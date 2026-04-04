/**
 * MAP-SCRIPT.JS 
 * Ez a fájl kezeli a térkép megjelenítését és a markerek (jelölők) elhelyezését.
 */

// 1. Térkép inicializálása
// [47.5, 18.5] - Magyarország környéki kezdőpont, 5-ös zoom szinttel
const map = L.map('map').setView([47.5, 18.5], 5); 

// 2. Térkép kinézetének beállítása (CartoDB Voyager - megbízható és szép)
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// 3. Automatikus jelölő generálás a database objektumból
// Fontos: A map.html-ben a script.js-nek hamarabb kell betöltődnie, mint ennek!
if (typeof database !== 'undefined') {
    Object.keys(database).forEach(key => {
        const item = database[key];

        // Ellenőrizzük, hogy vannak-e koordináták megadva az adott elemhez
        if (item.coords && Array.isArray(item.coords)) {
            const marker = L.marker(item.coords).addTo(map);
            
            // Kép kiválasztása a popup-hoz (vagy a galéria első képe, vagy a sima kép)
            let popupImage = "";
            if (item.images && item.images.length > 0) {
                popupImage = item.images[0];
            } else if (item.image) {
                popupImage = item.image;
            }

            // Popup (felugró ablak) tartalom összeállítása
            const popupContent = `
                <div style="text-align:center; min-width: 150px;">
                    <strong style="color:#8e0e0e; font-size: 1.2em; font-family: 'Georgia', serif;">
                        ${item.title}
                    </strong><br>
                    ${popupImage ? `<img src="${popupImage}" alt="${item.title}" style="width:100%; max-width:140px; margin-top:8px; border-radius:3px; border: 1px solid #ccc;">` : ''}
                    <br>
                    <a href="result.html?id=${encodeURIComponent(key)}" 
                       style="color:#8e0e0e; font-style:italic; font-weight:bold; text-decoration:none; display:inline-block; margin-top:8px; font-family: 'Georgia', serif;">
                        Megnézem az emléket →
                    </a>
                </div>
            `;
            
            marker.bindPopup(popupContent);
        }
    });
} else {
    console.error("Hiba: A 'database' objektum nem található. Ellenőrizd a script.js betöltését!");
}

// 4. Egy kis extra: Ha rákattintasz a térképre, kiírja a koordinátákat a konzolra 
// Ez segít neked az új helyszínek pontos belövésében (F12 -> Console)
map.on('click', function(e) {
    console.log("Kattintott koordináta: [" + e.latlng.lat.toFixed(4) + ", " + e.latlng.lng.toFixed(4) + "]");
});