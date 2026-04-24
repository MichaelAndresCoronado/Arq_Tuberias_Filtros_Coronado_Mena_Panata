## API REST de Biblioteca - Arquitectura de Tuberías y Filtros

API REST desarrollada con Node.js, Express y MySQL, orientada a la gestión de libros, autores, usuarios y préstamos. Este proyecto abandona el patrón clásico de controladores monolíticos para implementar estrictamente el patrón de **Arquitectura de Tuberías y Filtros (Pipes and Filters)**.

## Justificación de la Arquitectura

El modelo implementa una estrategia de procesamiento secuencial e independiente, donde cada solicitud HTTP viaja a través de una tubería ensamblada con filtros específicos.

## Estructura principal (Flujo de la Tubería)

Petición HTTP → entidad base
Filtro Inicial → crea el `req.pipeline` (transporte estandarizado)
Filtros de Entrada → validación, sanitización y limpieza de datos
Filtros de Procesamiento → lógica de negocio y consultas a BD
Filtros de Salida → formateo de respuestas (200/201)
Filtro Sumidero → captura global de errores

## Atributos de calidad

# Rendimiento
Salida temprana (Early Exit) si un filtro de entrada detecta datos inválidos, evitando cargas innecesarias en la base de datos.
Pool de conexiones (mysql2) para consultas concurrentes.

# Mantenibilidad
Alta cohesión y bajo acoplamiento. Cada filtro hace una sola cosa (Single Responsibility Principle).
Reutilización de filtros (ej. `validateIdParam`, `sendSuccessResponse` se usan en múltiples rutas).

# Escalabilidad
Fácil inserción de nuevos procesos (ej. si a futuro se requiere un filtro de "Autenticación JWT", solo se añade a la tubería sin modificar los demás filtros).

## Funcionalidad del Diseño de Tuberías y Filtros

El diseño fue construido bajo principios de seguridad, modularidad y transporte estandarizado de estado.

# 1. El Contexto de la Tubería (`req.pipeline`)
Todo inicia en `initializePipeline.js`.

# Permite:
Crear un objeto estándar que viaja por toda la petición:
`input`: Guarda los datos limpios y seguros.
`response`: Guarda la data de la BD lista para enviarse.
`error`: Registra fallos si ocurren.

# 2. Filtros de Entrada (Input Filters)
Intervienen apenas llega la petición (`autorInputFilters.js`, `libroInputFilters.js`, etc.).

# Garantiza:
Limpieza de espacios (`trim()`).
Validación de presencia de datos obligatorios.
Sanitización Anti-XSS (Bloquea inyección de etiquetas HTML mediante Regex).
Validación de formatos (Emails, ISBN de 10 o 13 dígitos, solo letras en nombres).

# 3. Filtros de Procesamiento (Processing Filters)
Extraen los datos limpios de `req.pipeline.input` y ejecutan la lógica pura.

# Permite:
Verificaciones de negocio (Ej. `checkLibroAvailability` verifica si un libro ya está prestado antes de intentar guardarlo).
Ejecución transaccional en la BD aislando los modelos SQL de la lógica HTTP.
Inyectar el resultado exitoso en `req.pipeline.response`.

# 4. Sumidero de Errores (Error Sink)
Ubicado al final de `app.js` (`errorFilter.js`).

# Evita:
Que el servidor colapse ante excepciones.
Si cualquier filtro usa `next(error)`, Express salta el resto de la tubería y cae aquí, devolviendo un JSON estandarizado (400, 404, 500) al cliente.

## Decisiones Técnicas Relevantes

# Eliminación de Controladores
La lógica se dividió en funciones pequeñas (filtros) que se pasan como un arreglo en el enrutador.

# Validación Defensiva
Uso de expresiones regulares para proteger la base de datos de ataques XSS desde los inputs.

# Manejo de Errores Delegado
Ningún filtro de BD envía respuestas HTTP de error por sí mismo; todos delegan al sumidero de errores usando `next(error)`.

# Separación de Modelos
Las consultas SQL crudas se mantienen en la carpeta `models`, completamente ignorantes de si la petición viene de un API REST o de otro sistema.

## Endpoints

# Autores
GET /api/autores
POST /api/autores
GET /api/autores/buscar?q=
GET /api/autores/:id
PUT /api/autores/:id
DELETE /api/autores/:id

# Libros
GET /api/libros
POST /api/libros
GET /api/libros/:id
PUT /api/libros/:id
DELETE /api/libros/:id

# Usuarios
POST /api/usuarios
GET /api/usuarios/:id/prestamos

# Préstamos
POST /api/prestamos
PUT /api/prestamos/:id/devolucion

## Tecnologías
Node.js
Express
MySQL
Docker
