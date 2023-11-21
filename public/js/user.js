// DOM Elements
const userForm = document.querySelector('.user-form');
const createButton = document.querySelector('.fab');
const userModal = document.querySelector('.user-modal');
const fondo = document.getElementById('fondo');
// const actualizarBtn = document.querySelector('.user-actualizar');
const eliminarBtn = document.querySelector('.user-eliminar');

let modoFormulario = 'crear'; // O 'actualizar'
let userIdActual = null; // Almacenar ID del usuario en modo actualizar

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

document.querySelectorAll('.user-actualizar').forEach(btn => {
  btn.addEventListener('click', e => {
      userIdActual = e.currentTarget.getAttribute('data-id');
      modoFormulario = 'actualizar';
      // Cargar datos del usuario con userId si es necesario
      userModal.showModal();
      fondo.classList.add('blur');
  });
});

const removeUser = async () => {
  if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

  try {
      const res = await axios({
          method: "DELETE",
          url: `/api/v1/users/${userIdActual}`,
      });

      if (res.status === 204) { // Por ejemplo, si tu API devuelve 204 para una eliminación exitosa
          showAlert('success', 'Usuario eliminado con éxito');
          
          window.setTimeout(() => {
            location.assign('/');
          }, 1500);
      }
  } catch (error) {
      showAlert('error', error.response.data.message);
      console.log(error);
  }
};

document.querySelectorAll('.user-eliminar').forEach(btn => {
  btn.addEventListener('click', e => {
      userIdActual = e.currentTarget.getAttribute('data-id');
      removeUser();
  });
});



createButton.addEventListener('click', e => {
    // userModal.open = !userModal.open;
    userModal.showModal();
    fondo.classList.add('blur');
});

// Event listener para cerrar la modal al hacer clic fuera
window.addEventListener('click', function(event) {
    // Comprueba si el clic fue fuera de la modal
    if (event.target === userModal) {
        userModal.close();
        fondo.classList.remove('blur');
    }
});

const submitUserForm = async (name, email, sex, phone, familyHead, birthDate) => {
    try {
      const url = modoFormulario === 'crear' ? '/api/v1/users' : `/api/v1/users/${userIdActual}`;
      const method = modoFormulario === 'crear' ? 'POST' : 'PATCH';
      
      const dataToUpdate = {};
      if (name) dataToUpdate.name = name;
      if (email) dataToUpdate.email = email;
      if (sex) dataToUpdate.sex = sex;
      if (phone) dataToUpdate.phone = phone;
      if (familyHead) dataToUpdate.familyHead = familyHead;
      if (birthDate) dataToUpdate.birthDate = birthDate;

      const res = await axios({
        method,
        url,
        data: dataToUpdate
      });
      
      if (res.data.status === 'success') {
        if (modoFormulario == "crear")  showAlert('success', 'Persona creada con éxito!');
        else showAlert('success', 'Persona actualizada con éxito!');
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
        console.log(err)
    }
};

if (userForm)
  userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('user-email').value;
    const name = document.getElementById('user-name').value;
    const sex = document.getElementById('user-sex').value;
    const phone = document.getElementById('user-phone').value;
    const birthDate = document.getElementById('user-birthDate').value;
    const familyHead = document.getElementById('user-familyHead').value;

    await submitUserForm(name, email, sex, phone, familyHead, birthDate);
    userModal.close();
    fondo.classList.remove('blur');
});



