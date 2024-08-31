const pool = require('./pool');

async function getThemeMinifigs(themeId) {
    const { rows } = await pool.query('SELECT * FROM minifigs WHERE themeId = $1', [themeId]);
    return rows;
}

async function insertMinifig(name, themeId) {
    await pool.query('INSERT INTO minifigs (name, themeId) VALUES ($1, $2);', [name, themeId]);
}

async function updateMinifig(name, themeId, minifigId) {
    await pool.query('UPDATE minifigs SET name = $1, themeId = $2 WHERE id = $3', [name, themeId, minifigId]);
}

module.exports = { getThemeMinifigs, insertMinifig, updateMinifig };