const { Router } = require('express');
const router = Router();
const themeCtrl = require('../controllers/themeController.js');
const minifigRouter = require('./minifigRouter.js');

router.use('/:themeId/minifigs', minifigRouter);
//router.get('/:themeId/sets', );

router.get('/', themeCtrl.getAllThemes);
router.get('/addTheme', themeCtrl.getNewThemeForm);
router.get('/:themeId/update', themeCtrl.getEditThemeForm);
router.get('/:themeId/products', themeCtrl.getThemeProducts);
router.post('/addTheme', themeCtrl.postNewTheme);
router.post('/:themeId/update', themeCtrl.postEditTheme);
router.post('/:themeId/delete', themeCtrl.postDeleteTheme);

module.exports = router;

