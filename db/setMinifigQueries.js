const pool = require('./pool');

async function getSetMinifigs(setId) {
    const { rows } = await pool.query(`SELECT incl.id, incl.minifigId, incl.minifigQty, minifigs.name AS minifigName
                                       FROM minifig_inclusions AS incl INNER JOIN minifigs
                                       ON incl.minifigId = minifigs.id
                                       WHERE incl.setId = $1`, [setId]);
    return rows;
};

async function getNewSetMinifigs(themeId, setId) {
    const { rows } = await pool.query(`SELECT minifigs.id, minifigs.name 
                                       FROM minifigs 
                                       INNER JOIN themes ON minifigs.themeId = themes.id
                                       WHERE themes.id = $1 AND minifigs.id 
                                       NOT IN (SELECT minifig_inclusions.minifigId FROM minifig_inclusions
                                               INNER JOIN sets ON minifig_inclusions.setId = sets.id
                                               WHERE sets.id = $2)`, [themeId, setId]);
    return rows;
};

module.exports = { getSetMinifigs, getNewSetMinifigs };