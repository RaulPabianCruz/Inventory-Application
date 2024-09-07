const { Router } = require('express');
const router = Router({mergeParams: true});
const setCtrl = require('../controllers/setController.js');

router.get('/', setCtrl.getThemeSets);
router.get('/add', setCtrl.getNewSetForm);
router.get('/:setId', setCtrl.getSetDetails);
router.get('/:setId/update', setCtrl.getUpdateSetForm);
router.get('/:setId/addMinifigs', setCtrl.getNewSetMinifigForm);
router.get('/:setId/updateMinifigs', setCtrl.getUpdateSetMinifigForm);
router.post('/add', setCtrl.postNewSetForm);
router.post('/:setId/update', setCtrl.postUpdateSetForm);
//router.post('/:setId/delete', );
router.post('/:setId/addMinifigs', setCtrl.postNewSetMinifigForm);
router.post('/:setId/:minifigId/updateMinifigs', setCtrl.postUpdateSetMinifigForm);
//router.post('/:setId/:minifigId/delete', )

module.exports = router;