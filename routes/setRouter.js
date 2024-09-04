const { Router } = require('express');
const router = Router({mergeParams: true});
const setCtrl = require('../controllers/setController.js');

router.get('/', setCtrl.getThemeSets);
router.get('/add', setCtrl.getNewSetForm);
//router.get('/update', );
//router.get('/:setId', );
//router.get('/:setId/updateMinifigs', );
//router.get('/:setId/addMinifigs', );
router.post('/add', setCtrl.postNewSetForm);
//router.post('/update', );
//router.post('/:setId/updateMinifigs', );
//router.post('/:setId/addMinifigs', );
//router.post('/delete', );

module.exports = router;