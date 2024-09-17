const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const db = require('../db/queries.js');
const minifigDb = require('../db/minifigQueries.js');

const validateMinifig = [
    body('name').trim()
    .isAlphanumeric('en-US', {ignore: '[\s-]'}).withMessage('Name can only consists of letters, numbers, spaces, and hyphens.')
    .isLength({min: 1, max: 25}).withMessage('Name must be between 1 and 25 characters')
];

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
    const theme = await db.getThemeFromId(req.params.themeId);
    res.render('minifigs/newMinifigForm', {
        title: `New ${theme[0].name} Minifig`,
        themeId: theme[0].id
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
    res.render('minifigs/editMinifigForm', {
        title: 'Edit Minifig',
        minifig: minifigDetails[0],
    });
});

const postNewMinifig = [
    validateMinifig,
    asyncHandler(async (req, res) => {
        const name = req.body.name;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const theme = await db.getThemeFromId(req.params.themeId);
            return res.status(400).render('minifigs/newMinifigForm', {
                title: `New ${theme[0].name} Minifig`,
                themeId: theme[0].id,
                errors: errors.array()
            });
        }
        await minifigDb.insertMinifig(name, req.params.themeId);
        res.redirect(`/${req.params.themeId}/minifigs`);
    })
];

const postEditMinifig = [
    validateMinifig,
    asyncHandler(async (req, res) => {
        const name = req.body.name;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const minifigDetails = await db.getMinifigById(req.params.minifigId);
            return res.status(400).render('minifigs/editMinifigForm', {
                title: 'Edit Minifig',
                minifig: minifigDetails[0],
                errors: errors.array()
            });
        }
        await minifigDb.updateMinifig(name, req.params.themeId, req.params.minifigId);
        res.redirect(`/${req.params.themeId}/minifigs`);
    })
];

const postDeleteMinifig = asyncHandler(async (req, res) => {
    await minifigDb.deleteMinifig(req.params.minifigId);
    res.redirect(`/${req.params.themeId}/minifigs`); 
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