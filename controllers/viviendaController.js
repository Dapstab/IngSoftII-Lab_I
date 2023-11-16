const Place = require('./../models/viviendaModel');
const factory = require('./handlerFactory');

exports.getPlace = factory.getOne(Place);
exports.getAllPlaces = factory.getAll(Place);
exports.updatePlace = factory.updateOne(Place);
exports.deletePlace = factory.deleteOne(Place);
exports.createPlace = factory.createOne(Place);