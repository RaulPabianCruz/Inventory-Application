const pool = require('./pool');

async function insertSet(name, pieceCount, qty, themeId) {
    await pool.query('INSERT INTO sets (setname, piececount, qty, themeid) VALUES ($1, $2, $3, $4)', [name, pieceCount, qty, themeId]);
}

async function updateSet(name, pieceCount, qty, themeId, setId) {
    await pool.query('UPDATE sets SET setName = $1, pieceCount = $2, qty = $3, themeId = $4 WHERE id = $5', [name, pieceCount, qty, themeId, setId]);
}

async function deleteSet(setId) {
    await pool.query('DELETE FROM minifig_inclusions WHERE setId = $1', [setId]);
    await pool.query('DELETE FROM sets WHERE id = $1', [setId])
}

module.exports = { insertSet, updateSet, deleteSet };