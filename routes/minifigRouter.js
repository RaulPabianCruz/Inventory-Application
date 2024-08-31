const { Router } = require('express');
const router = Router({mergeParams: true});
const minifigCtrl = require('../controllers/minifigController.js');

router.get('/', minifigCtrl.getThemeMinifigs);
router.get('/add', minifigCtrl.getNewMinifigForm);
router.get('/:minifigId', minifigCtrl.getMinifigDetails);
router.get('/:minifigId/update', minifigCtrl.getEditMinifigForm);
router.post('/add', minifigCtrl.postNewMinifig);
router.post('/:minifigId/update', minifigCtrl.postEditMinifig);
router.post('/:minifigId/delete', minifigCtrl.postDeleteMinifig);

module.exports = router;

