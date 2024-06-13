import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAhv8sig2xSMxE12IWirUp3ppNGMYjL6h0",
  authDomain: "sistemareservaciones-30b6e.firebaseapp.com",
  projectId: "sistemareservaciones-30b6e",
  storageBucket: "sistemareservaciones-30b6e.appspot.com",
  messagingSenderId: "392476332415",
  appId: "1:392476332415:web:e19141f3698b81ef538a4a"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('appointment-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const patientName = document.getElementById('patient-name').value;
    const doctorName = document.getElementById('doctor-name').value;
    const appointmentTime = document.getElementById('appointment-time').value;

    try {
        const docRef = await addDoc(collection(db, 'appointments'), {
            patientName,
            doctorName,
            appointmentTime
        });
        console.log('Cita reservada con ID:', docRef.id);
        loadAppointments();
    } catch (e) {
        console.error('Error agregando cita:', e);
    }
});

async function loadAppointments() {
    const appointmentList = document.getElementById('appointment-list');
    appointmentList.innerHTML = '';

    const querySnapshot = await getDocs(collection(db, 'appointments'));
    querySnapshot.forEach((doc) => {
        const appointment = doc.data();
        const listItem = document.createElement('div');
        listItem.textContent = `${appointment.patientName} - ${appointment.doctorName} - ${appointment.appointmentTime}`;
        appointmentList.appendChild(listItem);
    });
}

document.addEventListener('DOMContentLoaded', loadAppointments);
