import gsap from 'https://cdn.skypack.dev/gsap@3.12.0';
import Draggable from 'https://cdn.skypack.dev/gsap@3.12.0/Draggable';

document.documentElement.dataset.theme = 'dark';

gsap.registerPlugin(Draggable);

// Used to calculate distance of "tug"
let startX;
let startY;

const AUDIO = {
    CLICK: new Audio('https://assets.codepen.io/605876/click.mp3'),
};

const heading = document.querySelector('h1');

const CORD_DURATION = 0.1;

function updateElements() {
    const CORDS = document.querySelectorAll('.toggle-scene__cord');
    const HIT = document.querySelector('.grab-handle');
    const DUMMY = document.querySelector('.toggle-scene__dummy-cord');
    const DUMMY_CORD = document.querySelector('.toggle-scene__dummy-cord line');
    const FORM = document.querySelector('form');
    const TOGGLE = FORM ? FORM.querySelector('button') : null;  // Safely access button inside form

    // Ensure elements are found before proceeding
    if (!CORDS.length || !HIT || !DUMMY || !DUMMY_CORD || !TOGGLE) {
        console.error('Required elements are missing.');
        return;  // Exit if elements are not found
    }

    console.log(CORDS, HIT, DUMMY, DUMMY_CORD, TOGGLE);
}

// Call this function after the elements are dynamically generated
document.addEventListener('DOMContentLoaded', updateElements);

const PROXY = document.createElement('div');
// set init position
let ENDX, ENDY;

function setEndPoints() {
    const DUMMY_CORD = document.querySelector('.toggle-scene__dummy-cord line');
    if (DUMMY_CORD) {
        ENDX = DUMMY_CORD.getAttribute('x2');
        ENDY = DUMMY_CORD.getAttribute('y2');
    } else {
        console.error('DUMMY_CORD is not found.');
    }
}

const RESET = () => {
    gsap.set(PROXY, {
        x: ENDX,
        y: ENDY,
    });
};

setEndPoints(); // Initial setup for endpoints

const toggle = (e) => {
    e.preventDefault();
    AUDIO.CLICK.play();
    const theme = TOGGLE.matches('[aria-pressed=false]');
    TOGGLE.setAttribute('aria-pressed', theme);
    document.documentElement.dataset.theme = theme ? 'light' : 'dark';
    heading.innerText = `lights ${theme ? 'on' : 'off'}.`;
};

const FORM = document.querySelector('form');
if (FORM) {
    FORM.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!document.startViewTransition) return toggle();
        document.startViewTransition(() => toggle());
    });
}

const CORD_TL = gsap.timeline({
    paused: true,
    onStart: () => {
        FORM.requestSubmit();
        gsap.set([DUMMY, HIT], { display: 'none' });
        gsap.set(CORDS[0], { display: 'block' });
    },
    onComplete: () => {
        gsap.set([DUMMY, HIT], { display: 'block' });
        gsap.set(CORDS[0], { display: 'none' });
        RESET();
    },
});

// Simulate a simple animation by changing attributes instead of morphing
const CORDS = document.querySelectorAll('.toggle-scene__cord');
if (CORDS.length) {
    for (let i = 1; i < CORDS.length; i++) {
        CORD_TL.add(
            gsap.to('.toggle-scene__dummy-cord line', {
                attr: {
                    x2: gsap.utils.random(ENDX - 10, ENDX + 10), // Slight movement simulation
                    y2: gsap.utils.random(ENDY - 10, ENDY + 10),
                },
                duration: CORD_DURATION,
                repeat: 1,
                yoyo: true,
            })
        );
    }
}

Draggable.create(PROXY, {
    trigger: '.grab-handle',  // Use the selector directly
    type: 'x,y',
    onPress: (e) => {
        startX = e.x;
        startY = e.y;
    },
    onDragStart: () => {
        document.documentElement.style.setProperty('cursor', 'grabbing');
    },
    onDrag: function () {
        // Need to map the coordinates based on scaling.
        // ViewBox to physical sizing
        // The ViewBox width is 134
        const ratio = 1 / ((FORM.offsetWidth * 0.65) / 134);
        gsap.set('.toggle-scene__dummy-cord line', {
            attr: {
                x2: this.startX + (this.x - this.startX) * ratio,
                y2: this.startY + (this.y - this.startY) * ratio,
            },
        });
    },
    onRelease: (e) => {
        const DISTX = Math.abs(e.x - startX);
        const DISTY = Math.abs(e.y - startY);
        const TRAVELLED = Math.sqrt(DISTX * DISTX + DISTY * DISTY);
        document.documentElement.style.setProperty('cursor', 'unset');
        gsap.to('.toggle-scene__dummy-cord line', {
            attr: { x2: ENDX, y2: ENDY },
            duration: CORD_DURATION,
            onComplete: () => {
                if (TRAVELLED > 50) {
                    CORD_TL.restart();
                } else {
                    RESET();
                }
            },
        });
    },
});

// Ensure dynamic elements exist before running draggable logic
const interval = setInterval(() => {
    const HIT = document.querySelector('.grab-handle');
    const DUMMY_CORD = document.querySelector('.toggle-scene__dummy-cord line');

    if (HIT && DUMMY_CORD) {
        clearInterval(interval);  // Stop the interval when elements are found
        Draggable.create(PROXY, { // Run Draggable setup after elements are available
            trigger: HIT,
            type: 'x,y',
            onPress: (e) => {
                startX = e.x;
                startY = e.y;
            },
            onDragStart: () => {
                document.documentElement.style.setProperty('cursor', 'grabbing');
            },
            onDrag: function () {
                const ratio = 1 / ((FORM.offsetWidth * 0.65) / 134);
                gsap.set(DUMMY_CORD, {
                    attr: {
                        x2: this.startX + (this.x - this.startX) * ratio,
                        y2: this.startY + (this.y - this.startY) * ratio,
                    },
                });
            },
            onRelease: (e) => {
                const DISTX = Math.abs(e.x - startX);
                const DISTY = Math.abs(e.y - startY);
                const TRAVELLED = Math.sqrt(DISTX * DISTX + DISTY * DISTY);
                document.documentElement.style.setProperty('cursor', 'unset');
                gsap.to(DUMMY_CORD, {
                    attr: { x2: ENDX, y2: ENDY },
                    duration: CORD_DURATION,
                    onComplete: () => {
                        if (TRAVELLED > 50) {
                            CORD_TL.restart();
                        } else {
                            RESET();
                        }
                    },
                });
            },
        });
    }
}, 100);  // Check every 100ms for the availability of elements
