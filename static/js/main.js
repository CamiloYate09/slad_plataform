const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".container .letter-s", {
  duration: 1000,
  delay: 1000,
});
ScrollReveal().reveal(".container img", {
  duration: 1000,
  delay: 1500,
});
ScrollReveal().reveal(".container .text__left", {
  ...scrollRevealOption,
  origin: "right",
  delay: 2000,
});
ScrollReveal().reveal(".container .text__right", {
  ...scrollRevealOption,
  origin: "left",
  delay: 2000,
});
ScrollReveal().reveal(".container .explore", {
  duration: 1000,
  delay: 2500,
});
ScrollReveal().reveal(".container h5", {
  duration: 1000,
  interval: 500,
  delay: 3000,
});
ScrollReveal().reveal(".container .catalog", {
  duration: 1000,
  delay: 5000,
});
ScrollReveal().reveal(".container .print", {
  duration: 1000,
  delay: 5500,
});
ScrollReveal().reveal(".footer p", {
  duration: 1000,
  delay: 7000,
});

document.addEventListener('DOMContentLoaded', function() {
    const backgrounds = document.querySelectorAll('.bg-slide');
    let currentIndex = 0;

    function changeBackground() {
        // Remover la clase active de todos los fondos
        backgrounds.forEach(bg => bg.classList.remove('active'));

        // Incrementar el índice
        currentIndex = (currentIndex + 1) % backgrounds.length;

        // Añadir la clase active al siguiente fondo
        backgrounds[currentIndex].classList.add('active');
    }

    // Cambiar el fondo cada 5 segundos
    setInterval(changeBackground, 5000);
});

// Manejo del formulario y modales
document.addEventListener('DOMContentLoaded', function() {
  const formOverlay = document.querySelector('.form-overlay');
  const welcomeOverlay = document.querySelector('.welcome-overlay');
  const openFormBtn = document.querySelector('.open-form');
  const closeFormBtn = document.querySelector('.close-form');
  const closeWelcomeBtn = document.querySelector('.close-welcome');
  const form = document.querySelector('.form');

  // Función para generar token aleatorio
  function generateToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  // Función para verificar autorización
  function checkAuthorization() {
    // Implementación de verificación de autorización
    // Por ejemplo, verificar si el usuario está autenticado
    // o tiene los permisos necesarios

    // Para este ejemplo, usamos localStorage para simular una sesión
    const authToken = localStorage.getItem('authToken');
    return authToken && localStorage.getItem('userAuthorized') === 'true';
  }

  // Función para solicitar autorización
  function requestAuthorization() {
    // En un entorno real, esto podría redirigir a una página de inicio de sesión
    // o mostrar un diálogo de autenticación

    const isAuthorized = confirm("Para acceder a este formulario necesita autorización. ¿Desea continuar con el proceso de autorización?");

    if (isAuthorized) {
      // Generar token de autorización
      const authToken = generateToken();

      // Simular autorización exitosa
      localStorage.setItem('userAuthorized', 'true');
      localStorage.setItem('authToken', authToken);

      // Establecer el token en el formulario
      if (document.getElementById('auth_token')) {
        document.getElementById('auth_token').value = authToken;
      }

      return true;
    }

    return false;
  }

  // Función para generar y establecer token CSRF
  function setupCSRFProtection() {
    const csrfToken = generateToken();
    localStorage.setItem('csrfToken', csrfToken);

    if (document.getElementById('csrf_token')) {
      document.getElementById('csrf_token').value = csrfToken;
    }
  }

  // Inicializar protección CSRF al cargar la página
  setupCSRFProtection();

  // Abrir formulario con verificación de autorización
  openFormBtn.addEventListener('click', function(e) {
    e.preventDefault();

    // Verificar autorización antes de mostrar el formulario
    if (checkAuthorization() || requestAuthorization()) {
      // Generar nuevo token CSRF cada vez que se abre el formulario
      setupCSRFProtection();

      // Asegurarse de que el token de autorización esté en el formulario
      if (document.getElementById('auth_token')) {
        document.getElementById('auth_token').value = localStorage.getItem('authToken');
      }

      formOverlay.style.display = 'flex';
    } else {
      alert("No tiene autorización para acceder a este formulario.");
    }
  });

  // Cerrar formulario
  closeFormBtn.addEventListener('click', function() {
    formOverlay.style.display = 'none';
  });

  // Cerrar modal de bienvenida
  closeWelcomeBtn.addEventListener('click', function() {
    welcomeOverlay.style.display = 'none';
  });

  // Manejar envío del formulario con verificación de autorización y CSRF
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Verificar autorización antes de procesar el envío
    if (!checkAuthorization()) {
      alert("No tiene autorización para enviar este formulario.");
      formOverlay.style.display = 'none';
      return;
    }

    // Verificar token CSRF
    const formCsrfToken = document.getElementById('csrf_token').value;
    const storedCsrfToken = localStorage.getItem('csrfToken');

    if (!formCsrfToken || formCsrfToken !== storedCsrfToken) {
      alert("Error de seguridad: Token CSRF inválido. Por favor, intente nuevamente.");
      formOverlay.style.display = 'none';
      return;
    }

    // Verificar token de autorización
    const formAuthToken = document.getElementById('auth_token').value;
    const storedAuthToken = localStorage.getItem('authToken');

    if (!formAuthToken || formAuthToken !== storedAuthToken) {
      alert("Error de seguridad: Token de autorización inválido. Por favor, intente nuevamente.");
      formOverlay.style.display = 'none';
      return;
    }

    // Si todo está correcto, procesar el formulario
    console.log("Formulario enviado con éxito. Datos:", {
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      csrf: formCsrfToken,
      auth: formAuthToken
    });

    // Mostrar mensaje de bienvenida y resetear formulario
    formOverlay.style.display = 'none';
    welcomeOverlay.style.display = 'flex';
    form.reset();

    // Generar nuevos tokens para la próxima vez
    setupCSRFProtection();
  });

  // Cerrar al hacer clic fuera con verificación de autorización para el formulario
  window.addEventListener('click', function(e) {
    if (e.target === formOverlay) {
      // Verificar autorización y tokens antes de permitir cerrar
      const authToken = localStorage.getItem('authToken');
      const formAuthToken = document.getElementById('auth_token')?.value;

      // Solo permitir cerrar si está autorizado y los tokens coinciden
      if (checkAuthorization() && authToken === formAuthToken) {
        formOverlay.style.display = 'none';
      } else {
        // Si no está autorizado o los tokens no coinciden, cerramos el formulario
        // y mostramos un mensaje de seguridad
        formOverlay.style.display = 'none';
        alert("Sesión no autorizada cerrada por motivos de seguridad.");

        // Limpiar tokens por seguridad
        if (document.getElementById('csrf_token')) {
          document.getElementById('csrf_token').value = '';
        }
        if (document.getElementById('auth_token')) {
          document.getElementById('auth_token').value = '';
        }
      }
    }
    if (e.target === welcomeOverlay) {
      welcomeOverlay.style.display = 'none';
    }
  });

});
