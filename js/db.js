import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

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
    const calendarElement = document.getElementById('calendar');
    if (calendarElement) {
        const calendarType = document.title.split(' - ')[1]; // Ginecología, Terapias Estéticas, Nutrición
        loadCalendar(calendarType);
    }
});

async function loadCalendar(type) {
    const events = [];
    const q = query(collection(db, 'appointments'), where('type', '==', type));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const appointment = doc.data();
        events.push({
            id: doc.id,
            title: appointment.name,
            start: `${appointment.date}T${appointment.time}`,
            extendedProps: {
                email: appointment.email,
                phone: appointment.phone
            }
        });
    });

    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        events: events,
        eventClick: function(event) {
            if (confirm('¿Deseas eliminar esta cita?')) {
                deleteAppointment(event.id);
            }
        },
        eventDrop: function(event) {
            updateAppointment(event.id, event.start.format());
        },
        eventResize: function(event) {
            updateAppointment(event.id, event.start.format());
        }
    });
}

async function deleteAppointment(id) {
    try {
        await deleteDoc(doc(db, 'appointments', id));
        alert('Cita eliminada correctamente.');
        $('#calendar').fullCalendar('removeEvents', id);
    } catch (e) {
        console.error('Error al eliminar la cita: ', e);
        alert('Error al eliminar la cita, por favor intenta nuevamente.');
    }
}

async function updateAppointment(id, datetime) {
    const [date, time] = datetime.split('T');
    try {
        await updateDoc(doc(db, 'appointments', id), {
            date,
            time
        });
        alert('Cita actualizada correctamente.');
    } catch (e) {
        console.error('Error al actualizar la cita: ', e);
        alert('Error al actualizar la cita, por favor intenta nuevamente.');
    }
}
