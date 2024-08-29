const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const db = require('../db/queries.js');
const minifigDb = require('../db/minifigQueries.js');

const validateMinifig = body('name').trim()
                        .isAlphanumeric('en-US', {ignore: ' '}).withMessage('Name can only consists of letters and numbers.')
                        .isLength({min: 1, max: 25}).withMessage('Name must be between 1 and 25 characters');

const getThemeMinifigs = asyncHandler(async (req, res) => {
    const minifigs = await minifigDb.getThemeMinifigs(req.params.themeId);
    const theme = await db.getThemeFromId(req.params.themeId);
    res.render('minifigs/minifigSelection', {
        title: theme[0].name + ' Minifigs',
        minifigs: minifigs,
        themeId: req.params.themeId
    });
});

module.exports = { getThemeMinifigs };