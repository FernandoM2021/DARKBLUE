import {
    GAME_LEVELS
} from './core/plans.js';
import {
    Level
} from "./core/level.js";
import {
    State
} from "./core/state.js";
import {
    DOMDisplay
} from './view/display.js';
import {
    arrowKeys
} from './view/tracker.js';


function runAnimation(frameFunc) {
    let lastTime = null;
    function frame(time) {
        if (lastTime != null) {
            let timeStep = Math.min(time - lastTime, 100) / 1000;
            if (frameFunc(timeStep) === false) return;
        }
        lastTime = time;
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
};

function runLevel(level, Display) {
    let display = new Display(document.body, level);
    let state = State.start(level);
    let ending = 1;
    return new Promise(resolve => {
        runAnimation(time => {
            state = state.update(time, arrowKeys);
            display.syncState(state);
            if (state.status == "playing") {
                return true;
            } else if (ending > 0) {
                ending -= time;
                return true;
            } else {
                display.clear();
                resolve(state.status);
                return false;
            }
        });
    });
};

async function runGame(plans, Display) {
    for (let level = 0; level < plans.length;) {
        let status = await runLevel(new Level(plans[level]),
            Display);
        if (status == "won") level++;
    }
    console.log("¡Has ganado!");
};

async function bootstrap() {
    await runGame(GAME_LEVELS, DOMDisplay);
};

bootstrap();
