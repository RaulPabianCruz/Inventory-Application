const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const categoryDb = require('../db/categoryQueries.js');

const validateUser = body('theme').trim()
                    .isAlphanumeric().withMessage('Name can only consist of letters and numbers.')
                    .isLength({min: 1, max:25}).withMessage('Name must be between 1 and 25 characters.');

const getAllCategories = asyncHandler( async (req, res) => {
    const categories = await categoryDb.getAllCategories();
    res.render('index', {
        title: 'Categories',
        categories: categories,
    });
});

const getNewCategoryForm = (req, res) => {
    res.render('newCategoryForm', { title: 'New Category' });
}

const getEditCategoryForm = (req, res) => {
    res.render('editCategoryForm', { 
        title: 'Edit Category',
        categoryId: req.params.categoryId
    });
}


const postNewCategory = [
    validateUser,
    asyncHandler(async (req, res) => {
        const name = req.body.theme;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).render('newCategoryForm', {
                title: 'New Category',
                errors: errors.array()
            });
        }
        await categoryDb.insertCategory(name);
        res.redirect('/');
    })
];

const postEditCategory = [
    validateUser,
    asyncHandler(async (req, res) => {
        const name = req.body.theme;
        const categoryId = req.params.categoryId;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).render('editCategoryForm', {
                title: 'Edit Category',
                categoryId: req.params.categoryId,
                errors: errors.array()
            });
        }
        await categoryDb.updateCategory(name, categoryId);
        res.redirect('/');
    })
];

module.exports = { getAllCategories, getNewCategoryForm, getEditCategoryForm, postNewCategory, postEditCategory };
