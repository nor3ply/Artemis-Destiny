// Логіка взаємодії з планетами Cosmos
// Зібрані елементи планет
const planets = {
    mercury: document.getElementById('mercury'),
    venus: document.getElementById('venus'),
    earth: document.getElementById('earth'),
    mars: document.getElementById('mars'),
    jupiter: document.getElementById('jupiter'),
    saturn: document.getElementById('saturn'),
    uranus: document.getElementById('uranus'),
    neptune: document.getElementById('neptune')
};

// Глобальні елементи інформації та кнопок
const infoBox = document.getElementById('planetInfo');
const planetDataBox = document.getElementById('planetData');
const prevPlanetButton = document.getElementById('prevPlanet');
const nextPlanetButton = document.getElementById('nextPlanet');

// Порядок планет для навігації стрілками
const planetOrder = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

// Дані про планети
const planetData = {
    mercury: {
        name: 'Mercury',
        dayTemp: '+430°C',
        nightTemp: '-180°C',
        order: '1st',
        moons: '0',
        features: 'No atmosphere, extreme temperature swings, heavily cratered surface'
    },
    venus: {
        name: 'Venus',
        dayTemp: '~465°C (constant, same for day and night)',
        nightTemp: '~465°C',
        order: '2nd',
        moons: '0',
        features: 'Thick toxic atmosphere of CO₂ with sulfuric acid clouds, hottest planet, extremely high pressure (92 times Earth\'s)'
    },
    earth: {
        name: 'Earth',
        dayTemp: '~20°C average (can vary from -89°C to +58°C)',
        nightTemp: '~10°C average (drops after sunset, can go below -80°C in cold regions)',
        order: '3rd',
        moons: '1',
        features: 'Liquid water on surface, active plate tectonics, oxygen-rich atmosphere, only known planet to support life'
    },
    mars: {
        name: 'Mars',
        dayTemp: '~20°C (at the equator)',
        nightTemp: '~-80°C (can drop to -125°C at poles)',
        order: '4th',
        moons: '2 (Phobos and Deimos)',
        features: 'Called the Red Planet due to iron oxide (rust) on surface, largest volcano in the solar system (Olympus Mons), thin CO₂ atmosphere, frequent planet-wide dust storms'
    },
    jupiter: {
        name: 'Jupiter',
        dayTemp: '~-108°C (cloud tops)',
        nightTemp: '~-108°C (relatively consistent)',
        order: '5th',
        moons: '95 (known, including Io, Europa, Ganymede, Callisto)',
        features: 'Great Red Spot (giant storm larger than Earth), largest planet in the solar system, gas giant (mostly hydrogen and helium), faint ring system'
    },
    saturn: {
        name: 'Saturn',
        dayTemp: '~-139°C (cloud tops)',
        nightTemp: '~-139°C (relatively consistent)',
        order: '6th',
        moons: '146 (known, including Titan, Rhea, Enceladus)',
        features: 'Most prominent and complex ring system (made of ice and rock), gas giant (mostly hydrogen and helium), lowest density (would float in water), hexagonal storm at north pole'
    },
    uranus: {
        name: 'Uranus',
        dayTemp: '~-197°C (cloud tops)',
        nightTemp: '~-197°C (relatively consistent)',
        order: '7th',
        moons: '27 (known, including Titania, Oberon, Umbriel, Ariel, Miranda)',
        features: 'Rotates on its side (axial tilt ~98°), ice giant (water, ammonia, methane ice), pale blue color from methane, faint ring system'
    },
    neptune: {
        name: 'Neptune',
        dayTemp: '~-201°C (cloud tops)',
        nightTemp: '~-201°C (relatively consistent)',
        order: '8th',
        moons: '16 (known, including Triton, Nereid, Proteus)',
        features: 'Strongest winds in the solar system (up to 2,100 km/h), deep blue color from methane, Great Dark Spot (giant storm, observed by Voyager 2), ice giant'
    }
};

// Стан активної планети та ідентифікатор анімації
let activePlanet = null;
let animationFrameId = null;

// Обчислення прокрутки, щоб планета була по центру екрана
function scrollToPlanetDuringAnimation(planetElement) {
    if (!planetElement) return;

    const rect = planetElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset + rect.top - (window.innerHeight / 2) + (rect.height / 2);

    window.scrollTo({
        top: Math.max(scrollTop, 0),
        behavior: 'auto'
    });
}

// Слідкування за планетою під час її переходу
function followPlanetDuringTransition(planetElement) {
    if (!planetElement) return;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    function scrollStep() {
        scrollToPlanetDuringAnimation(planetElement);
        animationFrameId = requestAnimationFrame(scrollStep);
    }

    animationFrameId = requestAnimationFrame(scrollStep);

    function stopFollowing(event) {
        if (event.propertyName === 'top' || event.propertyName === 'left') {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            planetElement.removeEventListener('transitionend', stopFollowing);
        }
    }

    planetElement.addEventListener('transitionend', stopFollowing);
}

// Оновлення стану кнопок «попередня» / «наступна»
function updateNavButtons(id) {
    const index = planetOrder.indexOf(id);
    prevPlanetButton.disabled = index <= 0;
    nextPlanetButton.disabled = index === -1 || index >= planetOrder.length - 1;
}

// Показ інформації про обрану планету
function updatePlanetInfo(planetId) {
    const data = planetData[planetId];

    if (data) {
        planetDataBox.innerHTML = `
            <strong>Name:</strong> ${data.name}<br>
            <strong>Day temperature:</strong> ${data.dayTemp}<br>
            <strong>Night temperature:</strong> ${data.nightTemp}<br>
            <strong>Order from the Sun:</strong> ${data.order}<br>
            <strong>Number of moons:</strong> ${data.moons}<br>
            <strong>Features:</strong> ${data.features}
        `;
        updateNavButtons(planetId);
    }
}

// Перехід до наступної / попередньої планети
function navigatePlanet(direction) {
    if (!activePlanet) return;
    const currentIndex = planetOrder.indexOf(activePlanet);
    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex < 0 || nextIndex >= planetOrder.length) return;
    const nextPlanetId = planetOrder[nextIndex];
    const nextPlanetElement = planets[nextPlanetId];
    if (nextPlanetElement) {
        handlePlanetClick(nextPlanetId, nextPlanetElement);
    }
}

// Обробка кліку по планеті
function handlePlanetClick(planetId, planetElement) {
    if (activePlanet === planetId) {
        followPlanetDuringTransition(planetElement);
        planetElement.classList.remove('moved');
        infoBox.classList.remove('show');
        activePlanet = null;
        updateNavButtons(null);
        return;
    }

    if (activePlanet !== null && planets[activePlanet]) {
        planets[activePlanet].classList.remove('moved');
    }

    planetElement.classList.add('moved');
    updatePlanetInfo(planetId);
    infoBox.classList.add('show');
    activePlanet = planetId;
    followPlanetDuringTransition(planetElement);
}

// Прив’язка обробників кліків до зображень планет
if (planets.mercury) planets.mercury.addEventListener('click', function() { handlePlanetClick('mercury', this); });
if (planets.venus) planets.venus.addEventListener('click', function() { handlePlanetClick('venus', this); });
if (planets.earth) planets.earth.addEventListener('click', function() { handlePlanetClick('earth', this); });
if (planets.mars) planets.mars.addEventListener('click', function() { handlePlanetClick('mars', this); });
if (planets.jupiter) planets.jupiter.addEventListener('click', function() { handlePlanetClick('jupiter', this); });
if (planets.saturn) planets.saturn.addEventListener('click', function() { handlePlanetClick('saturn', this); });
if (planets.uranus) planets.uranus.addEventListener('click', function() { handlePlanetClick('uranus', this); });
if (planets.neptune) planets.neptune.addEventListener('click', function() { handlePlanetClick('neptune', this); });

// Кнопки навігації
prevPlanetButton.addEventListener('click', function() {
    navigatePlanet('prev');
});

nextPlanetButton.addEventListener('click', function() {
    navigatePlanet('next');
});
