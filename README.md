# Roomie

## Web-based chat application | Documentación básica

**Deploy**: [Go to Preview app](https://web-based-chat-app.vercel.app/)

### Características

- Tecnologías:
  - Typescript
  - React + Nextjs
  - React hooks + styled components
  - Geist
  - Firebase + firestore
  - Protocolo Oauth2 a través de Google y Firebase
- Chat en tiempo real
- Salas privadas
- Posibilidad de conversación privada y grupal
- Persistencia de datos en Cloud Firestore
- Escalabilidad para características más complejas

### Resumen del proceso de desarrollo:

1. Investigación sobre las arquitecturas y tecnologías disponibles más usadas, y la factibilidad de usar cada una de ellas. (El estudio y la investigación no se detuvo en ninguna etapa del proceso.)
2. Desarrollo de un chat sencillo en tiempo real `main branch`, utilizando:
   - Sala Única y pública
   - websockets `socketIO`
   - Node + Express js
   - React Next js
3. Desarrollo de aplicación escalable & serverless con firebase con persistencia de datos y múltiples salas. `firebase-cloud-dev branch`(resultado del proceso | definitiva)

#### Componentes | Páginas de la aplicación

- Página Sencilla de Inicio. Enlace hacia páginas de autenticación
- Páginas de **autenticación**: `/signup` y `/login`
  - El cliente selecciona usar credenciales (email + password) o autenticación mediante protocolo **Oauth2** con su cuenta de Google.
- Página de Bienvenida:
  - El cliente puede crear un nuevo chat o unirse a uno existente.
  - También tiene una vista con todos los chats que ha creado para unirse directamente
- **Chat Page**:
  - Chat en tiempo real con base de datos (NoSQL) en Cloud Firestore
  - Cada participante de la sala actual, tiene la posibilidad de añadir otros partiipantes.
