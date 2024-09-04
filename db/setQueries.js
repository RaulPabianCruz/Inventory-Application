const pool = require('./pool');

async function insertSet(name, pieceCount, qty, themeId) {
    await pool.query('INSERT INTO sets (setname, piececount, qty, themeid) VALUES ($1, $2, $3, $4)', [name, pieceCount, qty, themeId]);
}

module.exports = { insertSet };