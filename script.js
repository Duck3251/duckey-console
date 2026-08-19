const input = document.getElementById("commandInput");
const output = document.getElementById("output");

const ducks = new Map();

let secretCommandsUnlocked = false;
let currentArea = null;
let fieldEntered = false;


/* ============================= */
/* WEATHER STATE                 */
/* ============================= */

let currentWeather = null;

const weatherEffects = {
    rain: true,
    snow: true,
    puddles: true,
    snowmen: true
};


/* ============================= */
/* COMMANDS                      */
/* ============================= */

const commands = {
    "/help": "Show the available commands.",
    "/spawn <name>": "Spawn a duck.",
    "/remove <name>": "Remove a duck.",
    "/remove @all": "Remove all ducks.",
    "/say <name> <message>": "Make a duck say something.",
    "/say @all <message>": "Make every duck say something.",
    "/chaos <number>": "Spawn random ducks.",

    "/enterfield": "Enter the duck field.",
    "/enterforest": "Enter the forest.",
    "/enterlake": "Enter the lake.",
    "/enterfarm": "Enter the farm.",
    "/entervillage": "Enter the duck village.",
    "/entermarket": "Enter the market.",
    "/exitfield": "Leave the current area.",

    "/rain": "Start rain.",
    "/snow": "Start snow.",
    "/quackcode <message>": "Encode a message using DuckCode.",
    "/clearweather": "Clear the current weather.",
    "/clearweathereffects <weather/@all>": "Clear weather effects.",

    "/code": "Show the secret code puzzle.",
    "/save <number>": "Save your game.",
    "/load <number>": "Load your game.",
    "/clear": "Clear the console."
};


/* ============================= */
/* OUTPUT                        */
/* ============================= */

function print(text = "", className = "") {
    const line = document.createElement("p");

    line.textContent = text;

    if (className) {
        line.className = className;
    }

    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}


/* ============================= */
/* RANDOM DUCK TYPE              */
/* ============================= */

function randomDuckType() {
    const roll = Math.random();

    if (roll < 0.25) {
        return "pekin-adult";
    }

    if (roll < 0.50) {
        return "pekin-duckling";
    }

    return "mallard";
}


/* ============================= */
/* CREATE DUCK                   */
/* ============================= */

function createDuck(name) {
    return {
        name: name,
        type: randomDuckType(),

        frozen: false,

        x: 10 + Math.random() * 80,
        y: 35 + Math.random() * 50,

        dx: (Math.random() - 0.5) * 0.12,
        dy: (Math.random() - 0.5) * 0.12
    };
}


/* ============================= */
/* SPAWN                         */
/* ============================= */

function spawnDuck(name) {
    if (!name) {
        print("Usage: /spawn <name>", "error");
        return;
    }

    const key = name.toLowerCase();

    if (ducks.has(key)) {
        print(`${name} is already spawned!`, "error");
        return;
    }

    ducks.set(key, createDuck(name));

    print(`${name} has spawned! 🦆`, "success");

    updateField();
}


/* ============================= */
/* REMOVE                        */
/* ============================= */

function removeDuck(name) {
    if (!name) {
        print("Usage: /remove <name>", "error");
        return;
    }

    if (name.toLowerCase() === "@all") {
        const count = ducks.size;

        ducks.clear();

        print(
            `${count} ducks have been removed.`,
            "success"
        );

        updateField();
        return;
    }

    const key = name.toLowerCase();

    if (!ducks.has(key)) {
        print(`${name} was not found.`, "error");
        return;
    }

    ducks.delete(key);

    print(`${name} has been removed.`, "success");

    updateField();
}


/* ============================= */
/* SAY                           */
/* ============================= */

function duckSay(name, message) {
    if (!name || !message) {
        print(
            "Usage: /say <name> <message>",
            "error"
        );
        return;
    }

    if (name.toLowerCase() === "@all") {
        if (ducks.size === 0) {
            print(
                "There are no ducks to talk to.",
                "error"
            );
            return;
        }

        ducks.forEach((duck) => {
            print(
                `${duck.name}: ${message}`,
                "duck"
            );
        });

        return;
    }

    const key = name.toLowerCase();

    if (!ducks.has(key)) {
        print(
            `${name} is not spawned.`,
            "error"
        );
        return;
    }

    print(
        `${name}: ${message}`,
        "duck"
    );
}


/* ============================= */
/* CHAOS                         */
/* ============================= */

function chaos(amount) {
    amount = Number(amount);

    if (
        !Number.isInteger(amount) ||
        amount < 1 ||
        amount > 100
    ) {
        print(
            "Usage: /chaos <1-100>",
            "error"
        );
        return;
    }

    for (let i = 1; i <= amount; i++) {
        let name = `Random Duck ${i}`;

        while (ducks.has(name.toLowerCase())) {
            name += "!";
        }

        ducks.set(
            name.toLowerCase(),
            createDuck(name)
        );
    }

    print(
        `${amount} random ducks have appeared! 🦆`,
        "success"
    );

    updateField();
}


/* ============================= */
/* AREA DATA                     */
/* ============================= */

const areas = {

    field: {
        name: "Duck Field",
        emoji: "🦆",
        className: "area-field"
    },

    forest: {
        name: "Forest",
        emoji: "🌲",
        className: "area-forest"
    },

    lake: {
        name: "Lake",
        emoji: "🌊",
        className: "area-lake"
    },

    farm: {
        name: "Farm",
        emoji: "🌾",
        className: "area-farm"
    },

    village: {
        name: "Duck Village",
        emoji: "🏘️",
        className: "area-village"
    },

    market: {
        name: "Market",
        emoji: "🛒",
        className: "area-market"
    }
};


/* ============================= */
/* ENTER AREA                    */
/* ============================= */

function enterArea(areaID) {

    const area = areas[areaID];

    if (!area) {
        print(
            "That area does not exist.",
            "error"
        );
        return;
    }

    const field = document.getElementById("field");

    if (!field) {
        print(
            "The field element was not found.",
            "error"
        );
        return;
    }

    fieldEntered = true;
    currentArea = areaID;

    field.style.display = "block";

    Object.values(areas).forEach((a) => {
        field.classList.remove(a.className);
    });

    field.classList.add(area.className);

    print(
        `${area.emoji} You entered the ${area.name}!`,
        "success"
    );

    updateField();

    restoreWeatherVisuals();
}


/* ============================= */
/* EXIT AREA                     */
/* ============================= */

function exitArea() {

    const field = document.getElementById("field");

    if (!field) {
        return;
    }

    fieldEntered = false;
    currentArea = null;

    field.style.display = "none";

    Object.values(areas).forEach((area) => {
        field.classList.remove(area.className);
    });

    print(
        "You left the area. 🚪",
        "success"
    );
}


/* ============================= */
/* CREATE DUCK VISUAL            */
/* ============================= */

function createDuckVisual(duck) {

    const element = document.createElement("div");

    element.className =
        `field-duck ${duck.type}`;

    if (duck.frozen) {
        element.classList.add("frozen");
    }

    element.title = duck.name;

    const body = document.createElement("div");
    body.className = "duck-body";

    const head = document.createElement("div");
    head.className = "duck-head";

    const eye = document.createElement("div");
    eye.className = "duck-eye";

    const beak = document.createElement("div");
    beak.className = "duck-beak";

    head.appendChild(eye);
    head.appendChild(beak);

    element.appendChild(body);
    element.appendChild(head);

    return element;
}


/* ============================= */
/* UPDATE FIELD                  */
/* ============================= */

function updateField() {

    const field = document.getElementById("field");

    if (!field) {
        return;
    }

    field
        .querySelectorAll(".field-duck")
        .forEach(duck => duck.remove());

    ducks.forEach((duck) => {

        const element = createDuckVisual(duck);

        element.style.left =
            duck.x + "%";

        element.style.top =
            duck.y + "%";

        field.appendChild(element);
    });
}


/* ============================= */
/* DUCK MOVEMENT                 */
/* ============================= */

function moveDucks() {

    if (!fieldEntered) {
        return;
    }

    ducks.forEach((duck) => {

        if (duck.frozen) {
            return;
        }

        duck.x += duck.dx;
        duck.y += duck.dy;

        if (duck.x <= 2) {
            duck.x = 2;
            duck.dx = Math.abs(duck.dx);
        }

        if (duck.x >= 94) {
            duck.x = 94;
            duck.dx = -Math.abs(duck.dx);
        }

        if (duck.y <= 25) {
            duck.y = 25;
            duck.dy = Math.abs(duck.dy);
        }

        if (duck.y >= 90) {
            duck.y = 90;
            duck.dy = -Math.abs(duck.dy);
        }

        if (Math.random() < 0.01) {

            duck.dx =
                (Math.random() - 0.5) * 0.12;

            duck.dy =
                (Math.random() - 0.5) * 0.12;
        }
    });

    updateDuckPositions();
}


/* ============================= */
/* UPDATE POSITIONS              */
/* ============================= */

function updateDuckPositions() {

    const field =
        document.getElementById("field");

    if (!field) {
        return;
    }

    const elements =
        field.querySelectorAll(".field-duck");

    elements.forEach((element) => {

        const key =
            element.title.toLowerCase();

        const duck =
            ducks.get(key);

        if (!duck) {
            return;
        }

        element.style.left =
            duck.x + "%";

        element.style.top =
            duck.y + "%";
    });
}


/* ============================= */
/* HELP                          */
/* ============================= */

function help() {

    print(
        "Available commands:",
        "duck"
    );

    Object.entries(commands).forEach(
        ([command, description]) => {

            print(
                `${command} - ${description}`
            );
        }
    );

    if (secretCommandsUnlocked) {

        print("");

        print(
            "Secret commands unlocked.",
            "success"
        );

        print(
            "Type /secrethelp to see them."
        );
    }
}


/* ============================= */
/* CODE PUZZLE                   */
/* ============================= */

function showCode() {

    print(
        "SECRET CODE PUZZLE:",
        "duck"
    );

    print("10 - 3 = ?");
    print("10 - 2 = ?");
    print("10 - 5 - 5 = ?");
    print("10 - 9 = ?");
    print("10 - 6 = ?");

    print("");

    print(
        "Put the answers together to discover the secret code."
    );
}


/* ============================= */
/* SECRET UNLOCK                 */
/* ============================= */

function unlockSecretCommands() {

    if (secretCommandsUnlocked) {

        print(
            "Secret commands are already unlocked.",
            "error"
        );

        return;
    }

    secretCommandsUnlocked = true;

    print(
        "SECRET COMMANDS UNLOCKED! 🔓",
        "success"
    );

    print(
        "These commands are hidden from /help."
    );

    print(
        "Type /secrethelp to see them."
    );
}


/* ============================= */
/* SECRET HELP                   */
/* ============================= */

function secretHelp() {

    if (!secretCommandsUnlocked) {

        print(
            "Access denied.",
            "error"
        );

        return;
    }

    print(
        "SECRET DUCKCODE COMMANDS:",
        "duck"
    );

    print(
        "/duckcount - Count spawned ducks"
    );

    print(
        "/listducks - List spawned ducks"
    );

    print(
        "/teleport <name> - Teleport a duck"
    );

    print(
        "/quack @all - Make every duck quack"
    );

    print(
        "/freeze <duck> - Freeze a duck"
    );

    print(
        "/freeze @all - Freeze all ducks"
    );

    print(
        "/unfreeze <duck> - Unfreeze a duck"
    );

    print(
        "/unfreeze @all - Unfreeze all ducks"
    );
}


/* ============================= */
/* DUCK COUNT                    */
/* ============================= */

function duckCount() {

    print(
        `There are ${ducks.size} spawned ducks. 🦆`
    );
}


/* ============================= */
/* LIST DUCKS                    */
/* ============================= */

function listDucks() {

    if (ducks.size === 0) {

        print(
            "There are no spawned ducks."
        );

        return;
    }

    print(
        "Spawned ducks:",
        "duck"
    );

    ducks.forEach((duck) => {

        const status =
            duck.frozen
                ? " ❄️ FROZEN"
                : " 🦆 MOVING";

        print(
            `- ${duck.name}${status}`
        );
    });
}


/* ============================= */
/* TELEPORT                      */
/* ============================= */

function teleportDuck(name) {

    if (!name) {

        print(
            "Usage: /teleport <name>",
            "error"
        );

        return;
    }

    const duck =
        ducks.get(
            name.toLowerCase()
        );

    if (!duck) {

        print(
            `${name} was not found.`,
            "error"
        );

        return;
    }

    if (!fieldEntered) {

        print(
            "Enter an area first.",
            "error"
        );

        return;
    }

    duck.x =
        5 + Math.random() * 88;

    duck.y =
        25 + Math.random() * 65;

    updateDuckPositions();

    print(
        `${duck.name} has been teleported! ⚡🦆`,
        "success"
    );
}


/* ============================= */
/* QUACK ALL                     */
/* ============================= */

function quackAll() {

    if (ducks.size === 0) {

        print(
            "There are no ducks to quack.",
            "error"
        );

        return;
    }

    ducks.forEach((duck) => {

        print(
            `${duck.name}: QUACK! 🦆`,
            "duck"
        );
    });
}


/* ============================= */
/* FREEZE                        */
/* ============================= */

function freezeDuck(target) {

    if (!target) {

        print(
            "Usage: /freeze <duck> or /freeze @all",
            "error"
        );

        return;
    }

    if (
        target.toLowerCase() === "@all"
    ) {

        if (ducks.size === 0) {

            print(
                "There are no ducks to freeze.",
                "error"
            );

            return;
        }

        ducks.forEach((duck) => {
            duck.frozen = true;
        });

        updateField();

        print(
            "❄️ All ducks have been frozen!",
            "success"
        );

        return;
    }

    const duck =
        ducks.get(
            target.toLowerCase()
        );

    if (!duck) {

        print(
            `${target} was not found.`,
            "error"
        );

        return;
    }

    duck.frozen = true;

    updateField();

    print(
        `❄️ ${duck.name} has been frozen!`,
        "success"
    );
}


/* ============================= */
/* UNFREEZE                      */
/* ============================= */

function unfreezeDuck(target) {

    if (!target) {

        print(
            "Usage: /unfreeze <duck> or /unfreeze @all",
            "error"
        );

        return;
    }

    if (
        target.toLowerCase() === "@all"
    ) {

        if (ducks.size === 0) {

            print(
                "There are no ducks to unfreeze.",
                "error"
            );

            return;
        }

        ducks.forEach((duck) => {
            duck.frozen = false;
        });

        updateField();

        print(
            "☀️ All ducks have been unfrozen!",
            "success"
        );

        return;
    }

    const duck =
        ducks.get(
            target.toLowerCase()
        );

    if (!duck) {

        print(
            `${target} was not found.`,
            "error"
        );

        return;
    }

    duck.frozen = false;

    updateField();

    print(
        `☀️ ${duck.name} has been unfrozen!`,
        "success"
    );
}


/* ================================================= */
/* WEATHER SYSTEM                                    */
/* ================================================= */


/* ============================= */
/* GET FIELD                     */
/* ============================= */

function getField() {
    return document.getElementById("field");
}


/* ============================= */
/* REMOVE WEATHER EFFECTS        */
/* ============================= */

function removeWeatherEffects(type) {

    const field = getField();

    if (!field) {
        return;
    }

    if (
        type === "rain" ||
        type === "@all"
    ) {

        field
            .querySelectorAll(".rain-drop")
            .forEach(
                element => element.remove()
            );
    }

    if (
        type === "snow" ||
        type === "@all"
    ) {

        field
            .querySelectorAll(".snowflake")
            .forEach(
                element => element.remove()
            );
    }

    if (
        type === "puddles" ||
        type === "@all"
    ) {

        field
            .querySelectorAll(".weather-puddle")
            .forEach(
                element => element.remove()
            );
    }

    if (
        type === "snowmen" ||
        type === "@all"
    ) {

        field
            .querySelectorAll(".weather-snowman")
            .forEach(
                element => element.remove()
            );
    }
}


/* ============================= */
/* RAIN DROP                     */
/* ============================= */

function spawnRainDrop() {

    if (!fieldEntered) {
        return;
    }

    if (currentWeather !== "rain") {
        return;
    }

    if (!weatherEffects.rain) {
        return;
    }

    const field = getField();

    if (!field) {
        return;
    }

    const drop =
        document.createElement("div");

    drop.className =
        "weather-effect rain-drop";

    drop.style.left =
        Math.random() * 100 + "%";

    drop.style.top =
        "-20px";

    field.appendChild(drop);

    setTimeout(() => {
        drop.remove();
    }, 1100);
}


/* ============================= */
/* PUDDLE                        */
/* ============================= */

function spawnPuddle() {

    if (!fieldEntered) {
        return;
    }

    if (currentWeather !== "rain") {
        return;
    }

    if (!weatherEffects.puddles) {
        return;
    }

    const field = getField();

    if (!field) {
        return;
    }

    const puddle =
        document.createElement("div");

    puddle.className =
        "weather-puddle";

    puddle.style.left =
        5 + Math.random() * 90 + "%";

    puddle.style.top =
        65 + Math.random() * 25 + "%";

    field.appendChild(puddle);
}


/* ============================= */
/* SNOWFLAKE                     */
/* ============================= */

function spawnSnowflake() {

    if (!fieldEntered) {
        return;
    }

    if (currentWeather !== "snow") {
        return;
    }

    if (!weatherEffects.snow) {
        return;
    }

    const field = getField();

    if (!field) {
        return;
    }

    const snowflake =
        document.createElement("div");

    snowflake.className =
        "weather-effect snowflake";

    snowflake.textContent = "❄";

    snowflake.style.left =
        Math.random() * 100 + "%";

    snowflake.style.top =
        "-25px";

    snowflake.style.animationDuration =
        2 + Math.random() * 3 + "s";

    field.appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, 5500);
}


/* ============================= */
/* SNOWMAN                       */
/* ============================= */

function spawnSnowman() {

    if (!fieldEntered) {
        return;
    }

    if (currentWeather !== "snow") {
        return;
    }

    if (!weatherEffects.snowmen) {
        return;
    }

    const field = getField();

    if (!field) {
        return;
    }

    const snowman =
        document.createElement("div");

    snowman.className =
        "weather-snowman";

    snowman.textContent = "⛄";

    snowman.style.left =
        5 + Math.random() * 90 + "%";

    snowman.style.top =
        60 + Math.random() * 28 + "%";

    field.appendChild(snowman);
}


/* ============================= */
/* START RAIN                    */
/* ============================= */

function startRain() {

    if (!fieldEntered) {

        print(
            "Enter an area first before starting weather.",
            "error"
        );

        return;
    }

    currentWeather = "rain";

    const field = getField();

    if (field) {

        field.classList.remove(
            "weather-snow"
        );

        field.classList.add(
            "weather-rain"
        );
    }

    print(
        "🌧️ Rain has started!",
        "success"
    );

    print(
        "The rain may create puddles. 💧"
    );

    restoreWeatherVisuals();
}


/* ============================= */
/* START SNOW                    */
/* ============================= */

function startSnow() {

    if (!fieldEntered) {

        print(
            "Enter an area first before starting weather.",
            "error"
        );

        return;
    }

    currentWeather = "snow";

    const field = getField();

    if (field) {

        field.classList.remove(
            "weather-rain"
        );

        field.classList.add(
            "weather-snow"
        );
    }

    print(
        "❄️ Snow has started!",
        "success"
    );

    print(
        "The snow may create snowmen. ⛄"
    );

    restoreWeatherVisuals();
}


/* ============================= */
/* CLEAR CURRENT WEATHER         */
/* ============================= */

function clearWeather() {

    const field = getField();

    currentWeather = null;

    if (field) {

        field.classList.remove(
            "weather-rain"
        );

        field.classList.remove(
            "weather-snow"
        );
    }

    print(
        "☀️ The current weather has been cleared.",
        "success"
    );

    print(
        "Existing weather effects remain."
    );
}


/* ============================= */
/* CLEAR WEATHER EFFECTS         */
/* ============================= */

function clearWeatherEffects(target) {

    if (!target) {

        print(
            "Usage: /clearweathereffects <rain/snow/puddles/snowmen/@all>",
            "error"
        );

        return;
    }

    target =
        target.toLowerCase();

    const validTargets = [
        "rain",
        "snow",
        "puddles",
        "snowmen",
        "@all"
    ];

    if (!validTargets.includes(target)) {

        print(
            "Choose rain, snow, puddles, snowmen, or @all.",
            "error"
        );

        return;
    }

    removeWeatherEffects(target);

    if (target === "@all") {

        print(
            "🧹 All weather effects have been cleared.",
            "success"
        );

        return;
    }

    print(
        `🧹 ${target} effects have been cleared.`,
        "success"
    );
}


/* ============================= */
/* RESTORE WEATHER VISUALS       */
/* ============================= */

function restoreWeatherVisuals() {

    if (!fieldEntered) {
        return;
    }

    if (currentWeather === "rain") {

        if (weatherEffects.puddles) {
            spawnPuddle();
            spawnPuddle();
        }
    }

    if (currentWeather === "snow") {

        if (weatherEffects.snowmen) {
            spawnSnowman();
            spawnSnowman();
        }
    }
}


/* ============================= */
/* WEATHER LOOP                  */
/* ============================= */

setInterval(() => {

    if (!fieldEntered) {
        return;
    }

    if (currentWeather === "rain") {

        if (weatherEffects.rain) {

            for (let i = 0; i < 3; i++) {
                spawnRainDrop();
            }
        }

        if (
            weatherEffects.puddles &&
            Math.random() < 0.025
        ) {
            spawnPuddle();
        }
    }

    if (currentWeather === "snow") {

        if (weatherEffects.snow) {

            for (let i = 0; i < 2; i++) {
                spawnSnowflake();
            }
        }

        if (
            weatherEffects.snowmen &&
            Math.random() < 0.01
        ) {
            spawnSnowman();
        }
    }

}, 120);


/* ================================================= */
/* DUCKCODE CIPHER                                  */
/* ================================================= */

function encodeDuckCode(message) {

    if (!message) {
        return "";
    }

    return message
        .toUpperCase()
        .split("")
        .map(character => {

            if (character === " ") {
                return "+";
            }

            const code =
                character.charCodeAt(0);

            if (
                code >= 65 &&
                code <= 90
            ) {

                return code - 64;
            }

            return character;

        })
        .join("-");
}


/* ============================= */
/* QUACKCODE                     */
/* ============================= */

function quackCode(message) {

    if (!message) {

        print(
            "Usage: /quackcode <message>",
            "error"
        );

        return;
    }

    const encoded =
        encodeDuckCode(message);

    print(
        "🦆 DUCKCODE:",
        "duck"
    );

    print(
        encoded,
        "success"
    );
}


/* ============================= */
/* SAVE                           */
/* ============================= */

function saveGame(slot) {

    if (!slot) {

        print(
            "Usage: /save <number>",
            "error"
        );

        return;
    }

    if (!/^\d+$/.test(slot)) {

        print(
            "Save slot must be a number.",
            "error"
        );

        return;
    }

    const saveData = {

        ducks:
            Array.from(
                ducks.entries()
            ),

        secretCommandsUnlocked:
            secretCommandsUnlocked,

        currentArea:
            currentArea,

        currentWeather:
            currentWeather
    };

    localStorage.setItem(
        `duckeySave_${slot}`,
        JSON.stringify(saveData)
    );

    print(
        `Game saved to slot ${slot}! 💾🦆`,
        "success"
    );
}


/* ============================= */
/* LOAD                           */
/* ============================= */

function loadGame(slot) {

    if (!slot) {

        print(
            "Usage: /load <number>",
            "error"
        );

        return;
    }

    if (!/^\d+$/.test(slot)) {

        print(
            "Save slot must be a number.",
            "error"
        );

        return;
    }

    const saved =
        localStorage.getItem(
            `duckeySave_${slot}`
        );

    if (!saved) {

        print(
            `No save found in slot ${slot}.`,
            "error"
        );

        return;
    }

    try {

        const saveData =
            JSON.parse(saved);

        ducks.clear();

        if (
            Array.isArray(
                saveData.ducks
            )
        ) {

            saveData.ducks.forEach(
                ([key, duck]) => {

                    if (
                        typeof duck.frozen !==
                        "boolean"
                    ) {
                        duck.frozen = false;
                    }

                    ducks.set(
                        key,
                        duck
                    );
                }
            );
        }

        secretCommandsUnlocked =
            saveData.secretCommandsUnlocked === true;

        currentArea =
            saveData.currentArea || null;

        currentWeather =
            saveData.currentWeather || null;

        if (currentArea) {

            enterArea(currentArea);

        } else {

            updateField();
        }

        print(
            `Game loaded from slot ${slot}! 📂🦆`,
            "success"
        );

    } catch (error) {

        print(
            "Save file is corrupted.",
            "error"
        );
    }
}


/* ================================================= */
/* COMMAND PROCESSOR                                */
/* ================================================= */

function runCommand(command) {

    command = command.trim();

    if (!command) {
        return;
    }

    print("> " + command);

    /* ============================= */
    /* SECRET CODE DISCOVERY          */
    /* ============================= */

    if (
        command === "78096" ||
        command === "7 8 0 9 6"
    ) {

        print(
            "Correct code! Type /78096",
            "success"
        );

        return;
    }

    const parts =
        command.split(/\s+/);

    const commandName =
        parts[0].toLowerCase();


    /* ============================= */
    /* NORMAL COMMANDS                */
    /* ============================= */

    if (commandName === "/help") {

        help();

    }

    else if (commandName === "/spawn") {

        spawnDuck(
            parts.slice(1).join(" ")
        );

    }

    else if (commandName === "/remove") {

        removeDuck(
            parts.slice(1).join(" ")
        );

    }

    else if (commandName === "/say") {

        duckSay(
            parts[1],
            parts.slice(2).join(" ")
        );

    }

    else if (commandName === "/chaos") {

        chaos(parts[1]);

    }


    /* ============================= */
    /* AREAS                         */
    /* ============================= */

    else if (commandName === "/enterfield") {

        enterArea("field");

    }

    else if (commandName === "/enterforest") {

        enterArea("forest");

    }

    else if (commandName === "/enterlake") {

        enterArea("lake");

    }

    else if (commandName === "/enterfarm") {

        enterArea("farm");

    }

    else if (commandName === "/entervillage") {

        enterArea("village");

    }

    else if (commandName === "/entermarket") {

        enterArea("market");

    }

    else if (commandName === "/exitfield") {

        exitArea();

    }


    /* ============================= */
    /* WEATHER COMMANDS              */
    /* ============================= */

    else if (commandName === "/rain") {

        startRain();

    }

    else if (commandName === "/snow") {

        startSnow();

    }

    else if (commandName === "/quackcode") {

        quackCode(
            parts.slice(1).join(" ")
        );

    }

    else if (commandName === "/clearweather") {

        clearWeather();

    }

    else if (
        commandName === "/clearweathereffects"
    ) {

        clearWeatherEffects(
            parts[1]
        );

    }


    /* ============================= */
    /* OTHER COMMANDS                */
    /* ============================= */

    else if (commandName === "/code") {

        showCode();

    }

    else if (commandName === "/save") {

        saveGame(parts[1]);

    }

    else if (commandName === "/load") {

        loadGame(parts[1]);

    }

    else if (commandName === "/clear") {

        output.innerHTML = "";

    }


    /* ============================= */
    /* SECRET COMMANDS               */
    /* ============================= */

    else if (commandName === "/78096") {

        unlockSecretCommands();

    }

    else if (commandName === "/secrethelp") {

        secretHelp();

    }

    else if (commandName === "/duckcount") {

        if (!secretCommandsUnlocked) {

            print(
                "Unknown command.",
                "error"
            );

            return;
        }

        duckCount();

    }

    else if (commandName === "/listducks") {

        if (!secretCommandsUnlocked) {

            print(
                "Unknown command.",
                "error"
            );

            return;
        }

        listDucks();

    }

    else if (commandName === "/teleport") {

        if (!secretCommandsUnlocked) {

            print(
                "Unknown command.",
                "error"
            );

            return;
        }

        teleportDuck(
            parts.slice(1).join(" ")
        );

    }

    else if (commandName === "/quack") {

        if (!secretCommandsUnlocked) {

            print(
                "Unknown command.",
                "error"
            );

            return;
        }

        if (
            parts[1]?.toLowerCase() === "@all"
        ) {

            quackAll();

        } else {

            print(
                "Usage: /quack @all",
                "error"
            );
        }

    }

    else if (commandName === "/freeze") {

        if (!secretCommandsUnlocked) {

            print(
                "Unknown command.",
                "error"
            );

            return;
        }

        freezeDuck(
            parts.slice(1).join(" ")
        );

    }

    else if (commandName === "/unfreeze") {

        if (!secretCommandsUnlocked) {

            print(
                "Unknown command.",
                "error"
            );

            return;
        }

        unfreezeDuck(
            parts.slice(1).join(" ")
        );

    }


    /* ============================= */
    /* UNKNOWN                       */
    /* ============================= */

    else {

        print(
            `Unknown command: ${commandName}`,
            "error"
        );

        print(
            "Type /help for available commands."
        );
    }
}


/* ============================= */
/* INPUT                         */
/* ============================= */

if (input) {

    input.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                runCommand(
                    input.value
                );

                input.value = "";
            }
        }
    );

} else {

    console.error(
        "Duckey Console: #commandInput was not found."
    );
}


/* ============================= */
/* DUCK MOVEMENT LOOP             */
/* ============================= */

setInterval(
    moveDucks,
    50
);


/* ============================= */
/* STARTUP                       */
/* ============================= */

print(
    "Duckey Console v1.0"
);

print(
    "Type /help for commands."
);

print(
    "Try /help"
);
