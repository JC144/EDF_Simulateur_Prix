import { loadBuiltTarifs } from './tarif-defs.mjs';
import { providerOf } from './site-gen.mjs';
import { isSubscriptionDisabled, todayInParis } from '../../scripts/utils/tarifMeta.js';

export { isSubscriptionDisabled, todayInParis };

export function catalogStatus(manifest, offers = loadBuiltTarifs().abonnements, today = todayInParis()) {
    const disabled = [];
    for (const { name, price_url, subscription_url, subscriptionRule } of offers) {
        const grid = manifest?.[price_url];
        const restriction = grid ? grid.subscriptionRules?.find(rule => rule.names.includes(name)) : subscriptionRule;
        if (isSubscriptionDisabled(restriction, today)) disabled.push({ name, reason: restriction.reason });
        else if (!subscription_url.trim()) disabled.push({ name, reason: 'Aucun lien de souscription' });
    }
    disabled.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    const providers = new Set(offers.map(providerOf)).size;
    return { total: offers.length, active: offers.length - disabled.length, providers, disabled };
}
