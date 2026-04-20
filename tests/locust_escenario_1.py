from locust import HttpUser, task, between
import random

class Escenario1(HttpUser):

    wait_time =  between(0.3, 1.0)

    @task(1)
    def obtener_autores(self):
        with self.client.get("/api/autores", catch_response=True) as response:
            if response.status_code == 200:
                data= response.json()
                if isinstance(data, list) and len(data) > 0:
                    response.success()
                else:
                    response.failure(
                        "La respuesta no es una lista de autores o esta vacia "
                    )
            else:
                response.failure(f"Error al obtener autores: {response.status_code} - {response.text}")


    @task(2)
    def createAutor(self):
        nuevo_autor = {
            "nombre":f"Nombre Autor {random.randint(1, 1000)}",
            "apellido": "Apellido",
            "fecha_nacimiento": "1990-01-01",
            "nacionalidad": f"nacionalidad {random.randint(100, 999)}",
            "correo_electronico": f"correo_{random.randint(101, 1000)}@ejemplo.com",
        }
        
        self.client.post("/api/autores", json=nuevo_autor)


    @task(1)
    def root_api(self):
        self.client.get("/")

    
    @task(3)
    def update_autor(self):
        # 1. Obtenemos la lista de autores
        with self.client.get("/api/autores", catch_response=True) as response:
            if response.status_code == 200:
                autores = response.json()
                
                # 2. Validamos que la lista exista y no esté vacía
                if isinstance(autores, list) and len(autores) > 0:
                    autor_seleccionado = random.choice(autores)
                    autor_id = autor_seleccionado.get("id")

                    # 3. Verificamos que el ID sea válido antes de intentar el PUT
                    if autor_id:
                        nuevo_nombre = f"Nombre Actualizado {random.randint(1, 1000)}"
                        
                        # Generamos una fecha aleatoria para variar los datos (opcional)
                        anio = random.randint(1970, 2000)
                        nueva_fecha = f"{anio}-05-15"

                        datos_actualizados = {
                            "nombre": nuevo_nombre,
                            "apellido": autor_seleccionado.get("apellido"),
                            "fecha_nacimiento": nueva_fecha, # O usa autor_seleccionado.get("fecha_nacimiento")
                            "nacionalidad": autor_seleccionado.get("nacionalidad"),
                            "correo_electronico": autor_seleccionado.get("correo_electronico"),
                        }

                        # 4. Enviamos la solicitud PUT
                        with self.client.put(f"/api/autores/{autor_id}", name="/api/autores/[id]", json=datos_actualizados, catch_response=True) as put_res:
                            if put_res.status_code == 200:          
                                put_res.success()
                            else:
                                put_res.failure(f"Fallo al actualizar ID {autor_id}: {put_res.status_code}")
                    else:
                        response.failure("El autor seleccionado no tiene un ID válido.")
                else:
                    # Si no hay autores, marcamos como fallo suave o simplemente ignoramos
                    response.failure("La lista de autores está vacía. No hay nada que actualizar.")
            else:
                response.failure(f"Error HTTP {response.status_code} al listar autores")
    
    # Cambiado el peso a 1 para evitar vaciar la base de datos rápidamente
    @task(4)
    def delete_autor(self):
        # 1. Obtenemos la lista de autores
        with self.client.get("/api/autores", catch_response=True) as response:
            if response.status_code == 200:
                autores = response.json()
                
                # 2. Validamos que la lista exista y no esté vacía
                if isinstance(autores, list) and len(autores) > 0:
                    autor_seleccionado = random.choice(autores)
                    autor_id = autor_seleccionado.get("id")

                    # 3. Verificamos que el ID sea válido antes de intentar el DELETE
                    if autor_id is not None:
                        with self.client.delete(f"/api/autores/{autor_id}", name="/api/autores/[id]", catch_response=True) as del_res:
                            if del_res.status_code in (200, 204):
                                del_res.success()
                            else:
                                del_res.failure(f"Fallo al eliminar ID {autor_id}: {del_res.status_code} - {del_res.text}")
                    else:
                        response.failure("El autor seleccionado no tiene un ID válido.")
                else:
                    # Si no hay autores, marcamos como fallo suave o simplemente ignoramos
                    response.failure("La lista de autores está vacía. No hay nada que eliminar.")
            else:
                response.failure(f"Error HTTP {response.status_code} al listar autores")

    @task(2)
    def crear_libro(self):
        response = self.client.get("/api/autores", name="GET /api/autores (para crear libro)")
        if response.status_code == 200:
            autores = response.json()
            if autores:
                autor_id = random.choice(autores)["id"]
                nuevo_libro = {
                    "titulo": f"Titulo del Libro {random.randint(1,1000)}",
                    "isbn": f"ISBN-{random.randint(1000,9999)}",
                    "anio_publicacion": random.randint(1900, 2023),
                    "edicion": random.randint(1, 10),
                    "autor_id": autor_id
                }
                self.client.post("/api/libros", json=nuevo_libro, name="POST /api/libros")


# from locust import HttpUser, task, between
# import random

# class Escenario1(HttpUser):
#     wait_time = between(0.3, 1.0)

#     @task(1)
#     def obtener_autores(self):
#         with self.client.get("/api/autores", catch_response=True) as response:
#             if response.status_code == 200:
#                 data = response.json()
#                 if data:
#                     response.success()
#                 else:
#                     response.failure("La respuesta no es una lista de autores o está vacíanpm")
#             else:
#                 response.failure(f"Error al obtener autores: {response.status_code}")
#     @task(2)
#     def createAutor(self):
#         nuevo_autor ={
#             "nombre":f"Nombre Autor {random.randint(1,1000)}",
#             "apellido":f"Apellido Autor {random.randint(1,1000)}",
#             "fecha_nacimiento":f"{random.randint(1900,2000)}-{random.randint(1,12)}-{random.randint(1,28)}",
#             "nacionalidad" : f"Nacionalidad {random.randint(101,1000)}",
#             "correo_electronico" : f"correo{random.randint(101,1000)}@correo.com"
#         }
#         self.client.post("/api/autores", json=nuevo_autor)
#     @task(1)
#     def root_api(self):
#         self.client.get("/")

#     @task(3)
#     def actualizar_autor(self):
#         response = self.client.get("/api/autores", name="GET /api/autores (para actualizar)")
#         if response.status_code == 200:
#             autores = response.json()
#             if autores:
#                 autor_id = random.choice(autores)["id"]
#                 nuevo_autor ={
#                     "nombre":f"Nombre Autor {random.randint(1,1000)}",
#                     "apellido":f"Apellido Autor {random.randint(1,1000)}",
#                     "fecha_nacimiento":f"{random.randint(1900,2000)}-{random.randint(1,12)}-{random.randint(1,28)}",
#                     "nacionalidad" : f"Nacionalidad {random.randint(101,1000)}",
#                     "correo_electronico" : f"correo{random.randint(101,1000)}@correo.com"
#                 }
#                 self.client.put(f"/api/autores/{autor_id}", json=nuevo_autor, name="PUT /api/autores/[id]")

#     @task(4)
#     def eliminar_autor(self):
#         response = self.client.get("/api/autores", name="GET /api/autores (para eliminar)")
#         if response.status_code == 200:
#             autores = response.json()
#             if autores:
#                 autor_id = autores[0]["id"]
#                 self.client.delete(f"/api/autores/{autor_id}", name="DELETE /api/autores/[id]")

#     @task(2)
#     def crear_libro(self):
#         response = self.client.get("/api/autores", name="GET /api/autores (para crear libro)")
#         if response.status_code == 200:
#             autores = response.json()
#             if autores:
#                 autor_id = random.choice(autores)["id"]
#                 nuevo_libro = {
#                     "titulo": f"Titulo del Libro {random.randint(1,1000)}",
#                     "isbn": f"ISBN-{random.randint(1000,9999)}",
#                     "anio_publicacion": random.randint(1900, 2023),
#                     "edicion": random.randint(1, 10),
#                     "autor_id": autor_id
#                 }
#                 self.client.post("/api/libros", json=nuevo_libro, name="POST /api/libros")