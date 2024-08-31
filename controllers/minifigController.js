const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const db = require('../db/queries.js');
const minifigDb = require('../db/minifigQueries.js');

const validateMinifig = body('name').trim()
                        .isAlphanumeric('en-US', {ignore: ' '}).withMessage('Name can only consists of letters and numbers.')
                        .isLength({min: 1, max: 25}).withMessage('Name must be between 1 and 25 characters');

const getThemeMinifigs = asyncHandler(async (req, res) => {
    const minifigs = await db.getMinifigsByTheme(req.params.themeId);
    const theme = await db.getThemeFromId(req.params.themeId);
    res.render('minifigs/minifigSelection', {
        title: theme[0].name + ' Minifigs',
        minifigs: minifigs,
        themeId: req.params.themeId
    });
});

const getNewMinifigForm = asyncHandler(async (req, res) => {
    const themes = await db.getAllThemes();
    res.render('minifigs/newMinifigForm', {
        title: 'New Minifig',
        themes: themes,
        themeId: req.params.themeId
    });
});

const getMinifigDetails = asyncHandler(async (req, res) => {
    const minifigDetails = await db.getMinifigById(req.params.minifigId);
    const theme = await db.getThemeFromId(minifigDetails[0].themeid);
    res.render('minifigs/minifigDetails', {
        title: 'Minifig Details',
        minifig: minifigDetails[0],
        theme: theme[0]
    });
});

const getEditMinifigForm = asyncHandler(async (req, res) => {
    const minifigDetails = await db.getMinifigById(req.params.minifigId);
    const themes = await db.getAllThemes();
    res.render('minifigs/editMinifigForm', {
        title: 'Edit Minifig',
        minifig: minifigDetails[0],
        themes: themes
    });
});

const postNewMinifig = [
    validateMinifig,
    asyncHandler(async (req, res) => {
        const name = req.body.name;
        const themeId = req.body.themeId;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const themes = await db.getAllThemes();
            return res.status(400).render('minifigs/newMinifigForm', {
                title: 'New Minifig',
                themes: themes,
                themeId: themeId,
                errors: errors.array()
            });
        }
        await minifigDb.insertMinifig(name, themeId);
        res.redirect(`/${themeId}/minifigs`);
    })
];

const postEditMinifig = [
    validateMinifig,
    asyncHandler(async (req, res) => {
        const name = req.body.name;
        const themeId = req.body.themeId;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const minifigDetails = await db.getMinifigById(req.params.minifigId);
            const themes = await db.getAllThemes();
            return res.status(400).render('minifigs/editMinifigForm', {
                title: 'Edit Minifig',
                minifig: minifigDetails[0],
                themes: themes,
                errors: errors.array()
            });
        }
        await minifigDb.updateMinifig(name, themeId, req.params.minifigId);
        res.redirect(`/${req.params.themeId}/minifigs`);
    })
];

const postDeleteMinifig = asyncHandler(async (req, res) => {
    const themeId = req.params.themeId;
    await minifigDb.deleteMinifig(req.params.minifigId);
    res.redirect(`/${themeId}/minifigs`); 
});

module.exports = { 
    getThemeMinifigs,
    getNewMinifigForm,
    getMinifigDetails,
    getEditMinifigForm,
    postNewMinifig,
    postEditMinifig,
    postDeleteMinifig
};