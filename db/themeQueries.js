const pool = require('./pool');

async function getAllThemes() {
    const { rows } = await pool.query('SELECT * FROM themes');
    return rows;
};

async function insertTheme(theme) {
    await pool.query('INSERT INTO themes (name) VALUES ($1)', [theme]);
}

async function updateTheme(theme, themeId) {
    await pool.query('UPDATE themes SET name = $1 WHERE id = $2', [theme, themeId]);
}

async function deleteTheme(themeId) {
    await pool.query('DELETE FROM themes WHERE id = $1', [themeId]);
}

module.exports = { getAllThemes, insertTheme, updateTheme, deleteTheme };