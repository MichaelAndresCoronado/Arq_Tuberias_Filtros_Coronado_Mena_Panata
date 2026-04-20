from locust import HttpUser, task, between, events
import random
import requests

USUARIOS_REALES = []
LIBROS_REALES = []
PRESTAMOS_ACTIVOS = []

@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    global USUARIOS_REALES, LIBROS_REALES, PRESTAMOS_ACTIVOS

    USUARIOS_REALES.clear()
    LIBROS_REALES.clear()
    PRESTAMOS_ACTIVOS.clear()

    print("\n" + "=" * 70)
    print("🚀 PREPARANDO ESCENARIO 4 - CARGA MIXTA CON PICO DE TRÁFICO")
    print("=" * 70)

    base_url = environment.host

    # 1. Crear 120 usuarios lectores
    print("-> Creando 120 usuarios lectores...")
    for i in range(1, 121):
        suffix = random.randint(100000, 999999)
        payload_usuario = {
            "nombre": f"LectorNombre{i}_{suffix}",
            "apellido": f"LectorApellido{i}_{suffix}",
            "email": f"lector_{i}_{suffix}@espe.edu.ec",
            "password": "password123",
            "rol_id": 1
        }

        res = requests.post(f"{base_url}/api/usuarios", json=payload_usuario)
        if res.status_code == 201:
            data = res.json()
            usuario_id = data.get("id")
            if usuario_id:
                USUARIOS_REALES.append(usuario_id)
        else:
            print(f"❌ Error creando usuario {i}: {res.status_code} - {res.text}")

    # 2. Crear autor base
    print("-> Creando autor base...")
    suffix_autor = random.randint(100000, 999999)
    payload_autor = {
        "nombre": f"Gabriel_{suffix_autor}",
        "apellido": f"Garcia_{suffix_autor}",
        "email": f"autor_mix_{suffix_autor}@literatura.com",
        "password": "password123"
    }

    res_autor = requests.post(f"{base_url}/api/autores", json=payload_autor)
    autor_id = None

    if res_autor.status_code == 201:
        autor_id = res_autor.json().get("id")
        print(f"✅ Autor creado con ID: {autor_id}")
    else:
        print(f"❌ Error creando autor: {res_autor.status_code} - {res_autor.text}")

    # 3. Crear 80 libros
    if autor_id:
        print("-> Creando 80 libros...")
        for i in range(1, 81):
            payload_libro = {
                "titulo": f"Libro Mixto {i}",
                "isbn": f"ISBN-MIX-{random.randint(100000, 999999)}-{i}",
                "stock": 1,
                "autor_id": autor_id
            }

            res_libro = requests.post(f"{base_url}/api/libros", json=payload_libro)
            if res_libro.status_code == 201:
                libro_id = res_libro.json().get("id")
                if libro_id:
                    LIBROS_REALES.append(libro_id)
            else:
                print(f"❌ Error creando libro {i}: {res_libro.status_code} - {res_libro.text}")

    # 4. Crear algunos préstamos activos iniciales para probar devoluciones
    if USUARIOS_REALES and LIBROS_REALES:
        print("-> Creando 20 préstamos activos iniciales...")
        libros_disponibles = LIBROS_REALES.copy()
        random.shuffle(libros_disponibles)

        for i in range(min(20, len(libros_disponibles), len(USUARIOS_REALES))):
            payload_prestamo = {
                "usuario_id": USUARIOS_REALES[i],
                "libro_id": libros_disponibles[i],
                "fecha_prestamo": "2026-04-20",
                "fecha_devolucion_prevista": "2026-04-27"
            }

            res_prestamo = requests.post(f"{base_url}/api/prestamos", json=payload_prestamo)
            if res_prestamo.status_code == 201:
                prestamo_id = res_prestamo.json().get("id")
                if prestamo_id:
                    PRESTAMOS_ACTIVOS.append(prestamo_id)

    print(f"\n📊 RESUMEN INICIAL:")
    print(f"   Usuarios: {len(USUARIOS_REALES)}")
    print(f"   Libros: {len(LIBROS_REALES)}")
    print(f"   Préstamos activos iniciales: {len(PRESTAMOS_ACTIVOS)}")
    print("=" * 70 + "\n")


class LectorUser(HttpUser):
    wait_time = between(1, 3)
    weight = 7

    @task(4)
    def buscar_autores(self):
        termino = random.choice(["Gabriel", "Garcia", "Libro", "Mix"])
        self.client.get(f"/api/autores/buscar?q={termino}")

    @task(3)
    def consultar_prestamos_usuario(self):
        if not USUARIOS_REALES:
            return

        usuario_id = random.choice(USUARIOS_REALES)
        self.client.get(f"/api/usuarios/{usuario_id}/prestamos")

    @task(2)
    def listar_autores(self):
        self.client.get("/api/autores")

    @task(1)
    def listar_libros(self):
        self.client.get("/api/libros")


class BibliotecarioUser(HttpUser):
    wait_time = between(0.5, 2)
    weight = 3

    @task(3)
    def crear_prestamo(self):
        if not USUARIOS_REALES or not LIBROS_REALES:
            return

        usuario_id = random.choice(USUARIOS_REALES)
        libro_id = random.choice(LIBROS_REALES)

        payload = {
            "usuario_id": usuario_id,
            "libro_id": libro_id,
            "fecha_prestamo": "2026-04-20",
            "fecha_devolucion_prevista": "2026-04-27"
        }

        with self.client.post("/api/prestamos", json=payload, catch_response=True) as response:
            if response.status_code == 201:
                data = response.json()
                prestamo_id = data.get("id")
                if prestamo_id:
                    PRESTAMOS_ACTIVOS.append(prestamo_id)
                response.success()
            elif response.status_code == 400:
                # Libro ya prestado: comportamiento esperado
                response.success()
            else:
                response.failure(f"Error inesperado {response.status_code}: {response.text}")

    @task(2)
    def devolver_prestamo(self):
        if not PRESTAMOS_ACTIVOS:
            return

        prestamo_id = random.choice(PRESTAMOS_ACTIVOS)

        payload = {
            "fecha_devolucion_real": "2026-04-22"
        }

        with self.client.put(f"/api/prestamos/{prestamo_id}/devolucion", json=payload, catch_response=True) as response:
            if response.status_code == 200:
                try:
                    PRESTAMOS_ACTIVOS.remove(prestamo_id)
                except ValueError:
                    pass
                response.success()
            elif response.status_code in [400, 404]:
                response.success()
            else:
                response.failure(f"Error inesperado {response.status_code}: {response.text}")

    @task(2)
    def consultar_libros(self):
        self.client.get("/api/libros")

    @task(1)
    def consultar_autores(self):
        self.client.get("/api/autores")

    @task(1)
    def consultar_prestamos_usuario(self):
        if not USUARIOS_REALES:
            return

        usuario_id = random.choice(USUARIOS_REALES)
        self.client.get(f"/api/usuarios/{usuario_id}/prestamos")