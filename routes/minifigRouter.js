const { Router } = require('express');
const router = Router({mergeParams: true});
const minifigCtrl = require('../controllers/minifigController.js');

router.get('/', minifigCtrl.getThemeMinifigs);
//router.get('/add', );
//router.get('/:minifigId', );
//router.get('/:minifigId/update', );
//router.post('/add', );
//router.post('/:minifigId/update', );
//router.post('/:minifigId/delete', );

module.exports = router;

