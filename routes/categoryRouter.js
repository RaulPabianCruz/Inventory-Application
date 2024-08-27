const { Router } = require('express');
const router = Router();
const categoryCtrl = require('../controllers/categoryController.js');

router.get('/', categoryCtrl.getAllCategories);
router.get('/addCategory', categoryCtrl.getNewCategoryForm);
//router.get('/:categoryId/update', );
//router.get('/:categoryId/products', );
router.post('/addCategory', categoryCtrl.postNewCategory);
//router.post('/:categoryId/update', );
//router.post('/:categoryId/delete', );

module.exports = router;

