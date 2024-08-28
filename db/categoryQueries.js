const pool = require('./pool');

async function getAllCategories() {
    const { rows } = await pool.query('SELECT * FROM themes');
    return rows;
};

async function insertCategory(theme) {
    await pool.query('INSERT INTO themes (name) VALUES ($1)', [theme]);
}

async function updateCategory(theme, themeId) {
    await pool.query('UPDATE themes SET name = $1 WHERE id = $2', [theme, themeId]);
}

module.exports = { getAllCategories, insertCategory, updateCategory };