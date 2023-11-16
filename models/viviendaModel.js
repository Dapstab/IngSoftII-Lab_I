const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    direction: {
        type: String,
        required: true,
        maxlength: [100, "Las direcciones no pueden superar los 100 caracteres."], // Limita la longitud de la dirección a 100 caracteres
        minlength: [3, "Las direcciones no pueden tener menos de 3 caracteres."]
    },
    capacity: {
        type: Number,
        required: true,
        min: [1, "Toda vivienda debe ser habitada por al menos una persona."], // Asegura que la capacidad sea al menos 1
        max:[20, "Las viviendas registradas en este senso deben tener una capacidad máxima de 20 personas."]
    },
    levels: {
        type: Number,
        required: true,
        min: [1, "Toda vivienda tiene como mínimo un nivel."], // Asegura que el número de niveles sea al menos 1
        max: [10, "Las viviendas registradas en este senso deben tener un máximo de 10 pisos."]
    },
    stratum: {
        type: Number,
        required: [true, 'Toda vivienda debe tener un estrato asociado.'],
        min: [0, 'El estrato mínimo es 0.']
    },
    municipality: {
        type: mongoose.Schema.ObjectId,
        ref: 'Municipality',
        required: [true, 'Toda vivienda debe pertenecer a un municipio.']
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Toda vivienda debe estar asociada a un propietario.']
    },
    buildDate: {
        type: Date,
        required: [true, 'Por favor ingresa la fecha de construcción de la vivienda.']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, 
    timestamps: true
});

placeSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'owner',
      select: 'name'
    }).populate({
        path: 'municipality',
        select: 'name'
    });
    next();
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
