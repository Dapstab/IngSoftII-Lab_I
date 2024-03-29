const mongoose = require('mongoose');
const Municipality = require('./municipioModel');
const AppError = require('../utils/appError')

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Todo departamento debe tener un nombre.'],
        maxlength: [45, 'El nombre debe tener máximo 45 caracteres.'], // Limita la longitud del nombre a 45 caracteres
        minlength: [5, 'El nombre debe tener mínimo 5 caracteres.'],
        unique: true
    },
    area: {
        type: Number,
        min: [0, 'El área de un departamento no puede ser negativa.'] // Asegura que el área sea un valor no negativo
    },
    budget: {
        type: Number,
        required: [true, 'Todo departamento debe tener asociado un presupuesto.'],
        min: [0, 'El presupuesto del departamento no puede ser un valor negativo.'] // Asegura que el presupuesto sea un valor no negativo
    },
    population: {
        type: Number,
        required: [true, 'Por favor ingresa el número de habitantes.'],
        min: [0, 'La población no puede ser un valor negativa.'] // Asegura que la población sea un valor no negativo
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, 
    timestamps: true
});

departmentSchema.pre('findOneAndDelete', async function(next) {
    const doc = await this.model.findOne(this.getQuery());
    const municipality = await Municipality.findOne({department: doc.id});
    if (municipality) {
        return next(new AppError('No puedes borrar el departamento porque esta asociado a un municipio actualmente', 403));
    } else next();
});


const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;