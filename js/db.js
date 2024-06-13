
// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAhv8sig2xSMxE12IWirUp3ppNGMYjL6h0",
  authDomain: "sistemareservaciones-30b6e.firebaseapp.com",
  projectId: "sistemareservaciones-30b6e",
  storageBucket: "sistemareservaciones-30b6e.appspot.com",
  messagingSenderId: "392476332415",
  appId: "1:392476332415:web:e19141f3698b81ef538a4a"


import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import emailjs from 'https://cdn.emailjs.com/dist/email.min.js';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('appointmentForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;

            // Verificar disponibilidad
            const q = query(collection(db, 'appointments'), where('date', '==', date), where('time', '==', time), where('type', '==', document.title.split(' - ')[0]));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                alert('Esta hora ya está ocupada, por favor elige otro horario.');
                return;
            }

            // Agregar cita a Firestore
            try {
                await addDoc(collection(db, 'appointments'), {
                    name,
                    email,
                    phone,
                    date,
                    time,
                    type: document.title.split(' - ')[0] // Ginecología, Terapias Estéticas, Nutrición
                });
                alert('Cita agendada correctamente.');
                form.reset();

                // Enviar correo de confirmación
                sendConfirmationEmail(name, email, date, time, document.title.split(' - ')[0]);
            } catch (e) {
                console.error('Error al agregar la cita: ', e);
                alert('Error al agendar la cita, por favor intenta nuevamente.');
            }
        });
    }

    const calendar = document.getElementById('calendar');
    if (calendar) {
        loadCalendar();
    }

    async function loadCalendar() {
        const type = document.title.split(' - ')[1]; // Ginecología, Terapias Estéticas, Nutrición
        const q = query(collection(db, 'appointments'), where('type', '==', type));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const appointment = doc.data();
            const appointmentElement = document.createElement('div');
            appointmentElement.innerHTML = `
                <div>
                    <p>Nombre: ${appointment.name}</p>
                    <p>Correo: ${appointment.email}</p>
                    <p>Teléfono: ${appointment.phone}</p>
                    <p>Fecha: ${appointment.date}</p>
                    <p>Hora: ${appointment.time}</p>
                    <button data-id="${doc.id}" class="delete-appointment">Eliminar</button>
                </div>
            `;
            calendar.appendChild(appointmentElement);
        });

        document.querySelectorAll('.delete-appointment').forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                try {
                    await deleteDoc(doc(db, 'appointments', id));
                    alert('Cita eliminada correctamente.');
                    window.location.reload();
                } catch (e) {
                    console.error('Error al eliminar la cita: ', e);
                    alert('Error al eliminar la cita, por favor intenta nuevamente.');
                }
            });
        });
    }

    function sendConfirmationEmail(name, email, date, time, type) {
        const templateParams = {
            to_name: name,
            to_email: email,
            appointment_date: date,
            appointment_time: time,
            appointment_type: type
        };

        emailjs.send('SistemaReservacion', 'SRC', templateParams)
            .then((response) => {
                console.log('Correo enviado exitosamente!', response.status, response.text);
            }, (error) => {
                console.error('Error al enviar el correo:', error);
            });
    }
});
