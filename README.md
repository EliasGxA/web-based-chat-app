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

## Arquitecturas que se utilizan para hacer un chat

#### Introducción | Componente histórico [1]

En cuanto a las características de una aplicación basada en chat, es deseable que sea escalable y adaptado a los deseos del cliente. Las cuestiones de rendimiento y de utilización racional de recursos son de suma importancia.

Se presentan la taxonomía de diferentes características y funciones compatibles con la mayoría sistemas comunes, a saber, AOL Instant Messenger **(AIM)**, Yahoo Messenger **(YMSG)** y MSN Messenger **(MSN)**. De todos los sistemas, AIM admite la mayoría de las funciones y, por lo tanto, es la red más compleja Protocolo de mensajería instantánea. Esto puede deberse al hecho de que AIM ha la base de usuarios más grande de los tres sistemas. También se discute brevemente posibles enfoques futuros de la mensajería instantánea y la comunicación por chat utilizando protocolos estandarizados IETF como SIMPLE y XMPP.

**Arquitectura AIM**
La arquitectura del sistema AIM se muestra en la Fig. En AIM,
después de que el cliente inicia sesión con el servidor de autenticación principal
(paso 1 en la Fig. 1), el cliente es dirigido a un servidor BOS. los
El cliente abre una única conexión TCP al servidor BOS (paso
2), que es efectivamente el canal de control. Más subsiguientes
la comunicación se produce a través de esta conexión, como básica
mensajes instantáneos. También se establecen conexiones persistentes con
servidor de correo electrónico (paso 3) y el servidor de interés del usuario (paso 4). Nuevo
servicios (comprobar el estado del correo electrónico, buscar un usuario, etc.) requieren
enviar una solicitud de servicio al servidor BOS, que responde con
una nueva dirección IP y número de puerto TCP para contactar para eso
servicio particular. A continuación, se realiza una nueva conexión a ese servidor.
La excepción es cuando un usuario desea unirse o crear un chat.
sesión de sala. En este caso, el cliente primero se pone en contacto con el BOS
servidor para acceder al servidor de configuración de la sala de chat (paso 5),
que otorga permiso a una sala de chat. Las credenciales de
el servidor de configuración de la sala de chat se presenta al BOS
servidor (paso 6), que luego apunta al cliente a un chat en particular
servidor de sala (paso 7). Se mantiene cada sesión de sala de chat
utilizando una conexión TCP separada. La conexión al chat
El servidor de configuración de la sala persiste hasta varios minutos después de todo el chat.
finalizan las sesiones de sala. El servidor BOS puede obligar a un cliente a
cambie a otro servidor BOS a través de un mensaje de migración.

![Arquitectura AIM](AIM.PNG)

**Arquitectura MSN**
La arquitectura del sistema MSN se muestra a continuación (Fig. 2). MSN también tiene una arquitectura asimétrica, pero con solo tres tipos de
servidores: despacho, notificación y switchboard. Un cliente inicialmente contacta con el conocido servidor de despacho (paso 1 en la Fig.2) si no conoce ningún servidor de notificaciones. Luego del despacho, el servidor redirige al cliente a un servidor de notificaciones. El cliente luego abre una única conexión al servidor de notificaciones
(paso 2) y mantiene esta conexión mientras el cliente esté
iniciado sesión en el sistema. Este es el canal de control en el
Arquitectura MSN. El servidor de notificaciones mantiene la presencia
de usuarios en el sistema, y ​​apunta al cliente a las
servidores de switchboard cuando un nuevo mensaje instantáneo o sesión de chat
se crea (paso 4); El paso 3 se discutirá en el siguiente
subsección. El servidor de switchboard se utiliza tanto para sesiones de chat
y mensajes instantáneos a otros clientes; esto difiere de
los otros servicios en que MSN trata los mensajes instantáneos y
salas de chat privadas de forma idéntica. Los mensajes instantáneos son en realidad
salas de chat configuradas entre dos usuarios donde usuarios adicionales
puede ser invitado a la sala de chat. La conexión TCP al
La switchboard está abierta durante toda la vida del chat o la comunicación de mensajería instantánea al otro cliente. El servidor de switchboard también maneja
invitaciones para transferencia de archivos, video y voz. Mientras MSN
no tiene un mecanismo de migración explícito, la notificación
El servidor puede cerrar la conexión del cliente, lo que obliga al cliente
comenzar de nuevo.

![Arquitectura MNS](MNS.PNG)

**Arquitectura YMSG**
YMSG, por otro lado, es muy simple debido a su simétrica
arquitectura, y se muestra en la Fig. 3. La misma conexión
se utiliza para todos los mensajes instantáneos y sesiones de chat.
Muchos entornos corporativos emplean firewalls para filtrar
tráfico no deseado, con un valor predeterminado común para permitir el tráfico HTTP.
Debido a esto, muchos sistemas de mensajería instantánea permiten tunelizar
HTTP como una forma de evitar estos cortafuegos. Curiosamente, los tres
Todos los sistemas de mensajería instantánea comerciales utilizan la misma arquitectura simétrica
cuando se tuneliza sobre HTTP; es decir, el cliente solo interactúa
con un solo servidor front-end HTTP. La mensajería instantánea nativa
el protocolo está encapsulado de forma eficaz sobre HTTP, con
los comandos y las respuestas se multiplexan a través de conexiones HTTP.
AIM utiliza dos conexiones HTTP; uno para enviar
solicitudes de forma asincrónica, y la otra que bloquea
esperando las respuestas. YMSG usa un solo síncrono
conexión, de modo que cada solicitud se bloquea hasta que se recibe una respuesta
recibido de la red. MSN también usa una sola conexión,
pero envía solicitudes de forma asincrónica y recibe
una respuesta o sondeos para obtener una respuesta dependiendo del tipo de
solicitud.

![Arquitectura YMSG](YMSG.PNG)

#### Arquitectura General de una aplicación de mensajería: [2]

- **Chat app** o **lado del cliente** (escritorio, web o spartphone)
- **Chat Server Engine** o **parte del servidor**, que es un grupo de servidores externos responsables de la operación del chat. Este es el lugar donde ocurre toda la magia del chat. Ambas partes contienen varios componentes que se comunican entre sí y hacen que el chat entre en acción. La siguiente imagen muestra un buena generalización de la estructura de un chat

![arquitectura general de un chat](https://s3-eu-central-1.amazonaws.com/yellow.studio/app/public/ckeditor_assets/pictures/413/content_chat_table1.jpg)

**Chat Server Engine** es un núcleo de la arquitectura de chat que gestiona la entrega y el envío de mensajes. En nuestra versión de arquitectura de chat, incluye los siguientes componentes:

- **La API REST** de chat maneja las tareas que no están conectadas directamente con el envío y la entrega de mensajes, como la autenticación del usuario, el cambio de la configuración del usuario, la invitación de amigos, la descarga de paquetes de calcomanías, etc. API a través de la biblioteca cliente de la API de REST de chat.
- **Chat WebSocket Server** es responsable de transmitir mensajes entre usuarios. Esta conexión está abierta en ambos sentidos (full-duplex); eso significa que los usuarios no tienen que realizar solicitudes al servidor si hay algún mensaje para ellos, simplemente los reciben de inmediato.
- **Chat Media Storage Server** es un grupo de servidores responsables de almacenar los archivos multimedia de los usuarios.

La separación de componentes es el núcleo de las arquitecturas de chat. Todos los servicios que comprende la arquitectura son independientes entre sí. ¿Por qué? Es beneficioso desde muchas perspectivas:

- **Reutilización**. Cuando los componentes del chat se diseñan por separado, se pueden reutilizar fácilmente en otros proyectos.
  Escalabilidad. Cada componente de la arquitectura es un cuello de botella potencial cuando un proyecto crece y comienza a servir a una audiencia mayor. La ventaja de los componentes independientes es que se pueden escalar por separado sin afectar a toda la arquitectura.
- **Integración.** Los componentes independientes se pueden integrar fácilmente con los servicios del cliente a pedido. Por ejemplo, si el cliente desea que los archivos de usuario se almacenen en su CRM, puede integrar el CRM con Chat Media Storage sin tener que cambiar toda la arquitectura.
- **Personalización y migración**. Todos los componentes de la arquitectura se pueden ajustar fácilmente a las necesidades del cliente. Por ejemplo, pueden funcionar con diferentes servicios: Chat WebSocket Server se puede construir en PubNub, Twilio o Firebase, mientras que Chat Media Storage puede funcionar con Cloudinary o Amazon S3. O puede construir cualquiera de los componentes completamente desde cero si los necesita para realizar tareas específicas.

#### Arquitecturas específicas [3]

**Retos para el backend - arquitectura inicial:**

- Crecimiento futuro: evolución de la aplicación
- Capaz de manejar 10k usuarios concurrentes
- Comunicación en tiempo real
- Consígalo construido en 3-6 meses
- Las salas de chat deben tener el tamaño y la capacidad suficientes
- Buscar en varios canales simultáneamente
- Escala cuando la carga aumenta repentinamente
- Recuperación más rápida del historial de mensajes
- Poder compartir mensajes con soporte multimedia

**Base de la arquitectura**

![arquitectura base](https://www.simform.com/wp-content/uploads/2018/09/Chat-Architecture-3.png)

**Arquitectura de base de datos para la escalabilidad y el rendimiento de la aplicación de chat**

Actualizar y almacenar información en su base de datos (DB) tampoco es mágico. Sin embargo, los algoritmos son mucho más rápidos en la recuperación de información, pero con una aplicación de mensajería, las bases de datos rápidamente se vuelven enormes en tamaño y complejidad. Haciendo muy difícil encontrar, clasificar y actualizar información. Los algoritmos a continuación destacan mejor cómo la recuperación de información puede consumir mucho tiempo cuando elige una forma sobre otra

![db features](https://www.simform.com/wp-content/uploads/2018/10/database-sorting-in-chat-apps.gif)

**Para comprender mejor los desafíos del nivel de base de datos, primero echemos un vistazo al tipo de información que normalmente almacenamos:**

- Información de la sala de chat: nombre de la sala de chat, quién está en esta sala de chat, etc.
- Mensajes recientes: estos son mensajes que se acaban de enviar
- Mensajes archivados: mensajes antiguos por lo general. Pero puedes decir formalmente que cualquier mensaje que no esté en los últimos 50 mensajes es un mensaje archivado.

**Consideraciones de ingeniería:**

- Un usuario sentiría una mala experiencia de usuario si no puede encontrar los últimos 50 mensajes en su aplicación
- Un usuario querría enviar información tan rápido al servidor. ¡El chat en tiempo real es la norma ahora!
- Las salas de chat requerirían su propio almacén de datos, ya que almacenar esta información en la misma base de datos sería fatal para el rendimiento y la escalabilidad de su aplicación.
- Se publicarían más de 100.000 a 200.000 mensajes a diario si su aplicación tuviera más de 100.000 usuarios.

**La configuración de la base de datos para la escalabilidad y el rendimiento del chat incluiría:**

- Base de datos de metadatos
- Base de datos de historial de chat caliente
- Base de datos del historial de Cold Chat
- Cola de mensajes frente al historial de chat frío

**Para la base de datos de metadatos**, podemos usar cualquier almacén de valor clave que tenga una estructura de datos rica. Incluso puede usar Redis si se usa con RedisLabs para la persistencia.

**Para la base de datos de Hot Chat**, Redis se puede usar en un clúster o en modo compartido. También puede considerar Aerospike, ScyallaDB o ElasticSearch.

**Para el almacenamiento de datos de Cold Chat**, Riak es una de las opciones más populares. Pero también puede usar Cassandra / ScyllaDB, AeroSpike.

**Tipos de arqitecturas**:

- Arquitectura impulsada por eventos + Simplicidad + Iteratibilidad
- Utilice arquitecturas de terceros como Firebase y Layer
- Arquitecturas de chat descentralizadas
- Arquitecturas de chat de código abierto
- Arquitecturas basadas en plataformas
- Arquitecturas de nivel empresarial

**Arquitecturas de chat basadas en plantillas: Firebase y Layer**:

Las aplicaciones de chat creadas sobre **Firebase** son un gran ejemplo de este tipo de arquitecturas. En caso de que no lo sepa, piense en Firebase como un conjunto de reglas preconfiguradas para crear sus aplicaciones donde solo tiene que trabajar en el front-end, la mayor parte de la lógica del back-end de la aplicación ya estaría construida. Recuerde cómo abordé los problemas de escalabilidad anteriormente, con Firebase, no necesitará hacer eso y ellos se encargarán de la mayoría de las cosas por usted.

Así es como se ve la arquitectura de una aplicación de mensajería que usa Firebase:

![firebase architecture](https://www.simform.com/wp-content/uploads/2018/09/firebase.png)

Secret decidió ir con Pusher para construir un sistema basado en websocket altamente escalable.

Así es como se veía su arquitectura de alto nivel:

![Secret architecture](https://www.simform.com/wp-content/uploads/2018/09/pusher.png)

Esta solución se amplió fácilmente a más de 1.000.000 de conexiones simultáneas. Fue rápido, rápido y escalable.

**Cuándo optar por una solución tecnológica como Pusher, Firebase o Layer:**

- Si su equipo es un negocio pesado que espera una sobrecarga de tecnología muy baja, estas arquitecturas de terceros son la mejor opción para usted.
- Si usted es un equipo de tecnología que solo quiere lanzar un prototipo más rápido, esta arquitectura de terceros es algo que podría considerar aquí.

**Algunas precauciones que deben tomarse al evaluar estas plataformas de terceros:**

- En la mayoría de los casos, controlan tus datos.
- El sistema suele ser rígido e inflexible, lo que dificulta la adopción de nuevos cambios personalizados.
- A veces, terminaría pirateando todo el sistema solo para asegurarse de que puede obtener incluso una pequeña función personalizada
- Aparte de lo que ya existe, el sistema no le permitirá superar los puntos de referencia en términos de rendimiento.

**Arquitecturas de chat descentralizadas**:
Hasta ahora, lo que hemos visto son algo llamado arquitecturas de chat centralizadas. Las arquitecturas descentralizadas se basan principalmente en la parte superior de Blockchains o Distributed Ledgers para admitir servicios de chat seguros descentralizados.

Gran parte del trabajo anterior que hice en arquitecturas de chat descentralizadas fue extremadamente único y sería difícil señalar una arquitectura tan genérica como lo hicimos para un servicio de chat centralizado.

Recogeré aquí Matrix.org para crear una aplicación de chat B2B en redes descentralizadas. Matrix como solución se centraría en:

- Grupo de chat
- Señalización WebRTC
- Reducción de silos

En lugar de estar alojado en un servidor centralizado, así es como se ve realmente la arquitectura basada en Matrix

![matrix based architecture](https://www.simform.com/wp-content/uploads/2018/09/Matrix-Architecture-1.png)

Esta arquitectura en general es una malla de servicios. Lo realmente interesante de esta arquitectura es que el historial de conversaciones se distribuye entre estos servidores. No hay un único servidor que sea el propietario de la conversación.

Creo que un gran problema que existe en la mensajería es la falta de protocolos y estándares abiertos que puedan facilitar esta comunicación. Matrix simplifica esta comunicación utilizando WebRTC para comunicar información.

Si bien la mayor parte de la arquitectura general de una aplicación que se crea aquí es similar a la que tenemos en las soluciones de chat centralizadas, la diferencia radica en cómo los nodos de chat descentralizados interactúan entre sí. Eche un vistazo al siguiente ejemplo que muestra dos nodos descentralizados (servidores domésticos) hablando entre sí.

![data flow](https://www.simform.com/wp-content/uploads/2018/09/How-data-flows-between-clients.png)

**En lo adelante, algunas de las características destacables en apps de mensajería instantánea en la actualidad:**

- Video llamadas
- Sincronización autimática de contactos
- Indicador de escritura
- Compartir archivos grandes
- Cámara **In app**
- Publicación de historias (tipo Instagram)
- Encriptación **End to End**
- **Push Notification**
- Widget de búsqueda
- **In-app Browser**
- **Stickers** y **pop up stickers in line**
- Indicador de mensaje leído / no leído
- Bots
- Comparte ubicacion
- Agitar y mirar a su alrededor como en WeChat
- Actualizaciones de **screen** en tiempo real
- HIPAA compliance
- Persistencia sin conexión
- Función de foto arrastrable con zoom de Instagram
- Animaciones
- Burbuja de chat
- Edición de fotos

**Costos aproximados | SDK disponibles que vale la pena considerar**

**Quickblox**

![Quickblox](https://www.simform.com/wp-content/uploads/2018/09/Quickblox.png)

**PubnNub**

![PubnNub](https://www.simform.com/wp-content/uploads/2018/09/Pubnub.png)

**Pusher**

![Pusher](https://www.simform.com/wp-content/uploads/2018/09/Pusher-1.png)

**Conclusiones:**
He aquí la piedra angular del proceso: Inestigación + Innovación. Estudiar y buscar brechas en las apps que dominan el mercado

El proceso puede parecer complicado si carece de conocimientos técnicos. Querrá un equipo que explore todas las posibilidades y no deje piedra sin remover para sus necesidades comerciales y de desarrollo.

**Referencias**
[1] Raymond B. Jennings and others. A Study of Internet Instant Messaging and Chat Protocols, 2006
[2] [Guide to the Chat Architecture](https://yellow.systems/blog/guide-to-the-chat-architecture)
[3] [How to Build messaging app](https://www.simform.com/how-to-build-messaging-app-whatsapp-telegram-slack/) (2018)
