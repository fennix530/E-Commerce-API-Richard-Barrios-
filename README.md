# proyecto-final-ecommerce--Richard-Barrios

## 📦 E-Commerce Backend API

Este proyecto es una API RESTful para la gestión de productos en una tienda online, desarrollada con Node.js, Express y Firestore como base de datos.

---

## ✨ Características

- CRUD completo de productos
- Validación de datos con modelo personalizado
- Paginación y filtrado por categoría y precio
- Timestamps automáticos (`createdAt`, `updatedAt`)
- Prevención de productos duplicados por nombre
- Autenticación con JSON Web Tokens (JWT)
- Estructura modular por controlador, modelo, ruta y servicio

---

## Estructura del proyecto


├── src/ 
    │   
    ├── controllers/ │  
    ├── middleware/ │
    ├── models/ │  
    ├── public/ │ 
    ├── routes/ │
    ├── services/ │ 
    ├── index.js/    
    └── config/ 
├── .env 
└── README.m

---

## Endpoints principales

| Método | Ruta                  | Descripción                     |
|--------|-----------------------|---------------------------------|
| GET    | /api/productos        | Obtener todos los productos     |
| GET    | /api/productos/:id    | Obtener un producto por ID      |
| POST   | /api/productos        | Crear un nuevo producto         |
| PUT    | /api/productos/:id    | Actualizar producto por ID      |
| DELETE | /api/productos/:id    | Eliminar producto por ID        |
| POST   | /api/auth/register    | Registrar nuevo usuario         |
| POST   | /api/auth/login       | Autenticación de usuario        |

---

## 🔐 Seguridad

La autenticación se implementa con JSON Web Tokens (JWT). Las rutas protegidas requieren incluir el token en el header:

El sistema también valida productos duplicados por nombre y protege accesos mediante middlewares de autenticación.
---

## ⚙️ Variables de entorno

Configurar un archivo `.env` con los siguientes valores:

```env
PORT=3000
JWT_SECRET=tu_clave_secreta
FIREBASE_PROJECT_ID=...
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...

---

## Despliegue

---

### 🛠️ Instalación del proyecto

```markdown
## 🛠️ Instalación

```bash
git clone https://github.com/fennix530/proyecto-final-ecommerce--Richard-Barrios-.git
cd proyecto-final-ecommerce
npm install
npm start

---


---

### 🌐 Despliegue

```markdown
## 🌐 Despliegue

La API está desplegada en Railway y accesible públicamente en:

🔗 https://proyecto-final-richard-barrios.up.railway.app

Podés probar los endpoints usando herramientas como Postman, Insomnia o conectarte desde tu frontend.

---

## 👨‍💻 Autor

**Richard Barrios**  
📎 [GitHub](https://github.com/richardbarrios)


