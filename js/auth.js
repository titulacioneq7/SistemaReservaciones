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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

document.getElementById('google-login').addEventListener('click', function() {
    auth.signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            if (user.email === 'dr.stuarthgonz@gmail.com') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        })
        .catch(error => {
            console.error('Error de inicio de sesión:', error);
        });
});

function setupLogoutButton() {
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            auth.signOut().then(() => {
                window.location.href = 'index.html';
            }).catch((error) => {
                console.error('Error al cerrar sesión:', error);
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', setupLogoutButton);


