const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const db = require('../db/queries');
const setDb = require('../db/setQueries.js');

const alphaNumErr = 'must consist of letters, numbers, and spaces only.';
const nameLengthErr = 'must be between 1 and 40 characters.';
const numErr = 'must be a number.';
const numLengthErr = 'must be between 1 and 5 characters.';

const validateSet = [
    body('name').trim()
    .isAlphanumeric('en-US', {ignore: ' '}).withMessage('Name ' + alphaNumErr)
    .isLength({min: 1, max: 40}).withMessage('Name ' + nameLengthErr),
    body('pieceCount').trim()
    .isNumeric().withMessage('Piece count ' + numErr)
    .isLength({min: 1, max: 5}).withMessage('Piece count ' + numLengthErr),
    body('qty').trim()
    .isNumeric().withMessage('Quantity ' + numErr)
    .isLength({min: 1, max: 5}).withMessage('Quantity ' + numLengthErr)
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


const getNewSetForm = asyncHandler(async (req, res) => {
    const theme = await db.getThemeFromId(req.params.themeId);
    res.render('sets/newSetForm', {
        title: `New ${theme[0].name} Set`,
        themeId: theme[0].id
    });
});

const postNewSetForm = [
    validateSet,
    asyncHandler( async (req, res) => {
        const theme = await db.getThemeFromId(req.params.themeId);
        const name = req.body.name;
        const pieceCount = req.body.pieceCount;
        const qty = req.body.qty;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).render('/sets/newSetForm', {
                title: `New ${theme[0].name} Set`,
                themeId: theme[0].id
            });
        }
        await setDb.insertSet(name, pieceCount, qty, theme[0].id);
        res.redirect(`/${theme[0].id}/sets`);
    })
]

module.exports = { getThemeSets, getNewSetForm, postNewSetForm };