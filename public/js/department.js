// DOM Elements
const departmentForm = document.querySelector('.department-form');
const createButton = document.querySelector('.fab');
const departmentModal = document.querySelector('.department-modal');
const fondo = document.getElementById('fondo');

let modoFormulario = 'crear'; // O 'actualizar'
let departmentIdActual = null;

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

document.querySelectorAll('.department-actualizar').forEach(btn => {
  btn.addEventListener('click', e => {
      departmentIdActual = e.currentTarget.getAttribute('data-id');
      modoFormulario = 'actualizar';
  
      departmentModal.showModal();
      fondo.classList.add('blur');
  });
});

const removeDepartment = async () => {
  if (!confirm('¿Estás seguro de que deseas eliminar este departamento?')) return;

  try {
      const res = await axios({
          method: "DELETE",
          url: `/api/v1/departments/${departmentIdActual}`,
      });

      if (res.status === 204) { // Por ejemplo, si tu API devuelve 204 para una eliminación exitosa
          showAlert('success', 'Departamento eliminado con éxito');
          
          window.setTimeout(() => {
            location.assign('/departamentos');
          }, 1500);
      }
  } catch (error) {
      showAlert('error', 'Error al eliminar el departamento');
      console.log(error);
  }
};

document.querySelectorAll('.department-eliminar').forEach(btn => {
  btn.addEventListener('click', e => {
      departmentIdActual = e.currentTarget.getAttribute('data-id');
      removeDepartment();
  });
});

createButton.addEventListener('click', e => {
    // departmentModal.open = !departmentModal.open;
    departmentModal.showModal();
    fondo.classList.add('blur');
});

// Event listener para cerrar la modal al hacer clic fuera
window.addEventListener('click', function(event) {
    // Comprueba si el clic fue fuera de la modal
    if (event.target === departmentModal) {
        departmentModal.close();
        fondo.classList.remove('blur');
    }
});

const submitDepartmentForm = async (name, area, budget, population) => {
    try {
      const url = modoFormulario === 'crear' ? '/api/v1/departments' : `/api/v1/departments/${departmentIdActual}`;
      const method = modoFormulario === 'crear' ? 'POST' : 'PATCH';
      
      const dataToUpdate = {};
      if (name) dataToUpdate.name = name;
      if (area) dataToUpdate.area = area;
      if (budget) dataToUpdate.budget = budget;
      if (population) dataToUpdate.population = population;

      const res = await axios({
        method,
        url,
        data: dataToUpdate
      });
      
      if (res.data.status === 'success') {
        if (modoFormulario == "crear") showAlert('success', 'Departamento creado con éxito!');
        else showAlert('success', 'Departamento actualizado con éxito!');
        
        window.setTimeout(() => {
          location.assign('/departamentos');
        }, 1500);
      }
    } catch (err) {
        showAlert('error', err.response.data.message);
        console.log(err)
    }
};

if (departmentForm)
  departmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('department-name').value;
    const area = document.getElementById('department-area').value;
    const budget = document.getElementById('department-budget').value;
    const population = document.getElementById('department-population').value;
    console.log(population)
    await submitDepartmentForm(name, area, budget, population);
    departmentModal.close();
    fondo.classList.remove('blur');
});



