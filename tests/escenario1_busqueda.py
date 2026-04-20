from locust import HttpUser, task, between
import random

class EscenarioBusqueda(HttpUser):
    # Requerimiento: Cada usuario realiza una búsqueda cada 1 a 2 segundos
    wait_time = between(1, 2)

    @task
    def buscar_autores_parcial(self):
        # Términos que aparecen en aproximadamente el 30% de los registros
        # Basado en nuestra lista de 25 nombres, estos términos generarán carga real
        terminos = ["Gab", "Isa", "Mig", "Ele", "Mar", "Gar", "Lopez", "Perez"]
        query = random.choice(terminos)
        
        # Estímulo: GET /api/autores/buscar?q=<término>
        with self.client.get(f"/api/autores/buscar?q={query}", name="/api/autores/buscar", catch_response=True) as response:
            if response.status_code == 200:
                # Opcional: Validar que la respuesta no sea una lista vacía para asegurar que el estímulo es efectivo
                data = response.json()
                if isinstance(data, list):
                    response.success()
                else:
                    response.failure("La respuesta no es un formato JSON válido")
            else:
                response.failure(f"Error {response.status_code}: {response.text}")

    @task(0)
    def stop(self):
        self.interrupt()