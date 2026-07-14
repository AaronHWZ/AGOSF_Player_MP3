const buscadorMusica = document.getElementById('buscador-musica');
const reproductor = document.getElementById('reproductor');
const contenedor = document.getElementById('reproductor-contenedor');
const estadoCancion = document.getElementById('estado-cancion');
const playlistContainer = document.getElementById('playlist-container');
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');

let playlist = [];
let indiceActual = -1;

menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

buscadorMusica.addEventListener('change', function(evento) {
    const archivos = Array.from(evento.target.files);
    
    archivos.forEach(archivo => {
        const existe = playlist.some(item => item.nombre === archivo.name);
        if (!existe) {
            const urlTemporal = URL.createObjectURL(archivo);
            playlist.push({
                nombre: archivo.name,
                url: urlTemporal
            });
        }
    });

    actualizarPlaylistUI();

    if (playlist.length > 0 && indiceActual === -1) {
        reproducirCancion(0);
    }
});

function actualizarPlaylistUI() {
    playlistContainer.innerHTML = '';
    
    playlist.forEach((cancion, indice) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        if (indice === indiceActual) {
            item.classList.add('active');
        }

        const titulo = document.createElement('span');
        titulo.className = 'song-title';
        titulo.textContent = cancion.nombre;
        titulo.addEventListener('click', () => {
            reproducirCancion(indice);
        });

        const btnBorrar = document.createElement('button');
        btnBorrar.className = 'remove-btn';
        btnBorrar.textContent = '×';
        btnBorrar.addEventListener('click', (e) => {
            e.stopPropagation();
            eliminarCancion(indice);
        });

        item.appendChild(titulo);
        item.appendChild(btnBorrar);
        playlistContainer.appendChild(item);
    });
}

function reproducirCancion(indice) {
    if (indice < 0 || indice >= playlist.length) return;
    
    indiceActual = indice;
    reproductor.src = playlist[indiceActual].url;
    estadoCancion.textContent = "Sonando: " + playlist[indiceActual].nombre;
    reproductor.play();
    
    actualizarPlaylistUI();
}

function eliminarCancion(indice) {
    URL.revokeObjectURL(playlist[indice].url);
    playlist.splice(indice, 1);

    if (indice === indiceActual) {
        reproductor.pause();
        reproductor.src = '';
        estadoCancion.textContent = "Sube canciones a tu playlist";
        indiceActual = -1;
    } else if (indice < indiceActual) {
        indiceActual--;
    }

    actualizarPlaylistUI();
}

reproductor.addEventListener('ended', function() {
    if (indiceActual + 1 < playlist.length) {
        reproducirCancion(indiceActual + 1);
    } else {
        reproducirCancion(0);
    }
});

reproductor.addEventListener('play', function() {
    contenedor.classList.add('reproduciendo');
});

reproductor.addEventListener('pause', function() {
    contenedor.classList.remove('reproduciendo');
});
