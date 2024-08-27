const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const categoryDb = require('../db/categoryQueries.js');

const validateUser = body('theme').trim()
                    .isAlphanumeric().withMessage('Number letter only foo')
                    .isLength({min: 1, max:25}).withMessage('Too long or too short foo');

const getAllCategories = asyncHandler( async (req, res) => {
    const categories = await categoryDb.getAllCategories();
    res.render('index', {
        title: 'Categories',
        categories: categories,
    });
});

const getNewCategoryForm = (req, res) => {
    res.render('categoryForm', { title: 'New Category:' });
}

const postNewCategory = [
    validateUser,
    asyncHandler(async (req, res) => {
        const name = req.body.theme;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).render('categoryForm', {
                title: 'New Category:',
                errors: errors.array()
            });
        }
        await categoryDb.insertCategory(name);
        res.redirect('/');
    })
];

module.exports = { getAllCategories, getNewCategoryForm, postNewCategory };
