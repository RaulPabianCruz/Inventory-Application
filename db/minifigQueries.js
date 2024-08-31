const pool = require('./pool');

async function insertMinifig(name, themeId) {
    await pool.query('INSERT INTO minifigs (name, themeId) VALUES ($1, $2);', [name, themeId]);
}

async function updateMinifig(name, themeId, minifigId) {
    await pool.query('UPDATE minifigs SET name = $1, themeId = $2 WHERE id = $3', [name, themeId, minifigId]);
}

async function deleteMinifig(minifigId) {
    await pool.query('DELETE FROM minifigs WHERE id = $1', [minifigId]);
}

module.exports = { insertMinifig, updateMinifig, deleteMinifig };