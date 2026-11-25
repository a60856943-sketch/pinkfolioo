// Registrar Service Worker para PWA en iPhone/Android
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
}

const SECCIONES_MEDIA = [
    "perfil",
    "academica",
    "practicas",
    "extra",
    "experiencia",
    "intereses",
    "habilidades",
    "proyectos"
];

const mediaActual = {};
SECCIONES_MEDIA.forEach((sec) => {
    mediaActual[sec] = { foto: "", archivo: null };
});

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function escapeHtml(str) {
    return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// GENERADOR DE MONITOS KAWAII (GATITO, CONEJITO, OSITO, PANDITA, POLLITO, RANITA)
function generarMonitoSVG(semilla = "Pinkfolio", saludando = false) {
    const str = String(semilla || "Pinkfolio").trim().toLowerCase();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    const idx = Math.abs(hash);
    const tipo = idx % 6; // 0: gatito, 1: conejito, 2: osito, 3: pandita, 4: pollito, 5: ranita

    const fondos = ["#ffe6f3", "#f6e8ff", "#ffeaf5", "#fff0f7"];
    const fondo = fondos[idx % fondos.length];

    let orejas = "";
    let caraColor = "#ffffff";
    let detallesExtra = "";
    let nariz = `<ellipse cx="50" cy="56" rx="3.2" ry="2.2" fill="#ff7eb6"/>`;

    if (tipo === 0) {
        // Gatito blanco kawaii
        caraColor = "#ffffff";
        orejas = `
            <polygon points="24,42 29,18 44,34" fill="#ffffff" stroke="#f3c6de" stroke-width="2" stroke-linejoin="round"/>
            <polygon points="28,38 31,23 40,34" fill="#ffb3d9"/>
            <polygon points="76,42 71,18 56,34" fill="#ffffff" stroke="#f3c6de" stroke-width="2" stroke-linejoin="round"/>
            <polygon points="72,38 69,23 60,34" fill="#ffb3d9"/>`;
        detallesExtra = `
            <line x1="20" y1="53" x2="29" y2="55" stroke="#d49ab8" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="20" y1="59" x2="29" y2="59" stroke="#d49ab8" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="80" y1="53" x2="71" y2="55" stroke="#d49ab8" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="80" y1="59" x2="71" y2="59" stroke="#d49ab8" stroke-width="1.8" stroke-linecap="round"/>`;
    } else if (tipo === 1) {
        // Conejito rosa pastel
        caraColor = "#fff7fb";
        orejas = `
            <ellipse cx="37" cy="24" rx="7" ry="18" transform="rotate(-10 37 24)" fill="#fff7fb" stroke="#f3c6de" stroke-width="2"/>
            <ellipse cx="37" cy="24" rx="3.5" ry="12" transform="rotate(-10 37 24)" fill="#ffb3d9"/>
            <ellipse cx="63" cy="24" rx="7" ry="18" transform="rotate(10 63 24)" fill="#fff7fb" stroke="#f3c6de" stroke-width="2"/>
            <ellipse cx="63" cy="24" rx="3.5" ry="12" transform="rotate(10 63 24)" fill="#ffb3d9"/>`;
    } else if (tipo === 2) {
        // Osito miel kawaii
        caraColor = "#f7d6b5";
        orejas = `
            <circle cx="29" cy="31" r="9.5" fill="#f7d6b5"/>
            <circle cx="29" cy="31" r="5" fill="#e5a97b"/>
            <circle cx="71" cy="31" r="9.5" fill="#f7d6b5"/>
            <circle cx="71" cy="31" r="5" fill="#e5a97b"/>`;
        detallesExtra = `<ellipse cx="50" cy="59" rx="10" ry="7.5" fill="#fff6eb"/>`;
        nariz = `<ellipse cx="50" cy="56" rx="3.5" ry="2.4" fill="#6e473b"/>`;
    } else if (tipo === 3) {
        // Pandita kawaii
        caraColor = "#ffffff";
        orejas = `
            <circle cx="29" cy="31" r="9.5" fill="#4a3544"/>
            <circle cx="71" cy="31" r="9.5" fill="#4a3544"/>`;
        detallesExtra = `
            <ellipse cx="38" cy="51" rx="7.5" ry="6" transform="rotate(-15 38 51)" fill="#4a3544"/>
            <ellipse cx="62" cy="51" rx="7.5" ry="6" transform="rotate(15 62 51)" fill="#4a3544"/>`;
        nariz = `<ellipse cx="50" cy="57" rx="3.4" ry="2.2" fill="#4a3544"/>`;
    } else if (tipo === 4) {
        // Pollito esponjoso
        caraColor = "#fff0a6";
        orejas = `<path d="M 46 27 Q 50 18 53 26 Q 57 19 58 28" stroke="#f5c842" stroke-width="3" fill="none" stroke-linecap="round"/>`;
        nariz = `<polygon points="46,56 54,56 50,61" fill="#ff9f43"/>`;
    } else {
        // Ranita kawaii
        caraColor = "#c8f2c2";
        orejas = `
            <circle cx="35" cy="31" r="9" fill="#c8f2c2"/>
            <circle cx="65" cy="31" r="9" fill="#c8f2c2"/>`;
        nariz = "";
    }

    const patitaSaludo = saludando
        ? `<ellipse cx="80" cy="69" rx="6.5" ry="8.5" transform="rotate(28 80 69)" fill="${caraColor}" stroke="#f3c6de" stroke-width="1.8"/>`
        : "";

    return `
    <svg viewBox="0 0 100 100" width="100%" height="100%" style="background-color: ${fondo}; display: block;" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="100" height="100" fill="${fondo}"/>
        ${orejas}
        <!-- Cuerpo tierno -->
        <path d="M 30 96 C 30 78, 70 78, 70 96 Z" fill="${caraColor}" stroke="#f3c6de" stroke-width="1.8"/>
        <!-- Moñito rosa -->
        <polygon points="50,79 42,74 42,84" fill="#ff6eb4"/>
        <polygon points="50,79 58,74 58,84" fill="#ff6eb4"/>
        <circle cx="50" cy="79" r="2.6" fill="#d656a0"/>
        <!-- Cabecita gordita -->
        <ellipse cx="50" cy="53" rx="26" ry="23" fill="${caraColor}" stroke="#f3c6de" stroke-width="1.8"/>
        ${detallesExtra}
        <!-- Chapetes rosados -->
        <ellipse cx="32" cy="58" rx="4.8" ry="3" fill="#ff9ec9" opacity="0.75"/>
        <ellipse cx="68" cy="58" rx="4.8" ry="3" fill="#ff9ec9" opacity="0.75"/>
        <!-- Ojitos kawaii brillantes -->
        <circle cx="39" cy="51" r="3.6" fill="#3a1d31"/>
        <circle cx="61" cy="51" r="3.6" fill="#3a1d31"/>
        <circle cx="40.3" cy="49.7" r="1.4" fill="#ffffff"/>
        <circle cx="62.3" cy="49.7" r="1.4" fill="#ffffff"/>
        ${nariz}
        <!-- Boquita de gatito -->
        <path d="M 45 61 Q 47.5 64 50 61 Q 52.5 64 55 61" stroke="#6e3b58" stroke-width="2" stroke-linecap="round" fill="none"/>
        ${patitaSaludo}
    </svg>`;
}

function actualizarAvatarRegistro(nombre) {
    const cont = document.getElementById("avatarRegistroPreview");
    if (cont) {
        cont.innerHTML = generarMonitoSVG(nombre || "NuevoUsuario", true);
    }
}

function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = mensaje;
    toast.classList.remove("oculto");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.add("oculto"), 2600);
}

function mostrarAlertaAuth(idElemento, mensaje, tipo = "error") {
    const el = document.getElementById(idElemento);
    if (!el) return;
    el.textContent = mensaje;
    el.className = `alerta ${tipo}`;
}

function ocultarAlertasAuth() {
    ["alertaLogin", "alertaRegistro"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("oculto");
    });
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const oculto = input.type === "password";
    input.type = oculto ? "text" : "password";
    btn.textContent = oculto ? "Ocultar" : "Ver";
}

function mostrarRegistro() {
    ocultarAlertasAuth();
    actualizarAvatarRegistro("");
    document.getElementById("login").classList.add("oculto");
    document.getElementById("registro").classList.remove("oculto");
}

function mostrarLogin() {
    ocultarAlertasAuth();
    document.getElementById("registro").classList.add("oculto");
    document.getElementById("login").classList.remove("oculto");
}

function mostrarSeccion(seccionId) {
    document.querySelectorAll(".seccion").forEach(sec => sec.classList.add("oculto"));
    document.getElementById(seccionId).classList.remove("oculto");

    document.querySelectorAll("#menuSecciones button").forEach(btn => {
        btn.classList.toggle("activo", btn.dataset.sec === seccionId);
    });

    if (seccionId === "inicio") {
        renderizarInicio();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function comprimirImagen(file, maxAncho = 700, calidad = 0.8) {
    return new Promise((resolve, reject) => {
        const esTransparente = file.type === "image/png" || file.type === "image/webp";
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let ancho = img.width;
                let alto = img.height;

                if (ancho > maxAncho) {
                    alto = Math.round((alto * maxAncho) / ancho);
                    ancho = maxAncho;
                }

                canvas.width = ancho;
                canvas.height = alto;
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, ancho, alto);
                ctx.drawImage(img, 0, 0, ancho, alto);

                if (esTransparente) {
                    resolve(canvas.toDataURL("image/png"));
                } else {
                    resolve(canvas.toDataURL("image/jpeg", calidad));
                }
            };
            img.onerror = reject;
            img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function leerArchivoComoObjeto(file) {
    return new Promise((resolve, reject) => {
        if (file.size > 1500000) {
            reject(new Error("El archivo supera 1.5 MB. Usa uno más ligero."));
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            resolve({
                nombre: file.name,
                tipo: file.type || "application/octet-stream",
                tamanoKB: (file.size / 1024).toFixed(1),
                dataUrl: reader.result
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function actualizarPreviewSeccion(sec) {
    const cap = capitalizar(sec);
    const imgPreview = document.getElementById(`previewFoto${cap}`);
    const archPreview = document.getElementById(`previewArchivo${cap}`);
    const data = mediaActual[sec];

    if (imgPreview) {
        if (data.foto) {
            imgPreview.src = data.foto;
            imgPreview.classList.remove("oculto");
        } else {
            imgPreview.src = "";
            imgPreview.classList.add("oculto");
        }
    }

    if (archPreview) {
        if (data.archivo && data.archivo.dataUrl) {
            archPreview.textContent = `Archivo listo: ${data.archivo.nombre} (${data.archivo.tamanoKB} KB)`;
            archPreview.classList.remove("oculto");
        } else {
            archPreview.textContent = "";
            archPreview.classList.add("oculto");
        }
    }
}

function limpiarMediaFormulario(sec) {
    if (StorageDB.isInvitado()) return;
    const cap = capitalizar(sec);
    mediaActual[sec] = { foto: "", archivo: null };
    const fInput = document.getElementById(`foto${cap}`);
    const aInput = document.getElementById(`archivo${cap}`);
    if (fInput) fInput.value = "";
    if (aInput) aInput.value = "";
    actualizarPreviewSeccion(sec);
}

function htmlAdjuntos(dato) {
    const htmlFoto = dato.foto
        ? `<img src="${dato.foto}" alt="Imagen guardada" class="img-item-guardado">`
        : "";
    const htmlArchivo = (dato.archivo && dato.archivo.dataUrl)
        ? `<a href="${dato.archivo.dataUrl}" download="${escapeHtml(dato.archivo.nombre)}" class="archivo-adjunto">Descargar ${escapeHtml(dato.archivo.nombre)} (${dato.archivo.tamanoKB} KB)</a>`
        : "";
    return htmlFoto + htmlArchivo;
}

function renderizarInicio() {
    const contenedor = document.getElementById("resumenInicio");
    if (!contenedor) return;

    const invitado = StorageDB.isInvitado();
    const sesion = StorageDB.getUsuarioActual() || { nombre: "Usuario" };
    const perfil = StorageDB.getPerfil();
    const academica = StorageDB.getAcademica();
    const practicas = StorageDB.getPracticas();
    const extra = StorageDB.getLista("extra");
    const experiencia = StorageDB.getLista("experiencia");
    const intereses = StorageDB.getLista("intereses");
    const habilidades = StorageDB.getLista("habilidades");
    const proyectos = StorageDB.getLista("proyectos");

    const seccionesCompletadas = [
        Boolean(perfil.bio || perfil.foto || perfil.telefono || perfil.matricula),
        Boolean(academica.institucion || academica.carrera),
        Boolean(practicas.empresa || practicas.actividades),
        extra.length > 0,
        experiencia.length > 0,
        intereses.length > 0,
        habilidades.length > 0,
        proyectos.length > 0
    ];

    const totalSecciones = seccionesCompletadas.length;
    const completadas = seccionesCompletadas.filter(Boolean).length;
    const porcentaje = Math.round((completadas / totalSecciones) * 100);

    const semillaAvatar = perfil.nombre || sesion.correo || sesion.nombre || "Pinkfolio";
    const monitoPersonal = generarMonitoSVG(semillaAvatar, false);
    const monitoSaludando = generarMonitoSVG(semillaAvatar, true);

    const fotoHtml = perfil.foto
        ? `<img src="${perfil.foto}" alt="Foto de perfil" class="avatar-inicio">`
        : `<div class="avatar-placeholder">${monitoPersonal}</div>`;

    const nombreMostrar = escapeHtml(perfil.nombre || sesion.nombre || "Usuario");
    const subtituloMostrar = escapeHtml(academica.carrera || perfil.area || "Tu espacio profesional");

    const estadoVacioHtml = completadas === 0 ? `
        <div class="empty-state">
            <div class="globo-dialogo">
                ${invitado ? "¡Hola! Todavía no hay archivos ni datos aquí" : "¡Hola! Todavía no has subido nada"}
            </div>
            <div class="empty-monito">${monitoSaludando}</div>
            <h3>${invitado ? "Portafolio vacío por ahora" : "Tu espacio está listo para estrenarse"}</h3>
            <p>${invitado ? "Aún no se han cargado proyectos, evidencias ni información." : "Empieza completando tu perfil o subiendo tus archivos, certificados y proyectos."}</p>
            ${!invitado ? `<button type="button" class="btn-primario" onclick="mostrarSeccion('perfil')">Empezar a llenar mi perfil</button>` : ""}
        </div>
    ` : `
        <button type="button" class="btn-cv" onclick="exportarCV()">Descargar Currículum (PDF)</button>

        <div class="grid-resumen">
            <div class="mini-card" onclick="mostrarSeccion('proyectos')">
                <span class="mini-num">${proyectos.length}</span>
                <span class="mini-label">Proyectos</span>
            </div>
            <div class="mini-card" onclick="mostrarSeccion('habilidades')">
                <span class="mini-num">${habilidades.length}</span>
                <span class="mini-label">Habilidades</span>
            </div>
            <div class="mini-card" onclick="mostrarSeccion('experiencia')">
                <span class="mini-num">${experiencia.length}</span>
                <span class="mini-label">Experiencia</span>
            </div>
            <div class="mini-card" onclick="mostrarSeccion('extra')">
                <span class="mini-num">${extra.length}</span>
                <span class="mini-label">Act. Extra</span>
            </div>
        </div>
        <div class="item-guardado">
            <h3>Resumen de expediente</h3>
            <p><strong>Académica:</strong> ${academica.institucion ? escapeHtml(academica.institucion) : "Pendiente por completar"}</p>
            <p><strong>Prácticas:</strong> ${practicas.empresa ? escapeHtml(practicas.empresa) : "Pendiente por completar"}</p>
            <p><strong>Intereses y metas:</strong> ${intereses.length > 0 ? intereses.length + " registrados" : "Ninguno aún"}</p>
        </div>
    `;

    contenedor.innerHTML = `
        <div class="perfil-header-inicio">
            ${fotoHtml}
            <div>
                <h2>${nombreMostrar}</h2>
                <p class="subtitulo-inicio">${subtituloMostrar}</p>
            </div>
        </div>

        <div class="progreso-box">
            <div class="progreso-texto">
                <span>Progreso del portafolio</span>
                <strong>${porcentaje}% (${completadas}/${totalSecciones})</strong>
            </div>
            <div class="progreso-barra">
                <div class="progreso-relleno" style="width: ${porcentaje}%;"></div>
            </div>
        </div>

        ${estadoVacioHtml}
    `;
}

function renderizarObjetoUnico(clave, contenedorId, tituloFallback, lineasHtml) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    const data = clave === "perfil"
        ? StorageDB.getPerfil()
        : clave === "academica"
            ? StorageDB.getAcademica()
            : StorageDB.getPracticas();

    const tieneContenido = lineasHtml.some(Boolean) || data.foto || (data.archivo && data.archivo.dataUrl);
    if (!tieneContenido) {
        contenedor.innerHTML = `<p class="subtitulo-inicio">Aún no hay información registrada en esta sección.</p>`;
        return;
    }

    contenedor.innerHTML = `
        <div class="item-guardado">
            <h3>${tituloFallback}</h3>
            ${lineasHtml.filter(Boolean).map(l => `<p>${l}</p>`).join("")}
            ${htmlAdjuntos(data)}
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    const loginLogo = document.getElementById("avatarLoginPreview");
    if (loginLogo) {
        loginLogo.innerHTML = generarMonitoSVG("GatitoKawaii", true);
    }

    SECCIONES_MEDIA.forEach((sec) => {
        const cap = capitalizar(sec);
        const inputFoto = document.getElementById(`foto${cap}`);
        const inputArchivo = document.getElementById(`archivo${cap}`);

        if (inputFoto) {
            inputFoto.addEventListener("change", async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                try {
                    mediaActual[sec].foto = await comprimirImagen(file, 700, 0.8);
                    actualizarPreviewSeccion(sec);
                } catch {
                    mostrarToast("No se pudo cargar la imagen");
                }
            });
        }

        if (inputArchivo) {
            inputArchivo.addEventListener("change", async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                try {
                    mediaActual[sec].archivo = await leerArchivoComoObjeto(file);
                    actualizarPreviewSeccion(sec);
                } catch (err) {
                    mostrarToast(err.message);
                    e.target.value = "";
                }
            });
        }
    });
});

// REGISTRO CON VALIDACIONES
document.getElementById("formRegistro").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombreRegistro").value.trim();
    const area = document.getElementById("areaRegistro").value.trim();
    const correo = document.getElementById("correoRegistro").value.trim().toLowerCase();
    const password = document.getElementById("passwordRegistro").value;
    const confirmar = document.getElementById("confirmarPasswordRegistro").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!nombre || !area || !correo) {
        mostrarAlertaAuth("alertaRegistro", "Completa todos los campos obligatorios.");
        return;
    }
    if (!emailRegex.test(correo)) {
        mostrarAlertaAuth("alertaRegistro", "Ingresa un correo electrónico válido.");
        return;
    }
    if (password.length < 6) {
        mostrarAlertaAuth("alertaRegistro", "La contraseña debe tener al menos 6 caracteres.");
        return;
    }
    if (password !== confirmar) {
        mostrarAlertaAuth("alertaRegistro", "Las contraseñas no coinciden.");
        return;
    }

    const usuarios = StorageDB.getUsuariosRegistrados();
    if (usuarios.some(u => u.correo === correo)) {
        mostrarAlertaAuth("alertaRegistro", "Este correo ya está registrado. Inicia sesión.");
        return;
    }

    const nuevoUsuario = {
        id: Date.now(),
        nombre,
        area,
        correo,
        passwordHash: StorageDB.hashPassword(password)
    };

    StorageDB.addUsuarioRegistrado(nuevoUsuario);

    const perfilActual = StorageDB.getPerfil();
    if (!perfilActual.nombre) {
        localStorage.setItem("pinkfolio_perfil", JSON.stringify({
            ...perfilActual,
            nombre,
            correo,
            area
        }));
    }

    document.getElementById("formRegistro").reset();
    mostrarLogin();
    mostrarAlertaAuth("alertaLogin", "¡Cuenta creada! Inicia sesión con tus datos.", "exito");
});

// LOGIN CON VALIDACIÓN
document.getElementById("formLogin").addEventListener("submit", (e) => {
    e.preventDefault();
    const correo = document.getElementById("correoLogin").value.trim().toLowerCase();
    const password = document.getElementById("passwordLogin").value;

    const usuarios = StorageDB.getUsuariosRegistrados();
    if (usuarios.length === 0) {
        mostrarAlertaAuth("alertaLogin", "No hay cuentas registradas todavía. Crea una cuenta primero.");
        return;
    }

    const usuario = usuarios.find(u => u.correo === correo);
    if (!usuario) {
        mostrarAlertaAuth("alertaLogin", "No existe una cuenta con ese correo.");
        return;
    }

    const hashIngresado = StorageDB.hashPassword(password);
    const coincide = usuario.passwordHash ? usuario.passwordHash === hashIngresado : usuario.password === password;

    if (!coincide) {
        mostrarAlertaAuth("alertaLogin", "Contraseña incorrecta.");
        return;
    }

    const sesion = { nombre: usuario.nombre, correo: usuario.correo, rol: "admin" };
    StorageDB.setUsuarioActual(sesion);
    entrarAplicacion(sesion);
});

function accesoInvitado() {
    const sesion = { nombre: "Invitado", correo: "invitado@pinkfolio", rol: "invitado" };
    StorageDB.setUsuarioActual(sesion);
    entrarAplicacion(sesion);
}

function entrarAplicacion(sesion) {
    ocultarAlertasAuth();
    document.getElementById("login").classList.add("oculto");
    document.getElementById("registro").classList.add("oculto");
    document.getElementById("principal").classList.remove("oculto");

    const esInvitado = sesion.rol === "invitado";
    document.getElementById("nombreUsuario").textContent = sesion.nombre;

    const avatarTop = document.getElementById("avatarTopbar");
    if (avatarTop) {
        avatarTop.innerHTML = generarMonitoSVG(sesion.correo || sesion.nombre, false);
    }

    const badge = document.getElementById("badgeRol");
    badge.textContent = esInvitado ? "Invitado" : "Admin";
    badge.classList.toggle("invitado", esInvitado);

    document.querySelectorAll(".solo-admin").forEach(el => {
        el.classList.toggle("oculto", esInvitado);
    });

    cargarTodasLasListas();
    mostrarSeccion("inicio");
}

function cerrarSesion() {
    StorageDB.removeUsuarioActual();
    document.getElementById("principal").classList.add("oculto");
    document.getElementById("login").classList.remove("oculto");
    document.getElementById("formLogin").reset();
}

// FORMULARIOS
document.getElementById("formPerfil").addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = StorageDB.savePerfil({
        nombre: document.getElementById("pNombre").value.trim(),
        telefono: document.getElementById("pTelefono").value.trim(),
        correo: document.getElementById("pCorreo").value.trim(),
        matricula: document.getElementById("pMatricula").value.trim(),
        curp: document.getElementById("pCurp").value.trim(),
        area: document.getElementById("pArea").value.trim(),
        bio: document.getElementById("pBio").value.trim(),
        foto: mediaActual.perfil.foto,
        archivo: mediaActual.perfil.archivo
    });
    if (ok) {
        cargarTodasLasListas();
        renderizarInicio();
        mostrarToast("Perfil guardado con éxito");
    }
});

document.getElementById("formAcademica").addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = StorageDB.saveAcademica({
        institucion: document.getElementById("institucion").value.trim(),
        carrera: document.getElementById("carrera").value.trim(),
        semestre: document.getElementById("semestre").value.trim(),
        periodo: document.getElementById("periodo").value.trim(),
        foto: mediaActual.academica.foto,
        archivo: mediaActual.academica.archivo
    });
    if (ok) {
        cargarTodasLasListas();
        renderizarInicio();
        mostrarToast("Información académica guardada");
    }
});

document.getElementById("formPracticas").addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = StorageDB.savePracticas({
        empresa: document.getElementById("empresaPracticas").value.trim(),
        area: document.getElementById("areaPracticas").value.trim(),
        actividades: document.getElementById("actividadesPracticas").value.trim(),
        periodo: document.getElementById("periodoPracticas").value.trim(),
        foto: mediaActual.practicas.foto,
        archivo: mediaActual.practicas.archivo
    });
    if (ok) {
        cargarTodasLasListas();
        renderizarInicio();
        mostrarToast("Prácticas guardadas");
    }
});

document.getElementById("formExtra").addEventListener("submit", (e) => {
    e.preventDefault();
    const res = StorageDB.saveItemLista("extra", {
        etiqueta: document.getElementById("tipoExtra").value,
        nombre: document.getElementById("actividad").value.trim(),
        descripcion: document.getElementById("descripcionExtra").value.trim(),
        fecha: document.getElementById("fechaExtra").value.trim(),
        foto: mediaActual.extra.foto,
        archivo: mediaActual.extra.archivo
    });
    if (res) {
        document.getElementById("formExtra").reset();
        limpiarMediaFormulario("extra");
        renderizarLista("extra", "listaExtra");
        renderizarInicio();
        mostrarToast("Actividad agregada");
    }
});

document.getElementById("formExperiencia").addEventListener("submit", (e) => {
    e.preventDefault();
    const res = StorageDB.saveItemLista("experiencia", {
        empresa: document.getElementById("empresa").value.trim(),
        puesto: document.getElementById("puesto").value.trim(),
        descripcion: document.getElementById("descripcionTrabajo").value.trim(),
        periodo: document.getElementById("periodoTrabajo").value.trim(),
        foto: mediaActual.experiencia.foto,
        archivo: mediaActual.experiencia.archivo
    });
    if (res) {
        document.getElementById("formExperiencia").reset();
        limpiarMediaFormulario("experiencia");
        renderizarLista("experiencia", "listaExperiencia");
        renderizarInicio();
        mostrarToast("Experiencia guardada");
    }
});

document.getElementById("formIntereses").addEventListener("submit", (e) => {
    e.preventDefault();
    const res = StorageDB.saveItemLista("intereses", {
        etiqueta: document.getElementById("categoriaInteres").value,
        nombre: document.getElementById("interes").value.trim(),
        descripcion: document.getElementById("descripcionInteres").value.trim(),
        foto: mediaActual.intereses.foto,
        archivo: mediaActual.intereses.archivo
    });
    if (res) {
        document.getElementById("formIntereses").reset();
        limpiarMediaFormulario("intereses");
        renderizarLista("intereses", "listaIntereses");
        renderizarInicio();
        mostrarToast("Interés o meta agregado");
    }
});

document.getElementById("formHabilidades").addEventListener("submit", (e) => {
    e.preventDefault();
    const res = StorageDB.saveItemLista("habilidades", {
        etiqueta: "Habilidad " + document.getElementById("tipoHabilidad").value,
        nombre: document.getElementById("habilidad").value.trim(),
        nivel: document.getElementById("nivelHabilidad").value.trim(),
        foto: mediaActual.habilidades.foto,
        archivo: mediaActual.habilidades.archivo
    });
    if (res) {
        document.getElementById("formHabilidades").reset();
        limpiarMediaFormulario("habilidades");
        renderizarLista("habilidades", "listaHabilidades");
        renderizarInicio();
        mostrarToast("Habilidad guardada");
    }
});

document.getElementById("formProyectos").addEventListener("submit", (e) => {
    e.preventDefault();
    const res = StorageDB.saveItemLista("proyectos", {
        nombre: document.getElementById("nombreProyecto").value.trim(),
        descripcion: document.getElementById("descripcionProyecto").value.trim(),
        tecnologias: document.getElementById("tecnologias").value.trim(),
        foto: mediaActual.proyectos.foto,
        archivo: mediaActual.proyectos.archivo
    });
    if (res) {
        document.getElementById("formProyectos").reset();
        limpiarMediaFormulario("proyectos");
        renderizarLista("proyectos", "listaProyectos");
        renderizarInicio();
        mostrarToast("Proyecto guardado");
    }
});

function eliminarItem(entidad, contenedorId, index) {
    if (StorageDB.isInvitado()) return;
    StorageDB.deleteItemLista(entidad, index);
    renderizarLista(entidad, contenedorId);
    renderizarInicio();
    mostrarToast("Registro eliminado");
}

function renderizarLista(entidad, contenedorId) {
    const datos = StorageDB.getLista(entidad);
    const contenedor = document.getElementById(contenedorId);
    const invitado = StorageDB.isInvitado();
    if (!contenedor) return;

    if (datos.length === 0) {
        contenedor.innerHTML = `<p class="subtitulo-inicio">Aún no hay elementos registrados aquí.</p>`;
        return;
    }

    contenedor.innerHTML = "";
    datos.forEach((dato, index) => {
        const div = document.createElement("div");
        div.className = "item-guardado";
        div.innerHTML = `
            ${dato.etiqueta ? `<span class="etiqueta-item">${escapeHtml(dato.etiqueta)}</span>` : ""}
            <h3>${escapeHtml(dato.nombre || dato.empresa || "")}</h3>
            ${dato.puesto ? `<p><strong>Puesto:</strong> ${escapeHtml(dato.puesto)}</p>` : ""}
            ${dato.descripcion ? `<p>${escapeHtml(dato.descripcion)}</p>` : ""}
            <p><strong>${escapeHtml(dato.fecha || dato.periodo || dato.nivel || dato.tecnologias || "")}</strong></p>
            ${htmlAdjuntos(dato)}
            ${!invitado ? `<button type="button" class="btn-eliminar" onclick="eliminarItem('${entidad}', '${contenedorId}', ${index})">Eliminar</button>` : ""}
        `;
        contenedor.appendChild(div);
    });
}

function cargarTodasLasListas() {
    renderizarLista("extra", "listaExtra");
    renderizarLista("experiencia", "listaExperiencia");
    renderizarLista("intereses", "listaIntereses");
    renderizarLista("habilidades", "listaHabilidades");
    renderizarLista("proyectos", "listaProyectos");

    const perfil = StorageDB.getPerfil();
    document.getElementById("pNombre").value = perfil.nombre || "";
    document.getElementById("pTelefono").value = perfil.telefono || "";
    document.getElementById("pCorreo").value = perfil.correo || "";
    document.getElementById("pMatricula").value = perfil.matricula || "";
    document.getElementById("pCurp").value = perfil.curp || "";
    document.getElementById("pArea").value = perfil.area || "";
    document.getElementById("pBio").value = perfil.bio || "";
    mediaActual.perfil.foto = perfil.foto || "";
    mediaActual.perfil.archivo = perfil.archivo || null;
    actualizarPreviewSeccion("perfil");
    renderizarObjetoUnico("perfil", "vistaGuardadaPerfil", "Perfil guardado", [
        perfil.nombre ? `<strong>Nombre:</strong> ${escapeHtml(perfil.nombre)}` : "",
        perfil.area ? `<strong>Área:</strong> ${escapeHtml(perfil.area)}` : "",
        perfil.telefono ? `<strong>Teléfono:</strong> ${escapeHtml(perfil.telefono)}` : "",
        perfil.correo ? `<strong>Correo:</strong> ${escapeHtml(perfil.correo)}` : "",
        perfil.bio ? escapeHtml(perfil.bio) : ""
    ]);

    const academica = StorageDB.getAcademica();
    document.getElementById("institucion").value = academica.institucion || "";
    document.getElementById("carrera").value = academica.carrera || "";
    document.getElementById("semestre").value = academica.semestre || "";
    document.getElementById("periodo").value = academica.periodo || "";
    mediaActual.academica.foto = academica.foto || "";
    mediaActual.academica.archivo = academica.archivo || null;
    actualizarPreviewSeccion("academica");
    renderizarObjetoUnico("academica", "vistaGuardadaAcademica", "Información académica guardada", [
        academica.institucion ? `<strong>Institución:</strong> ${escapeHtml(academica.institucion)}` : "",
        academica.carrera ? `<strong>Carrera:</strong> ${escapeHtml(academica.carrera)}` : "",
        academica.semestre ? `<strong>Semestre:</strong> ${escapeHtml(academica.semestre)}` : "",
        academica.periodo ? `<strong>Periodo:</strong> ${escapeHtml(academica.periodo)}` : ""
    ]);

    const practicas = StorageDB.getPracticas();
    document.getElementById("empresaPracticas").value = practicas.empresa || "";
    document.getElementById("areaPracticas").value = practicas.area || "";
    document.getElementById("actividadesPracticas").value = practicas.actividades || "";
    document.getElementById("periodoPracticas").value = practicas.periodo || "";
    mediaActual.practicas.foto = practicas.foto || "";
    mediaActual.practicas.archivo = practicas.archivo || null;
    actualizarPreviewSeccion("practicas");
    renderizarObjetoUnico("practicas", "vistaGuardadaPracticas", "Prácticas guardadas", [
        practicas.empresa ? `<strong>Empresa:</strong> ${escapeHtml(practicas.empresa)}` : "",
        practicas.area ? `<strong>Área:</strong> ${escapeHtml(practicas.area)}` : "",
        practicas.actividades ? escapeHtml(practicas.actividades) : "",
        practicas.periodo ? `<strong>Periodo:</strong> ${escapeHtml(practicas.periodo)}` : ""
    ]);

    SECCIONES_MEDIA.slice(3).forEach((sec) => actualizarPreviewSeccion(sec));
}

// EXPORTACIÓN DE CURRÍCULUM EN PDF (SIN DATOS SENSIBLES)
function exportarCV() {
    const perfil = StorageDB.getPerfil();
    const academica = StorageDB.getAcademica();
    const practicas = StorageDB.getPracticas();
    const experiencia = StorageDB.getLista("experiencia");
    const proyectos = StorageDB.getLista("proyectos");
    const extra = StorageDB.getLista("extra");
    const habilidades = StorageDB.getLista("habilidades");
    const intereses = StorageDB.getLista("intereses");

    const nombre = perfil.nombre || "Portafolio Profesional";
    const ventana = window.open("", "_blank", "width=850,height=950");
    if (!ventana) {
        mostrarToast("Habilita las ventanas emergentes para descargar el PDF");
        return;
    }

    ventana.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>CV - ${escapeHtml(nombre)}</title>
<style>
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #3a1d31; padding: 32px; max-width: 780px; margin: 0 auto; line-height: 1.5; }
    .top { display: flex; align-items: center; gap: 18px; border-bottom: 2px solid #d656a0; padding-bottom: 16px; margin-bottom: 20px; }
    .top img { width: 78px; height: 78px; border-radius: 50%; object-fit: cover; border: 2px solid #d656a0; }
    h1 { color: #b83b84; font-size: 24px; margin: 0; }
    .sub { color: #785269; font-size: 13px; font-weight: 600; }
    h2 { color: #b83b84; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #f2c2de; padding-bottom: 4px; margin: 18px 0 10px; }
    .item { margin-bottom: 10px; }
    .item strong { font-size: 14px; }
    .meta { font-size: 12px; color: #785269; }
    .chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .chip { background: #fff0f8; border: 1px solid #f2c2de; padding: 4px 10px; border-radius: 999px; font-size: 12px; }
    @media print { body { padding: 12px; } }
</style>
</head>
<body>
    <div class="top">
        ${perfil.foto ? `<img src="${perfil.foto}" alt="Foto">` : ""}
        <div>
            <h1>${escapeHtml(nombre)}</h1>
            <div class="sub">${escapeHtml(perfil.area || academica.carrera || "")}</div>
            <div class="meta">${escapeHtml([perfil.telefono, perfil.correo].filter(Boolean).join(" • "))}</div>
        </div>
    </div>
    ${perfil.bio ? `<p>${escapeHtml(perfil.bio)}</p>` : ""}

    ${(academica.institucion || academica.carrera) ? `
    <h2>Formación Académica</h2>
    <div class="item">
        <strong>${escapeHtml(academica.carrera || "")}</strong> — ${escapeHtml(academica.institucion || "")}
        <div class="meta">${escapeHtml([academica.semestre, academica.periodo].filter(Boolean).join(" • "))}</div>
    </div>` : ""}

    ${experiencia.length ? `
    <h2>Experiencia Laboral</h2>
    ${experiencia.map(e => `
        <div class="item">
            <strong>${escapeHtml(e.puesto)}</strong> en ${escapeHtml(e.empresa)} <span class="meta">(${escapeHtml(e.periodo)})</span>
            ${e.descripcion ? `<div>${escapeHtml(e.descripcion)}</div>` : ""}
        </div>`).join("")}` : ""}

    ${(practicas.empresa || practicas.actividades) ? `
    <h2>Prácticas / Estadías</h2>
    <div class="item">
        <strong>${escapeHtml(practicas.area || "Practicante")}</strong> — ${escapeHtml(practicas.empresa || "")} <span class="meta">(${escapeHtml(practicas.periodo || "")})</span>
        ${practicas.actividades ? `<div>${escapeHtml(practicas.actividades)}</div>` : ""}
    </div>` : ""}

    ${proyectos.length ? `
    <h2>Proyectos</h2>
    ${proyectos.map(p => `
        <div class="item">
            <strong>${escapeHtml(p.nombre)}</strong> ${p.tecnologias ? `<span class="meta">(${escapeHtml(p.tecnologias)})</span>` : ""}
            ${p.descripcion ? `<div>${escapeHtml(p.descripcion)}</div>` : ""}
        </div>`).join("")}` : ""}

    ${extra.length ? `
    <h2>Formación Extracurricular</h2>
    ${extra.map(x => `
        <div class="item">
            <strong>${escapeHtml(x.nombre)}</strong> ${x.etiqueta ? `<span class="meta">[${escapeHtml(x.etiqueta)}]</span>` : ""} ${x.fecha ? `<span class="meta">• ${escapeHtml(x.fecha)}</span>` : ""}
            ${x.descripcion ? `<div>${escapeHtml(x.descripcion)}</div>` : ""}
        </div>`).join("")}` : ""}

    ${habilidades.length ? `
    <h2>Habilidades</h2>
    <div class="chips">${habilidades.map(h => `<span class="chip">${escapeHtml(h.nombre)} ${h.nivel ? `(${escapeHtml(h.nivel)})` : ""}</span>`).join("")}</div>` : ""}

    ${intereses.length ? `
    <h2>Intereses y Metas</h2>
    ${intereses.map(i => `<div class="item"><strong>${escapeHtml(i.nombre)}</strong> <span class="meta">(${escapeHtml(i.etiqueta || "")})</span>: ${escapeHtml(i.descripcion || "")}</div>`).join("")}` : ""}

    <script>window.onload = () => setTimeout(() => window.print(), 300);</script>
</body>
</html>`);
    ventana.document.close();
}

window.addEventListener("load", () => {
    const usuario = StorageDB.getUsuarioActual();
    if (usuario) {
        entrarAplicacion(usuario);
    }
});