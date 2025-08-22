import Globe from 'https://esm.sh/globe.gl';
import * as THREE from 'https://esm.sh/three';

const arcs = [
  { name: "Crane", startLat: 48.776320, startLng: -108.360246, endLat: 33.392742, endLng: -102.032121, color: 'magenta', months: [8,9,10,3,4] },
  { name: "Eagle", startLat: 45, startLng: -100, endLat: 25, endLng: -70, color: 'cyan', months: [9,10,11,2,3] },
  { name: "Goose", startLat: 50, startLng: -90, endLat: 30, endLng: -60, color: 'lime', months: [10,11,0,1,2] },
  { name: "Warbler", startLat: 35, startLng: -80, endLat: 15, endLng: -50, color: 'yellow', months: [2,3,4,5] },
  { name: "Stork", startLat: 10, startLng: -50, endLat: 30, endLng: -20, color: 'pink', months: [3,4,5,6] },
  { name: "Swallow", startLat: 29.487442192568476, startLng: -96.77888488946694, endLat: -29.905878792375937, endLng: -63.776867262107864, color: 'blue', months: [4,5,6,7] },
  { name: "Hawk", startLat: 10, startLng: -60, endLat: 30, endLng: -30, color: 'orange', months: [7,8,9,10] }
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