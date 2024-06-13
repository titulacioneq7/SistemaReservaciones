document.addEventListener('DOMContentLoaded', async () => {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        const response = await fetch('footer.html');
        const footerHtml = await response.text();
        footerContainer.innerHTML = footerHtml;

        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
        const { getAuth, signOut } = await import('https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js');

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
        const auth = getAuth(app);

        // Configurar el botón de cerrar sesión
        const logoutButton = document.getElementById('logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                signOut(auth).then(() => {
                    window.location.href = 'index.html';
                }).catch((error) => {
                    console.error('Error al cerrar sesión:', error);
                });
            });
        }
    }
});
