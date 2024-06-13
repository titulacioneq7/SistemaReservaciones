import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

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

$(document).ready(function() {
    const calendarEl = $('#calendar');

    const calendar = calendarEl.fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        events: async function(start, end, timezone, callback) {
            const type = document.title.split(' - ')[1]; // Ginecología, Terapias Estéticas, Nutrición
            const q = query(collection(db, 'appointments'), where('type', '==', type));
            const querySnapshot = await getDocs(q);
            const events = [];
            querySnapshot.forEach((doc) => {
                const appointment = doc.data();
                events.push({
                    id: doc.id,
                    title: `${appointment.name} - ${appointment.email}`,
                    start: `${appointment.date}T${appointment.time}`,
                    end: `${appointment.date}T${moment(appointment.time, 'HH:mm').add(1, 'hours').format('HH:mm')}`,
                    extendedProps: {
                        phone: appointment.phone,
                    }
                });
            });
            callback(events);
        },
        eventClick: function(event) {
            if (confirm('¿Deseas eliminar esta cita?')) {
                deleteAppointment(event.id);
            }
        },
        eventDrop: function(event) {
            updateAppointment(event.id, event.start.format(), event.end.format());
        }
    });

    async function deleteAppointment(id) {
        try {
            await deleteDoc(doc(db, 'appointments', id));
            alert('Cita eliminada correctamente.');
            calendar.fullCalendar('refetchEvents');
        } catch (e) {
            console.error('Error al eliminar la cita: ', e);
            alert('Error al eliminar la cita, por favor intenta nuevamente.');
        }
    }

    async function updateAppointment(id, start, end) {
        try {
            const startTime = moment(start).format('HH:mm');
            const date = moment(start).format('YYYY-MM-DD');
            await updateDoc(doc(db, 'appointments', id), {
                date: date,
                time: startTime,
            });
            alert('Cita actualizada correctamente.');
            calendar.fullCalendar('refetchEvents');
        } catch (e) {
            console.error('Error al actualizar la cita: ', e);
            alert('Error al actualizar la cita, por favor intenta nuevamente.');
        }
    }
});
