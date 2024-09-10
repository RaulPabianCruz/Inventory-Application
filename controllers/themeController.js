const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const db = require('../db/queries.js');
const themeDb = require('../db/themeQueries.js');

const validateTheme = [
    body('theme').trim()
    .isAlphanumeric('en-US', {ignore: '[\s-]'}).withMessage('Name can only consist of letters, numbers, spaces, and hyphens.')
    .isLength({min: 1, max:25}).withMessage('Name must be between 1 and 25 characters.')
];

const getAllThemes = asyncHandler( async (req, res) => {
    const themes = await db.getAllThemes();
    res.render('index', {
        title: 'Themes',
        themes: themes,
    });
});

const getNewThemeForm = (req, res) => {
    res.render('theme/newThemeForm', { title: 'New Theme' });
}

const getEditThemeForm = asyncHandler(async (req, res) => {
    const theme = await db.getThemeFromId(req.params.themeId);
    res.render('theme/editThemeForm', { 
        title: 'Edit Theme',
        theme: theme[0]
    });
});

const getThemeProducts = asyncHandler( async (req, res) => {
    const theme = await db.getThemeFromId(req.params.themeId);
    res.render('theme/themeProducts', {
        title: theme[0].name,
        themeId: theme[0].id
    });
});

const postNewTheme = [
    validateTheme,
    asyncHandler(async (req, res) => {
        const name = req.body.theme;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).render('theme/newThemeForm', {
                title: 'New Theme',
                errors: errors.array()
            });
        }
        await themeDb.insertTheme(name);
        res.redirect('/');
    })
];

const postEditTheme = [
    validateTheme,
    asyncHandler(async (req, res) => {
        const name = req.body.theme;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const theme = await db.getThemeFromId(req.params.themeId);
            return res.status(400).render('theme/editThemeForm', {
                title: 'Edit Theme',
                theme: theme[0],
                errors: errors.array()
            });
        }
        await themeDb.updateTheme(name, req.params.themeId);
        res.redirect('/');
    })
];

const postDeleteTheme = asyncHandler(async (req, res) => {
    await themeDb.deleteTheme(req.params.themeId);
    res.redirect('/');
});

module.exports = { getAllThemes,
    getNewThemeForm,
    getEditThemeForm,
    getThemeProducts,
    postNewTheme,
    postEditTheme,
    postDeleteTheme 
};
