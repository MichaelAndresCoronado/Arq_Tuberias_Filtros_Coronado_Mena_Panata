const API_BASE = 'http://localhost:3000/api';

// ESTADO GLOBAL

const state = {
    currentSection: 'autores',
    autores: [],
    libros: [],
    usuarios: [],
    prestamos: [],
    autorEditable: null,
    libroEditable: null,
    usuarioEditable: null,
    prestamoEditable: null
};

// INICIALIZACIÓN

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeFormFeedback();
    loadAllData();
});

// EVENT LISTENERS

function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    // Autores
    document.getElementById('btn-add-autor').addEventListener('click', () => openAutorForm());
    document.getElementById('btn-search-autores').addEventListener('click', searchAutores);
    document.getElementById('search-autores').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchAutores();
    });

    // Libros
    document.getElementById('btn-add-libro').addEventListener('click', () => openLibroForm());

    // Usuarios
    document.getElementById('btn-add-usuario').addEventListener('click', () => openUsuarioForm());

    // Préstamos
    document.getElementById('btn-add-prestamo').addEventListener('click', () => openPrestamoForm());

    // Modal
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.getElementById('btn-cancel-modal').addEventListener('click', closeModal);
    document.getElementById('form-modal').addEventListener('submit', handleFormSubmit);

    // Cerrar modal al hacer click fuera
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') closeModal();
    });
}

function initializeFormFeedback() {
    const form = document.getElementById('form-modal');
    const formFields = document.getElementById('form-fields');

    if (!form || !formFields || document.getElementById('form-feedback')) return;

    const feedback = document.createElement('div');
    feedback.id = 'form-feedback';
    feedback.className = 'form-feedback';
    feedback.style.display = 'none';
    form.insertBefore(feedback, formFields);
}

// NAVEGACIÓN

function handleNavigation(e) {
    e.preventDefault();
    const section = e.currentTarget.dataset.section;

    // Actualizar active
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    e.currentTarget.classList.add('active');

    // Cambiar sección
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(`${section}-section`).classList.add('active');

    state.currentSection = section;
}

// CARGAR DATOS

async function loadAllData() {
    await loadAutores();
    await loadLibros();
    await loadUsuarios();
    await loadPrestamos();
}

async function loadAutores() {
    try {
        const response = await fetch(`${API_BASE}/autores`);
        const data = await response.json();
        state.autores = data.data || [];
        renderAutoresTable();
    } catch (error) {
        console.error('Error cargando autores:', error);
        showToast('Error al cargar autores', 'error');
    }
}

async function loadLibros() {
    try {
        const response = await fetch(`${API_BASE}/libros`);
        const data = await response.json();
        state.libros = data.data || [];
        renderLibrosTable();
    } catch (error) {
        console.error('Error cargando libros:', error);
        showToast('Error al cargar libros', 'error');
    }
}

async function loadUsuarios() {
    try {
        const response = await fetch(`${API_BASE}/usuarios`);
        if (!response.ok) throw new Error('No se pudieron cargar los usuarios');
        const data = await response.json();
        state.usuarios = data.data || [];
        renderUsuariosTable();
    } catch (error) {
        console.error('Error cargando usuarios:', error);
        showToast('Error al cargar usuarios', 'error');
    }
}

async function loadPrestamos() {
    try {
        const response = await fetch(`${API_BASE}/prestamos`);
        if (!response.ok) return;
        const data = await response.json();
        state.prestamos = data.data || [];
        renderPrestamosTable();
    } catch (error) {
        console.error('Error cargando préstamos:', error);
        showToast('Error al cargar préstamos', 'error');
    }
}

// ================================
// RENDERIZAR TABLAS
// ================================

function renderAutoresTable() {
    const tbody = document.getElementById('autores-tbody');

    if (state.autores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="loading">No hay autores registrados</td></tr>';
        return;
    }

    tbody.innerHTML = state.autores.map(autor => `
        <tr>
            <td>${autor.autor_id}</td>
            <td>${autor.nombre}</td>
            <td>${autor.apellido}</td>
            <td>${autor.email || 'N/A'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" onclick="openAutorForm(${autor.autor_id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteAutor(${autor.autor_id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderLibrosTable() {
    const tbody = document.getElementById('libros-tbody');

    if (state.libros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading">No hay libros registrados</td></tr>';
        return;
    }

    tbody.innerHTML = state.libros.map(libro => `
        <tr>
            <td>${libro.id}</td>
            <td>${libro.titulo}</td>
            <td>${libro.isbn}</td>
            <td>${libro.nombre || 'N/A'} ${libro.apellido || ''}</td>
            <td><span class="badge badge-info">${libro.anio_publicacion || 'N/A'}</span></td>
            <td><span class="badge badge-secondary">${libro.edicion || 'N/A'}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" onclick="openLibroForm(${libro.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteLibro(${libro.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderUsuariosTable() {
    const tbody = document.getElementById('usuarios-tbody');

    if (state.usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="loading">No hay usuarios registrados</td></tr>';
        return;
    }

    tbody.innerHTML = state.usuarios.map(usuario => `
        <tr>
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.apellido}</td>
            <td>${usuario.email}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="openUsuarioForm(${usuario.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-warning" onclick="viewUsuarioPrestamos(${usuario.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteUsuario(${usuario.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderPrestamosTable() {
    const tbody = document.getElementById('prestamos-tbody');

    if (state.prestamos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading">No hay préstamos registrados</td></tr>';
        return;
    }

    tbody.innerHTML = state.prestamos.map(prestamo => {
        const devolucionReal = prestamo.fecha_devolucion_real;
        const estado = devolucionReal
            ? '<span class="badge badge-success">Devuelto</span>'
            : '<span class="badge badge-warning">Activo</span>';

        return `
            <tr>
                <td>${prestamo.id}</td>
                <td>${prestamo.nombre_usuario || 'N/A'}</td>
                <td>${prestamo.titulo_libro || 'N/A'}</td>
                <td>${formatDate(prestamo.fecha_prestamo)}</td>
                <td>${formatDate(prestamo.fecha_devolucion_prevista)}</td>
                <td>${estado}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="openPrestamoForm(${prestamo.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${!devolucionReal ? `
                            <button class="btn btn-success" onclick="openDevolucionForm(${prestamo.id})">
                                <i class="fas fa-reply"></i>
                            </button>
                        ` : ''}
                        <button class="btn btn-danger" onclick="deletePrestamo(${prestamo.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ================================
// FORMULARIOS - AUTORES
// ================================

function openAutorForm(id = null) {
    state.autorEditable = id;

    const formFields = document.getElementById('form-fields');
    const modalTitle = document.getElementById('modal-title');

    if (id) {
        const autor = state.autores.find(a => a.autor_id === id);
        modalTitle.textContent = 'Editar Autor';
        formFields.innerHTML = `
            <div class="form-group">
                <label>Nombre *</label>
                <input type="text" id="autor-nombre" value="${autor.nombre}" required>
            </div>
            <div class="form-group">
                <label>Apellido *</label>
                <input type="text" id="autor-apellido" value="${autor.apellido}" required>
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" id="autor-email" value="${autor.email || ''}" required>
            </div>
        `;
    } else {
        modalTitle.textContent = 'Nuevo Autor';
        formFields.innerHTML = `
            <div class="form-group">
                <label>Nombre *</label>
                <input type="text" id="autor-nombre" placeholder="Ej: Gabriel" required>
            </div>
            <div class="form-group">
                <label>Apellido *</label>
                <input type="text" id="autor-apellido" placeholder="Ej: García Márquez" required>
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" id="autor-email" placeholder="Ej: gabriel@example.com" required>
            </div>
        `;
    }

    openModal();
}

// ================================
// FORMULARIOS - LIBROS
// ================================

function openLibroForm(id = null) {
    state.libroEditable = id;

    const formFields = document.getElementById('form-fields');
    const modalTitle = document.getElementById('modal-title');

    if (id) {
        const libro = state.libros.find(l => l.id === id);
        modalTitle.textContent = 'Editar Libro';
        formFields.innerHTML = `
            <div class="form-group">
                <label>Título *</label>
                <input type="text" id="libro-titulo" value="${libro.titulo}" required>
            </div>
            <div class="form-group">
                <label>ISBN *</label>
                <input type="text" id="libro-isbn" value="${libro.isbn}" required>
            </div>
            <div class="form-group">
                <label>Año de Publicación</label>
                <input type="number" id="libro-anio_publicacion" value="${libro.anio_publicacion || ''}">
            </div>
            <div class="form-group">
                <label>Edición</label>
                <input type="text" id="libro-edicion" value="${libro.edicion || ''}">
            </div>
            <div class="form-group">
                <label>Autor *</label>
                <select id="libro-autor_id" required>
                    <option value="">Seleccionar autor</option>
                    ${state.autores.map(a => `
                        <option value="${a.autor_id}" ${a.autor_id === libro.autor_id ? 'selected' : ''}>
                            ${a.nombre} ${a.apellido}
                        </option>
                    `).join('')}
                </select>
            </div>
        `;
    } else {
        modalTitle.textContent = 'Nuevo Libro';
        formFields.innerHTML = `
            <div class="form-group">
                <label>Título *</label>
                <input type="text" id="libro-titulo" placeholder="Ej: Cien años de soledad" required>
            </div>
            <div class="form-group">
                <label>ISBN *</label>
                <input type="text" id="libro-isbn" placeholder="Ej: 978-0-06-085846-5" required>
            </div>
            <div class="form-group">
                <label>Año de Publicación</label>
                <input type="number" id="libro-anio_publicacion" placeholder="Ej: 1967">
            </div>
            <div class="form-group">
                <label>Edición</label>
                <input type="text" id="libro-edicion" placeholder="Ej: Primera">
            </div>
            <div class="form-group">
                <label>Autor *</label>
                <select id="libro-autor_id" required>
                    <option value="">Seleccionar autor</option>
                    ${state.autores.map(a => `
                        <option value="${a.autor_id}">
                            ${a.nombre} ${a.apellido}
                        </option>
                    `).join('')}
                </select>
            </div>
        `;
    }

    openModal();
}

// ================================
// FORMULARIOS - USUARIOS
// ================================

function openUsuarioForm(id = null) {
    state.usuarioEditable = id;

    const formFields = document.getElementById('form-fields');
    const modalTitle = document.getElementById('modal-title');

    if (id) {
        const usuario = state.usuarios.find(u => u.id === id);
        modalTitle.textContent = 'Editar Usuario';
        formFields.innerHTML = `
            <div class="form-group">
                <label>Nombre *</label>
                <input type="text" id="usuario-nombre" value="${usuario.nombre}" required>
            </div>
            <div class="form-group">
                <label>Apellido *</label>
                <input type="text" id="usuario-apellido" value="${usuario.apellido}" required>
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" id="usuario-email" value="${usuario.email}" required>
            </div>
            <div class="form-group">
                <label>Contraseña</label>
                <input type="password" id="usuario-password" placeholder="Dejar en blanco para no cambiar">
            </div>
        `;
    } else {
        modalTitle.textContent = 'Nuevo Usuario';
        formFields.innerHTML = `
            <div class="form-group">
                <label>Nombre *</label>
                <input type="text" id="usuario-nombre" placeholder="Ej: Juan" required>
            </div>
            <div class="form-group">
                <label>Apellido *</label>
                <input type="text" id="usuario-apellido" placeholder="Ej: Pérez" required>
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" id="usuario-email" placeholder="Ej: juan@example.com" required>
            </div>
            <div class="form-group">
                <label>Contraseña *</label>
                <input type="password" id="usuario-password" placeholder="Contraseña" required>
            </div>
        `;
    }

    openModal();
}

// ================================
// FORMULARIOS - PRÉSTAMOS
// ================================

function openPrestamoForm(id = null) {
    state.prestamoEditable = id;

    const formFields = document.getElementById('form-fields');
    const modalTitle = document.getElementById('modal-title');

    const prestamo = id ? state.prestamos.find(p => p.id === id) : null;

    modalTitle.textContent = id ? 'Editar Préstamo' : 'Nuevo Préstamo';

    formFields.innerHTML = `
        <div class="form-group">
            <label>Usuario *</label>
            <select id="prestamo-usuario_id" required>
                <option value="">Seleccionar usuario</option>
                ${state.usuarios.map(u => `
                    <option value="${u.id}" ${prestamo && Number(prestamo.usuario_id) === Number(u.id) ? 'selected' : ''}>${u.nombre} ${u.apellido}</option>
                `).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Libro *</label>
            <select id="prestamo-libro_id" required>
                <option value="">Seleccionar libro</option>
                ${state.libros.map(l => `
                    <option value="${l.id}" ${prestamo && Number(prestamo.libro_id) === Number(l.id) ? 'selected' : ''}>${l.titulo}</option>
                `).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Fecha Préstamo *</label>
            <input type="date" id="prestamo-fecha_prestamo" value="${prestamo?.fecha_prestamo || getTodayDate()}" required>
        </div>
        <div class="form-group">
            <label>Fecha Devolución Prevista *</label>
            <input type="date" id="prestamo-fecha_devolucion_prevista" value="${prestamo?.fecha_devolucion_prevista || getDatePlus(14)}" required>
        </div>
    `;

    openModal();
}

function openDevolucionForm(prestamoId) {
    const formFields = document.getElementById('form-fields');
    const modalTitle = document.getElementById('modal-title');

    state.prestamoEditable = prestamoId;
    modalTitle.textContent = 'Registrar Devolución';
    formFields.innerHTML = `
        <div class="form-group">
            <label>Fecha Devolución Real *</label>
            <input type="date" id="prestamo-fecha_devolucion_real" value="${getTodayDate()}" required>
        </div>
        <input type="hidden" id="prestamo-type" value="devolucion">
    `;

    openModal();
}

// ================================
// MANEJADOR DE FORMULARIOS
// ================================

async function handleFormSubmit(e) {
    e.preventDefault();

    const form = document.getElementById('form-modal');
    if (form.dataset.readOnly === 'true') {
        closeModal();
        return;
    }

    const tipoDevolucion = document.getElementById('prestamo-type')?.value;

    if (tipoDevolucion === 'devolucion') {
        await submitDevoluccion();
    } else if (state.autorEditable !== null) {
        await submitAutor();
    } else if (state.libroEditable !== null) {
        await submitLibro();
    } else if (state.usuarioEditable !== null) {
        await submitUsuario();
    } else if (state.prestamoEditable !== null) {
        // Nuevo préstamo
        if (document.getElementById('prestamo-usuario_id')) {
            await submitPrestamo();
        }
    } else {
        // Determinar qué tipo de formulario es basado en los campos presentes
        if (document.getElementById('autor-nombre')) {
            await submitAutor();
        } else if (document.getElementById('libro-titulo')) {
            await submitLibro();
        } else if (document.getElementById('usuario-nombre')) {
            await submitUsuario();
        } else if (document.getElementById('prestamo-usuario_id')) {
            await submitPrestamo();
        }
    }
}

async function submitAutor() {
    clearFormFeedback();
    const validationError = validateAutorForm();
    if (validationError) {
        showFormFeedback(validationError, 'error');
        return;
    }

    const nombre = document.getElementById('autor-nombre').value;
    const apellido = document.getElementById('autor-apellido').value;
    const email = document.getElementById('autor-email').value;

    const payload = { nombre, apellido, email, password: 'password123' };

    try {
        const url = state.autorEditable
            ? `${API_BASE}/autores/${state.autorEditable}`
            : `${API_BASE}/autores`;

        const method = state.autorEditable ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData?.error?.message || 'Error en la solicitud');
        }

        showToast(
            state.autorEditable ? 'Autor actualizado' : 'Autor creado',
            'success'
        );
        closeModal();
        await loadAutores();
        state.autorEditable = null;
    } catch (error) {
        console.error('Error:', error);
        showFormFeedback(error.message || 'Error al guardar el autor', 'error');
        showToast(error.message || 'Error al guardar el autor', 'error');
    }
}

async function submitLibro() {
    clearFormFeedback();
    const validationError = validateLibroForm();
    if (validationError) {
        showFormFeedback(validationError, 'error');
        return;
    }

    const titulo = document.getElementById('libro-titulo').value;
    const isbn = document.getElementById('libro-isbn').value;
    const anio_publicacion = document.getElementById('libro-anio_publicacion').value;
    const edicion = document.getElementById('libro-edicion').value;
    const autor_id = parseInt(document.getElementById('libro-autor_id').value);

    const payload = { titulo, isbn, anio_publicacion, edicion, autor_id };

    try {
        const url = state.libroEditable
            ? `${API_BASE}/libros/${state.libroEditable}`
            : `${API_BASE}/libros`;

        const method = state.libroEditable ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData?.error?.message || 'Error en la solicitud');
        }

        showToast(
            state.libroEditable ? 'Libro actualizado' : 'Libro creado',
            'success'
        );
        closeModal();
        await loadLibros();
        state.libroEditable = null;
    } catch (error) {
        console.error('Error:', error);
        showFormFeedback(error.message || 'Error al guardar el libro', 'error');
        showToast(error.message || 'Error al guardar el libro', 'error');
    }
}

async function submitUsuario() {
    clearFormFeedback();
    const validationError = validateUsuarioForm();
    if (validationError) {
        showFormFeedback(validationError, 'error');
        return;
    }

    const nombre = document.getElementById('usuario-nombre').value;
    const apellido = document.getElementById('usuario-apellido').value;
    const email = document.getElementById('usuario-email').value;
    const password = document.getElementById('usuario-password').value;

    const payload = { nombre, apellido, email };
    if (password) payload.password = password;

    try {
        const url = state.usuarioEditable
            ? `${API_BASE}/usuarios/${state.usuarioEditable}`
            : `${API_BASE}/usuarios`;

        const method = state.usuarioEditable ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData?.error?.message || 'Error en la solicitud');
        }

        showToast(
            state.usuarioEditable ? 'Usuario actualizado' : 'Usuario creado',
            'success'
        );
        closeModal();
        await loadUsuarios();
        state.usuarioEditable = null;
    } catch (error) {
        console.error('Error:', error);
        showFormFeedback(error.message || 'Error al guardar el usuario', 'error');
        showToast(error.message || 'Error al guardar el usuario', 'error');
    }
}

async function submitPrestamo() {
    clearFormFeedback();
    const validationError = validatePrestamoForm();
    if (validationError) {
        showFormFeedback(validationError, 'error');
        return;
    }

    const usuario_id = parseInt(document.getElementById('prestamo-usuario_id').value);
    const libro_id = parseInt(document.getElementById('prestamo-libro_id').value);
    const fecha_prestamo = document.getElementById('prestamo-fecha_prestamo').value;
    const fecha_devolucion_prevista = document.getElementById('prestamo-fecha_devolucion_prevista').value;

    const payload = { usuario_id, libro_id, fecha_prestamo, fecha_devolucion_prevista };

    try {
        const url = state.prestamoEditable
            ? `${API_BASE}/prestamos/${state.prestamoEditable}`
            : `${API_BASE}/prestamos`;

        const method = state.prestamoEditable ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData?.error?.message || 'Error en la solicitud');
        }

        showToast(state.prestamoEditable ? 'Préstamo actualizado' : 'Préstamo creado', 'success');
        closeModal();
        await loadPrestamos();
        state.prestamoEditable = null;
    } catch (error) {
        console.error('Error:', error);
        showFormFeedback(error.message || 'Error al crear el préstamo', 'error');
        showToast(error.message || 'Error al crear el préstamo', 'error');
    }
}

async function submitDevoluccion() {
    clearFormFeedback();
    const validationError = validateDevolucionForm();
    if (validationError) {
        showFormFeedback(validationError, 'error');
        return;
    }

    const fecha_devolucion_real = document.getElementById('prestamo-fecha_devolucion_real').value;

    const payload = { fecha_devolucion_real };

    try {
        const response = await fetch(`${API_BASE}/prestamos/${state.prestamoEditable}/devolucion`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData?.error?.message || 'Error en la solicitud');
        }

        showToast('Devolución registrada', 'success');
        closeModal();
        await loadPrestamos();
        state.prestamoEditable = null;
    } catch (error) {
        console.error('Error:', error);
        showFormFeedback(error.message || 'Error al registrar la devolución', 'error');
        showToast(error.message || 'Error al registrar la devolución', 'error');
    }
}

// ================================
// BÚSQUEDA
// ================================

async function searchAutores() {
    const query = document.getElementById('search-autores').value;

    if (!query.trim()) {
        await loadAutores();
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/autores/buscar?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        state.autores = data.data || [];
        renderAutoresTable();
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al buscar autores', 'error');
    }
}

// ================================
// ELIMINAR
// ================================

async function deleteAutor(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este autor?')) return;

    try {
        const response = await fetch(`${API_BASE}/autores/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error en la solicitud');

        showToast('Autor eliminado', 'success');
        await loadAutores();
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar el autor', 'error');
    }
}

async function deleteLibro(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este libro?')) return;

    try {
        const response = await fetch(`${API_BASE}/libros/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error en la solicitud');

        showToast('Libro eliminado', 'success');
        await loadLibros();
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar el libro', 'error');
    }
}

async function deleteUsuario(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

    try {
        const response = await fetch(`${API_BASE}/usuarios/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData?.error?.message || 'Error en la solicitud');
        }

        showToast('Usuario eliminado', 'success');
        await loadUsuarios();
    } catch (error) {
        console.error('Error:', error);
        showToast(error.message || 'Error al eliminar el usuario', 'error');
    }
}

async function deletePrestamo(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este préstamo?')) return;

    try {
        const response = await fetch(`${API_BASE}/prestamos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData?.error?.message || 'Error en la solicitud');
        }

        showToast('Préstamo eliminado', 'success');
        await loadPrestamos();
    } catch (error) {
        console.error('Error:', error);
        showToast(error.message || 'Error al eliminar el préstamo', 'error');
    }
}

// ================================
// VER PRÉSTAMOS POR USUARIO
// ================================

async function viewUsuarioPrestamos(usuarioId) {
    try {
        const response = await fetch(`${API_BASE}/usuarios/${usuarioId}/prestamos`);
        if (!response.ok) throw new Error('No se pudieron cargar los préstamos del usuario');
        const data = await response.json();
        const prestamos = data.data || [];

        const formFields = document.getElementById('form-fields');
        const modalTitle = document.getElementById('modal-title');

        const usuario = state.usuarios.find(u => u.id === usuarioId);
        const nombreUsuario = usuario
            ? `${usuario.nombre} ${usuario.apellido}`
            : `Usuario #${usuarioId}`;
        modalTitle.textContent = `Préstamos de ${nombreUsuario}`;

        if (prestamos.length === 0) {
            formFields.innerHTML = '<p style="text-align: center; color: #999;">No hay préstamos</p>';
        } else {
            formFields.innerHTML = `
                <div style="overflow-x: auto;">
                    <table class="data-table" style="font-size: 0.9rem;">
                        <thead>
                            <tr>
                                <th>Libro</th>
                                <th>ISBN</th>
                                <th>Préstamo</th>
                                <th>Devolución</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${prestamos.map(p => `
                                <tr>
                                    <td>${p.titulo}</td>
                                    <td>${p.isbn}</td>
                                    <td>${formatDate(p.fecha_prestamo)}</td>
                                    <td>${p.fecha_devolucion_real ? formatDate(p.fecha_devolucion_real) : 'Pendiente'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        const form = document.getElementById('form-modal');
        const submitButton = form.querySelector('button[type="submit"]');
        const cancelButton = document.getElementById('btn-cancel-modal');

        submitButton.style.display = 'none';
        cancelButton.textContent = 'Cerrar';
        form.dataset.readOnly = 'true';

        openModal();
    } catch (error) {
        console.error('Error:', error);
        showToast(error.message || 'Error al cargar los préstamos', 'error');
    }
}

// ================================
// MODAL
// ================================

function openModal() {
    clearFormFeedback();
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    const form = document.getElementById('form-modal');
    const submitButton = form.querySelector('button[type="submit"]');
    const cancelButton = document.getElementById('btn-cancel-modal');

    form.style.display = 'flex';
    submitButton.style.display = 'inline-flex';
    cancelButton.textContent = 'Cancelar';
    delete form.dataset.readOnly;
    clearFormFeedback();

    document.getElementById('form-fields').innerHTML = '';
    state.autorEditable = null;
    state.libroEditable = null;
    state.usuarioEditable = null;
    state.prestamoEditable = null;
}

function showFormFeedback(message, type = 'error') {
    const feedback = document.getElementById('form-feedback');
    if (!feedback) return;

    feedback.textContent = message;
    feedback.className = `form-feedback ${type}`;
    feedback.style.display = 'block';
}

function clearFormFeedback() {
    const feedback = document.getElementById('form-feedback');
    if (!feedback) return;

    feedback.textContent = '';
    feedback.className = 'form-feedback';
    feedback.style.display = 'none';
}

function validateAutorForm() {
    const nombre = document.getElementById('autor-nombre')?.value.trim();
    const apellido = document.getElementById('autor-apellido')?.value.trim();
    const email = document.getElementById('autor-email')?.value.trim();

    const htmlRegex = /<[^>]*>/g;
    const onlyLettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre || !apellido || !email) return 'Nombre, apellido y email son requeridos';
    if (htmlRegex.test(nombre) || htmlRegex.test(apellido)) return 'No se permiten etiquetas HTML en nombre o apellido';
    if (!onlyLettersRegex.test(nombre) || !onlyLettersRegex.test(apellido)) return 'Nombre y apellido solo deben contener letras';
    if (!emailRegex.test(email)) return 'El formato del correo electrónico no es válido';

    return null;
}

function validateLibroForm() {
    const titulo = document.getElementById('libro-titulo')?.value.trim();
    const isbn = document.getElementById('libro-isbn')?.value.trim();
    const anio = document.getElementById('libro-anio_publicacion')?.value.trim();
    const edicion = document.getElementById('libro-edicion')?.value.trim();
    const autorId = document.getElementById('libro-autor_id')?.value;

    const htmlRegex = /<[^>]*>/g;
    const isbnClean = (isbn || '').replace(/-/g, '');
    const currentYear = new Date().getFullYear();

    if (!titulo || !isbn || !autorId) return 'Título, ISBN y autor son obligatorios';
    if (htmlRegex.test(titulo) || htmlRegex.test(edicion || '')) return 'No se permite contenido HTML en título o edición';
    if (!/^\d{10}$|^\d{13}$/.test(isbnClean)) return 'El ISBN debe tener exactamente 10 o 13 dígitos numéricos';
    if (anio) {
        const yearInt = parseInt(anio, 10);
        if (Number.isNaN(yearInt) || yearInt < 0 || yearInt > currentYear) {
            return `El año de publicación debe estar entre 0 y ${currentYear}`;
        }
    }

    return null;
}

function validateUsuarioForm() {
    const nombre = document.getElementById('usuario-nombre')?.value.trim();
    const apellido = document.getElementById('usuario-apellido')?.value.trim();
    const email = document.getElementById('usuario-email')?.value.trim();
    const passwordInput = document.getElementById('usuario-password');
    const password = passwordInput?.value;
    const isCreate = state.usuarioEditable === null;

    if (!nombre || !apellido || !email) return 'Nombre, apellido y email son obligatorios';
    if (!email.includes('@')) return 'El formato del email no es válido';
    if (isCreate && !password) return 'La contraseña es obligatoria para crear usuario';

    return null;
}

function validatePrestamoForm() {
    const usuarioId = document.getElementById('prestamo-usuario_id')?.value;
    const libroId = document.getElementById('prestamo-libro_id')?.value;
    const fechaPrestamo = document.getElementById('prestamo-fecha_prestamo')?.value;
    const fechaPrevista = document.getElementById('prestamo-fecha_devolucion_prevista')?.value;

    if (!usuarioId || !libroId || !fechaPrestamo || !fechaPrevista) {
        return 'Usuario, libro y fechas son obligatorios';
    }

    const fechaPrestamoDate = new Date(fechaPrestamo);
    const fechaPrevistaDate = new Date(fechaPrevista);

    if (Number.isNaN(fechaPrestamoDate.getTime()) || Number.isNaN(fechaPrevistaDate.getTime())) {
        return 'Las fechas ingresadas no son válidas';
    }

    if (fechaPrevistaDate < fechaPrestamoDate) {
        return 'La fecha de devolución prevista no puede ser menor que la fecha de préstamo';
    }

    return null;
}

function validateDevolucionForm() {
    const fechaDevolucionReal = document.getElementById('prestamo-fecha_devolucion_real')?.value;
    if (!fechaDevolucionReal) return 'La fecha de devolución real es obligatoria';
    return null;
}

// ================================
// NOTIFICACIONES
// ================================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.classList.remove('show', 'hide');
        }, 300);
    }, 3000);
}

// ================================
// UTILIDADES
// ================================

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
}

function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function getDatePlus(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}
