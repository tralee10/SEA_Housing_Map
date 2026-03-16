mapboxgl.accessToken = 'pk.eyJ1IjoidHJhbGVlMTAiLCJhIjoiY202cmp6MTd5MjNrMDJpcHY4N3JtZDFuNCJ9.FDnd5ftof56RdHpFHNsjxQ'; 

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 11,
    center: [-122.335167, 47.608013]
});

map.addControl(new mapboxgl.NavigationControl({showCompass: false}), 'top-right');


// ---------------- CHART SETUP ----------------

let chart;
let geojsonData = null;

function createChart(){
    const ctx = document.getElementById('unitsChart');

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'New Units Built',
                data: [],
                backgroundColor: '#f3a515',
                borderColor: '#bb7c08',
                borderWidth: 1,
                borderRadius: 1,
                barThickness: 10
            }]
        },
        options: {
            indexAxis: 'y',
            responsive:true,
            animation:{
                duration:600
            },

            plugins:{
                legend:{
                    display:false
                },
                tooltip:{
                    callbacks:{
                        label:(context)=>{
                            return context.raw.toLocaleString() + " units";
                        }
                    }
                }
            },

            scales:{
                x:{
                    title:{
                        display:true,
                        color: 'white', 
                        text:'New Housing Units'
                    },
                    ticks:{
                        color: 'white'
                    },
                    grid:{
                        color:'#eee'
                    }
                },
                y:{
                    ticks:{
                        color: 'white'
                    },
                    grid:{
                        display:false
                    }
                }
            }

        }
    });

}


function updateChart(){

    if(!geojsonData || !chart) return;

    const totals = {};

    geojsonData.features.forEach(f=>{

        const p = f.properties;

        if(filters.dwelling !== "All" && p["Type of Dwelling Unit per Code"] !== filters.dwelling) return;
        if(filters.permit !== "All" && p["Type of Permit"] !== filters.permit) return;
        if(filters.neighborhood !== "All" && p["Neighborhood"] !== filters.neighborhood) return;
        if(filters.village !== "All" && p["Urban Village Name"] !== filters.village) return;

        if(filters.yearIssued !== null && p["Year Issued"] != filters.yearIssued) return;
        if(filters.yearFinaled !== null && p["Year Finaled"] != filters.yearFinaled) return;

        let group = p["Neighborhood"];

        if(filters.village !== "All"){
            group = p["Urban Village Name"];
        }

        const units = parseInt(p["New Units Permitted"]) || 0;

        if(!totals[group]) totals[group] = 0;

        totals[group] += units;

    });

    const sorted = Object.entries(totals)
        .sort((a,b)=>b[1]-a[1])
        .slice(0,10);

    const labels = sorted.map(d=>d[0]);
    const values = sorted.map(d=>d[1]);

    chart.data.labels = labels;
    chart.data.datasets[0].data = values;

    chart.update();

}



// ---------------- LEGEND ----------------

const legend = document.getElementById('legend');

function showDotLegend(){

    legend.innerHTML = `
    <strong>Development Status</strong>

    <p><i class="dot" style="background:#4DA3FF; width:12px; height:12px;"></i>Permit Issued</p>
    <p><i class="dot" style="background:#FF6B6B; width:12px; height:12px;"></i>Permit Finalized</p>

    <br>

    <strong>Net Units Permitted</strong>

    <p><i class="dot" style="background:#999; width:8px; height:8px;"></i>Small Development</p>
    <p><i class="dot" style="background:#999; width:16px; height:16px;"></i>Medium Development</p>
    <p><i class="dot" style="background:#999; width:24px; height:24px;"></i>Large Development</p>
    `;
}

function showHeatLegend(){

    legend.innerHTML = `
    <div class="legend-title">Housing Development Density</div>

    <div class="legend-subtitle">Permit Issued (Blue)</div>
    <div class="legend-gradient gradient-blue"></div>

    <div class="legend-subtitle">Permit Finalized (Red)</div>
    <div class="legend-gradient gradient-red"></div>

    <div class="legend-scale">Low → High Density</div>
    `;
}

showDotLegend();

// ---------------- FILTER STATE ----------------

let filters = {
    dwelling: "All",
    permit: "All",
    neighborhood: "All",
    village: "All",
    yearIssued: null,
    yearFinaled: null
};


// ---------------- APPLY FILTERS ----------------
function applyFilters() {
    const permitFilters = ['all'];
    const finaledFilters = ['all'];

    if (filters.dwelling !== "All") {
        permitFilters.push(['==', ['get', 'Type of Dwelling Unit per Code'], filters.dwelling]);
        finaledFilters.push(['==', ['get', 'Type of Dwelling Unit per Code'], filters.dwelling]);
    }

    if (filters.permit !== "All") {
        permitFilters.push(['==', ['get', 'Type of Permit'], filters.permit]);
        finaledFilters.push(['==', ['get', 'Type of Permit'], filters.permit]);
    }

    if (filters.neighborhood !== "All") {
        permitFilters.push(['==', ['get', 'Neighborhood'], filters.neighborhood]);
        finaledFilters.push(['==', ['get', 'Neighborhood'], filters.neighborhood]);
    }

    if (filters.village !== "All") {
        permitFilters.push(['==', ['get', 'Urban Village Name'], filters.village]);
        finaledFilters.push(['==', ['get', 'Urban Village Name'], filters.village]);
    }

    if (filters.yearIssued !== null) {
        permitFilters.push(['==', ['get', 'Year Issued'], filters.yearIssued]);
    }

    if (filters.yearFinaled !== null) {
        finaledFilters.push(['==', ['get', 'Year Finaled'], filters.yearFinaled]);
    }

    map.setFilter('permit-symbols', permitFilters.length > 1 ? permitFilters : null);
    map.setFilter('finaled-symbols', finaledFilters.length > 1 ? finaledFilters : null);

    map.setFilter('permit-heat', permitFilters.length > 1 ? permitFilters : null);
    map.setFilter('finaled-heat', finaledFilters.length > 1 ? finaledFilters : null);

    map.setPaintProperty('permit-heat','heatmap-opacity',0.85);

    updateChart;
}

// ---------------- LOAD POPULATION DATA ----------------

async function loadPop() {
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
                    '#f0fff1',
                    1500,
                    '#94c58c',
                    3000,
                    '#64ad62',
                    4500    ,
                    '#429b46',
                    6000,
                    '#1a8828',
                    7500,
                    "#0a6921",
                    10000,
                    '#094f29'
                ],
                'fill-outline-color': '#ffffff',
                'fill-opacity': 0.7,
            }
        });

        const layers = [
            '0-1,500',
            '1,500-2,999',
            '3,000-4,499',
            '4,500-5,999',
            '6,000-7,499',
            '7,500+'
        ];
        const colors = [
            '#f0fff1',
            '#94c58c',
            '#64ad62',
            '#429b46',
            '#1a8828',
            '#0a6921'
        ];

        const legend = document.getElementById('pop-legend');
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

    map.on('click', 'pop_data_layer', e => {

    const props = e.features[0].properties;

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
                <strong>Tract:</strong> ${props["TRACT"]}<br>
                <strong>Population:</strong> ${props["Total_Population"]}<br>
            `)
        .addTo(map);
    });
}

loadPop();

// ---------------- LOAD PERMIT DATA ----------------

async function loadData() {

    const response = await fetch('assets/built_units.geojson');
    const data = await response.json();

    geojsonData = data;

    map.on('load', () => {

        map.addSource('tracts', {
            type: 'geojson',
            data: data
        });

        map.addLayer({
            id: 'tract-fill',
            type: 'fill',
            source: 'tracts',
            paint: { 'fill-color': 'transparent' }
        });

        map.addLayer({
            id: 'finaled-symbols',
            type: 'circle',
            source: 'tracts',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['sqrt',['get','Net Units Permitted']],
                    0,1,
                    50,20,
                    100,15,
                    200,10,
                    300,5
                ],
                'circle-color':'#FF6B6B',
                'circle-opacity':0.75,
                'circle-stroke-width':1,
                'circle-stroke-color':'white'
            }
        });

        map.addLayer({
            id:'permit-symbols',
            type:'circle',
            source:'tracts',
            paint:{
                'circle-radius':[
                    'interpolate',
                    ['linear'],
                    ['sqrt',['get','Net Units Permitted']],
                    0,1,
                    50,20,
                    100,15,
                    200,10,
                    300,5
                ],
                'circle-color':'#4DA3FF',
                'circle-opacity':0.75,
                'circle-stroke-width':1,
                'circle-stroke-color':'white'
            }
        });

        map.addLayer({
            id: 'finaled-heat',
            type: 'heatmap',
            source: 'tracts',
            maxzoom: 15,
            paint: {
                'heatmap-weight': [
                    'interpolate',
                    ['linear'],
                    ['get','Net Units Permitted'],
                    0,0,
                    17,1
                ],
                'heatmap-intensity': 1,
                'heatmap-radius': 25,
                'heatmap-opacity': 0.8,
                'heatmap-color': [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0,'rgba(255,0,0,0)',
                    0.2,'#FF6B6B',
                    0.4,'#ff4d4d',
                    0.6,'#ff1a1a',
                    0.8,'#cc0000',
                    1,'#800000'
                ]
            },
            layout:{visibility:'none'}
        });

        map.addLayer({
            id: 'permit-heat',
            type: 'heatmap',
            source: 'tracts',
            maxzoom: 15,
            paint: {
                'heatmap-weight': [
                    'interpolate',
                    ['linear'],
                    ['get','Net Units Permitted'],
                    0,0,
                    17,1
                ],
                'heatmap-intensity': 1,
                'heatmap-radius': 25,
                'heatmap-opacity': 0.8,
                'heatmap-color': [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0,'rgba(0,0,255,0)',
                    0.2,'#4DA3FF',
                    0.4,'#1f78ff',
                    0.6,'#0066ff',
                    0.8,'#0044cc',
                    1,'#0033cc'
                ]
            },
            layout:{visibility:'none'}
        });

        // --------- Pointer ----------------
        
        map.on('mouseenter', 'permit-symbols', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'permit-symbols', () => {
            map.getCanvas().style.cursor = '';
        });

        map.on('mouseenter', 'finaled-symbols', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'finaled-symbols', () => {
            map.getCanvas().style.cursor = '';
        });



        // ---------------- POPUPS ON CLICK----------------

        map.on('click', 'permit-symbols', (e) => {

            const props = e.features[0].properties;

            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`
                    <strong>Permit Type:</strong> ${props["Type of Permit"]}<br>
                    <strong>Dwelling Type:</strong> ${props["Type of Dwelling Unit per Code"]}<br>
                    <strong>Neighborhood:</strong> ${props["Neighborhood"]}<br>
                    <strong>Urban Village:</strong> ${props["Urban Village Name"]}<br>
                    <strong>New Units:</strong> ${props["New Units Permitted"]}<br>
                    <strong>Net Units:</strong> ${props["Net Units Permitted"]}<br>
                    <strong>Council District:</strong> ${props["Council District"]}<br>
                    <strong>Year Issued:</strong> ${props["Year Issued"]}<br>
                    <strong>Year Completed:</strong> ${props["Year Finaled"]}
                `)
                .addTo(map);

        });


        map.on('click', 'finaled-symbols', (e) => {

            const props = e.features[0].properties;

            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`
                    <strong>Permit Type:</strong> ${props["Type of Permit"]}<br>
                    <strong>Dwelling Type:</strong> ${props["Type of Dwelling Unit per Code"]}<br>
                    <strong>Neighborhood:</strong> ${props["Neighborhood"]}<br>
                    <strong>Urban Village:</strong> ${props["Urban Village Name"]}<br>
                    <strong>New Units:</strong> ${props["New Units Permitted"]}<br>
                    <strong>Net Units:</strong> ${props["Net Units Permitted"]}<br>
                    <strong>Council District:</strong> ${props["Council District"]}<br>
                    <strong>Year Issued:</strong> ${props["Year Issued"]}<br>
                    <strong>Year Completed:</strong> ${props["Year Finaled"]}
                `)
                .addTo(map);

        });

                createChart();
        updateChart();

    });

}

loadData();



// ---------------- RESET MAP BUTTON ----------------

const reset = document.getElementById('reset');

reset.addEventListener('click', () => {

    map.flyTo({
        zoom: 11,
        center: [-122.335167, 47.608013]
    });

    filters = {
        dwelling: "All",
        permit: "All",
        neighborhood: "All",
        village: "All",
        yearIssued: 2010,
        yearFinaled: 2010
    };

    const issuedSlider = document.getElementById('year-slider');
    const issuedLabel = document.getElementById('year-label');
    issuedSlider.value = 2010;
    issuedLabel.textContent = 2010;

    const finaledSlider = document.getElementById('finaled-slider');
    const finaledLabel = document.getElementById('finaled-label');
    finaledSlider.value = 2010;
    finaledLabel.textContent = 2010;

    document.getElementById('dwelling-filter').value = "All";
    document.getElementById('permit-filter').value = "All";
    document.getElementById('neigh-filter').value = "All";
    document.getElementById('village-filter').value = "All";

    applyFilters();
});

// -------------- HeatMap Button -------------------------

let heatOn = false;

const toggleBtn = document.getElementById("heat-toggle");

toggleBtn.addEventListener("click", () => {

    heatOn = !heatOn;

    if(heatOn){

        map.setLayoutProperty('permit-symbols','visibility','none');
        map.setLayoutProperty('finaled-symbols','visibility','none');

        map.setLayoutProperty('permit-heat','visibility','visible');
        map.setLayoutProperty('finaled-heat','visibility','visible');

        toggleBtn.textContent = " Switch to Proportional Symbols Map";

        showHeatLegend();

    } else {

        map.setLayoutProperty('permit-symbols','visibility','visible');
        map.setLayoutProperty('finaled-symbols','visibility','visible');

        map.setLayoutProperty('permit-heat','visibility','none');
        map.setLayoutProperty('finaled-heat','visibility','none');

        toggleBtn.textContent = "Switch to Heatmap";

        showDotLegend();

    }

});



// ---------------- SLIDERS ----------------

const issuedSlider = document.getElementById('year-slider');
const issuedLabel = document.getElementById('year-label');

issuedSlider.addEventListener('input',(e)=>{

    filters.yearIssued = parseInt(e.target.value);
    issuedLabel.textContent = filters.yearIssued;

    applyFilters();

});

const finaledSlider = document.getElementById('finaled-slider');
const finaledLabel = document.getElementById('finaled-label');

finaledSlider.addEventListener('input',(e)=>{

    filters.yearFinaled = parseInt(e.target.value);
    finaledLabel.textContent = filters.yearFinaled;

    applyFilters();

});


// ---------------- DROPDOWNS ----------------

document.getElementById('dwelling-filter').addEventListener('change',(e)=>{
    filters.dwelling = e.target.value;
    applyFilters();
});

document.getElementById('permit-filter').addEventListener('change',(e)=>{
    filters.permit = e.target.value;
    applyFilters();
});

document.getElementById('neigh-filter').addEventListener('change',(e)=>{
    filters.neighborhood = e.target.value;
    applyFilters();
});

document.getElementById('village-filter').addEventListener('change',(e)=>{
    filters.village = e.target.value;
    applyFilters();
});