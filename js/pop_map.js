// mapboxgl.accessToken =
//             'pk.eyJ1IjoidHJhbGVlMTAiLCJhIjoiY202cmp6MTd5MjNrMDJpcHY4N3JtZDFuNCJ9.FDnd5ftof56RdHpFHNsjxQ';
// const map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/dark-v10',
//     zoom: 11,
//     center: [-122.335167, 47.608013]
// });

// async function loadPop() {
//     let response = await fetch('assets/2010_pop_tract.geojson');
//     let pop_data = await response.json();

//     map.on('load', function loadingData() {
//         map.addSource('pop_data', {
//             type: 'geojson',
//             data: pop_data
//         });

//         map.addLayer({
//             'id': 'pop_data_layer',
//             'type': 'fill',
//             'source': 'pop_data',
//             'paint': {
//                 'fill-color': [
//                     'step',
//                     ['get', 'Total_Population'],
//                     '#FFF5F0',
//                     1500,
//                     '#FCBBA1',
//                     3000,
//                     '#FC9272',
//                     4500    ,
//                     '#FB6A4A',
//                     6000,
//                     '#EF3B2C',
//                     7500,
//                     "#A50F15",
//                     10000,
//                     '#CB181D'
//                 ],
//                 'fill-outline-color': '#BBBBBB',
//                 'fill-opacity': 0.7,
//             }
//         });

//         const layers = [
//             '0-1,500',
//             '1,500-2,999',
//             '3,000-4,499',
//             '4,500-5,999',
//             '6,000-7,499',
//             '7,500+'
//         ];
//         const colors = [
//             '#FFF5F0',
//             '#FCBBA1',
//             '#FC9272',
//             '#FB6A4A',
//             '#EF3B2C',
//             '#A50F15'
//         ];

//         const legend = document.getElementById('pop-legend');
//         legend.innerHTML = "<b>Seattle 2010 Population by Census Tract</b><br>";


//         layers.forEach((layer, i) => {
//             const color = colors[i];
//             const item = document.createElement('div');
//             const key = document.createElement('span');
//             key.className = 'legend-key';
//             key.style.backgroundColor = color;

//             const value = document.createElement('span');
//             value.innerHTML = `${layer}`;
//             item.appendChild(key);
//             item.appendChild(value);
//             legend.appendChild(item);
//         });
//     });

//     map.on('click', 'pop_data_layer', e => {

//     const props = e.features[0].properties;

//         new mapboxgl.Popup()
//             .setLngLat(e.lngLat)
//             .setHTML(`
//                 <strong>Tract:</strong> ${props["TRACT"]}<br>
//                 <strong>Population:</strong> ${props["Total_Population"]}<br>
//             `)
//         .addTo(map);
//     });
//     updateDashboard(data.features);
// }

// loadPop();