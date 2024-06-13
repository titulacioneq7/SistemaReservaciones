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

document.addEventListener('DOMContentLoaded', function() {
    const consultoriosList = document.getElementById('consultorios-list');
    if (consultoriosList) {
        consultoriosList.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const doctor = e.target.getAttribute('data-doctor');
                const specialty = e.target.getAttribute('data-specialty');
                alert(`Has elegido ${specialty} con ${doctor}`);
            }
        });
    }

    const addDoctorForm = document.getElementById('add-doctor-form');
    if (addDoctorForm) {
        addDoctorForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const doctorName = document.getElementById('doctor-name').value;
            const specialty = document.getElementById('specialty').value;

            try {
                await db.collection('doctors').add({
                    doctorName,
                    specialty
                });
                loadDoctors();
            } catch (e) {
                console.error('Error agregando doctor:', e);
            }
        });
    }

    async function loadDoctors() {
        const adminConsultoriosList = document.getElementById('admin-consultorios-list');
        if (adminConsultoriosList) {
            adminConsultoriosList.innerHTML = '';
            const querySnapshot = await db.collection('doctors').get();
            querySnapshot.forEach((doc) => {
                const doctor = doc.data();
                const listItem = document.createElement('div');
                listItem.textContent = `${doctor.doctorName} - ${doctor.specialty}`;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Eliminar';
                deleteButton.addEventListener('click', async () => {
                    await db.collection('doctors').doc(doc.id).delete();
                    loadDoctors();
                });
                listItem.appendChild(deleteButton);
                adminConsultoriosList.appendChild(listItem);
            });
        }
    }

    if (document.getElementById('admin-consultorios-list')) {
        loadDoctors();
    }

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
});


