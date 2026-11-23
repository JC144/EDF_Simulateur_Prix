// Fragments de texte positionnés comme dans les tableaux PDF.
export function row(y, x, cells, gap = 30) {
    return cells.map((str, i) => ({ str, x: x + i * gap, y, w: 10 }));
}
