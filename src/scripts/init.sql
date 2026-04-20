-- =========================================
-- CREACIÓN Y SELECCIÓN DE BASE DE DATOS
-- =========================================
CREATE DATABASE IF NOT EXISTS biblioteca DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE biblioteca;

-- =========================================
-- CONFIGURACIÓN INICIAL
-- =========================================
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS prestamo;
DROP TABLE IF EXISTS libro;
DROP TABLE IF EXISTS usuario_rol;
DROP TABLE IF EXISTS rol;
DROP TABLE IF EXISTS autor;
DROP TABLE IF EXISTS usuario;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================
-- 1. TABLA USUARIO (TABLA BASE)
-- =========================================
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    
    -- Evita usuarios duplicados con mismo nombre y apellido
    UNIQUE(nombre, apellido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- 2. TABLA ROL
-- =========================================
CREATE TABLE rol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- 3. TABLA USUARIO_ROL
-- =========================================
CREATE TABLE usuario_rol (
    usuario_id INT,
    rol_id INT,

    PRIMARY KEY (usuario_id, rol_id),

    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (rol_id) REFERENCES rol(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- 4. TABLA AUTOR (Extensión de Usuario)
-- =========================================
CREATE TABLE autor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNIQUE NOT NULL,

    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- 5. TABLA LIBRO
-- =========================================
CREATE TABLE libro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    isbn VARCHAR(50) UNIQUE NOT NULL,
    stock INT DEFAULT 1 CHECK (stock >= 0),
    autor_id INT NOT NULL,

    FOREIGN KEY (autor_id) REFERENCES autor(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_libro_autor ON libro(autor_id);

-- =========================================
-- 6. TABLA PRESTAMO 
-- =========================================
CREATE TABLE prestamo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    libro_id INT NOT NULL,
    fecha_prestamo DATE NOT NULL,
    fecha_devolucion_prevista DATE NOT NULL,
    fecha_devolucion_real DATE NULL,

    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE RESTRICT,
    FOREIGN KEY (libro_id) REFERENCES libro(id) ON DELETE RESTRICT,

    -- Validación lógica de fechas
    CHECK (fecha_devolucion_prevista >= fecha_prestamo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- CONTROL DE PRÉSTAMOS DUPLICADOS
-- =========================================
ALTER TABLE prestamo
ADD COLUMN activo TINYINT(1)
GENERATED ALWAYS AS (
    CASE 
        WHEN fecha_devolucion_real IS NULL THEN 1
        ELSE NULL
    END
) STORED;

-- Garantiza que un libro específico solo pueda tener UN préstamo activo a la vez
CREATE UNIQUE INDEX unique_prestamo_activo ON prestamo(libro_id, activo);

-- =========================================
-- DATOS INICIALES (ROLES)
-- =========================================
INSERT INTO rol (nombre) VALUES
('lector'),
('bibliotecario');