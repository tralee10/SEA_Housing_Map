mapboxgl.accessToken = 'pk.eyJ1IjoidHJhbGVlMTAiLCJhIjoiY202cmp6MTd5MjNrMDJpcHY4N3JtZDFuNCJ9.FDnd5ftof56RdHpFHNsjxQ';

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    zoom: 11,
    center: [-122.335167, 47.608013] // Seattle
});

// Legend
const legend = document.getElementById('legend');
legend.innerHTML = `
    <strong>Population 2025</strong>
    <p><i class="dot" style="background:#4DA3FF; width:8px; height:8px;"></i> Small Population</p>
    <p><i class="dot" style="background:#4DA3FF; width:16px; height:16px;"></i> Medium Population</p>
    <p><i class="dot" style="background:#4DA3FF; width:24px; height:24px;"></i> Large Population</p>
`;

async function loadData() {

    const response = await fetch('assets/built_units.geojson');
    const data = await response.json();

    map.on('load', () => {

        map.addSource('tracts', {
            type: 'geojson',
            data: data
        });

        // Optional transparent fill layer (keeps polygon hover working nicely)
        map.addLayer({
            id: 'tract-fill',
            type: 'fill',
            source: 'tracts',
            paint: {
                'fill-color': 'transparent'
            }
        });

        // Proportional Symbols Layer
        map.addLayer({
            id: 'population-symbols',
            type: 'circle',
            source: 'tracts',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['sqrt', ['get', 'Population 2025']],
                    0, 0,
                    50, 5,
                    100, 10,
                    200, 20,
                    300, 30
                ],
                'circle-color': '#4DA3FF',
                'circle-opacity': 0.75,
                'circle-stroke-width': 1,
                'circle-stroke-color': 'white'
            }
        });

        // Popup
        map.on('click', 'population-symbols', e => {

            const props = e.features[0].properties;

            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`
                    <strong>GEOID:</strong> ${props.GEOID}<br>
                    <strong>Population 2025:</strong> ${props["Population 2010"]}<br>
                    <strong>Housing Units 2025:</strong> ${props["Housing Units 2025"]}<br>
                    <strong>Population Density:</strong> ${props["Population Density (people per acre for most recent year)"]}<br>
                    <strong>Housing Unit Density:</strong> ${props["Housing Unit Density (units per acre for most recent year)"]}<br>
                    <strong>New Units Permitted:</strong> ${props["New Units Permitted"]}
                `)
                .addTo(map);
        });

        updateDashboard(data.features);
    });

    // Update dashboard when map moves
    map.on('moveend', () => {
        const bounds = map.getBounds();
        const visible = data.features.filter(f => {
            const coords = f.geometry.type === "Point"
                ? f.geometry.coordinates
                : turf.centroid(f).geometry.coordinates;

            return bounds.contains(coords);
        });

        updateDashboard(visible);
    });
}


// Reset button
const reset = document.getElementById('reset');
reset.addEventListener('click', () => {
    map.flyTo({
        zoom: 11,
        center: [-122.335167, 47.608013]
    });
});

loadData();
