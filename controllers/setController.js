const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const db = require('../db/queries');
//const setDb = require('../db/setQueries.js');

const validateSet = [
    body('name').trim(),
    body('pieceCount').trim(),
    body('qty').trim()
];

const getThemeSets = asyncHandler(async (req, res) => {
    const sets = await db.getSetsByTheme(req.params.themeId);
    const theme = await db.getThemeFromId(req.params.themeId);
    res.render('sets/setSelection', {
        title: theme[0].name + ' Sets',
        sets: sets,
        themeId: theme[0].id
    });
});


module.exports = { getThemeSets };