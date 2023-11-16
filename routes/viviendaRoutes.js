const express = require('express');
const placeController = require('./../controllers/viviendaController');

const router = express.Router();

router
  .route('/')
  .get(placeController.getAllPlaces)
  .post(placeController.createPlace);

router
  .route('/:id')
  .get(placeController.getPlace)
  .patch(placeController.updatePlace)
  .delete(placeController.deletePlace);

module.exports = router;
