import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

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
        const events = querySnapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().name,
            start: `${doc.data().date}T${doc.data().time}`,
            extendedProps: {
                email: doc.data().email,
                phone: doc.data().phone,
                type: doc.data().type
            }
        }));

        $(document).ready(function() {
            $('#calendar').fullCalendar({
                initialView: 'dayGridMonth',
                events: events,
                editable: true,
                eventClick: function(info) {
                    const id = info.event.id;
                    if (confirm('¿Deseas eliminar esta cita?')) {
                        deleteDoc(doc(db, 'appointments', id)).then(() => {
                            alert('Cita eliminada correctamente.');
                            window.location.reload();
                        }).catch((e) => {
                            console.error('Error al eliminar la cita: ', e);
                            alert('Error al eliminar la cita, por favor intenta nuevamente.');
                        });
                    }
                },
                eventDrop: function(info) {
                    const id = info.event.id;
                    const newDate = info.event.startStr.split('T')[0];
                    const newTime = info.event.startStr.split('T')[1];
                    updateDoc(doc(db, 'appointments', id), {
                        date: newDate,
                        time: newTime
                    }).then(() => {
                        alert('Cita actualizada correctamente.');
                    }).catch((e) => {
                        console.error('Error al actualizar la cita: ', e);
                        alert('Error al actualizar la cita, por favor intenta nuevamente.');
                    });
                }
            });
        });
    }
});

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html';
    }
});
