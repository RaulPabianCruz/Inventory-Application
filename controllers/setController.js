const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const db = require('../db/queries');
const setDb = require('../db/setQueries.js');
const setMinifigDb = require('../db/setMinifigQueries.js');

const validateSet = [
    body('name').trim()
    .isAlphanumeric('en-US', {ignore: ' '}).withMessage('Name must consist of letters, numbers, and spaces only.')
    .isLength({min: 1, max: 40}).withMessage('Name must be between 1 and 40 characters.'),
    body('pieceCount').trim()
    .isInt({min: 1, max: 99999}).withMessage('Piece Count must be an Integer between 1 and 99,999'),
    body('qty').trim()
    .isInt({min: 1, max: 10000}).withMessage('Set quantity must be an Integer between 1 and 10000')
];

const validateMinifig = [
    body('minifigId').trim()
    .isInt().withMessage('Invalid Minifig Selection - (id)'),
    body('qty').trim()
    .isInt({min: 1, max: 10}).withMessage('Minifig quantity must be between 1 and 10')
];

const getThemeSets = asyncHandler(async (req, res) => {
    const sets = await db.getSetsByTheme(req.params.themeId);
    const theme = await db.getThemeFromId(req.params.themeId);
    res.render('sets/setSelection', {
        title: `${theme[0].name} Sets`,
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

const getUpdateSetForm = asyncHandler(async (req, res) => {
    const set = await db.getSetById(req.params.setId);
    res.render('sets/updateSetForm', {
        title: 'Update Set',
        set: set[0],
    });
});

const getSetDetails = asyncHandler(async (req, res) => {
    const set = await db.getSetById(req.params.setId);
    const setMinifigs = await setMinifigDb.getSetMinifigs(req.params.setId);
    res.render('sets/setDetails', {
        title: 'Set Details',
        set: set[0],
        setMinifigs: setMinifigs
    });
});

const getNewSetMinifigForm = asyncHandler(async (req, res) => {
    const minifigs = await setMinifigDb.getNewSetMinifigs(req.params.themeId, req.params.setId);
    const set = await db.getSetById(req.params.setId);
    res.render('sets/newSetMinifigForm', {
        title: `New ${set[0].setname} Minifig`,
        minifigs: minifigs,
        set: set[0]
    });
});

const getUpdateSetMinifigForm = asyncHandler(async (req, res) => {
    const set = await db.getSetById(req.params.setId);
    const setMinifigs = await setMinifigDb.getSetMinifigs(req.params.setId);
    res.render('sets/updateSetMinifigForm', {
        title: `Update ${set[0].setname} Minifigs`,
        set: set[0],
        setMinifigs: setMinifigs
    });
});

const postNewSetForm = [
    validateSet,
    asyncHandler( async (req, res) => {
        const name = req.body.name;
        const pieceCount = req.body.pieceCount;
        const qty = req.body.qty;

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const theme = await db.getThemeFromId(req.params.themeId);
            return res.status(400).render('sets/newSetForm', {
                title: `New ${theme[0].name} Set`,
                themeId: theme[0].id,
                errors: errors.array()
            });
        }
        await setDb.insertSet(name, pieceCount, qty, req.params.themeId);
        res.redirect(`/${req.params.themeId}/sets`);
    })
]

const postUpdateSetForm = [
    validateSet,
    asyncHandler(async (req, res) => {
        const name = req.body.name;
        const pieceCount = req.body.pieceCount;
        const qty = req.body.qty;
        
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const set = await db.getSetById(req.params.setId);
            return res.status(400).render('sets/updateSetForm', {
                title: 'Update Set',
                set: set[0],
                errors: errors.array()
            });
        }
        await setDb.updateSet(name, pieceCount, qty, req.params.themeId, req.params.setId);
        res.redirect(`/${req.params.themeId}/sets/${req.params.setId}`);
    })
]

const postNewSetMinifigForm = [
    validateMinifig,
    asyncHandler(async (req, res) => {
        const setId = req.params.setId;
        const minifigId = req.body.minifigId;
        const qty = req.body.qty;

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const minifigs = await setMinifigDb.getNewSetMinifigs(req.params.themeId, setId);
            const set = await db.getSetById(setId);
            return res.status(400).render('sets/newSetMinifigForm', {
                title: `New ${set[0].name} Minifig`,
                minifigs: minifigs,
                set: set[0],
                errors: errors.array()
            });
        }
        await setMinifigDb.insertNewSetMinifig(setId, minifigId, qty);
        res.redirect(`/${req.params.themeId}/sets/${req.params.setId}`);
    })
]

const postUpdateSetMinifigForm = [
    body('qty').trim()
    .isInt({min: 1, max: 10}).withMessage('Minifig quantity must be between 1 and 10'),
    asyncHandler(async (req, res) => {
        const qty = req.body.qty;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const set = await db.getSetById(req.params.setId);
            const setMinifigs = await setMinifigDb.getSetMinifigs(req.params.setId);
            res.status(400).render('sets/updateSetMinifigForm', {
                title: `Update ${set[0].setname} Minifigs`,
                set: set[0],
                setMinifigs: setMinifigs,
                errors: errors.array()
            });
        }
        await setMinifigDb.updateSetMinifig(req.params.setId, req.params.minifigId, qty);
        res.redirect(`/${req.params.themeId}/sets/${req.params.setId}`);
    })
]

const postDeleteSetMinifig = asyncHandler(async (req, res) => {
    await setMinifigDb.deleteSetMinifig(req.params.setId, req.params.minifigId);
    res.redirect(`/${req.params.themeId}/sets/${req.params.setId}`);
});

const postDeleteSet = asyncHandler(async (req, res) => {
    await setDb.deleteSet(req.params.setId);
    res.redirect(`/${req.params.themeId}/sets`);
});

module.exports = { 
    getThemeSets,
    getNewSetForm,
    getUpdateSetForm,
    getSetDetails,
    getNewSetMinifigForm,
    getUpdateSetMinifigForm,
    postNewSetForm,
    postUpdateSetForm,
    postNewSetMinifigForm,
    postUpdateSetMinifigForm,
    postDeleteSetMinifig,
    postDeleteSet
};