/** @typedef {import('leaflet')} */ // 

let map;
let recorridoLinea; 
let watchId = null; 
let contadorPosiciones = 1;

function inicializarMapa() {
    map = L.map('mapa').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    recorridoLinea = L.polyline([], { color: 'red', weight: 4 }).addTo(map);
}

function iniciarSegui() {
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(regPos, errorGeo, {
            enableHighAccuracy: true
        });
    } else {
        alert("Tu navegador no soporta geolocalización.");
    }
}

function regPos(posicion) {
    let lat = posicion.coords.latitude;
    let lon = posicion.coords.longitude;
    let latLng = [lat, lon];

    map.setView(latLng, 16); 
    recorridoLinea.addLatLng(latLng);

    let lista = document.getElementById('lista-historial');
    let nuevoElemento = document.createElement('li');
    nuevoElemento.className = 'list-group-item';
    nuevoElemento.textContent = `${contadorPosiciones}- Lat: ${lat.toFixed(5)}, Lng: ${lon.toFixed(5)}`;
    lista.appendChild(nuevoElemento);

    // Api History:
    let estado = { latitud: lat, longitud: lon, id: contadorPosiciones };
    window.history.pushState(estado, `Posición ${contadorPosiciones}`, `#punto-${contadorPosiciones}`);

    contadorPosiciones++;
}

function pararSegui() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null; 
    }
}

function limpiaHisto() {
    pararSegui();

    recorridoLinea.setLatLngs([]);
    
    document.getElementById('lista-historial').innerHTML = '';
    contadorPosiciones = 1;
}

function errorGeo(error) {
    console.error(`Error de ubicación: ${error.message}`);
}

window.onload = inicializarMapa;