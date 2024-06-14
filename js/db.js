import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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

document.getElementById("appointment-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("patient-name").value;
    const phone = document.getElementById("patient-phone").value;
    const time = document.getElementById("appointment-time").value;
    const consultorio = document.querySelector("html").dataset.consultorio;

    const q = query(collection(db, consultorio), where("time", "==", time));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        await addDoc(collection(db, consultorio), { name, phone, time });
        alert("Cita reservada con éxito");
    } else {
        alert("Hora no disponible, por favor elige otra");
    }
});

document.getElementById("cancel-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const appointmentId = document.getElementById("appointment-id").value;
    const consultorio = document.querySelector("html").dataset.consultorio;

    const docRef = doc(db, consultorio, appointmentId);
    await deleteDoc(docRef);
    alert("Cita cancelada con éxito");
});

document.getElementById("logout").addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Error al cerrar sesión", error);
    });
});

window.addEventListener("load", async () => {
    const consultorio = document.querySelector("html").dataset.consultorio;
    const q = query(collection(db, consultorio));
    const querySnapshot = await getDocs(q);

    const appointmentsList = document.getElementById("appointments-list-content");
    querySnapshot.forEach((doc) => {
        const appointment = doc.data();
        const appointmentItem = document.createElement("div");
        appointmentItem.className = "appointment-item";
        appointmentItem.innerHTML = `
            <strong>ID:</strong> ${doc.id}<br>
            <strong>Nombre:</strong> ${appointment.name}<br>
            <strong>Teléfono:</strong> ${appointment.phone}<br>
            <strong>Hora:</strong> ${appointment.time}<br>
        `;
        appointmentsList.appendChild(appointmentItem);
    });
});
