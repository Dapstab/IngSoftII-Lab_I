const express = require('express');
const municipalityController = require('./../controllers/municipioController');

const router = express.Router();

router
  .route('/')
  .get(municipalityController.getAllMunicipalities)
  .post(municipalityController.createMunicipality);

router
  .route('/:id')
  .get(municipalityController.getMunicipality)
  .patch(municipalityController.updateMunicipality)
  .delete(municipalityController.deleteMunicipality);

module.exports = router;
