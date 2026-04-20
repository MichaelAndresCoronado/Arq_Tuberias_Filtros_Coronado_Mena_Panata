from locust import HttpUser, task, between, events
import random
import requests

# Variables globales para IDs reales
USUARIOS_REALES = []
LIBROS_REALES = []

@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    global USUARIOS_REALES, LIBROS_REALES
    print("\n" + "="*60)
    print("🚀 PREPARANDO ESCENARIO 3 - EVITANDO VALORES NULL")
    print("="*60)
    
    base_url = environment.host
    
    # 1. Crear 200 Usuarios Lectores (Sin valores NULL)
    print("-> Generando 200 usuarios lectores...")
    for i in range(1, 201):
        payload_lector = {
            "nombre": f"Lector_Nombre_{i}",
            "apellido": f"Lector_Apellido_{i}",
            "email": f"lector_{i}_{random.randint(1,9999)}@espe.edu.ec",
            "password": "password123"
        }
        res = requests.post(f"{base_url}/api/usuarios", json=payload_lector)
        if res.status_code == 201:
            USUARIOS_REALES.append(res.json().get('id'))

    # 2. Crear el Usuario base para el Autor (Con Nombres Reales)
    print("-> Configurando Autor (Usuario base)...")
    payload_u_autor = {
        "nombre": "Gabriel",     # Valor explícito no NULL
        "apellido": "Garcia",    # Valor explícito no NULL
        "email": f"autor_esc3_{random.randint(1000,9999)}@literatura.com",
        "password": "password123"
    }
    
    # Crear Usuario
    res_u = requests.post(f"{base_url}/api/usuarios", json=payload_u_autor)
    
    if res_u.status_code == 201:
        u_id = res_u.json().get('id')
        
        # Vincular en la tabla 'autor'
        res_a = requests.post(f"{base_url}/api/autores", json={"usuario_id": u_id})
        
        if res_a.status_code == 201:
            autor_id_final = res_a.json().get('id')
            
            # 3. Crear 50 Libros vinculados al ID de la tabla Autor
            print(f"-> Creando 50 libros para el Autor ID: {autor_id_final}...")
            for i in range(1, 51):
                res_lib = requests.post(f"{base_url}/api/libros", json={
                    "titulo": f"Cien años de soledad Edición {i}",
                    "isbn": f"ISBN-{random.randint(1000,9999)}-{i}",
                    "autor_id": autor_id_final
                })
                if res_lib.status_code == 201:
                    LIBROS_REALES.append(res_lib.json().get('id'))
        else:
            print(f"❌ Error en tabla Autor: {res_a.text}")
    else:
        print(f"❌ Error en usuario de autor: {res_u.text}")

    print(f"\n📊 RESUMEN: {len(USUARIOS_REALES)} Lectores | {len(LIBROS_REALES)} Libros")
    print("="*60 + "\n")

class escenario3_concurrencia(HttpUser):
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
                print(f"✅ [OK] Prestamo: Usuario {u_id} -> Libro {l_id}")
                response.success()
            elif response.status_code == 400:
                print(f"⚠️ [BLOQUEADO] Libro {l_id} ocupado.")
                response.success() 
            else:
                response.failure(f"Error {response.status_code}")