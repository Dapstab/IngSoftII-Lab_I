// DOM Elements
const placeForm = document.querySelector('.place-form');
const createButton = document.querySelector('.fab');
const placeModal = document.querySelector('.place-modal');
const fondo = document.getElementById('fondo');

let modoFormulario = 'crear'; // O 'actualizar'
let placeIdActual = null; // Almacenar ID del usuario en modo actualizar

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, time * 1000);
};

document.querySelectorAll('.place-actualizar').forEach(btn => {
  btn.addEventListener('click', e => {
      placeIdActual = e.currentTarget.getAttribute('data-id');
      modoFormulario = 'actualizar';
      
      placeModal.showModal();
      fondo.classList.add('blur');
  });
});

const removePlace = async () => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta vivienda?')) return;

  try {
      const res = await axios({
          method: "DELETE",
          url: `/api/v1/places/${placeIdActual}`,
      });

      if (res.status === 204) { // Por ejemplo, si tu API devuelve 204 para una eliminación exitosa
          showAlert('success', 'Vivienda eliminado con éxito');
          
          window.setTimeout(() => {
            location.assign('/');
          }, 1500);
      }
  } catch (error) {
      showAlert('error', 'Error al eliminar el usuario');
      console.log(error);
  }
};

document.querySelectorAll('.place-eliminar').forEach(btn => {
  btn.addEventListener('click', e => {
      placeIdActual = e.currentTarget.getAttribute('data-id');
      removePlace();
  });
});

createButton.addEventListener('click', e => {
    // placeModal.open = !placeModal.open;
    placeModal.showModal();
    fondo.classList.add('blur');
});

// Event listener para cerrar la modal al hacer clic fuera
window.addEventListener('click', function(event) {
    // Comprueba si el clic fue fuera de la modal
    if (event.target === placeModal) {
        placeModal.close();
        fondo.classList.remove('blur');
    }
});

const submitPlaceForm = async (direction, capacity, levels, stratum, municipality, owner, buildDate) => {
  
    try {
      const url = modoFormulario === 'crear' ? '/api/v1/places' : `/api/v1/places/${placeIdActual}`;
      const method = modoFormulario === 'crear' ? 'POST' : 'PATCH';
      const dataToUpdate = {};
      if (direction) dataToUpdate.direction = direction;
      if (capacity) dataToUpdate.capacity = capacity;
      if (levels) dataToUpdate.levels = levels;
      if (stratum) dataToUpdate.stratum = stratum;
      if (municipality) dataToUpdate.municipality = municipality;
      if (owner) dataToUpdate.owner = owner;
      if (buildDate) dataToUpdate.buildDate = buildDate;

      const res = await axios({
        method,
        url,
        data: dataToUpdate
      });
      
      if (res.data.status === 'success') {
        if (modoFormulario == "crear") showAlert('success', 'Vivienda creada con éxito!');
        else showAlert('success', 'Vivienda actualizada con éxito!');
        
        window.setTimeout(() => {
          location.assign('/viviendas');
        }, 1500);
      }
    } catch (err) {
        showAlert('error', err.response.data.message);
        console.log(err)
    }
};

if (placeForm)
  placeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const direction = document.getElementById('place-direction').value;
    const capacity = document.getElementById('place-capacity').value;
    const levels = document.getElementById('place-levels').value;
    const stratum = document.getElementById('place-stratum').value;
    const municipality = document.getElementById('place-municipality').value;
    const owner = document.getElementById('place-owner').value;
    const buildDate = document.getElementById('place-buildDate').value;
    console.log(direction)

    await submitPlaceForm(direction, capacity, levels, stratum, municipality, owner, buildDate);
    placeModal.close();
    fondo.classList.remove('blur');
});



