// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhv8sig2xSMxE12IWirUp3ppNGMYjL6h0",
  authDomain: "sistemareservaciones-30b6e.firebaseapp.com",
  projectId: "sistemareservaciones-30b6e",
  storageBucket: "sistemareservaciones-30b6e.appspot.com",
  messagingSenderId: "392476332415",
  appId: "1:392476332415:web:e19141f3698b81ef538a4a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Elements
const ginecologiaTable = document.getElementById('ginecologiaTable').querySelector('tbody');
const esteticasTable = document.getElementById('esteticasTable').querySelector('tbody');
const nutricionTable = document.getElementById('nutricionTable').querySelector('tbody');

// Modal Elements
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editId = document.getElementById('editId');
const editCollection = document.getElementById('editCollection');
const editName = document.getElementById('editName');
const editPhone = document.getElementById('editPhone');
const editDate = document.getElementById('editDate');
const editTime = document.getElementById('editTime');
const closeModal = document.getElementsByClassName('close')[0];

// Fetch and display patients
function fetchPatients(collectionName, tableElement) {
  db.collection(collectionName).get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      const data = doc.data();
      const row = tableElement.insertRow();
      row.insertCell(0).textContent = data.name;
      row.insertCell(1).textContent = data.phone;
      row.insertCell(2).textContent = data.date;
      row.insertCell(3).textContent = data.time;
      const actionsCell = row.insertCell(4);
      
      const editButton = document.createElement('button');
      editButton.textContent = 'Editar';
      editButton.addEventListener('click', () => {
        openEditModal(doc.id, collectionName, data);
      });
      actionsCell.appendChild(editButton);
    });
  }).catch(error => {
    console.error('Error fetching patients: ', error);
  });
}

fetchPatients('appointments_ginecologia', ginecologiaTable);
fetchPatients('appointments_esteticas', esteticasTable);
fetchPatients('appointments_nutricion', nutricionTable);

// Open edit modal
function openEditModal(id, collection, data) {
  editId.value = id;
  editCollection.value = collection;
  editName.value = data.name;
  editPhone.value = data.phone;
  editDate.value = data.date;
  editTime.value = data.time;
  editModal.style.display = 'block';
}

// Close edit modal
closeModal.onclick = function() {
  editModal.style.display = 'none';
}

// Save changes
editForm.onsubmit = function(e) {
  e.preventDefault();
  const id = editId.value;
  const collection = editCollection.value;
  const updatedData = {
    name: editName.value,
    phone: editPhone.value,
    date: editDate.value,
    time: editTime.value
  };
  db.collection(collection).doc(id).update(updatedData)
    .then(() => {
      alert('Cita actualizada con éxito');
      location.reload();
    })
    .catch(error => {
      console.error('Error al actualizar cita: ', error);
    });
}
