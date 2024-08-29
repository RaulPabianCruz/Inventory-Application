const pool = require('./pool');

async function getThemeMinifigs(themeId) {
    const { rows } = await pool.query('SELECT * FROM minifigs WHERE themeId = $1', [themeId]);
    return rows;
}

module.exports = { getThemeMinifigs };