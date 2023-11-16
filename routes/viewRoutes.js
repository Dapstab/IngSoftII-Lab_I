const express = require('express');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

// router.get('/', viewsController.getOverview);
router.get('/', viewsController.getUsers);
router.get('/viviendas', viewsController.getPlaces);
router.get('/municipios', viewsController.getMunicipalities);
router.get('/departamentos', viewsController.getDepartments);
 
module.exports = router;