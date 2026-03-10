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
    <strong>Development Status</strong>
<p>
<i class="dot" style="background:#4DA3FF; width:12px; height:12px;"></i>
Permit Issued
</p>

<p>
<i class="dot" style="background:#FF6B6B; width:12px; height:12px;"></i>
Construction Completed
</p>

<br>

<strong>Net Units Permitted</strong>

<p>
<i class="dot" style="background:#999; width:8px; height:8px;"></i>
Small Development
</p>

<p>
<i class="dot" style="background:#999; width:16px; height:16px;"></i>
Medium Development
</p>

<p>
<i class="dot" style="background:#999; width:24px; height:24px;"></i>
Large Development
</p>
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


        // Time Slider (Year Finalized)
        map.addLayer({
            id: 'finaled-symbols',
            type: 'circle',
            source: 'tracts',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['sqrt', ['get', 'Net Units Permitted']],
                    0, 0,
                    50, 5,
                    100, 10,
                    200, 20,
                    300, 30
                ],
                'circle-color': '#FF6B6B',
                'circle-opacity': 0.75,
                'circle-stroke-width': 1,
                'circle-stroke-color': 'white'
            }
        });

        
        // Time Slider (Year Issued)
        map.addLayer({
            id: 'permit-symbols',
            type: 'circle',
            source: 'tracts',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['sqrt', ['get', 'Net Units Permitted']],
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
        map.on('click', 'permit-symbols', e => {

            const props = e.features[0].properties;

            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`
                    <strong>Permit Type:</strong> ${props["Type of Permit"]}<br>
                    <strong>Dwelling Type:</strong> ${props["Type of Dwelling Unit per Code"]}<br>
                    <strong>New Units:</strong> ${props["New Units Permitted"]}<br>
                    <strong>Net Units:</strong> ${props["Net Units Permitted"]}<br>
                    <strong>Neighborhood:</strong> ${props["Neighborhood"]}<br>
                    <strong>Urban Village:</strong> ${props["Urban Village Name"]}<br>
                    <strong>Council District:</strong> ${props["Council District"]}<br>
                    <strong>Year Issued:</strong> ${props["Year Issued"]}
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


// Time Slider Logic (Year Issued)

const slider = document.getElementById('year-slider');
const yearLabel = document.getElementById('year-label');

slider.addEventListener('input', (e) => {

    const year = parseInt(e.target.value);
    yearLabel.textContent = year;

    map.setFilter('permit-symbols', [
        '==',
        ['get', 'Year Issued'],
        year
    ]);

});

// Time Slider Logic (Year Finaled)
const finaledSlider = document.getElementById('finaled-slider');
const finaledLabel = document.getElementById('finaled-label');

finaledSlider.addEventListener('input', (e) => {

    const year = parseInt(e.target.value);
    finaledLabel.textContent = year;

    map.setFilter('finaled-symbols', [
        '==',
        ['get', 'Year Finaled'],
        year
    ]);

});
