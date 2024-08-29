const pool = require('./pool');

async function getThemeFromId(themeId) {
    const { rows } = await pool.query('SELECT name FROM themes WHERE id = $1', [themeId]);
    return rows;
}

module.exports = { getThemeFromId };