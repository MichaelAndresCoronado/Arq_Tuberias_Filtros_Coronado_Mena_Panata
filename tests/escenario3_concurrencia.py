from locust import HttpUser, task, between, events
import random
import requests

USUARIOS_REALES = []
LIBROS_REALES = []

@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    global USUARIOS_REALES, LIBROS_REALES

    USUARIOS_REALES.clear()
    LIBROS_REALES.clear()

    print("\n" + "=" * 60)
    print("🚀 PREPARANDO ESCENARIO 3 - PRÉSTAMOS CONCURRENTS")
    print("=" * 60)

    base_url = environment.host

    # 1. Crear 200 usuarios lectores
    print("-> Generando 200 usuarios lectores...")
    for i in range(1, 201):
        payload_lector = {
            "nombre": f"Lector_Nombre_{i}",
            "apellido": f"Lector_Apellido_{i}",
            "email": f"lector_{i}_{random.randint(1, 999999)}@espe.edu.ec",
            "password": "password123",
            "rol_id": 1
        }

        res = requests.post(f"{base_url}/api/usuarios", json=payload_lector)

        if res.status_code == 201:
            data = res.json()
            USUARIOS_REALES.append(data.get("id"))
        else:
            print(f"❌ Error creando usuario {i}: {res.status_code} - {res.text}")

    # 2. Crear un autor correctamente usando /api/autores
    print("-> Creando autor base...")
    payload_autor = {
        "nombre": "Gabriel",
        "apellido": "Garcia",
        "email": f"autor_esc3_{random.randint(1000,9999)}@literatura.com",
        "password": "password123"
    }

    res_a = requests.post(f"{base_url}/api/autores", json=payload_autor)

    autor_id_final = None

    if res_a.status_code == 201:
        autor_id_final = res_a.json().get("id")
        print(f"✅ Autor creado con ID: {autor_id_final}")
    else:
        print(f"❌ Error creando autor: {res_a.status_code} - {res_a.text}")

    # 3. Crear 50 libros para ese autor
    if autor_id_final:
        print(f"-> Creando 50 libros para el autor ID: {autor_id_final}...")
        for i in range(1, 51):
            payload_libro = {
                "titulo": f"Cien años de soledad Edición {i}",
                "isbn": f"ISBN-{random.randint(100000,999999)}-{i}",
                "stock": 1,
                "autor_id": autor_id_final
            }

            res_lib = requests.post(f"{base_url}/api/libros", json=payload_libro)

            if res_lib.status_code == 201:
                data = res_lib.json()
                LIBROS_REALES.append(data.get("id"))
            else:
                print(f"❌ Error creando libro {i}: {res_lib.status_code} - {res_lib.text}")

    print(f"\n📊 RESUMEN: {len(USUARIOS_REALES)} Lectores | {len(LIBROS_REALES)} Libros")
    print("=" * 60 + "\n")


class Escenario3Concurrencia(HttpUser):
    wait_time = between(0.1, 0.5)

    @task
    def crear_prestamo_concurrente(self):
        if not USUARIOS_REALES or not LIBROS_REALES:
            return

        u_id = random.choice(USUARIOS_REALES)
        l_id = random.choice(LIBROS_REALES)

        payload = {
            "usuario_id": u_id,
            "libro_id": l_id,
            "fecha_prestamo": "2026-04-19",
            "fecha_devolucion_prevista": "2026-04-26"
        }

        with self.client.post("/api/prestamos", json=payload, catch_response=True) as response:
            if response.status_code == 201:
                response.success()
            elif response.status_code == 400:
                # Libro ya prestado: bloqueo esperado por la lógica de negocio
                response.success()
            else:
                response.failure(f"Error {response.status_code}: {response.text}")