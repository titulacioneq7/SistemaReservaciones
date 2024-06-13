// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAQ62IM8yEMdPdQFepP9Faojj3JK8oryzc",
  authDomain: "sistemareservaciones-584be.firebaseapp.com",
  projectId: "sistemareservaciones-584be",
  storageBucket: "sistemareservaciones-584be.appspot.com",
  messagingSenderId: "1060448849855",
  appId: "1:1060448849855:web:335be69bdc4e6bf7145b0a",
  measurementId: "G-K9487NEQ7W"
};

// Inicialización de Firebase
firebase.initializeApp(firebaseConfig);

// Referencia a la base de datos
const database = firebase.database();

// Escuchar el evento de envío del formulario
document.getElementById('appointment').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Obtener los valores del formulario
    const formData = new FormData(event.target);
    const date = formData.get('date');
    const time = formData.get('time');

    // Verificar si la hora seleccionada está disponible en la base de datos
    const appointmentsRef = database.ref('appointments/' + date + '/' + time);
    appointmentsRef.once('value', function(snapshot) {
        const appointment = snapshot.val();
        if (appointment === null) {
            // La hora está disponible, guardar la cita en la base de datos
            appointmentsRef.set({
                patientName: formData.get('patientName'),
                phoneNumber: formData.get('phoneNumber'),
                email: formData.get('email'),
                symptoms: formData.get('symptoms')
            }).then(function() {
                alert("Tu cita ha sido agendada, revisa tu correo electrónico.");
            }).catch(function(error) {
                console.error("Error al guardar la cita: ", error);
            });
        } else {
            // La hora no está disponible
            alert("Lo siento, la hora seleccionada ya está ocupada. Por favor, elige otra hora.");
        }
    });
});
