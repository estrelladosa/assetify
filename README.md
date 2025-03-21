# Assetify

## Proyecto Backend - Node.js con MongoDB Atlas

Este es el backend del proyecto desarrollado con **Node.js** y **MongoDB Atlas**. A continuación, se detallan los avances realizados hasta ahora, las dependencias necesarias y cómo poner en marcha el proyecto en los equipos de los demás compañeros.

### Avances Realizados

1. **Creación del Proyecto Backend**:
   - Se ha creado un proyecto backend con **Node.js** utilizando el framework **Express**.
   - La estructura del proyecto se encuentra organizada para ofrecer una API RESTful que permite gestionar usuarios.

2. **Dependencias Instaladas**:
   Se han instalado las siguientes dependencias para facilitar el desarrollo y la comunicación con la base de datos:

   - **express**: Framework para manejar las rutas y peticiones HTTP.
   - **mongoose**: ORM para interactuar con MongoDB y gestionar la base de datos de manera más sencilla.
   - **dotenv**: Para gestionar variables de entorno, como las credenciales de la base de datos.
   - **cors**: Para habilitar el acceso a la API desde otros orígenes, lo que es necesario si el frontend se encuentra en otro servidor o dominio.

3. **Base de Datos en MongoDB Atlas**:
   - Se ha creado una base de datos en **MongoDB Atlas**, una base de datos NoSQL gestionada en la nube, que está siendo utilizada para almacenar la información de los usuarios.
   - La base de datos contiene la colección `usuarios`, que almacena información de los usuarios del sistema (nombre, correo, contraseña, país, estilo, seguidores, etc.).

4. **Modelo de Usuario**:
   Se ha creado un modelo de **Usuario** en el archivo `models/Usuario.js`. Este modelo define la estructura de los documentos de los usuarios en la base de datos, especificando los campos que deben estar presentes.

5. **Rutas del Usuario**:
   Se ha creado un **router** de usuario en `routes/usuarioRoutes.js` con las siguientes funcionalidades:
   
   - **GET /api/usuarios**: Devuelve todos los usuarios registrados en la base de datos.
   - **GET /api/usuarios/:id**: Devuelve un usuario específico según el ID proporcionado en la URL.
   - **POST /api/usuarios**: Permite crear un nuevo usuario proporcionando los datos necesarios en el cuerpo de la solicitud.

## API de Usuarios - Rutas y Ejemplos en Postman

Este documento describe las rutas de la API para gestionar usuarios, junto con ejemplos de cómo realizar las peticiones correspondientes usando **Postman**.

### Rutas Disponibles

#### 1. **Obtener todos los usuarios**
- **Método**: `GET`
- **URL**: `http://localhost:5000/api/usuarios`

##### Descripción:
Obtiene una lista de todos los usuarios registrados en la base de datos.

##### Ejemplo en Postman:
- **Método**: `GET`
- **URL**: `http://localhost:5000/api/usuarios`

No necesitas enviar nada en el cuerpo de la solicitud (Body).

---

#### 2. **Obtener un usuario por ID**
- **Método**: `GET`
- **URL**: `http://localhost:5000/api/usuarios/:id`

##### Descripción:
Obtiene un usuario específico usando su ID.

##### Ejemplo en Postman:
- **Método**: `GET`
- **URL**: `http://localhost:5000/api/usuarios/67dd6b3afe192873e76ad526`

---

#### 3. **Crear un nuevo usuario**
- **Método**: `POST`
- **URL**: `http://localhost:5000/api/usuarios`

##### Descripción:
Crea un nuevo usuario con la información proporcionada en el cuerpo de la solicitud.

##### Cuerpo de la Solicitud (Body):
En **Postman**, selecciona la opción **raw** y luego el tipo **JSON**. El cuerpo de la solicitud debe ser el siguiente:

```json
{
  "nombre_usuario": "usuario3",
  "correo": "usuario3@email.com",
  "contraseña": "contraseña123",
  "pais": "67dd5dbc5b23483b4fcb67b7",  // ID de un país existente
  "descripcion": "Soy un artista digital",
  "estilo": "67dd5dbc5b23483b4fcb67b8",  // ID de un estilo existente
  "seguidores": [
    "67dd5dbc5b23483b4fcb67ad"  // ID de un usuario existente
  ],
  "seguidos": [
    "67dd5dbc5b23483b4fcb67b0"  // ID de un usuario existente
  ],
  "guardados": [
    "67dd60e906648ed7ac3ee35b"  // ID de un asset existente
  ]
}
