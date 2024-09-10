const pool = require('./pool');

async function insertTheme(theme) {
    await pool.query('INSERT INTO themes (name) VALUES ($1)', [theme]);
}

async function updateTheme(theme, themeId) {
    await pool.query('UPDATE themes SET name = $1 WHERE id = $2', [theme, themeId]);
}

async function deleteTheme(themeId) {
    await pool.query(`DELETE FROM minifig_inclusions 
        WHERE id IN (SELECT incl.id 
                     FROM minifig_inclusions AS incl
                     INNER JOIN sets ON incl.setId = sets.id
                     WHERE sets.themeId = $1 )`, [themeId]);
    await pool.query('DELETE FROM minifigs WHERE themeId = $1', [themeId]);
    await pool.query('DELETE FROM sets WHERE themeId = $1', [themeId]);
    await pool.query('DELETE FROM themes WHERE id = $1', [themeId]);
}

module.exports = { insertTheme, updateTheme, deleteTheme };