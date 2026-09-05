/* ============================================================
 *  CityStream — Autenticación
 *
 *  Cliente de /api/v1/auth para las páginas de registro, login,
 *  recuperación de contraseña y cuenta.
 *
 *  La sesión NO vive aquí. El API responde con una cookie
 *  HttpOnly (`cs_session`) que este código no puede leer ni por
 *  accidente: cada petición va con `credentials: 'include'` y el
 *  navegador adjunta la cookie solo. Por eso no hay token en
 *  localStorage, ni en sessionStorage, ni en memoria.
 *
 *  Un solo archivo para todas las páginas: cada formulario se
 *  declara con `data-auth="login|registro|olvide|reset"` y aquí
 *  se cablea el que exista en el documento.
 * ============================================================ */

'use strict';

const API_BASE =
  location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? 'http://localhost:8080'
    : 'https://api.citystream.tech';

/* ------------------------------------------------------------
 *  Cliente HTTP
 * ---------------------------------------------------------- */

/** Error con el status y el cuerpo del API, para mapear mensajes. */
class ApiError extends Error {
  constructor(status, body, headers) {
    super((body && body.message) || 'error');
    this.status = status;
    this.body = body || {};
    this.headers = headers;
  }
}

async function api(path, { method = 'POST', body } = {}) {
  let res;
  try {
    res = await fetch(API_BASE + '/api/v1' + path, {
      method,
      credentials: 'include', // manda y recibe la cookie de sesión
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch solo rechaza por red/CORS, nunca por status HTTP
    throw new ApiError(0, { message: 'network' });
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data, res.headers);
  return data;
}

/* ------------------------------------------------------------
 *  Mensajes de error
 *
 *  El backend expone un código estable (`rc`, ej. "AUTH_EMAIL_TAKEN")
 *  además del status HTTP — dos errores 409 o dos 401 distintos ya
 *  no hay que adivinarlos comparando el texto de `message`, que
 *  además está en inglés. Ver internal/apperrors en citystreamapi.
 *
 *  `rc` es opcional a propósito: si el API todavía no lo manda (un
 *  backend viejo desplegado), el switch no matchea nada y el código
 *  cae en el fallback por status de más abajo, igual que antes.
 * ---------------------------------------------------------- */

function mensajeDeError(err) {
  if (err.status === 0) {
    return 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.';
  }

  if (err.status === 429) {
    return `Demasiados intentos. Vuelve a intentarlo ${esperaLegible(err.headers)}.`;
  }

  const rc = (err.body && err.body.rc) || '';

  switch (rc) {
    case 'AUTH_EMAIL_TAKEN':
      return 'Ese correo ya tiene una cuenta. ¿Quieres iniciar sesión?';
    case 'AUTH_USERNAME_TAKEN':
      return 'Ese nombre de usuario ya está tomado. Prueba con otro.';
    case 'OAUTH_EMAIL_NOT_VERIFIED':
      return 'Ese email no está verificado con tu proveedor. Verifícalo e inténtalo de nuevo.';
    case 'AUTH_TOKEN_EXPIRED':
    case 'AUTH_TOKEN_INVALID':
    case 'AUTH_TOKEN_MALFORMED':
    case 'AUTH_TOKEN_MISSING':
    case 'AUTH_INVALID_CREDENTIALS':
      return null; // cada pantalla lo interpreta a su modo
  }

  if (err.status === 409) return 'Esos datos ya están registrados.';
  if (err.status === 401) return null; // cada pantalla lo interpreta a su modo
  if (err.status === 400) return 'Revisa los datos: hay algo que el servidor no aceptó.';
  if (err.status === 403) return 'Petición bloqueada por seguridad. Recarga la página e inténtalo de nuevo.';

  return 'Algo salió mal de nuestro lado. Inténtalo en un momento.';
}

/** Convierte X-RateLimit-Reset (timestamp unix) en "en 45 segundos". */
function esperaLegible(headers) {
  const reset = headers && Number(headers.get('X-RateLimit-Reset'));
  if (!reset) return 'más tarde';

  const segundos = Math.max(0, Math.round(reset - Date.now() / 1000));
  if (segundos <= 0) return 'ahora';
  if (segundos < 60) return `en ${segundos} segundo${segundos === 1 ? '' : 's'}`;

  const minutos = Math.ceil(segundos / 60);
  return `en ${minutos} minuto${minutos === 1 ? '' : 's'}`;
}

/* ------------------------------------------------------------
 *  Estado visual del formulario
 * ---------------------------------------------------------- */

function estado(form, tipo, texto) {
  const salida = form.querySelector('[data-auth-status]');
  const boton = form.querySelector('button[type="submit"]');

  if (boton) {
    boton.disabled = tipo === 'loading';
    boton.dataset.loading = tipo === 'loading' ? 'true' : '';
  }
  if (!salida) return;

  salida.textContent = texto || '';
  salida.dataset.tipo = tipo;
}

/** Marca un campo como inválido y le devuelve el foco. */
function campoInvalido(form, nombre, mensaje) {
  const campo = form.elements[nombre];
  if (!campo) return;
  campo.setAttribute('aria-invalid', 'true');
  campo.focus();
  estado(form, 'error', mensaje);
}

function limpiarInvalidos(form) {
  form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
}

/**
 * Cablea un formulario: valida con las reglas nativas, llama a `enviar`
 * y deja el estado visual consistente pase lo que pase.
 */
function conectar(form, enviar) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    limpiarInvalidos(form);

    // La validación nativa cubre required, type=email, minlength y pattern:
    // no hay que reimplementarla en JS.
    if (!form.reportValidity()) return;

    estado(form, 'loading', 'Enviando…');
    try {
      await enviar(new FormData(form));
    } catch (err) {
      const msg = mensajeDeError(err);
      estado(form, 'error', msg || 'No pudimos completar la operación.');
      if (err.status === 401 || err.status === 409) {
        const primero = form.querySelector('input:not([type=hidden])');
        if (primero) primero.focus();
      }
    }
  });
}

/* ------------------------------------------------------------
 *  Pantallas
 * ---------------------------------------------------------- */

function pantallaLogin(form) {
  conectar(form, async (datos) => {
    try {
      await api('/auth/login', {
        body: {
          email: String(datos.get('email')).trim().toLowerCase(),
          password: datos.get('password'),
        },
      });
    } catch (err) {
      if (err.status === 401) {
        // El servidor no distingue email inexistente de contraseña mala, y
        // la UI tampoco debe hacerlo: revelarlo permite enumerar cuentas.
        campoInvalido(form, 'password', 'Correo o contraseña incorrectos.');
        return;
      }
      throw err;
    }
    location.assign(destinoTrasLogin());
  });
}

function pantallaRegistro(form) {
  conectar(form, async (datos) => {
    const password = datos.get('password');
    if (password !== datos.get('password2')) {
      campoInvalido(form, 'password2', 'Las dos contraseñas no coinciden.');
      return;
    }

    await api('/auth/register', {
      body: {
        email: String(datos.get('email')).trim().toLowerCase(),
        username: String(datos.get('username')).trim(),
        password,
      },
    });
    location.assign('/cuenta.html');
  });
}

function pantallaOlvide(form) {
  conectar(form, async (datos) => {
    await api('/auth/forgot-password', {
      body: { email: String(datos.get('email')).trim().toLowerCase() },
    });
    // Mensaje idéntico exista o no la cuenta: el servidor responde 200
    // siempre para no revelar qué correos están registrados.
    form.hidden = true;
    const listo = document.querySelector('[data-auth-enviado]');
    if (listo) {
      listo.hidden = false;
      listo.focus();
    }
  });
}

function pantallaReset(form) {
  const token = new URLSearchParams(location.search).get('token');

  if (!token) {
    estado(form, 'error', 'Este enlace está incompleto. Pide uno nuevo desde "Olvidé mi contraseña".');
    form.querySelectorAll('input, button').forEach((el) => (el.disabled = true));
    return;
  }

  conectar(form, async (datos) => {
    const password = datos.get('password');
    if (password !== datos.get('password2')) {
      campoInvalido(form, 'password2', 'Las dos contraseñas no coinciden.');
      return;
    }

    try {
      await api('/auth/reset-password', { body: { token, password } });
    } catch (err) {
      if (err.status === 401) {
        estado(form, 'error', 'El enlace ya se usó o expiró. Pide uno nuevo desde "Olvidé mi contraseña".');
        return;
      }
      throw err;
    }
    location.assign('/login.html?cambiada=1');
  });
}

async function pantallaCuenta(raiz) {
  // El estado vive fuera de la tarjeta, que arranca oculta hasta confirmar
  // la sesión.
  const salida = document.querySelector('[data-auth-status]');

  let datos;
  try {
    datos = await api('/auth/me', { method: 'GET' });
  } catch (err) {
    // 401 = sin sesión, token roto o token expirado (dura 24 h). El backend
    // distingue el caso "expiró" del resto (rc AUTH_TOKEN_EXPIRED): ahí el
    // aviso es específico en vez del genérico "inicia sesión".
    if (err.status === 401) {
      const rc = (err.body && err.body.rc) || '';
      const destino =
        rc === 'AUTH_TOKEN_EXPIRED'
          ? '/login.html?expiro=1'
          : '/login.html?volver=' + encodeURIComponent(location.pathname);
      location.replace(destino);
      return;
    }
    if (salida) salida.textContent = mensajeDeError(err) || 'No pudimos cargar tu cuenta.';
    return;
  }

  const usuario = datos.user || datos;
  raiz.querySelectorAll('[data-campo]').forEach((el) => {
    const valor = usuario[el.dataset.campo];
    if (valor) el.textContent = valor;
  });
  if (salida) salida.textContent = '';
  raiz.hidden = false;

  const salir = document.querySelector('[data-auth-logout]');
  if (salir) {
    salir.addEventListener('click', async () => {
      salir.disabled = true;
      try {
        await api('/auth/logout');
      } catch {
        // Si el logout falla, la cookie sigue viva; llevar al login igual
        // sería mentirle al usuario sobre su estado de sesión.
        salir.disabled = false;
        return;
      }
      location.assign('/login.html?salio=1');
    });
  }
}

/** Vuelve a donde el usuario quería ir, si es una ruta de este sitio. */
function destinoTrasLogin() {
  const volver = new URLSearchParams(location.search).get('volver');
  // Solo rutas relativas propias: un `volver` con host abierto sería un
  // open redirect servido desde nuestro dominio.
  if (volver && volver.startsWith('/') && !volver.startsWith('//')) return volver;
  return '/cuenta.html';
}

/* ------------------------------------------------------------
 *  Avisos que llegan por query string
 * ---------------------------------------------------------- */

function avisoInicial() {
  const params = new URLSearchParams(location.search);
  const avisos = {
    cambiada: 'Tu contraseña quedó cambiada. Ya puedes entrar.',
    salio: 'Cerraste sesión.',
    volver: 'Inicia sesión para continuar.',
    expiro: 'Tu sesión expiró. Inicia sesión de nuevo.',
  };
  const clave = Object.keys(avisos).find((k) => params.has(k));
  if (!clave) return;

  const caja = document.querySelector('[data-auth-aviso]');
  if (caja) {
    caja.textContent = avisos[clave];
    caja.hidden = false;
  }
}

/* ------------------------------------------------------------
 *  OAuth (Google / Apple)
 *
 *  El API espera {id_token}, o sea que el token lo obtiene el
 *  navegador con el SDK del proveedor. Los botones aparecen solo
 *  si hay client ID configurado en static/js/auth-config.js —
 *  el mismo criterio que usa el backend, que solo registra las
 *  rutas OAuth cuando el proveedor está configurado.
 * ---------------------------------------------------------- */

function iniciarOAuth() {
  const cfg = window.CS_OAUTH || {};
  const zona = document.querySelector('[data-auth-oauth]');
  if (!zona || !cfg.googleClientId) return;

  zona.hidden = false;
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.onload = () => {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: cfg.googleClientId,
      callback: async ({ credential }) => {
        try {
          await api('/auth/oauth/google', { body: { id_token: credential } });
          location.assign(destinoTrasLogin());
        } catch (err) {
          const caja = document.querySelector('[data-auth-aviso]');
          if (caja) {
            caja.textContent = mensajeDeError(err) || 'No pudimos entrar con Google.';
            caja.hidden = false;
          }
        }
      },
    });
    window.google.accounts.id.renderButton(zona.querySelector('[data-oauth-google]'), {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      locale: 'es-419',
    });
  };
  document.head.appendChild(script);
}

/* ------------------------------------------------------------
 *  Arranque
 * ---------------------------------------------------------- */

const pantallas = {
  login: pantallaLogin,
  registro: pantallaRegistro,
  olvide: pantallaOlvide,
  reset: pantallaReset,
};

document.addEventListener('DOMContentLoaded', () => {
  avisoInicial();

  const form = document.querySelector('[data-auth]');
  if (form) {
    const pantalla = pantallas[form.dataset.auth];
    if (pantalla) pantalla(form);
    iniciarOAuth();
  }

  const cuenta = document.querySelector('[data-auth-cuenta]');
  if (cuenta) pantallaCuenta(cuenta);

  // Mostrar/ocultar contraseña. Nativo no existe, son cuatro líneas.
  document.querySelectorAll('[data-toggle-password]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const campo = document.getElementById(btn.dataset.togglePassword);
      if (!campo) return;
      const visible = campo.type === 'text';
      campo.type = visible ? 'password' : 'text';
      btn.setAttribute('aria-pressed', String(!visible));
      btn.textContent = visible ? 'Mostrar' : 'Ocultar';
    });
  });
});
