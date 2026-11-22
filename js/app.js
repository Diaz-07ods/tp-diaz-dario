// ============================================================
// Buscador de personajes · Laboratorio N.º 5
// Fundamentos del Desarrollo Web · Unidad 4
// API: https://rickandmortyapi.com/documentation
// Variante B · Filtro por especie
// ============================================================


// ---------- 1. Configuración ----------
const URL_PERSONAJES =
    "https://rickandmortyapi.com/api/character";

const TEXTO_DESCONOCIDO = "Desconocido";


// Traducción de los estados que devuelve la API.
const ESTADOS = {
    Alive: {
        texto: "Vivo",
        clase: "estado-vivo"
    },

    Dead: {
        texto: "Muerto",
        clase: "estado-muerto"
    },

    unknown: {
        texto: TEXTO_DESCONOCIDO,
        clase: "estado-desconocido"
    }
};


// Traducción de géneros.
const GENEROS = {
    Female: "Femenino",
    Male: "Masculino",
    Genderless: "Sin género",
    unknown: TEXTO_DESCONOCIDO
};


// ---------- 2. Selección de elementos del DOM ----------
const formularioBusqueda =
    document.querySelector("#formulario-busqueda");

const campoNombre =
    document.querySelector("#campo-nombre");

const filtroEstado =
    document.querySelector("#filtro-estado");

const campoEspecie =
    document.querySelector("#campo-especie");

const botonBuscar =
    document.querySelector("#boton-buscar");

const mensajeEstado =
    document.querySelector("#mensaje-estado");

const contadorResultados =
    document.querySelector("#contador-resultados");

const contenedorResultados =
    document.querySelector("#contenedor-resultados");


// ---------- 3. Lectura de criterios ----------
const leerCriteriosBusqueda = () => {

    return {
        nombre: campoNombre.value.trim(),
        estado: filtroEstado.value,
        especie: campoEspecie.value.trim()
    };
};


// ---------- 4. Construcción de la URL ----------
const construirUrlBusqueda = (
    nombre,
    estado,
    especie
) => {

    const url = new URL(URL_PERSONAJES);


    if (nombre) {
        url.searchParams.set(
            "name",
            nombre
        );
    }


    if (estado) {
        url.searchParams.set(
            "status",
            estado
        );
    }


    if (especie) {
        url.searchParams.set(
            "species",
            especie
        );
    }


    return url;
};


// ---------- 5. Acceso a la API ----------
const buscarPersonajes = async (
    nombre,
    estado,
    especie
) => {

    const url =
        construirUrlBusqueda(
            nombre,
            estado,
            especie
        );


    const respuesta =
        await fetch(url);


    // La API responde 404 cuando los filtros
    // no encuentran ningún personaje.
    if (respuesta.status === 404) {

        return {
            total: 0,
            personajes: []
        };
    }


    // Otro código que no pertenezca al rango
    // 200 - 299 sí se considera error HTTP.
    if (!respuesta.ok) {

        throw new Error(
            `El servidor respondió con el código ${respuesta.status}`
        );
    }


    const datos =
        await respuesta.json();


    return {
        total: datos.info.count,
        personajes: datos.results
    };
};


// ---------- 6. Formateo de datos ----------
const textoSeguro = (valor) => {

    if (
        !valor ||
        valor === "unknown"
    ) {

        return TEXTO_DESCONOCIDO;

    }


    return valor;
};


const obtenerEstado = (estado) =>
    ESTADOS[estado] ?? ESTADOS.unknown;


const obtenerGenero = (genero) =>
    GENEROS[genero] ?? TEXTO_DESCONOCIDO;


// ---------- 7. Creación de datos de la tarjeta ----------
const crearDato = (
    etiqueta,
    valor
) => {

    const termino =
        document.createElement("dt");

    termino.textContent =
        etiqueta;


    const descripcion =
        document.createElement("dd");

    descripcion.textContent =
        valor;


    return [
        termino,
        descripcion
    ];
};


// ---------- 8. Creación de tarjetas ----------
const crearTarjeta = (personaje) => {

    const tarjeta =
        document.createElement("article");

    tarjeta.classList.add(
        "tarjeta"
    );


    const imagen =
        document.createElement("img");

    imagen.src =
        personaje.image;

    imagen.alt =
        `Retrato de ${textoSeguro(personaje.name)}`;

    imagen.loading =
        "lazy";

    imagen.width =
        300;

    imagen.height =
        300;


    const cuerpo =
        document.createElement("div");

    cuerpo.classList.add(
        "tarjeta-cuerpo"
    );


    const titulo =
        document.createElement("h2");

    titulo.textContent =
        textoSeguro(personaje.name);


    const estado =
        obtenerEstado(
            personaje.status
        );


    const indicadorEstado =
        document.createElement("span");

    indicadorEstado.classList.add(
        "estado",
        estado.clase
    );


    indicadorEstado.textContent =
        `${estado.texto} · ${textoSeguro(personaje.species)}`;


    const listaDatos =
        document.createElement("dl");


    const cantidadEpisodios =
        personaje.episode?.length ?? 0;


    listaDatos.append(

        ...crearDato(
            "Género",
            obtenerGenero(personaje.gender)
        ),

        ...crearDato(
            "Origen",
            textoSeguro(
                personaje.origin?.name
            )
        ),

        ...crearDato(
            "Última ubicación",
            textoSeguro(
                personaje.location?.name
            )
        ),

        ...crearDato(
            "Episodios",
            `${cantidadEpisodios}`
        )

    );


    cuerpo.append(
        titulo,
        indicadorEstado,
        listaDatos
    );


    tarjeta.append(
        imagen,
        cuerpo
    );
    return tarjeta;
};


// ---------- 9. Renderizado de personajes ----------
const mostrarPersonajes = (
    personajes
) => {
    const tarjetas =
        personajes.map(
            (personaje) =>
                crearTarjeta(personaje)
        );
    contenedorResultados.replaceChildren(
        ...tarjetas
    );
};


// ---------- 10. Mensajes de estado ----------
const mostrarMensaje = (
    texto,
    esError = false
) => {
    mensajeEstado.textContent =
        texto;
    mensajeEstado.classList.toggle(
        "error",
        esError
    );
};


// ---------- 11. Estado de carga ----------
const activarCarga = (
    estaCargando
) => {

    botonBuscar.disabled =
        estaCargando;
    botonBuscar.textContent =
        estaCargando
            ? "Buscando…"
            : "Buscar";
    contenedorResultados.setAttribute(
        "aria-busy",
        String(estaCargando)
    );
};

// ---------- 12. Contador ----------
const ocultarContador = () => {
    contadorResultados.hidden =
        true;
    contadorResultados.textContent =
        "";
};

const mostrarContador = (
    total,
    cantidadMostrada
) => {
    const textoEncontrados =
        total === 1
            ? "1 personaje encontrado"
            : `${total} personajes encontrados`;

    const textoMostrados =
        cantidadMostrada === 1
            ? "se muestra 1"
            : `se muestran ${cantidadMostrada}`;
    contadorResultados.textContent =
        `${textoEncontrados} · ${textoMostrados}`;
    contadorResultados.hidden =
        false;
};


// ---------- 13. Limpiar resultados ----------
const limpiarResultados = () => {

    contenedorResultados.replaceChildren();

    ocultarContador();
};


// ---------- 14. Manejador del formulario ----------
const manejarBusqueda = async (
    evento
) => {
    evento.preventDefault();
    const {
        nombre,
        estado,
        especie
    } = leerCriteriosBusqueda();


    // Si no se ingresó ningún criterio,
    // no se hace ninguna petición.
    if (
        nombre === "" &&
        estado === "" &&
        especie === ""
    ) {

        mostrarMensaje(
            "Escribe un nombre, selecciona un estado o indica una especie para buscar.",
            true
        );
        limpiarResultados();
        campoNombre.focus();
        return;
    }

    activarCarga(true);
    limpiarResultados();
    mostrarMensaje(
        "Buscando personajes…"
    );

    try {
        const {
            total,
            personajes
        } = await buscarPersonajes(
            nombre,
            estado,
            especie
        );

        // Caso sin resultados.
        if (
            personajes.length === 0
        ) {
            mostrarMensaje(
                "No se encontraron personajes con los filtros seleccionados. Prueba con otro nombre, estado o especie"
            );
            limpiarResultados();
            return;
        }
        mostrarPersonajes(
            personajes
        );
        mostrarContador(
            total,
            personajes.length
        );
        mostrarMensaje(
            "Búsqueda completada."
        );

    } catch (error) {
        console.error(
            "Error al buscar personajes:",
            error
        );
        limpiarResultados();


        // fetch produce normalmente un TypeError
        // cuando existe un problema de conexión.
        if (
            error instanceof TypeError
        ) {

            mostrarMensaje(
                "No se pudo conectar con la API. Revisa tu conexión e inténtalo de nuevo.",
                true
            );

        } else {

            mostrarMensaje(
                `Ocurrió un problema al consultar la API (${error.message}).`,
                true
            );

        }

    } finally {

        // Siempre vuelve a habilitar el botón.

        activarCarga(false);

    }
};


// ---------- 15. Registro del evento ----------
formularioBusqueda.addEventListener(
    "submit",
    manejarBusqueda
);