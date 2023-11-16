const Municipality = require('./../models/municipioModel');
const factory = require('./handlerFactory');

exports.getMunicipality = factory.getOne(Municipality);
exports.getAllMunicipalities = factory.getAll(Municipality);
exports.updateMunicipality = factory.updateOne(Municipality);
exports.deleteMunicipality = factory.deleteOne(Municipality);
exports.createMunicipality = factory.createOne(Municipality);