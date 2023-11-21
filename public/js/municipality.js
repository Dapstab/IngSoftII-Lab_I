// DOM Elements
const municipalityForm = document.querySelector('.municipality-form');
const createButton = document.querySelector('.fab');
const municipalityModal = document.querySelector('.municipality-modal');
const fondo = document.getElementById('fondo');

let modoFormulario = 'crear'; // O 'actualizar'
let municipalityIdActual = null; 

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

document.querySelectorAll('.municipality-actualizar').forEach(btn => {
  btn.addEventListener('click', e => {
      municipalityIdActual = e.currentTarget.getAttribute('data-id');
      modoFormulario = 'actualizar';
      
      municipalityModal.showModal();
      fondo.classList.add('blur');
  });
});

const removeMunicipality = async () => {
  if (!confirm('¿Estás seguro de que deseas eliminar este municipio?')) return;

  try {
      const res = await axios({
          method: "DELETE",
          url: `/api/v1/municipalities/${municipalityIdActual}`,
      });

      if (res.status === 204) { // Por ejemplo, si tu API devuelve 204 para una eliminación exitosa
          showAlert('success', 'Municipio eliminado con éxito');
          
          window.setTimeout(() => {
            location.assign('/municipios');
          }, 1500);
      }
  } catch (error) {
      showAlert('error', error.response.data.message);
      console.log(error);
  }
};

document.querySelectorAll('.municipality-eliminar').forEach(btn => {
  btn.addEventListener('click', e => {
      municipalityIdActual = e.currentTarget.getAttribute('data-id');
      removeMunicipality();
  });
});

createButton.addEventListener('click', e => {
    // municipalityModal.open = !municipalityModal.open;
    municipalityModal.showModal();
    fondo.classList.add('blur');
});

// Event listener para cerrar la modal al hacer clic fuera
window.addEventListener('click', function(event) {
    // Comprueba si el clic fue fuera de la modal
    if (event.target === municipalityModal) {
        municipalityModal.close();
        fondo.classList.remove('blur');
    }
});

const submitMunicipalityForm = async (name, area, budget, department, governor) => {
    try {
      const url = modoFormulario === 'crear' ? '/api/v1/municipalities' : `/api/v1/municipalities/${municipalityIdActual}`;
      const method = modoFormulario === 'crear' ? 'POST' : 'PATCH';
      
      const dataToUpdate = {};
      if (name) dataToUpdate.name = name;
      if (area) dataToUpdate.area = area;
      if (budget) dataToUpdate.budget = budget;
      if (department) dataToUpdate.department = department;
      if (governor) dataToUpdate.governor = governor;
  
      const res = await axios({
        method,
        url,
        data: dataToUpdate
      });
      
      if (res.data.status === 'success') {
        if (modoFormulario == "crear")  showAlert('success', 'Municipio creado con éxito!');
        else showAlert('success', 'Municipio actualizado con éxito!');
        
        window.setTimeout(() => {
          location.assign('/municipios');
        }, 1500);
      }
    } catch (err) {
        showAlert('error', err.response.data.message);
        console.log(err)
    }
};

if (municipalityForm)
  municipalityForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('municipality-name').value;
    const area = document.getElementById('municipality-area').value;
    const budget = document.getElementById('municipality-budget').value;
    const department = document.getElementById('municipality-department').value;
    const governor = document.getElementById('municipality-governor').value;

    await submitMunicipalityForm(name, area, budget, department, governor);
    municipalityModal.close();
    fondo.classList.remove('blur');
});



