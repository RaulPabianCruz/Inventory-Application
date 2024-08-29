const pool = require('./pool');

async function getThemeMinifigs(themeId) {
    const { rows } = await pool.query('SELECT * FROM minifigs WHERE themeId = $1', [themeId]);
    return rows;
}

async function insertMinifig(name, themeId) {
    await pool.query('INSERT INTO minifigs (name, themeId) VALUES ($1, $2);', [name, themeId]);
}

module.exports = { getThemeMinifigs, insertMinifig };