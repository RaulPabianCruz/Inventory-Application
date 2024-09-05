const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const db = require('../db/queries');
const setDb = require('../db/setQueries.js');
const setMinifigDb = require('../db/setMinifigQueries.js');

const alphaNumErr = 'must consist of letters, numbers, and spaces only.';
const nameLengthErr = 'must be between 1 and 40 characters.';

const validateSet = [
    body('name').trim()
    .isAlphanumeric('en-US', {ignore: ' '}).withMessage('Name ' + alphaNumErr)
    .isLength({min: 1, max: 40}).withMessage('Name ' + nameLengthErr),
    body('pieceCount').trim()
    .isInt({min: 1, max: 99999}).withMessage('Piece Count must be an Integer between 1 and 99,999'),
    body('qty').trim()
    .isInt({min: 1, max: 10000}).withMessage('Set quantity must be between 1 and 10000')
];

const validateMinifig = [
    body('minifigId').trim()
    .isNumeric().withMessage('Invalid Minifig Selection - (id)'),
    body('qty').trim()
    .isInt({min: 1, max: 10}).withMessage('Minifig quantity must be between 1 and 10')
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

const getSetDetails = asyncHandler(async (req, res) => {
    const setId = req.params.setId;
    const set = await db.getSetById(setId);
    //need to fill out set minifigs and check back on this query later
    const minifigs = await setMinifigDb.getSetMinifigs(setId);
    res.render('sets/setDetails', {
        title: 'Set Details',
        set: set[0]
    });
});

const getNewSetMinifigForm = asyncHandler(async (req, res) => {
    const minifigs = await setMinifigDb.getNewSetMinifigs(req.params.themeId, req.params.setId);
    const set = await db.getSetById(req.params.setId);
    res.render('sets/newSetMinifigForm', {
        title: `New ${set[0].setname} Minifig`,
        minifigs: minifigs
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

module.exports = { getThemeSets, getNewSetForm, getSetDetails, getNewSetMinifigForm, postNewSetForm };