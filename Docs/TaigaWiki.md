# ACCIONES RELACIONADAS CON ALASTRIA ID

## En este documento se describen las acciones relacionadas con Alastria Id.

  * Asunciones
  * Creación de Alastria Id
  * Autenticación
  * Testimonios
    - Emisión, registro, revocación y borrado
  * Alegaciones
    - Entrega, registro, aceptacióny borrado
  * Claves Publicas
    - Registro, revocación y borrado
  * Transacciones
  * Recuperación de claves privadas

## Asunciones

Los nodos de Alastria son permisionados y por tanto no es posible iniciar ninguna interacción con la blockchain desde el exterior. Es necesaria una pieza de arquitectura que actué como Gateway (GW) que será gestionada en combinación con los nodos y por los mismos actores. Los usuarios finales necesitan el apoyo de los socios que operan un nodo y GW para todas las acciones.

A continuación se describen paso a paso cada una de las acciones.

## Creación de Alastria Id

1. Creación en el dispositivo del usuario del par de claves personales (pública/privada) y, en su caso, el par de claves de dispositivo en un dispositivo con la aplicación Alastria instalada.

2. Identificación ante los sistema tradicionales (off chain) del socio y selección de opción de creación de identidad Alastria.
	1. El SP  genera un objeto JSON con formato AT (Alastria Token) que permita enlazar esta identificación con el paso siguiente.
	2. El SP solicita al usuario la llave pública de usuario (Generada en el punto 1).
	3. Modelo de datos objeto JSON:
  ```
  {
    URLGateWay  : http:www.gateway_socio.com
    URLCallBack : http:www.backend_service_provider.com/callback //Opcional
    AlastriaIDServiceProvider : 0xServiceProvider
  }.firma_service_provider
  ```
El SP manda una notificación Push al móvil del usuario o presenta un QR que es escaneado por el móvil

3. Creación de Alastria ID por el usuario, enviando al GateWay un Alastria Identity Creation (AIC) con los siguientes datos:
	1. Objeto de transacción Ethereum para creación de Identidad
    ```
    {
      From: 0xCuentaUsuario,
      To: 0xMetaIdentityManager,
      Value: empty,
      Data: PayloadBytes //createIdentityWithCall(0xCuentaUsuario,AlastriaIDServiceProvider,0xRegistry,PayloadBytesCallRegistry)
    }.FirmaCuentaUsuario
    //Payload llamada a registry
      Data: registry.SetPubKey(HashPubKeyCuentaUsuario)
    ```
	2. Objeto AT enviado al usuario desde el serviceProvider (Paso 2)
	3. Clave pública del usuario (PubKeyCuentaUsuario)

El objeto Alastria Identity Creation se envía firmado con la PrivKeyUser

4. El GateWay verifica:
	1. Comprueba la firma de todos los elementos firmados
	2. Existe sesión en la capa OAuth
	3. Que la petición viene autorizada por un service provider capaz de crear identidades (para el MPV será una lista blanca)
	4. Si ya existe otro Alastria ID para ese usuario (*0xCuentaUsuario*) no se crea otra identidad y se devuelve la existente
  
5. El GateWay manda la transaccion del punto 3 a IdentityManager

6. El GW devuelve el alastria_id creado al sistema tradicional del socio así como a la aplicación móvil junto con otros parámetros necesarios de la red (direcciones de contratos, lista de gw, ...).

7. El socio liga el nuevo Alastria ID con el identificador corporativo,para poder usarlo directamente en autenticaciones siguientes.

## Autenticación con Alastria Id

1. Acceso a WebApp y selección de Alastria Id como identificación, iniciando la creación de la sesión.
	1. Se genera un objeto JSON con formato AT (Alastria Token) que permita enlazar esta identificación con el paso siguiente.
	2. Se solicita al usuario la PubKeyUser y AlastriaID de usuario 

2. Comprobación de la identidad de la aplicación del SP por la Aplicación Alastria.
	1. Solicitud de la clave publica de la aplicación (Aplicación Alastria -> GW -> getPubKey(AlastriaIDServiceProvider)
	2. Verificación de la firma del AT

3. El usuario manda un AlastriaSesion (JSON firmado) de aceptación de sesion a *URLCallBack* conteniendo:
	1. Objeto AT enviado al usuario desde el serviceProvider
	2. AlastriaId del Usuario
	3. Clave pública del usuario (PubKeyUser)
El objeto AlastriaSesion va firmado con la PrivKeyUser

4. El ServiceProvider recupera el Hash de PubKeyUser del Registry getPubKey(AlastriaIDUser)

5. Comprobación de la clave publica y firma del usuario y por tanto de su Identidad.

6. Si es la primera vez que se accede con AlastriaId puede ser necesario ligarlo con la cuenta en el sistema del proveedor de servicios:
	1. Utilizando usuario/password u otro sistema de autenticación
	2. Pidiendo atributos básicos (Nombre/apellidos, DNI) del nivel (LoA) que se considere (p.e.: 2 ó 3)

7. Envío del token de sesión a la aplicación Web.

## Testimonios

### Emisión (offchain)
1. Identificación del usuario ante sistema tradicional del socio mediante AlastriaId (Creación o autenticación) 
2. Creación de testimonios firmados por el SP para cada atributo 
	1. Consulta de datos validados del usuario en el sistema tradicional.
	2. Generación de un testimonio firmado en formato JSON firmado por el SP para cada uno de los datos validados: signedAttestment
	3. Envío de cada testimonio al móvil del usuario.
	4. Almacenamiento de los testimonios deseados en el repositorio accesible exclusivamente por el usuario. Para cada Testimonio generará una URI.

El formato del testimonio es un JSON firmado por la PrivKeySP

### Registro
1. El usuario manda una transaccion a traves del GW y el identitymanager/proxy al AlastriaAttestationRegistry.set para que se registre el atributo con los siguientes datos:
	1. dataHash: Hash (SignedAttestment)
	2. URI: Localizador abstracto del testimonio en su repositorio.
La transacción se envía firmada por la PrivKeyUser

### Revocación
1. El Testimoniador manda una transaccion a traves del GW y el identitymanager/proxy al AlastriaAttestationRegistry.revokeAttestation para que se registre la revocación del atributo con los siguientes datos:
	1. revHash: Hash (signedAttestment+AttestmentSignature) 
	2. Status: askIssuer or Revoked 
La transacción se envía firmada por la PrivKeySP

### Borrado
1. El usuario manda una transaccion a traves del GW y el identitymanager/proxy al AlastriaAttestationRegistry.deleteAttestation para que se registre el borrado del atributo con los siguientes datos:
	1. dataHash: Hash (Testimonio)
La transacción se envía firmada por la PrivKeyUser

## Alegaciones

    Creación de la solicitud del consumidor de identidad (prestador de servicios) de:
        La lista de atributos requeridos con el nivel EIDAS de cada uno.
        El callback donde deben ser enviados los datos.
        Firma del requerimiento (a través de un JWT).

    Envío de la solicitud de datos al usuario mediante:
        URL inter aplicación.
        Push notification al móvil.
        Código QR para escanear con la aplicación Alastria del móvil.

    La aplicación valida el requerimiento y realiza las siguientes acciones:
        La aplicación selecciona los testimonios más adecuados.
        Se los presenta al usuario para su validación.
        Permite que el usuario cambie la elección pre-definida.
        Permite la aprobación/rechazo de la solicitud.

    Remisión del callback con la respuesta:
        rechazo.
        aprobación: con los testimonios elegidos por el usuario (incluyendo sus firmas originales) más el requerimiento original, en un JWT firmado (por la clave personal del usuario).

Publicación de información pública de usuario

NOTA: En una primera versión sólo se registra la clave personal pública del usuario.
Clave personal pública del usuario en un repositorio

    Se guarda la clave personal pública del usuario en un objeto JSON en IPFS (u otro repositorio).
    EL usuario registra por medio de su alastria_id (gateway -> metaidentitycontract -> proxy contract) en el registry el hash IPFS de su clave pública personal.

NOTA: El posible registro de los metadatos de los registros está en estudio, en una primera aproximación se realizaría de la siguiente manera.
Publicación de Metadatos en el Registry

    Se utilizará la URI correspondiente al JWT de cada testimonio (ver apartado de Creación de Alastria Id).
    Registrar los atributos, enviando al GW los siguientes datos:
    a. JWT. El GW comprueba la firma del emisor.
    b. Transacción firmada.
        De: Usr (KPub cliente). El GW comprueba que la cuenta existe.
        Para: IdentityManager. El GW comprueba la dirección.
        Función: Forward. El GW comprueba la función llamada Destination = Registry.Set.
            Parámetros: Identificador ¿opaco o cifrado? del Testimonio, ¿Issuer?, URI.

Transacción

    Cuando una aplicación Alastria desea que un usuario invoque un contrato:

        La aplicación generará un JWT firmado, con los datos de la transacción a firmar por el usuario.
            Descripción amigable de lo que se está solicitando.
            Dirección del contrato.
            Función a invocar en el contrato.
            Valores de los parámetros.
            Callback de respuesta.

        La aplicación presenta la descripción amigable y los datos de la transacción para su aceptación o rechazo.

        En caso de aprobación, se firma la transacción y se remiten los datos al Gateway para su envío a la blockchain ¿encaminándolo a través del metaidentitymanager?. En este punto podría incorporarse controles sobre las transacción (por ejemplo, que no se trate de ninguno de los contratos relacionados con identidad).

        El Gateway envía el hash de la transacción al móvil.

        El móvil envía a la url de callback el hash de la transacción.

Revocacion de testimonios

NOTA: Aunque cualquiera pueda registrar una revocación de un testimonio en el registro, los casos de uso más frecuentes son las revocaciones por el propio usuario, por el emisor del testimonio o por fuerza legal.

Para revocar un testimonio, se requiere remitir una transacción al blockchain de Alastria con los siguientes parámetros:

    De: Llave del revocador (emisor/usuario).
    Para: Registry.
    Función: revoke (SHA-3 del testimonio)

Recuperación de claves privadas

Se contempla un mecanismo de salvaguardia y recuperación de la clave personal, publica y privada, del usuario. En su caso el mismo mecanismo se podría aplicar a la clave de dispositivo. En futuras versiones se podría utilizar un conjunto de claves derivadas (no en el MVP).

Cada clave se troceara en n partes (al menos 3) de forma que se pueda reconstruir la clave original con cualesquiera n-1 partes. La partes se cifrarán con una password del usuario y se repartirán entre n socios para su salvaguardia. Los socios podrán ser elegidos por el usuario pero se le propondrán 3 socios de los que hayan prestado al menos un testimonio de nivel ¿3?, en caso de no existir al menos tres socios que cumplan la condición se dará un aviso al usuario.

La recuperación de la clave la iniciará el usuario mediante un dispositivo con la aplicación Alastria instalada en la que se habrá creado el par de claves de dispositivo.
Proceso

    Identificación ante los sistema tradicionales (off chain) del socio y selección de opción de recuperación de claves Alastria.
    a. Se genera un token de sesión que permita enlazar esta identificación con el paso siguiente.
    b. Se entrega el Alastria Id correspondiente al usuario identificado.
    c. Se solicita al usuario la llave pública de dispositivo.

    Inicio de la recuperación de clave, enviando al GW los siguientes datos:
    a. Token de sesión.
    b. Llave de dispositivo firmada por la clave de dispositivo (en este momento el usuario no tiene la clave personal).

    El GW verifica que no haya otro Alastria ID para ese dispositivo (la comprobación se hace sobre la llave de dispositivo) ¿y no haya otro dispositivo asociado a ese Alastria Id?.

    El GW solicita al sistema tradicional la parte de la clave personal Alastria correspondiente al AlastriaId y token de sesión.

    Se repetirá el proceso hasta obtener n-1 claves.

    Con las n-1 partes de recompondrá y descifrará el par de claves.

En este punto se podría comprobar que el registro de la clave publica en el registry coincide.
