from locust import HttpUser, task, between, events
import random

# --- CONFIGURACIÓN DE POBLADO ---
@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    print("\n" + "="*50)
    print("🚀 INICIANDO PREPARACIÓN DEL ENTORNO: ESC-PREST-02")
    print("="*50)
    
    base_url = environment.host
    
    # 1. Crear 200 Usuarios
    user_ids = []
    print(f"-> Creando 200 usuarios en {base_url}...")
    for i in range(1, 201):
        payload = {
            "nombre": f"Lector_{i}",
            "apellido": f"Prueba_{i}",
            "email": f"test_user_{i}@espe.edu.ec",
            "password": "password123",
            "rol_id": 1
        }
        res = environment.client.post(f"{base_url}/api/usuarios", json=payload)
        if res.status_code == 201:
            user_ids.append(res.json()['id'])
    print(f"✅ Usuarios creados exitosamente: {len(user_ids)}")

    # 2. Obtener autores
    res_aut = environment.client.get(f"{base_url}/api/autores")
    if res_aut.status_code == 200:
        autor_ids = [a['id'] for a in res_aut.json()]
        print(f"✅ Autores detectados: {len(autor_ids)}")
    else:
        print("❌ ERROR: No se pudieron obtener autores.")
        return

    # 3. Crear 500 Libros
    libro_ids = []
    print(f"-> Creando 500 libros...")
    for i in range(1, 501):
        payload = {
            "titulo": f"Libro Escenario 2 - {i}",
            "isbn": f"978-0-{i}-{random.randint(100, 999)}",
            "anio_publicacion": 2024,
            "edicion": "1ra",
            "autor_id": random.choice(autor_ids)
        }
        res = environment.client.post(f"{base_url}/api/libros", json=payload)
        if res.status_code == 201:
            libro_ids.append(res.json()['id'])
    print(f"✅ Libros creados exitosamente: {len(libro_ids)}")

    # 4. Crear 1000 Préstamos
    prestamos_creados = 0
    if user_ids and libro_ids:
        print(f"-> Generando 1000 préstamos (50% devueltos)...")
        for i in range(1000):
            l_id = libro_ids[i % len(libro_ids)]
            u_id = random.choice(user_ids)
            payload_p = {
                "usuario_id": u_id,
                "libro_id": l_id,
                "fecha_prestamo": "2026-04-01",
                "fecha_devolucion_prevista": "2026-04-15"
            }
            res_p = environment.client.post(f"{base_url}/api/prestamos", json=payload_p)
            
            if res_p.status_code == 201:
                prestamos_creados += 1
                if i < 500: # Devolver los primeros 500
                    p_id = res_p.json()['id']
                    environment.client.put(f"{base_url}/api/prestamos/{p_id}/devolucion", json={
                        "fecha_devolucion_real": "2026-04-10"
                    })
    
    print(f"✅ Préstamos procesados: {prestamos_creados}")
    print("="*50)
    print("🏁 ENTORNO LISTO. Iniciando simulación de carga...")
    print("="*50 + "\n")

# --- EVENTO AL FINALIZAR ---
@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    print("\n" + "!"*50)
    print("🛑 PRUEBA FINALIZADA POR EL USUARIO")
    print("!"*50)

# --- CLASE DE CARGA ---
class escenario2_peticiones(HttpUser):
    wait_time = between(2.0, 4.0)

    @task
    def consultar_historial(self):
        usuario_id = random.randint(1, 200)
        
        with self.client.get(
            f"/api/usuarios/{usuario_id}/prestamos", 
            name="/api/usuarios/[id]/prestamos", 
            catch_response=True
        ) as response:
            if response.status_code == 200:
                print(f"🔍 [OK] Historial consultado para Usuario ID: {usuario_id}")
                response.success()
            else:
                print(f"⚠️ [ERROR {response.status_code}] Usuario ID: {usuario_id}")
                response.failure(f"Fallo: {response.status_code}")