// API Base URL
const API_BASE = 'http://localhost:3000/api';

// ================================
// ESTADO GLOBAL
// ================================

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

// ================================
// INICIALIZACIÓN
// ================================

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadAllData();
});

// ================================
// EVENT LISTENERS
// ================================

function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    // Autores
    document.getElementById('btn-add-autor').addEventListener('click', openAutorForm);
    document.getElementById('btn-search-autores').addEventListener('click', searchAutores);
    document.getElementById('search-autores').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchAutores();
    });

    // Libros
    document.getElementById('btn-add-libro').addEventListener('click', openLibroForm);

    // Usuarios
    document.getElementById('btn-add-usuario').addEventListener('click', openUsuarioForm);

    // Préstamos
    document.getElementById('btn-add-prestamo').addEventListener('click', openPrestamoForm);

    // Modal
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.getElementById('btn-cancel-modal').addEventListener('click', closeModal);
    document.getElementById('form-modal').addEventListener('submit', handleFormSubmit);

    // Cerrar modal al hacer click fuera
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') closeModal();
    });
}

// ================================
// NAVEGACIÓN
// ================================

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

// ================================
// CARGAR DATOS
// ================================

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
        const data = await response.json();
        state.usuarios = data.data || [];
    } catch (error) {
        console.error('Error cargando usuarios:', error);
    }
}

async function loadPrestamos() {
    try {
        const response = await fetch(`${API_BASE}/prestamos`);
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
            <td>${autor.id}</td>
            <td>${autor.nombre}</td>
            <td>${autor.apellido}</td>
            <td>${autor.email || 'N/A'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" onclick="openAutorForm(${autor.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteAutor(${autor.id})">
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
        tbody.innerHTML = '<tr><td colspan="6" class="loading">No hay libros registrados</td></tr>';
        return;
    }

    tbody.innerHTML = state.libros.map(libro => `
        <tr>
            <td>${libro.id}</td>
            <td>${libro.titulo}</td>
            <td>${libro.isbn}</td>
            <td>${libro.nombre || 'N/A'} ${libro.apellido || ''}</td>
            <td><span class="badge badge-info">${libro.stock} disponibles</span></td>
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
        const autor = state.autores.find(a => a.id === id);
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
                <label>Stock *</label>
                <input type="number" id="libro-stock" value="${libro.stock}" required>
            </div>
            <div class="form-group">
                <label>Autor *</label>
                <select id="libro-autor_id" required>
                    <option value="">Seleccionar autor</option>
                    ${state.autores.map(a => `
                        <option value="${a.id}" ${a.id === libro.autor_id ? 'selected' : ''}>
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
                <label>Stock *</label>
                <input type="number" id="libro-stock" value="1" required>
            </div>
            <div class="form-group">
                <label>Autor *</label>
                <select id="libro-autor_id" required>
                    <option value="">Seleccionar autor</option>
                    ${state.autores.map(a => `
                        <option value="${a.id}">
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
    
    modalTitle.textContent = 'Nuevo Préstamo';
    formFields.innerHTML = `
        <div class="form-group">
            <label>Usuario *</label>
            <select id="prestamo-usuario_id" required>
                <option value="">Seleccionar usuario</option>
                ${state.usuarios.map(u => `
                    <option value="${u.id}">${u.nombre} ${u.apellido}</option>
                `).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Libro *</label>
            <select id="prestamo-libro_id" required>
                <option value="">Seleccionar libro</option>
                ${state.libros.filter(l => l.stock > 0).map(l => `
                    <option value="${l.id}">${l.titulo}</option>
                `).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Fecha Préstamo *</label>
            <input type="date" id="prestamo-fecha_prestamo" value="${getTodayDate()}" required>
        </div>
        <div class="form-group">
            <label>Fecha Devolución Prevista *</label>
            <input type="date" id="prestamo-fecha_devolucion_prevista" value="${getDatePlus(14)}" required>
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
    const nombre = document.getElementById('autor-nombre').value;
    const apellido = document.getElementById('autor-apellido').value;
    const email = document.getElementById('autor-email').value;

    const payload = { nombre, apellido, email };

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

        if (!response.ok) throw new Error('Error en la solicitud');

        showToast(
            state.autorEditable ? 'Autor actualizado' : 'Autor creado',
            'success'
        );
        closeModal();
        await loadAutores();
        state.autorEditable = null;
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al guardar el autor', 'error');
    }
}

async function submitLibro() {
    const titulo = document.getElementById('libro-titulo').value;
    const isbn = document.getElementById('libro-isbn').value;
    const stock = parseInt(document.getElementById('libro-stock').value);
    const autor_id = parseInt(document.getElementById('libro-autor_id').value);

    const payload = { titulo, isbn, stock, autor_id };

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

        if (!response.ok) throw new Error('Error en la solicitud');

        showToast(
            state.libroEditable ? 'Libro actualizado' : 'Libro creado',
            'success'
        );
        closeModal();
        await loadLibros();
        state.libroEditable = null;
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al guardar el libro', 'error');
    }
}

async function submitUsuario() {
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

        if (!response.ok) throw new Error('Error en la solicitud');

        showToast(
            state.usuarioEditable ? 'Usuario actualizado' : 'Usuario creado',
            'success'
        );
        closeModal();
        await loadUsuarios();
        state.usuarioEditable = null;
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al guardar el usuario', 'error');
    }
}

async function submitPrestamo() {
    const usuario_id = parseInt(document.getElementById('prestamo-usuario_id').value);
    const libro_id = parseInt(document.getElementById('prestamo-libro_id').value);
    const fecha_prestamo = document.getElementById('prestamo-fecha_prestamo').value;
    const fecha_devolucion_prevista = document.getElementById('prestamo-fecha_devolucion_prevista').value;

    const payload = { usuario_id, libro_id, fecha_prestamo, fecha_devolucion_prevista };

    try {
        const response = await fetch(`${API_BASE}/prestamos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Error en la solicitud');

        showToast('Préstamo creado', 'success');
        closeModal();
        await loadPrestamos();
        state.prestamoEditable = null;
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al crear el préstamo', 'error');
    }
}

async function submitDevoluccion() {
    const fecha_devolucion_real = document.getElementById('prestamo-fecha_devolucion_real').value;

    const payload = { fecha_devolucion_real };

    try {
        const response = await fetch(`${API_BASE}/prestamos/${state.prestamoEditable}/devolucion`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Error en la solicitud');

        showToast('Devolución registrada', 'success');
        closeModal();
        await loadPrestamos();
        state.prestamoEditable = null;
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al registrar la devolución', 'error');
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

        if (!response.ok) throw new Error('Error en la solicitud');

        showToast('Usuario eliminado', 'success');
        await loadUsuarios();
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar el usuario', 'error');
    }
}

async function deletePrestamo(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este préstamo?')) return;

    try {
        const response = await fetch(`${API_BASE}/prestamos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error en la solicitud');

        showToast('Préstamo eliminado', 'success');
        await loadPrestamos();
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar el préstamo', 'error');
    }
}

// ================================
// VER PRÉSTAMOS POR USUARIO
// ================================

async function viewUsuarioPrestamos(usuarioId) {
    try {
        const response = await fetch(`${API_BASE}/usuarios/${usuarioId}/prestamos`);
        const data = await response.json();
        const prestamos = data.data || [];

        const formFields = document.getElementById('form-fields');
        const modalTitle = document.getElementById('modal-title');
        
        const usuario = state.usuarios.find(u => u.id === usuarioId);
        modalTitle.textContent = `Préstamos de ${usuario.nombre} ${usuario.apellido}`;

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

        document.getElementById('form-modal').style.display = 'none';
        document.querySelector('.modal-content').querySelector('div').innerHTML = document.getElementById('form-fields').innerHTML;
        openModal();
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al cargar los préstamos', 'error');
    }
}

// ================================
// MODAL
// ================================

function openModal() {
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('form-modal').style.display = 'flex';
    document.getElementById('form-fields').innerHTML = '';
    state.autorEditable = null;
    state.libroEditable = null;
    state.usuarioEditable = null;
    state.prestamoEditable = null;
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
