## Sistema de Gestión de Biblioteca API

API REST desarrollada con Node.js, Express y MySQL, orientada a la gestión de libros, autores, usuarios y préstamos, aplicando buenas prácticas de diseño, integridad de datos y control de concurrencia.

## Justificación del Modelo de Datos

El modelo implementa una estrategia basada en composición + roles, evitando herencia directa.

## Estructura principal

usuario → entidad base
autor → extensión de usuario
rol + usuario_rol → gestión flexible de roles
libro → asociado a autor
prestamo → relación entre usuario y libro

## Atributos de calidad
# Rendimiento

Uso de índices (idx_libro_autor, unique_prestamo_activo)
Pool de conexiones (mysql2)
Consultas optimizadas con JOIN

# Mantenibilidad

Separación por capas (MVC)
Reutilización de entidad usuario
Código modular

# Escalabilidad

Roles dinámicos mediante tabla intermedia
Modelo extensible (nuevos roles, entidades)
Preparado para microservicios

# Justificación del Diseño de Base de Datos (SQL)

El diseño SQL fue construido bajo principios de:

Integridad referencial
Normalización
Control de concurrencia
Consistencia de datos

# 1. Uso de utf8mb4
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci

# Permite:

Soporte completo de caracteres Unicode
Compatibilidad con emojis y múltiples idiomas

# 2. Integridad referencial con claves foráneas
FOREIGN KEY (...) REFERENCES ... ON DELETE CASCADE / RESTRICT

# Beneficios:

Evita datos huérfanos
Controla eliminaciones:
CASCADE → elimina dependencias automáticamente
RESTRICT → protege datos críticos

# 3. Uso de tabla intermedia usuario_rol
PRIMARY KEY (usuario_id, rol_id)

# Permite:

Relación muchos a muchos
Un usuario con múltiples roles
Escalabilidad sin cambios estructurales

# 4. Restricciones de unicidad
UNIQUE(email)
UNIQUE(nombre, apellido)
UNIQUE(isbn)

# Evita:

Duplicidad de usuarios
Libros repetidos
Inconsistencias
## 5. Uso de CHECK

CHECK (stock >= 0)
CHECK (fecha_devolucion_prevista >= fecha_prestamo)

# Garantiza:

Validez lógica de datos
Prevención de errores desde BD

## 6. Índices para optimización

CREATE INDEX idx_libro_autor ON libro(autor_id);

# Mejora:

Búsquedas por autor
Rendimiento en JOINs

## 7. Control de concurrencia en préstamos

ALTER TABLE prestamo
ADD COLUMN activo TINYINT(1)
GENERATED ALWAYS AS (
    CASE 
        WHEN fecha_devolucion_real IS NULL THEN 1
        ELSE NULL
    END
) STORED;

CREATE UNIQUE INDEX unique_prestamo_activo ON prestamo(libro_id, activo);

# Esta es una decisión clave:

Solo puede existir UN préstamo activo por libro
Se evita que múltiples usuarios pidan el mismo libro simultáneamente

# Ventajas:

Control a nivel de base de datos (más seguro)
Evita condiciones de carrera
No depende solo del backend

## 8. Uso de ON DELETE CASCADE
FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE

# Permite:

Eliminar automáticamente entidades dependientes (ej: autor)

### Instalación y Ejecución
## 1. Clonar repositorio

git clone https://github.com/MichaelAndresCoronado/Laboratorio2_1p_Arq_Coronado_Mena_Panata.git
cd Laboratorio2_1p_Arq_Coronado_Mena_Panata

## 2. Configurar variables de entorno

# Crear .env:

DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=1234
DB_NAME=biblioteca

## 3. Levantar Docker

docker-compose up -d

## 4. Instalar dependencias

npm install

## 5. Ejecutar API

npm run dev

## 6. Ejecutar Locust

pip install locust
locust -f locustfile.py

Abrir:

http://localhost:8089

## Decisiones Técnicas Relevantes

# Pool de conexiones

Manejo eficiente de múltiples requests

# Transacciones

Implementadas en creación de usuarios y autores

# Manejo de errores

Validaciones HTTP (400, 404, 500)

# JOINs optimizados

Reducción de consultas múltiples

# Formato de fechas

Uso de DATE_FORMAT desde SQL

# Endpoints

# Libros
GET /libros
POST /libros
GET /libros/:id
PUT /libros/:id
DELETE /libros/:id

# Autores
GET /autores
POST /autores
GET /autores/buscar?q=
GET /autores/:id
PUT /autores/:id
DELETE /autores/:id

# Usuarios
POST /usuarios
GET /usuarios/:id/prestamos

# Préstamos
POST /prestamos
PUT /prestamos/:id/devolver

# Tecnologías
Node.js
Express
MySQL
Docker
Locust
