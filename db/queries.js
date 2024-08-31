const pool = require('./pool');

async function getAllThemes() {
    const { rows } = await pool.query('SELECT * FROM themes');
    return rows;
};

async function getThemeFromId(themeId) {
    const { rows } = await pool.query('SELECT * FROM themes WHERE id = $1', [themeId]);
    return rows;
}

async function getMinifigsByTheme(themeId) {
    const { rows } = await pool.query('SELECT * FROM minifigs WHERE themeId = $1', [themeId]);
    return rows;
}

async function getMinifigById(minifigId) {
    const { rows } = await pool.query('SELECT * FROM minifigs WHERE id = $1', [minifigId]);
    return rows;
}

module.exports = { getAllThemes, getThemeFromId, getMinifigsByTheme, getMinifigById };