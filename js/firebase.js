import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

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

// Inicialización de la aplicación Firebase
firebase.initializeApp(firebaseConfig);

// Obtención de la referencia a la base de datos
var database = firebase.database();
