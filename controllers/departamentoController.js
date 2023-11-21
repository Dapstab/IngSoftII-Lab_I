const catchAsync = require('../utils/catchAsync');
const Department = require('./../models/departamentoModel');
const factory = require('./handlerFactory');

exports.getDepartment = factory.getOne(Department);
exports.getAllDepartments = factory.getAll(Department);
exports.updateDepartment = factory.updateOne(Department);
exports.deleteDepartment = factory.deleteOne(Department);
exports.createDepartment = factory.createOne(Department);