const { Router } = require('express');
const router = Router();
const themeCtrl = require('../controllers/themeController.js');

router.get('/', themeCtrl.getAllThemes);
router.get('/addTheme', themeCtrl.getNewThemeForm);
router.get('/:themeId/update', themeCtrl.getEditThemeForm);
//router.get('/:themeId/products', );
router.post('/addTheme', themeCtrl.postNewTheme);
router.post('/:themeId/update', themeCtrl.postEditTheme);
//router.post('/:themeId/delete', );

module.exports = router;

