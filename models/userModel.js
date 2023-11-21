const mongoose = require('mongoose');
const validator = require('validator');
const Municipality = require('./municipioModel');
const Place = require('./viviendaModel');
const AppError = require('../utils/appError');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor dinos tu nombre.']
    },
    email: {
        type: String,
        required: [true, 'Por favor dinos tu correo.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Por favor danos un correo válido.']
    },
    phone: {
        type: String,
        required: [true, 'Por favor ingresa un número de teléfono válido.'],
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: 'Por favor danos un número celular válido.'
        }
    },
    birthDate: {
        type: Date,
        required: [true, 'Por favor dinos tu fecha de nacimiento.'],
        validate: {
            validator: function(value) {
                const cutoff = new Date();
                cutoff.setFullYear(cutoff.getFullYear() - 6);
                return value <= cutoff;
            },
            message: 'Para registrate debes tener al menos 6 años.'
        }
    },
    sex: {
        type: String,
        required: [true, 'Por favor especifica tu sexo.'],
        enum: {
            values: ['masculino', 'femenino', 'no binario'],
            message: 'Por favor ingresa un tipo de sexo válido.'
        }
    },
    familyHead:  {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: null
    }    
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, 
    timestamps: true
});

userSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'familyHead',
      select: 'name'
    });
    next();
});

// userSchema.pre('save', async function(next) {
//     const familyHead = await mongoose.model('User').findById(this.familyHead)
//     if (familyHead.birthDate <= this.birthDate) {
//         return next(new AppError('No puedes poner como cabeza de familia alguien cuya edad es menor que la tuya.', 403));
//     }
//     next()
// })

userSchema.statics.calcAge = function(birthDate) {
    const hoy = new Date();
    const fechaNacimiento = new Date(birthDate);
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const m = hoy.getMonth() - fechaNacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }
    return edad;
}



userSchema.virtual('age').get(function () {
    if (this.birthDate) {
        return this.constructor.calcAge(this.birthDate);
    }
    return null;
  });

userSchema.pre('findOneAndDelete', async function(next) {
    const doc = await this.model.findOne(this.getQuery());
    
    const municipality = await Municipality.findOne({governor: doc.id});
    const place = await Place.findOne({owner: doc.id});

    if (municipality) {
        return next(new AppError('No puedes borrar este usuario porque actualmente es gobernador de un municipio', 403));
    } else if (place) {
        return next(new AppError('No puedes borrar este usuario porque actualmente es propietario de una vivienda', 403));
    } else next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;