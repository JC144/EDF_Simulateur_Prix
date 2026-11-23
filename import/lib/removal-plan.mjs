import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from './tarif-defs.mjs';
import { detectEol } from './site-gen.mjs';

// Toutes les lectures et validations précèdent l'application. Les originaux
// servent aussi à détecter une modification intervenue depuis la préparation.
export class RemovalPlan {
    changes = new Map();

    #set(file, before, after) {
        const abs = path.resolve(REPO_ROOT, file);
        const rel = path.relative(REPO_ROOT, abs).replaceAll('\\', '/');
        if (rel !== file || rel.startsWith('../') || path.isAbsolute(rel)
            || fs.realpathSync(abs) !== path.join(fs.realpathSync(REPO_ROOT), file)) {
            throw new Error('Chemin de suppression inattendu : ' + file);
        }
        this.changes.set(file, { abs, before, after });
    }

    remove(file) {
        const abs = path.join(REPO_ROOT, file);
        if (fs.existsSync(abs)) this.#set(file, fs.readFileSync(abs), null);
    }

    edit(file, transform) {
        const before = fs.readFileSync(path.join(REPO_ROOT, file));
        const original = before.toString('utf8');
        const content = transform(original);
        if (content === original) return;
        const next = content.replace(/\r?\n/g, detectEol(original));
        if (next !== original) this.#set(file, before, next);
    }

    apply() {
        const lock = path.join(REPO_ROOT, 'import/.remove.lock');
        const handle = fs.openSync(lock, 'wx');
        const started = [];
        try {
            for (const [file, { abs, before }] of this.changes) {
                if (fs.realpathSync(abs) !== path.join(fs.realpathSync(REPO_ROOT), file)
                    || !fs.readFileSync(abs).equals(before)) {
                    throw new Error('Fichier modifié depuis la préparation : ' + file);
                }
            }
            for (const change of this.changes.values()) {
                if (change.after === null) {
                    fs.unlinkSync(change.abs);
                    started.push(change);
                } else {
                    started.push(change);
                    fs.writeFileSync(change.abs, change.after);
                }
            }
        } catch (error) {
            const failures = [];
            for (const { abs, before } of started.reverse()) {
                try {
                    if (!fs.existsSync(abs) || !fs.readFileSync(abs).equals(before)) fs.writeFileSync(abs, before);
                } catch (restoreError) {
                    failures.push(restoreError.message);
                }
            }
            if (failures.length) throw new Error(error.message + '\nRestauration incomplète : ' + failures.join('\n'));
            throw error;
        } finally {
            fs.closeSync(handle);
            fs.unlinkSync(lock);
        }
    }
}
