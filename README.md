# Buscador de personajes de Rick and Morty

Aplicación web que permite consultar personajes de la serie Rick and Morty utilizando su API pública. Facilita la búsqueda por nombre y el filtrado por estado y especie.

**Autor:** Dario Diaz  
**Asignatura:** Fundamentos de Desarrollo Web  
**Institución:** UCSA  
**Variante del TP:** B — Filtro por especie

## Sitios publicados

- **Repositorio GitHub:** https://github.com/Diaz-07ods/tp-diaz-dario
- **GitHub Pages:** Pendiente de publicación
- **Vercel:** Pendiente de publicación

## Captura

Pendiente de incorporar una captura de la aplicación publicada.

## Funcionalidades

- Consultar personajes mediante la API pública de Rick and Morty
- Buscar personajes por nombre
- Filtrar personajes por estado: vivo, muerto o desconocido
- Filtrar personajes por especie (Variante B)
- Mostrar los resultados obtenidos de la API
- Presentar información de los personajes en español

## Tecnologías

- HTML5: estructura de la página
- CSS3: diseño y presentación visual
- JavaScript (ES6+): lógica de la aplicación
- Fetch API: consultas HTTP
- API pública de Rick and Morty: fuente de información
- Git y GitHub: control de versiones
- GitHub Pages y Vercel: publicación web

## Estructura del proyecto
```text
tp-diaz-dario/
├── index.html
├── README.md
├── .gitignore
├── css/
│   └── estilos.css
├── js/
│   └── app.js
├── datos/
│   └── respaldo-personajes.json
└── evidencias/
    ├── 01-resultados.png
    ├── 02-network.png
    └── 03-network.png
```

**Descripción de los archivos principales:**
- `index.html`: estructura de la aplicación
- `css/estilos.css`: estilos visuales
- `js/app.js`: consultas a la API y gestión de resultados
- `datos/respaldo-personajes.json`: archivo de datos de respaldo
- `.gitignore`: archivos excluidos del control de versiones
- `README.md`: documentación técnica

## Cómo ejecutarlo localmente
1. Clonar el repositorio:

   `git clone https://github.com/Diaz-07ods/tp-diaz-dario.git`

2. Abrir la carpeta descargada en Visual Studio Code
3. Abrir `index.html` utilizando Live Server
4. Realizar búsquedas de personajes desde el navegador
La aplicación necesita conexión a Internet para consultar la API

## Despliegue
La aplicación se publicará mediante GitHub Pages y Vercel utilizando la rama `main`
Los cambios se registrarán mediante commits y se enviarán al repositorio con `git push`
Ambas plataformas estarán configuradas para actualizar automáticamente el sitio cuando se publiquen cambios en `main`
Se utilizará un número de versión visible en el pie de página para comprobar el despliegue continuo