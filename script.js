import Globe from 'https://esm.sh/globe.gl';
import * as THREE from 'https://esm.sh/three';

const arcs = [
  { name: "Crane", startLat: 55, startLng: 20, endLat: 35, endLng: 50, color: 'magenta', months: [8,9,10,3,4] },
  { name: "Eagle", startLat: 45, startLng: -100, endLat: 25, endLng: -70, color: 'cyan', months: [9,10,11,2,3] },
  { name: "Goose", startLat: 50, startLng: -90, endLat: 30, endLng: -60, color: 'lime', months: [10,11,0,1,2] },
  { name: "Warbler", startLat: 35, startLng: -80, endLat: 15, endLng: -50, color: 'yellow', months: [2,3,4,5] },
  { name: "Stork", startLat: 10, startLng: -50, endLat: 30, endLng: -20, color: 'pink', months: [3,4,5,6] },
  { name: "Swallow", startLat: 50, startLng: 10, endLat: 30, endLng: 40, color: 'blue', months: [4,5,6,7] },
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
let paused = false;
let monthInterval;
let progress = 0;

function setArcAnimation(monthIndex) {
  globe.arcDashAnimateTime((arc) =>
    arc.months.includes(monthIndex) ? 2000 : 0
  );
  activeArc = arcs.find(arc => arc.months.includes(monthIndex)) || null;
  progress = 0;
}

function updateBird() {
  if (paused || !activeArc) return;
  progress += 0.01;
  if (progress > 1) progress = 0;

  const lat = activeArc.startLat + (activeArc.endLat - activeArc.startLat) * progress;
  const lng = activeArc.startLng + (activeArc.endLng - activeArc.startLng) * progress;
  const pos = latLngToVector3(lat, lng, globe.getGlobeRadius() * 1.2);
  birdSprite.position.copy(pos);
}

function animate() {
  updateBird();
  requestAnimationFrame(animate);
}

animate();

function updateMonthDisplay() {
  months.forEach((m, i) => m.classList.toggle('active', i === activeMonth));
}

function cycleMonth() {
  updateMonthDisplay();
  setArcAnimation(activeMonth);
  activeMonth = (activeMonth + 1) % 12;
}

function startMonthCycle() {
  cycleMonth();
  monthInterval = setInterval(cycleMonth, 2000);
}

function stopMonthCycle() {
  clearInterval(monthInterval);
}

startMonthCycle();

document.getElementById('pauseBtn').addEventListener('click', () => {
  paused = !paused;
  if (paused) {
    stopMonthCycle();
    pauseBtn.textContent = 'Play';
  } else {
    startMonthCycle();
    pauseBtn.textContent = 'Pause';
  }
});

/*document.getElementById('nextBtn').addEventListener('click', () => {
  if (!paused) {
    stopMonthCycle();
    activeMonth = (activeMonth + 1) % 12;
    updateMonthDisplay();
    setArcAnimation(activeMonth);
  }
});*/ //old next button functionality

document.getElementById('nextBtn').addEventListener('click', () => {
  window.location.href = 'nextpage.html';
});

/*const speciesDivs = document.querySelectorAll('.species');
const birdInfo = document.getElementById('birdInfo');

const birdDetails = {
  Crane: {
    speed: "50-60 km/h",
    altitude: "3,000 meters",
    population: "250,000",
    origin: "Northern Europe"
  },
  Eagle: {
    speed: "120-160 km/h",
    altitude: "4,500 meters",
    population: "500,000",
    origin: "North America"
  },
  Goose: {
    speed: "120-160 km/h",
    altitude: "4,500 meters",
    population: "500,000",
    origin: "North America"
  },
  Warbler: {
    speed: "120-160 km/h",
    altitude: "4,500 meters",
    population: "500,000",
    origin: "North America"
  },
  Stork: {
    speed: "120-160 km/h",
    altitude: "4,500 meters",
    population: "500,000",
    origin: "North America"
  },
  Swallow: {
    speed: "120-160 km/h",
    altitude: "4,500 meters",
    population: "500,000",
    origin: "North America"
  },
  Hawk: {
    speed: "120-160 km/h",
    altitude: "4,500 meters",
    population: "500,000",
    origin: "North America"
  }
}; */

const speciesDivs = document.querySelectorAll('.species');

const birdDetails = {
  Crane: {
    speed: "50-60 km/h",
    altitude: "3,000 meters",
    population: "250,000",
    origin: "Northern Europe"
  },
  Eagle: {
    speed: "120-160 km/h",
    altitude: "4,500 meters",
    population: "500,000",
    origin: "North America"
  },
  Goose: {
    speed: "120-160 km/h",
    altitude: "4,500 meters",
    population: "500,000",
    origin: "North America"
  },
  Warbler: {
    speed: "120-160 km/h",
    altitude: "4,500 meters",
    population: "500,000",
    origin: "North America"
  },
  Stork: {
    speed: "120-160 km/h",
    altitude: "4,500 meters",
    population: "500,000",
    origin: "North America"
  },
  Swallow: {
    speed: "120-160 km/h",
    altitude: "4,500 meters",
    population: "500,000",
    origin: "North America"
  },
  Hawk: {
    speed: "120-160 km/h",
    altitude: "4,500 meters",
    population: "500,000",
    origin: "North America"
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
        <li><strong>Maximum altitude:</strong> ${bird.altitude}</li>
        <li><strong>Population:</strong> ${bird.population}</li>
        <li><strong>Origin:</strong> ${bird.origin}</li>
      </ul>
    `;
  }
});