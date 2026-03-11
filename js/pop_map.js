mapboxgl.accessToken =
            'pk.eyJ1IjoidHJhbGVlMTAiLCJhIjoiY202cmp6MTd5MjNrMDJpcHY4N3JtZDFuNCJ9.FDnd5ftof56RdHpFHNsjxQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    zoom: 11,
    center: [-122.335167, 47.608013]
});

async function geojsonFetch() {
    let response = await fetch('assets/2010_pop_tract.geojson');
    let pop_data = await response.json();

    map.on('load', function loadingData() {
        map.addSource('pop_data', {
            type: 'geojson',
            data: pop_data
        });

        map.addLayer({
            'id': 'pop_data_layer',
            'type': 'fill',
            'source': 'pop_data',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'Total_Population'],
                    '#FFF5F0',
                    1000,
                    '#FEE0D2',
                    2000,
                    '#FCBBA1',
                    3000    ,
                    '#FC9272',
                    4000,
                    '#FB6A4A',
                    5000,
                    '#EF3B2C',
                    6000,
                    '#CB181D',
                    7000,
                    "#A50F15",
                    10000,
                    '#67000D'
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });

        const layers = [
            '0-1,000',
            '1,000-1,999',
            '2,000-2,999',
            '3,000-3,999',
            '4,000-4,999',
            '5,000-5,999',
            '6,000-6,999',
            '7,000-7,999',
            '8,000+'
        ];
        const colors = [
            '#FFF5F0',
            '#FEE0D2',
            '#FCBBA1',
            '#FC9272',
            '#FB6A4A',
            '#EF3B2C',
            '#CB181D',
            '#A50F15',
            '#67000D'
        ];

        const legend = document.getElementById('legend');
        legend.innerHTML = "<b>Seattle 2010 Population by Census Tract</b><br>";


        layers.forEach((layer, i) => {
            const color = colors[i];
            const item = document.createElement('div');
            const key = document.createElement('span');
            key.className = 'legend-key';
            key.style.backgroundColor = color;

            const value = document.createElement('span');
            value.innerHTML = `${layer}`;
            item.appendChild(key);
            item.appendChild(value);
            legend.appendChild(item);
        });
    });

    map.on('click', 'permit-symbols', e => {

    const props = e.features[0].properties;

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
                <strong>Tract:</strong> ${props["TRACT"]}<br>
                <strong>Population:</strong> ${props["Total_Population"]}<br>
            `)
        .addTo(map);
    });
    updateDashboard(data.features);
}

geojsonFetch();