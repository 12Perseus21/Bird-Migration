import Globe from 'https://esm.sh/globe.gl';
import * as THREE from 'https://esm.sh/three';

const arcs = [
  { name: "Crane", startLat: 48.776320, startLng: -108.360246, endLat: 33.392742, endLng: -102.032121, color: 'magenta', months: [8,9,10,3,4] },
  { name: "Crane", startLat: 51.977490, startLng: -93.419713, endLat: 34.859608, endLng: -112.666747, color: 'magenta', months: [8,9,10,3,4] },
  { name: "Eagle", startLat: 48.803961, startLng: 9.629311, endLat: 53.959159, endLng: 22.250249, color: 'cyan', months: [9,10,11,2,3] },
  { name: "Eagle", startLat: 25.762313, startLng: 83.175663, endLat: 28.509404, endLng: 96.802460, color: 'cyan', months: [9,10,11,2,3] },
  { name: "Goose", startLat: 53.654084, startLng: -7.070723, endLat: 64.570282, endLng: -17.823010, color: 'lime', months: [10,11,0,1,2] },
  { name: "Goose", startLat: 64.570282, startLng: -17.823010, endLat: 67.437727, endLng: -45.275332, color: 'lime', months: [10,11,0,1,2] },
  { name: "Warbler", startLat: 49.972591, startLng: -90.373420, endLat: 37.650520, endLng: -95.912134, color: 'yellow', months: [2,3,4,5] },
  { name: "Warbler", startLat: 48.158397, startLng: -107.266500, endLat: 28.380562, endLng: -97.850685, color: 'yellow', months: [2,3,4,5] },
  { name: "Stork", startLat: 50.857489, startLng: 6.688258, endLat: 45.447740, endLng: 21.348121, color: 'pink', months: [3,4,5,6] },
  { name: "Stork", startLat: 24.011547, startLng: 102.653979, endLat: 32.824697, endLng: 113.592493, color: 'pink', months: [3,4,5,6] },
  { name: "Swallow", startLat: 28.433086, startLng: 101.501193, endLat: 16.143856, endLng: 120.808176, color: 'blue', months: [4,5,6,7] },
  { name: "Swallow", startLat: 16.143856, startLng: 120.808176, endLat: 10.260747, endLng: 124.051068, color: 'blue', months: [4,5,6,7] },
  { name: "Hawk", startLat: 41.982003, startLng: -117.382852, endLat: 44.745258, endLng: -94.643698, color: 'orange', months: [7,8,9,10] }
];

const globe = Globe({ animateIn: false })(document.getElementById('globeViz'))
  .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
  .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
  .arcsData(arcs)
  .arcColor('color')
  .arcAltitude(0.2)
  .arcStroke(0.6)
  .arcDashGap(0.1)
  .arcDashLength(0.3)
  .arcDashInitialGap(() => Math.random())
  .atmosphereColor('#3a9ceb')
  .atmosphereAltitude(0.25)
  .pointOfView({ lat: 20, lng: 0, altitude: 2 });


const birdTexture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Bird_icon_2.svg/512px-Bird_icon_2.svg.png');
const birdMaterial = new THREE.SpriteMaterial({ map: birdTexture, transparent: true });
const birdSprite = new THREE.Sprite(birdMaterial);
birdSprite.scale.set(5, 5, 1);
globe.scene().add(birdSprite);

function latLngToVector3(lat, lng, radius = 100) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lng + 180) * Math.PI / 180;
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

const months = document.querySelectorAll('.month');
let activeMonth = 0;
let activeArc = null;
let progress = 0;
let intervalId = null;
let isPlaying = true; // auto-cycle enabled by default

function updateArcsForMonth(monthIndex) {
  // Only keep arcs active in this month
  const visibleArcs = arcs.filter(arc => arc.months.includes(monthIndex));
  globe.arcsData(visibleArcs);
}

function setArcAnimation(monthIndex) {
  updateArcsForMonth(monthIndex); // filter arcs

  globe.arcDashAnimateTime((arc) =>
    arc.months.includes(monthIndex) ? 2000 : 0
  );

  activeArc = arcs.find(arc => arc.months.includes(monthIndex)) || null;
  progress = 0;
}

function updateMonthDisplay() {
  months.forEach((m, i) => m.classList.toggle('active', i === activeMonth));
}

// Cycle forwards
function nextMonth() {
  activeMonth = (activeMonth + 1) % 12;
  setArcAnimation(activeMonth);
  updateMonthDisplay();
}

// Cycle backwards
function prevMonth() {
  activeMonth = (activeMonth - 1 + 12) % 12;
  setArcAnimation(activeMonth);
  updateMonthDisplay();
}

// Auto-cycle controller
function startMonthCycle() {
  if (!intervalId) {
    intervalId = setInterval(() => {
      nextMonth();
    }, 4000); // 4 seconds per month
  }
}

function stopMonthCycle() {
  clearInterval(intervalId);
  intervalId = null;
}

// Pause auto-cycle and update button
function pauseAutoCycle() {
  stopMonthCycle();
  isPlaying = false;
  pauseBtn.textContent = 'Play';
}

// Button wiring
document.getElementById('nextPageBtn').addEventListener('click', () => {
  pauseAutoCycle();
  nextMonth();
});

document.getElementById('backPageBtn').addEventListener('click', () => {
  pauseAutoCycle();
  prevMonth();
});

// Play/Pause button
document.getElementById('pauseBtn').addEventListener('click', () => {
  if (isPlaying) {
    pauseAutoCycle();
  } else {
    startMonthCycle();
    isPlaying = true;
    pauseBtn.textContent = 'Pause';
  }
});

// start with auto-cycle running
startMonthCycle();

const speciesDivs = document.querySelectorAll('.species');

const birdDetails = {
  Crane: {
    speed: "40-56 km/h",
    altitude: "1,600 m",
    origin: "N.A and Siberia" 
  },
  Eagle: {
    speed: "~28-45 km/h",
    altitude: "300-1,500 m",
    origin: "N.A and Eurasia"
  },
  Goose: {
    speed: "50-60 km/h",
    altitude: "600-1,200 ft",
    origin: "Northern hemisphere"
  },
  Warbler: {
    speed: "30-40 km/h",
    altitude: "Up to 1,000 m",
    origin: "Central America"
  },
  Stork: {
    speed: "Up to 50 km/h",
    altitude: "Up to 2,000 m",
    origin: "Europe and Asia"
  },
  Swallow: {
    speed: "~32 km/h",
    altitude: "Up to 600 m",
    origin: "Northern Hemisphere"
  },
  Hawk: {
    speed: "~50-70 km/h",
    altitude: "500-2,000 m",
    origin: "N.A and Eurasia"
  }
};


speciesDivs.forEach(div => {
  const name = div.getAttribute('data-name');
  const infoDiv = div.querySelector('.info');
  const bird = birdDetails[name];

  if (bird) {
    infoDiv.innerHTML = `
      <ul style="margin: 0; padding-left: 18px;">
        <li><strong>Speed:</strong> ${bird.speed}</li>
        <li><strong>Max altitude:</strong> ${bird.altitude}</li>
        <li><strong>Origin:</strong> ${bird.origin}</li>
      </ul>
    `;
  }
});