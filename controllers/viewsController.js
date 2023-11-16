const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Municipality = require('../models/municipioModel');
const Department = require('../models/departamentoModel');
const Place = require('../models/viviendaModel');
const User = require('../models/userModel');


exports.getUsers = catchAsync(async (req, res, next) => {
    // 1) Obtener datos de usuarios de la colección
    let users = await User.find();
    // 2) Formatear las fechas de nacimiento
    users = users.map(user => {
        // Clonar el objeto user para no modificar el original
        const userClone = { ...user.toObject() };

        // Formatear la fecha de nacimiento
        const fechaMongoose = new Date(userClone.birthDate);
        userClone.birthDate = fechaMongoose.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return userClone;
    });

    // 3) Renderizar la plantilla con los datos de los usuarios
    res.status(200).render('userView', {
        title: 'Personas',
        users: users
    });
});


exports.getPlaces = catchAsync(async (req, res, next) => {
    let places = await Place.find();
    const users = await User.find();
    const municipalities = await Municipality.find();

    places = places.map(place => {
        // Clonar el objeto user para no modificar el original
        const placeClone = { ...place.toObject() };

        // Formatear la fecha de nacimiento
        const fechaMongoose = new Date(placeClone.buildDate);
        placeClone.buildDate = fechaMongoose.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return placeClone;
    });

    res.status(200).render('placeView', {
      title: 'Viviendas',
      places,
      municipalities,
      users
    });
});

exports.getMunicipalities = catchAsync(async (req, res, next) => {
    const users = await User.find();
    const municipalities = await Municipality.find();
    const departments = await Department.find();
    
    res.status(200).render('municipalityView', {
      title: 'Municipios',
      municipalities,
      departments,
      users
    });
});

exports.getDepartments = catchAsync(async (req, res, next) => {

    const departments = await Department.find();
    // 2) Build template
    // 3) Render that template using tour data from 1)
    res.status(200).render('departmentView', {
      title: 'Departamentos',
      departments
    });
});