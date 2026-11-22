# RESPUESTAS.md
## Laboratorio N.º 5 · Consumo de API REST y renderizado dinámico
**Variante asignada:** B · Filtro por especie
---
## 1. ¿Qué pasa desde que la persona presiona “Buscar” hasta que aparecen las tarjetas?
Cuando la persona presiona el botón **Buscar**, se ejecuta el evento `submit` del formulario y se llama a la función `manejarBusqueda`.
Lo primero que hace `manejarBusqueda` es ejecutar `evento.preventDefault()` para evitar que el formulario recargue la página. Después llama a `leerCriteriosBusqueda`, que obtiene los valores ingresados en los campos de nombre, estado y especie. En los campos de texto se usa `.trim()` para eliminar espacios sobrantes.
Luego se comprueba si los tres criterios están vacíos. Si no se ingresó ningún criterio, se muestra un aviso y la función termina sin realizar una petición a la API.
Si existe al menos un criterio, se activa el estado de carga con `activarCarga(true)`. En ese momento el botón queda deshabilitado, cambia su texto a “Buscando…” y se limpian los resultados anteriores.
Después se ejecuta:
```javascript
await buscarPersonajes(nombre, estado, especie);
```

En `buscarPersonajes`, primero se llama a `construirUrlBusqueda`, que crea la URL utilizando `new URL()` y agrega únicamente los parámetros que tienen valor mediante `searchParams`.
La primera pausa ocurre en:
```javascript
await fetch(url);
```

Mientras JavaScript espera la respuesta del servidor, la página no queda bloqueada. La persona todavía puede desplazarse por la página y el navegador puede seguir procesando otros eventos.
Cuando llega la respuesta, el código verifica `respuesta.status` y `respuesta.ok`. Si la respuesta es válida, aparece una segunda pausa en:
```javascript
await respuesta.json();
```

Ese `await` espera a que el cuerpo de la respuesta sea leído y convertido a un objeto JavaScript.
La función `buscarPersonajes` devuelve un objeto con:
```javascript
{
    total,
    personajes
}
```
El valor `total` proviene de `datos.info.count` y `personajes` de `datos.results`.
De vuelta en `manejarBusqueda`, si no hay personajes se muestra un mensaje informativo y no se renderizan tarjetas. Si hay resultados, se llama a `mostrarPersonajes`, que utiliza `crearTarjeta` para generar cada tarjeta con `createElement` y `textContent`.
Después se llama a `mostrarContador` para mostrar el total de coincidencias informado por la API y la cantidad de personajes que se muestran en la página actual.
Finalmente, el bloque `finally` ejecuta `activarCarga(false)`, por lo que el botón vuelve a habilitarse tanto si la búsqueda terminó correctamente como si ocurrió un error.
---
## 2. ¿Por qué se revisa `respuesta.ok` o `respuesta.status` si ya existe un `try/catch`?
El bloque `try/catch` por sí solo no detecta todos los errores HTTP.
`fetch()` rechaza la promesa principalmente cuando existe un problema de red, por ejemplo si no hay conexión o el servidor no puede ser alcanzado. Sin embargo, una respuesta HTTP como 404 o 500 puede llegar correctamente al navegador y `fetch()` la considera una respuesta recibida, aunque el código de estado indique un problema.
Por eso, dentro de `buscarPersonajes` se revisa primero:
```javascript
if (respuesta.status === 404)
```
En la API de Rick and Morty, un 404 al realizar una búsqueda significa que no existen personajes que coincidan con los filtros. En ese caso se devuelve:
```javascript
{
    total: 0,
    personajes: []
}
```
y la interfaz muestra un mensaje de “sin resultados”, sin tratarlo como un error técnico.
Después se verifica:
```javascript
if (!respuesta.ok)
```

Esto permite detectar otros códigos HTTP fuera del rango 200–299 y convertirlos en una excepción con `throw new Error(...)`.
Por ejemplo, si el servidor respondiera con un error 500 y no se comprobara `respuesta.ok`, el programa intentaría continuar como si la petición hubiera sido exitosa y podría intentar procesar datos que no tienen la estructura esperada. En cambio, con esta comprobación el error pasa al bloque `catch` y se muestra un mensaje adecuado.

---
## 3. ¿Cómo se implementó la Variante B y qué se probó para comprobar que funciona?
La Variante B corresponde al **filtro por especie**.
En `index.html` agregué un campo de texto con el identificador:
```html
id="campo-especie"
```

En `app.js`, ese elemento se selecciona con:
```javascript
const campoEspecie = document.querySelector("#campo-especie");
```

La función `leerCriteriosBusqueda` obtiene su valor utilizando:
```javascript
especie: campoEspecie.value.trim()
```
El uso de `.trim()` permite ignorar los espacios sobrantes al principio y al final del texto.
Luego, `construirUrlBusqueda` recibe el parámetro `especie` y solamente lo agrega a la URL cuando tiene contenido:
```javascript
if (especie) {
    url.searchParams.set("species", especie);
}
```
De esta manera, la especie puede utilizarse sola o combinarse con nombre y estado.
Para comprobar el funcionamiento realicé búsquedas como:
- solo especie: `Alien`;
- nombre + estado + especie: `Rick` + `Vivo` + `Human`;
- especie con espacios sobrantes para comprobar que `.trim()` funciona;
- combinación de los filtros para verificar que los parámetros aparezcan juntos en la petición.

En la pestaña **Network** de DevTools también comprobé que la petición contiene los parámetros correspondientes y que la búsqueda correcta devuelve **Status 200**.
### URL observada en Network
http://127.0.0.1:5500/index.html
```
