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
    }, 3000);// 3 second pause so the user sees SFO first

    map.once('moveend', () => {
        // Find the button and make it appear
        const btn = document.getElementById('next-leg-btn');
        btn.style.display = 'block'; 
        
        // Optional: Add a nice fade-in effect if you want to get fancy
        btn.style.opacity = '0';
        btn.style.transition = 'opacity 1s';
        setTimeout(() => btn.style.opacity = '1', 10);
    }); 
});
// <><><><><><><><><><><><><><><><><> Button to trigger the next part of the trip <><><><><><><><><><><>><><><><\\
// <><><><><><><><><><><><><><><><><> THE GRAND TOUR LOGIC <><><><><><><><><><><>><><><><\\

// 1. Define the full list of stops
const itinerary = [
    { name: 'Paris', coords: [2.3553, 48.8818], btnText: 'Train to Amsterdam' },
    { name: 'Amsterdam', coords: [4.9041, 52.3676], btnText: 'Train to Berlin' },
    { name: 'Berlin', coords: [13.4050, 52.5200], btnText: 'Train to Prague' },
    { name: 'Prague', coords: [14.4378, 50.0755], btnText: 'Train to Vienna' },
    { name: 'Vienna', coords: [16.3738, 48.2082], btnText: 'Train to Munich' },
    { name: 'Munich', coords: [11.5820, 48.1351], btnText: 'Train to Zurich' },
    { name: 'Zurich', coords: [8.5417, 47.3769], btnText: 'Train to Rome' },
    { name: 'Rome', coords: [12.4964, 41.9028], btnText: 'Train to Florence' },
    { name: 'Florence', coords: [11.2558, 43.7696], btnText: 'Train to Milan' },
    { name: 'Milan', coords: [9.1900, 45.4642], btnText: 'Train to Barcelona' },
    { name: 'Barcelona', coords: [2.1734, 41.3851], btnText: 'Train to Madrid' },
    { name: 'Madrid', coords: [-3.7038, 40.4168], btnText: 'Fly home to SFO' },
    { name: 'SFO', coords: [-122.3816, 37.6191], btnText: 'Home Sweet Home!' }
];

let currentLeg = 0;
const btn = document.getElementById('next-leg-btn');

btn.addEventListener('click', () => {
    // If we've reached the end of the list, stop
    if (currentLeg >= itinerary.length) return;

    const destination = itinerary[currentLeg];
    
    // Determine where the orange line starts: 
    // If it's the first click, start at Heathrow. Otherwise, start at the last city.
    const startCoords = currentLeg === 0 ? [-0.4550, 51.4700] : itinerary[currentLeg - 1].coords;

    // 2. Update the orange line on the map
    map.getSource('backpacking-route').setData({
        'type': 'Feature',
        'geometry': {
            'type': 'LineString',
            'coordinates': [startCoords, destination.coords]
        }
    });

    // 3. Fly to the destination with a cool tilted view
    map.flyTo({
        center: destination.coords,
        zoom: 12,
        pitch: 60,
        bearing: currentLeg * 10, // Slightly rotate the camera for each city!
        speed: 0.6,
        essential: true
    });

    // 4. Update the button for the NEXT stop
    btn.innerText = destination.btnText;
    currentLeg++;

    // If it's the last stop, turn the button green
    if (destination.name === 'SFO') {
        btn.style.backgroundColor = '#2ecc71';
    }
});