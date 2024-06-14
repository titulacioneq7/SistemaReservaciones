import { initializeApp } from "https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

$(document).ready(function() {
    $('#calendar').fullCalendar({
        editable: true,
        events: async function(start, end, timezone, callback) {
            const querySnapshot = await getDocs(collection(db, 'nutricion'));
            const events = [];
            querySnapshot.forEach((doc) => {
                const appointment = doc.data();
                events.push({
                    id: doc.id,
                    title: `${appointment.name} - ${appointment.phone}`,
                    start: appointment.time,
                });
            });
            callback(events);
        },
        eventClick: function(event) {
            const isConfirmed = confirm("¿Desea eliminar esta cita?");
            if (isConfirmed) {
                deleteDoc(doc(db, 'nutricion', event.id));
                $('#calendar').fullCalendar('removeEvents', event.id);
            }
        }
    });

    document.getElementById("logout").addEventListener("click", () => {
        signOut(auth).then(() => {
            window.location.href = "index.html";
        }).catch((error) => {
            console.error("Error al cerrar sesión", error);
        });
    });
});
