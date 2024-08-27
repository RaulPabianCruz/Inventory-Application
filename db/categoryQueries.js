const pool = require('./pool');

async function getAllCategories() {
    const { rows } = await pool.query('SELECT * FROM themes');
    return rows;
};

async function insertCategory(theme) {
    await pool.query('INSERT INTO themes (name) VALUES ($1)', [theme]);
}

module.exports = { getAllCategories, insertCategory };