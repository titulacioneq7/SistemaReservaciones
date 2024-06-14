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

// Reservation form submission for Nutrición
const formNutricion = document.getElementById('appointmentFormNutricion');
if (formNutricion) {
  formNutricion.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    db.collection('appointments_nutricion').add({
      name: name,
      phone: phone,
      date: date,
      time: time
    })
    .then(() => {
      alert('Cita reservada con éxito!');
      formNutricion.reset();
    })
    .catch((error) => {
      console.error('Error al reservar cita: ', error);
    });
  });
}

// Admin page: displaying appointments for Nutrición on FullCalendar
const calendarElNutricion = document.getElementById('calendarNutricion');
if (calendarElNutricion) {
  document.addEventListener('DOMContentLoaded', () => {
    const calendar = new FullCalendar.Calendar(calendarElNutricion, {
      initialView: 'dayGridMonth',
      events: function(fetchInfo, successCallback, failureCallback) {
        db.collection('appointments_nutricion').get().then(querySnapshot => {
          let events = [];
          querySnapshot.forEach(doc => {
            const data = doc.data();
            events.push({
              title: data.name,
              start: `${data.date}T${data.time}`,
              id: doc.id
            });
          });
          successCallback(events);
        }).catch(error => {
          console.error('Error fetching appointments: ', error);
          failureCallback(error);
        });
      },
      editable: true,
      eventClick: function(info) {
        if (confirm('¿Deseas eliminar esta cita?')) {
          db.collection('appointments_nutricion').doc(info.event.id).delete()
            .then(() => {
              alert('Cita eliminada con éxito');
              info.event.remove();
            })
            .catch(error => {
              console.error('Error al eliminar cita: ', error);
            });
        }
      },
      eventDrop: function(info) {
        const newDate = info.event.start.toISOString().split('T')[0];
        const newTime = info.event.start.toISOString().split('T')[1].substr(0, 5);
        
        db.collection('appointments_nutricion').doc(info.event.id).update({
          date: newDate,
          time: newTime
        })
        .then(() => {
          alert('Cita actualizada con éxito');
        })
        .catch(error => {
          console.error('Error al actualizar cita: ', error);
        });
      }
    });

    calendar.render();
  });
}
