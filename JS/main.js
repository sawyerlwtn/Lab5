mapboxgl.accessToken = 'pk.eyJ1Ijoic2F3eWVybHd0biIsImEiOiJjbWxmaTIxcGMwMjNxM2xwdjV6dGhhNzY5In0.-e2Om8U7uw6E8aXJk-gSpA';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/sawyerlwtn/cmlfiijn7001901sr702o44bo',
    projection: 'globe',
    center: [-122.3816, 37.6191], // Start exactly at SFO
    zoom: 14,                     // Start at Street Level
    pitch: 60                     // Start tilted
});

map.on('load', () => {
    // Add your line data
    map.addSource('backpacking-route', {
        type: 'geojson',
        data: {
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': [
                    [-122.3816, 37.6191], // SFO
                    [-0.4550, 51.4700]    // Heathrow
                ]
            }
        }
    });

    map.addLayer({
        'id': 'route-line',
        'type': 'line',
        'source': 'backpacking-route',
        'paint': {
            'line-color': '#ff5500',
            'line-width': 4
        }
    });

    // The 'Ultimate' FlyTo
    setTimeout(() => {
        map.flyTo({
            center: [-0.4550, 51.4700], // Destination: Heathrow
            zoom: 14,                  // End at Street Level
            pitch: 60,
            speed: 0.15,               // Very slow to allow the globe to 'unfold'
            curve: 1.5,                // Higher number = higher 'arc' into space
            essential: true
        });
    }, 3000); // 3 second pause so the user sees SFO first
});