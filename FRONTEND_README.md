# Frontend de Gestión de Biblioteca

## 🎯 Descripción

Este es un frontend moderno y completamente funcional para la aplicación de Gestión de Biblioteca. Proporciona una interfaz elegante e intuitiva para gestionar autores, libros, usuarios y préstamos.

## ✨ Características

### 1. **Gestión de Autores**
- ✅ Ver todos los autores
- ✅ Buscar autores por nombre
- ✅ Crear nuevos autores
- ✅ Editar autores existentes
- ✅ Eliminar autores

### 2. **Gestión de Libros**
- ✅ Ver todos los libros
- ✅ Crear nuevos libros
- ✅ Editar libros existentes
- ✅ Ver stock disponible
- ✅ Eliminar libros

### 3. **Gestión de Usuarios**
- ✅ Registrar nuevos usuarios
- ✅ Ver lista de usuarios
- ✅ Ver historial de préstamos de cada usuario
- ✅ Editar datos de usuarios
- ✅ Eliminar usuarios

### 4. **Gestión de Préstamos**
- ✅ Crear nuevos préstamos
- ✅ Ver estado de préstamos
- ✅ Registrar devoluciones
- ✅ Ver historial de préstamos por usuario
- ✅ Verificar disponibilidad de libros

## 🎨 Diseño Moderno

- **Color Scheme**: Gradientes modernos con colores primarios en indigo
- **Iconografía**: FontAwesome 6 para iconos profesionales
- **Responsive**: Diseño completamente adaptable a dispositivos móviles
- **Animaciones**: Transiciones suaves y fluidas
- **Dark/Light**: Interfaz clara con contraste óptimo

## 🚀 Cómo Usar

### 1. Iniciar el Servidor
```bash
npm install
npm start
```

El servidor estará disponible en `http://localhost:3000`

### 2. Acceder al Frontend
Abre tu navegador y ve a:
```
http://localhost:3000
```

### 3. Navegación

La aplicación tiene un sidebar izquierdo con las siguientes secciones:

#### **Autores**
- Click en "Nuevo Autor" para crear uno
- Usa la barra de búsqueda para filtrar
- Edita o elimina con los botones en la tabla

#### **Libros**
- Necesitas autores creados previamente
- Al crear un libro, selecciona un autor de la lista
- Puedes actualizar el stock en cualquier momento

#### **Usuarios**
- Registra nuevos usuarios (lectores)
- Visualiza el historial de préstamos por usuario
- Edita información de contacto

#### **Préstamos**
- Crea préstamos seleccionando usuario y libro
- Solo puedes prestar libros con stock disponible
- Registra devoluciones usando el botón "Devolver"

## 📋 Estructura del Código

```
public/
├── index.html          # Estructura HTML
├── styles.css          # Estilos modernos
└── app.js              # Lógica de la aplicación
```

### index.html
- Estructura semántica y accesible
- Modal reutilizable para formularios
- Tablas dinámicas
- Sistema de notificaciones (toast)

### styles.css
- Variables CSS personalizadas
- Diseño basado en grid y flexbox
- Animaciones suaves
- Media queries responsivas
- Scroll bar personalizada

### app.js
- Gestión de estado global
- Funciones CRUD para cada entidad
- Sistema de toast notifications
- Validación de formularios
- Manejo de errores

## 🎯 Flujo Típico de Uso

### 1. Crear una Biblioteca desde Cero

```
1. Ir a Autores → Crear autores famosos
2. Ir a Libros → Crear libros y asociarlos a autores
3. Ir a Usuarios → Registrar usuarios/lectores
4. Ir a Préstamos → Crear préstamos entre usuarios y libros
5. Registrar devoluciones cuando sea necesario
```

### 2. Ejemplo Práctico

1. **Crear Autor**
   - Nombre: Gabriel
   - Apellido: García Márquez
   - Email: gabriel@example.com

2. **Crear Libro**
   - Título: Cien años de soledad
   - ISBN: 978-0-06-085846-5
   - Stock: 5
   - Autor: Gabriel García Márquez

3. **Registrar Usuario**
   - Nombre: Juan
   - Apellido: Pérez
   - Email: juan@example.com
   - Contraseña: 123456

4. **Crear Préstamo**
   - Usuario: Juan Pérez
   - Libro: Cien años de soledad
   - Fecha Préstamo: Hoy
   - Fecha Devolución: +14 días

5. **Registrar Devolución**
   - Click en el botón "Devolver" del préstamo
   - Registrar fecha de devolución

## 🎨 Personalización de Estilos

Todos los colores están definidos como variables CSS en `styles.css`:

```css
--primary-color: #6366f1        /* Indigo */
--secondary-color: #10b981      /* Esmeralda */
--danger-color: #ef4444         /* Rojo */
--warning-color: #f59e0b        /* Ámbar */
--success-color: #10b981        /* Verde */
```

Para cambiar los colores, solo edita estas variables.

## 📱 Responsive Design

La aplicación se adapta a:
- ✅ Escritorio (1920x1080+)
- ✅ Tablet (768px - 1024px)
- ✅ Móvil (hasta 480px)

## 🔧 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **API**: REST API con Express.js
- **Iconos**: FontAwesome 6
- **Base de Datos**: MySQL
- **Arquitectura Backend**: Tuberías y Filtros

## 🐛 Troubleshooting

### "El frontend no carga"
- Asegúrate de que el servidor está corriendo en puerto 3000
- Recarga la página (Ctrl+F5)
- Abre la consola del navegador (F12) para ver errores

### "Los datos no se cargan"
- Verifica que la API está respondiendo: http://localhost:3000/health
- Comprueba que CORS está habilitado en el servidor
- Revisa la consola del navegador para ver errores de red

### "No puedo crear préstamos"
- Asegúrate de tener al menos un usuario y un libro creados
- Verifica que el libro tiene stock disponible
- Comprueba que las fechas sean válidas

## 📝 Notas Importantes

1. Los préstamos solo se pueden hacer de libros con stock > 0
2. La fecha de devolución prevista debe ser posterior a la de préstamo
3. Los usuarios y autores requieren email válido
4. El ISBN debe ser único por libro
5. No se pueden eliminar autores con libros asociados

## 🎓 Aprendizaje

Este frontend demuestra:
- ✅ Buenas prácticas de HTML/CSS/JS
- ✅ Arquitectura modular
- ✅ Manejo de eventos del DOM
- ✅ Consumo de APIs REST
- ✅ Gestión de estado
- ✅ Validación de formularios
- ✅ UX/UI moderno

## 📞 Soporte

Si tienes preguntas o encontras problemas, verifica:
1. La consola del navegador (F12)
2. La pestaña Network para ver las peticiones
3. La respuesta del servidor en el terminal

---

**¡Disfruta usando tu Gestor de Biblioteca Moderno!** 📚✨
