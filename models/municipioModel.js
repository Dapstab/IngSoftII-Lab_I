const mongoose = require('mongoose');
const Place = require('./viviendaModel');
const AppError = require('../utils/appError');

const municipalitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Todo municipio debe tener un nombre.'],
        maxlength: [45, 'El nombre del municipio debe tener máximo 45 caracteres.'], // Limita la longitud del nombre a 45 caracteres
        unique: true
    },
    area: {
        type: Number,
        min: [0, "Los municipios no pueden tener áreas negativas."] // Asegura que el área sea un valor no negativo
    },
    budget: {
        type: Number,
        required: [true, 'Todo municipio debe tener un presupuesto asociado.'],
        min: [0, 'Los municipios no pueden tener un presupuesto negativo'] // Asegura que el presupuesto sea un valor no negativo
    },
    department: {
        type: mongoose.Schema.ObjectId, // o Number, según la implementación de tu ID
        ref: 'Department',
        required: [true, 'Todo municipio debe encontrarse en un departamento.'],
        unique: true
    },
    governor: {
        type: mongoose.Schema.ObjectId, // o Number, según la implementación de tu ID
        ref: 'User',
        required: [true, 'Todo municipio debe tener un gobernador asociado.'],
        unique: true
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, 
    timestamps: true
});

municipalitySchema.pre(/^find/, function(next) {
    this.populate({
      path: 'governor',
      select: 'name'
    }).populate({
        path: 'department',
        select: 'name'
    });
    next();
});

municipalitySchema.pre('findOneAndDelete', async function(next) {
    const doc = await this.model.findOne(this.getQuery());
    const place = await Place.findOne({municipality: doc.id});
    if (place) {
        return next(new AppError('No puedes borrar este municipio porque actualmente alberga viviendas', 403));
    } else next();
});



const Municipality = mongoose.model('Municipality', municipalitySchema);

module.exports = Municipality;