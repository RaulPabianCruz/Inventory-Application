const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const themeDb = require('../db/themeQueries.js');

const validateTheme = body('theme').trim()
                    .isAlphanumeric('en-US', {ignore: ' '}).withMessage('Name can only consist of letters and numbers.')
                    .isLength({min: 1, max:25}).withMessage('Name must be between 1 and 25 characters.');

const getAllThemes = asyncHandler( async (req, res) => {
    const themes = await themeDb.getAllThemes();
    res.render('index', {
        title: 'Themes',
        themes: themes,
    });
});

const getNewThemeForm = (req, res) => {
    res.render('theme/newThemeForm', { title: 'New Theme' });
}

const getEditThemeForm = (req, res) => {
    res.render('theme/editThemeForm', { 
        title: 'Edit Theme',
        themeId: req.params.themeId
    });
}

const getThemeProducts = asyncHandler( async (req, res) => {
    const name = await themeDb.getThemeFromId(req.params.themeId);
    res.render('theme/themeProducts', {
        title: name[0].name,
        themeId: req.params.themeId
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
        const themeId = req.params.themeId;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).render('theme/editThemeForm', {
                title: 'Edit Theme',
                themeId: req.params.themeId,
                errors: errors.array()
            });
        }
        await themeDb.updateTheme(name, themeId);
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
