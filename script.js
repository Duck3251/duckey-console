console.log("DUCKEY SCRIPT LOADED - NEW VERSION");

alert("🦆 DUCKEY CONSOLE -- V1.0");

const input = document.getElementById("commandInput");
const output = document.getElementById("output");
const ducks = new Map();

let secretCommandsUnlocked = false;
let currentArea = null;
let fieldEntered = false;

/* ================================================= */
/* WEATHER                                          */
/* ================================================= */

let currentWeather = null;

const weatherEffects = {
    rain: true,
    snow: true,
    puddles: true,
    snowmen: true
};

/* ================================================= */
/* BOSS STATE                                        */
/* ================================================= */

let bossBattleActive = false;
let currentBoss = null;

let playerHP = 100;

const MAX_PLAYER_HP = 100;

let attackLevel = 10;

let unlockedBoss = 1;

const bossData = {
    1: {
        name: "Mega Duckey",
        baseHP: 100,
        emoji: "🦆"
    }
};

const bossDefeatCounts = {
    1: 0
};

/* ================================================= */
/* BOSS PROJECTILES                                  */
/* ================================================= */

const bossProjectiles = [];

let bossProjectileTimer = null;

let bossAttackTimer = null;

/* ================================================= */
/* PLAYER ATTACK                                     */
/* ================================================= */

let featherCooldown = false;

const FEATHER_COOLDOWN_TIME = 7000;

/* ================================================= */
/* BOSS DOM                                          */
/* ================================================= */

const bossBattlefield =
    document.getElementById("bossBattlefield");

const bossCursor =
    document.getElementById("bossCursor");

const megaDuckey =
    document.getElementById("megaDuckey");

const bossHealthBar =
    document.getElementById("bossHealthBar");

const bossHealthText =
    document.getElementById("bossHealthText");

const playerHealthBar =
    document.getElementById("playerHealthBar");

const playerHealthText =
    document.getElementById("playerHealthText");

const featherCooldownElement =
    document.getElementById("featherCooldown");

const bossVictory =
    document.getElementById("bossVictory");

const bossDefeat =
    document.getElementById("bossDefeat");

/* ================================================= */
/* COMMANDS                                          */
/* ================================================= */

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

    "/boss <number>": "Fight a boss.",
    "/bossstatus": "Show your current boss battle status.",

    "/code": "Show the secret code puzzle.",

    "/save <number>": "Save your game.",
    "/load <number>": "Load your game.",

    "/clear": "Clear the console."
};

/* ================================================= */
/* OUTPUT                                            */
/* ================================================= */

function print(text = "", className = "") {

    const line = document.createElement("p");

    line.textContent = text;

    if (className) {
        line.className = className;
    }

    output.appendChild(line);

    output.scrollTop =
        output.scrollHeight;
}

/* ================================================= */
/* RANDOM DUCK TYPE                                  */
/* ================================================= */

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

/* ================================================= */
/* CREATE DUCK                                       */
/* ================================================= */

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

/* ================================================= */
/* SPAWN DUCK                                        */
/* ================================================= */

function spawnDuck(name) {

    if (!name) {

        print(
            "Usage: /spawn <name>",
            "error"
        );

        return;
    }

    const key =
        name.toLowerCase();

    if (ducks.has(key)) {

        print(
            `${name} is already spawned!`,
            "error"
        );

        return;
    }

    ducks.set(
        key,
        createDuck(name)
    );

    print(
        `${name} has spawned! 🦆`,
        "success"
    );

    updateField();
}

/* ================================================= */
/* REMOVE DUCK                                       */
/* ================================================= */

function removeDuck(name) {

    if (!name) {

        print(
            "Usage: /remove <name>",
            "error"
        );

        return;
    }

    if (
        name.toLowerCase() === "@all"
    ) {

        const count =
            ducks.size;

        ducks.clear();

        print(
            `${count} ducks have been removed.`,
            "success"
        );

        updateField();

        return;
    }

    const key =
        name.toLowerCase();

    if (!ducks.has(key)) {

        print(
            `${name} was not found.`,
            "error"
        );

        return;
    }

    ducks.delete(key);

    print(
        `${name} has been removed.`,
        "success"
    );

    updateField();
}

/* ================================================= */
/* SAY                                               */
/* ================================================= */

function duckSay(name, message) {

    if (!name || !message) {

        print(
            "Usage: /say <name> <message>",
            "error"
        );

        return;
    }

    if (
        name.toLowerCase() === "@all"
    ) {

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

    const key =
        name.toLowerCase();

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

/* ================================================= */
/* CHAOS                                             */
/* ================================================= */

function chaos(amount) {

    amount =
        Number(amount);

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

    for (
        let i = 1;
        i <= amount;
        i++
    ) {

        let name =
            `Random Duck ${i}`;

        while (
            ducks.has(
                name.toLowerCase()
            )
        ) {

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

/* ================================================= */
/* AREAS                                             */
/* ================================================= */

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

/* ================================================= */
/* ENTER AREA                                        */
/* ================================================= */

function enterArea(areaID) {

    const area =
        areas[areaID];

    if (!area) {

        print(
            "That area does not exist.",
            "error"
        );

        return;
    }

    fieldEntered = true;

    currentArea =
        areaID;

    const field =
        document.getElementById("field");

    field.style.display =
        "block";

    bossBattlefield.classList.remove(
        "boss-active"
    );

    Object.values(areas).forEach(
        (a) => {

            field.classList.remove(
                a.className
            );

        }
    );

    field.classList.add(
        area.className
    );

    print(
        `${area.emoji} You entered the ${area.name}!`,
        "success"
    );

    updateField();

    restoreWeatherVisuals();
}

/* ================================================= */
/* EXIT AREA                                         */
/* ================================================= */

function exitArea() {

    const field =
        document.getElementById("field");

    fieldEntered = false;

    currentArea = null;

    field.style.display =
        "none";

    Object.values(areas).forEach(
        (area) => {

            field.classList.remove(
                area.className
            );

        }
    );

    print(
        "You left the area. 🚪",
        "success"
    );
}

/* ================================================= */
/* DUCK VISUAL                                       */
/* ================================================= */

function createDuckVisual(duck) {

    const element =
        document.createElement("div");

    element.className =
        `field-duck ${duck.type}`;

    if (duck.frozen) {

        element.classList.add(
            "frozen"
        );
    }

    element.title =
        duck.name;

    const body =
        document.createElement("div");

    body.className =
        "duck-body";

    const head =
        document.createElement("div");

    head.className =
        "duck-head";

    const eye =
        document.createElement("div");

    eye.className =
        "duck-eye";

    const beak =
        document.createElement("div");

    beak.className =
        "duck-beak";

    head.appendChild(eye);
    head.appendChild(beak);

    element.appendChild(body);
    element.appendChild(head);

    return element;
}

/* ================================================= */
/* UPDATE FIELD                                      */
/* ================================================= */

function updateField() {

    const field =
        document.getElementById("field");

    if (!field) {
        return;
    }

    field
        .querySelectorAll(".field-duck")
        .forEach(
            duck => duck.remove()
        );

    ducks.forEach((duck) => {

        const element =
            createDuckVisual(duck);

        element.style.left =
            duck.x + "%";

        element.style.top =
            duck.y + "%";

        field.appendChild(element);
    });
}

/* ================================================= */
/* DUCK MOVEMENT                                     */
/* ================================================= */

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

            duck.dx =
                Math.abs(duck.dx);
        }

        if (duck.x >= 94) {

            duck.x = 94;

            duck.dx =
                -Math.abs(duck.dx);
        }

        if (duck.y <= 25) {

            duck.y = 25;

            duck.dy =
                Math.abs(duck.dy);
        }

        if (duck.y >= 90) {

            duck.y = 90;

            duck.dy =
                -Math.abs(duck.dy);
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

/* ================================================= */
/* UPDATE DUCK POSITIONS                             */
/* ================================================= */

function updateDuckPositions() {

    const field =
        document.getElementById("field");

    const elements =
        field.querySelectorAll(
            ".field-duck"
        );

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

/* ================================================= */
/* HELP                                              */
/* ================================================= */

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

/* ================================================= */
/* CODE                                              */
/* ================================================= */

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

/* ================================================= */
/* SECRET                                             */
/* ================================================= */

function unlockSecretCommands() {

    if (secretCommandsUnlocked) {

        print(
            "Secret commands are already unlocked.",
            "error"
        );

        return;
    }

    secretCommandsUnlocked =
        true;

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

    print("/duckcount - Count spawned ducks");
    print("/listducks - List spawned ducks");
    print("/teleport <name> - Teleport a duck");
    print("/quack @all - Make every duck quack");
    print("/freeze <duck> - Freeze a duck");
    print("/freeze @all - Freeze all ducks");
    print("/unfreeze <duck> - Unfreeze a duck");
    print("/unfreeze @all - Unfreeze all ducks");
}

function duckCount() {

    print(
        `There are ${ducks.size} spawned ducks. 🦆`
    );
}

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

        ducks.forEach(
            duck => duck.frozen = true
        );

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

        ducks.forEach(
            duck => duck.frozen = false
        );

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
/* WEATHER                                           */
/* ================================================= */

function getField() {
    return document.getElementById("field");
}

function removeWeatherEffects(type) {

    const field =
        getField();

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

function spawnRainDrop() {

    if (
        !fieldEntered ||
        currentWeather !== "rain" ||
        !weatherEffects.rain
    ) {
        return;
    }

    const field =
        getField();

    const drop =
        document.createElement("div");

    drop.className =
        "weather-effect rain-drop";

    drop.style.left =
        Math.random() * 100 + "%";

    drop.style.top =
        "-20px";

    field.appendChild(drop);

    setTimeout(
        () => drop.remove(),
        1100
    );
}

function spawnPuddle() {

    if (
        !fieldEntered ||
        currentWeather !== "rain" ||
        !weatherEffects.puddles
    ) {
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

    getField().appendChild(puddle);
}

function spawnSnowflake() {

    if (
        !fieldEntered ||
        currentWeather !== "snow" ||
        !weatherEffects.snow
    ) {
        return;
    }

    const snowflake =
        document.createElement("div");

    snowflake.className =
        "weather-effect snowflake";

    snowflake.textContent =
        "❄";

    snowflake.style.left =
        Math.random() * 100 + "%";

    snowflake.style.top =
        "-25px";

    snowflake.style.animationDuration =
        2 + Math.random() * 3 + "s";

    getField().appendChild(
        snowflake
    );

    setTimeout(
        () => snowflake.remove(),
        5500
    );
}

function spawnSnowman() {

    if (
        !fieldEntered ||
        currentWeather !== "snow" ||
        !weatherEffects.snowmen
    ) {
        return;
    }

    const snowman =
        document.createElement("div");

    snowman.className =
        "weather-snowman";

    snowman.textContent =
        "⛄";

    snowman.style.left =
        5 + Math.random() * 90 + "%";

    snowman.style.top =
        60 + Math.random() * 28 + "%";

    getField().appendChild(
        snowman
    );
}

function startRain() {

    if (!fieldEntered) {

        print(
            "Enter an area first before starting weather.",
            "error"
        );

        return;
    }

    currentWeather =
        "rain";

    const field =
        getField();

    field.classList.remove(
        "weather-snow"
    );

    field.classList.add(
        "weather-rain"
    );

    print(
        "🌧️ Rain has started!",
        "success"
    );

    restoreWeatherVisuals();
}

function startSnow() {

    if (!fieldEntered) {

        print(
            "Enter an area first before starting weather.",
            "error"
        );

        return;
    }

    currentWeather =
        "snow";

    const field =
        getField();

    field.classList.remove(
        "weather-rain"
    );

    field.classList.add(
        "weather-snow"
    );

    print(
        "❄️ Snow has started!",
        "success"
    );

    restoreWeatherVisuals();
}

function clearWeather() {

    const field =
        getField();

    currentWeather =
        null;

    field.classList.remove(
        "weather-rain"
    );

    field.classList.remove(
        "weather-snow"
    );

    print(
        "☀️ The current weather has been cleared.",
        "success"
    );
}

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

    if (
        !validTargets.includes(target)
    ) {

        print(
            "Choose rain, snow, puddles, snowmen, or @all.",
            "error"
        );

        return;
    }

    removeWeatherEffects(target);

    print(
        `🧹 ${target === "@all" ? "All" : target} weather effects have been cleared.`,
        "success"
    );
}

function restoreWeatherVisuals() {

    if (!fieldEntered) {
        return;
    }

    if (currentWeather === "rain") {

        spawnPuddle();
        spawnPuddle();
    }

    if (currentWeather === "snow") {

        spawnSnowman();
        spawnSnowman();
    }
}

/* ================================================= */
/* WEATHER LOOP                                      */
/* ================================================= */

setInterval(() => {

    if (!fieldEntered) {
        return;
    }

    if (currentWeather === "rain") {

        for (
            let i = 0;
            i < 3;
            i++
        ) {
            spawnRainDrop();
        }

        if (
            Math.random() < 0.025
        ) {
            spawnPuddle();
        }
    }

    if (currentWeather === "snow") {

        for (
            let i = 0;
            i < 2;
            i++
        ) {
            spawnSnowflake();
        }

        if (
            Math.random() < 0.01
        ) {
            spawnSnowman();
        }
    }

}, 120);

/* ================================================= */
/* DUCKCODE                                         */
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

function quackCode(message) {

    if (!message) {

        print(
            "Usage: /quackcode <message>",
            "error"
        );

        return;
    }

    print(
        "🦆 DUCKCODE:",
        "duck"
    );

    print(
        encodeDuckCode(message),
        "success"
    );
}

/* ================================================= */
/* SAVE                                              */
/* ================================================= */

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

        secretCommandsUnlocked,

        currentArea,

        currentWeather,

        attackLevel,

        unlockedBoss,

        bossDefeatCounts
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

/* ================================================= */
/* LOAD                                              */
/* ================================================= */

function loadGame(slot) {

    if (!slot) {

        print(
            "Usage: /load <number>",
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

                    duck.frozen =
                        duck.frozen === true;

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

        attackLevel =
            Number.isFinite(
                saveData.attackLevel
            )
                ? saveData.attackLevel
                : 10;

        unlockedBoss =
            Number.isFinite(
                saveData.unlockedBoss
            )
                ? saveData.unlockedBoss
                : 1;

        if (
            saveData.bossDefeatCounts
        ) {

            Object.keys(
                saveData.bossDefeatCounts
            ).forEach((key) => {

                bossDefeatCounts[key] =
                    Number(
                        saveData.bossDefeatCounts[key]
                    ) || 0;
            });
        }

        if (currentArea) {

            enterArea(
                currentArea
            );

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
/* BOSS STATUS                                       */
/* ================================================= */

function bossStatus() {

    print(
        "⚔️ BOSS STATUS",
        "duck"
    );

    print(
        `🪶 Feather Damage: ${attackLevel}`
    );

    print(
        `🔓 Highest Unlocked Boss: ${unlockedBoss}`
    );

    print(
        `❤️ Player HP: ${playerHP}/${MAX_PLAYER_HP}`
    );

    Object.entries(
        bossData
    ).forEach(
        ([id, boss]) => {

            const defeats =
                bossDefeatCounts[id] || 0;

            const hp =
                boss.baseHP *
                Math.pow(
                    2,
                    defeats
                );

            const unlocked =
                Number(id) <= unlockedBoss;

            print(
                `${boss.emoji} Boss ${id}: ${boss.name} | ` +
                `${unlocked ? "UNLOCKED" : "LOCKED"} | ` +
                `Next HP: ${hp} | ` +
                `Defeated: ${defeats}`
            );
        }
    );
}

/* ================================================= */
/* START BOSS                                        */
/* ================================================= */

function startBoss(bossNumber) {

    const id =
        Number(bossNumber);

    if (!Number.isInteger(id)) {

        print(
            "Usage: /boss <number>",
            "error"
        );

        return;
    }

    if (!bossData[id]) {

        print(
            `Boss ${id} does not exist yet.`,
            "error"
        );

        return;
    }

    if (id > unlockedBoss) {

        print(
            `Boss ${id} is locked! Defeat the previous boss first.`,
            "error"
        );

        return;
    }

    if (bossBattleActive) {

        print(
            "You are already fighting a boss!",
            "error"
        );

        return;
    }

    const boss =
        bossData[id];

    const previousDefeats =
        bossDefeatCounts[id] || 0;

    const bossHP =
        boss.baseHP *
        Math.pow(
            2,
            previousDefeats
        );

    currentBoss = {

        id,

        name: boss.name,

        emoji: boss.emoji,

        maxHP: bossHP,

        hp: bossHP
    };

    playerHP =
        MAX_PLAYER_HP;

    bossBattleActive =
        true;

    featherCooldown =
        false;

    clearBossProjectiles();

    bossVictory.classList.remove(
        "show"
    );

    bossDefeat.classList.remove(
        "show"
    );

    bossBattlefield.classList.add(
        "boss-active"
    );

    updateBossUI();

    print("");
    print("================================");
    print("⚔️ BOSS BATTLE");
    print("================================");

    print(
        `${boss.emoji} MEGA DUCKEY HAS APPEARED!`,
        "error"
    );

    print(
        "🖱️ Move your cursor around the battlefield."
    );

    print(
        "🖱️ LEFT-CLICK to fire a feather."
    );

    print(
        "⚠️ Red projectiles damage you when they hit your cursor."
    );

    print(
        "🪶 Feather Blaster cooldown: 7 seconds."
    );

    print("================================");

    startBossAttackLoop();
}

/* ================================================= */
/* BOSS UI                                           */
/* ================================================= */

function updateBossUI() {

    if (!currentBoss) {
        return;
    }

    const bossPercent =
        Math.max(
            0,
            currentBoss.hp /
            currentBoss.maxHP *
            100
        );

    bossHealthBar.style.width =
        bossPercent + "%";

    bossHealthText.textContent =
        `${currentBoss.hp} / ${currentBoss.maxHP}`;

    const playerPercent =
        Math.max(
            0,
            playerHP /
            MAX_PLAYER_HP *
            100
        );

    playerHealthBar.style.width =
        playerPercent + "%";

    playerHealthText.textContent =
        `❤️ ${playerHP} / ${MAX_PLAYER_HP}`;

    if (featherCooldown) {

        featherCooldownElement.textContent =
            "🪶 RECHARGING...";

        featherCooldownElement.classList.remove(
            "ready"
        );

    } else {

        featherCooldownElement.textContent =
            "🪶 READY";

        featherCooldownElement.classList.add(
            "ready"
        );
    }
}

/* ================================================= */
/* CURSOR MOVEMENT                                   */
/* ================================================= */

bossBattlefield.addEventListener(
    "mousemove",
    (event) => {

        if (!bossBattleActive) {
            return;
        }

        const rect =
            bossBattlefield.getBoundingClientRect();

        const x =
            event.clientX -
            rect.left;

        const y =
            event.clientY -
            rect.top;

        bossCursor.style.left =
            x + "px";

        bossCursor.style.top =
            y + "px";
    }
);

/* ================================================= */
/* PLAYER FEATHER                                    */
/* ================================================= */

function fireFeather() {

    if (!bossBattleActive) {
        return;
    }

    if (!currentBoss) {
        return;
    }

    if (featherCooldown) {

        print(
            "🪶 Feather Blaster is cooling down!",
            "error"
        );

        return;
    }

    featherCooldown =
        true;

    updateBossUI();

    const battlefieldRect =
        bossBattlefield.getBoundingClientRect();

    const cursorRect =
        bossCursor.getBoundingClientRect();

    const bossRect =
        megaDuckey.getBoundingClientRect();

    const startX =
        cursorRect.left -
        battlefieldRect.left +
        cursorRect.width / 2;

    const startY =
        cursorRect.top -
        battlefieldRect.top +
        cursorRect.height / 2;

    const targetX =
        bossRect.left -
        battlefieldRect.left +
        bossRect.width / 2;

    const targetY =
        bossRect.top -
        battlefieldRect.top +
        bossRect.height / 2;

    createFeatherProjectile(
        startX,
        startY,
        targetX,
        targetY
    );

    const damage =
        attackLevel;

    currentBoss.hp =
        Math.max(
            0,
            currentBoss.hp - damage
        );

    megaDuckey.classList.add(
        "hit"
    );

    setTimeout(() => {

        megaDuckey.classList.remove(
            "hit"
        );

    }, 120);

    updateBossUI();

    print(
        `🪶 FEATHER FIRED! -${damage} HP`,
        "success"
    );

    if (currentBoss.hp <= 0) {

        setTimeout(
            defeatBoss,
            150
        );

        return;
    }

    setTimeout(() => {

        featherCooldown =
            false;

        updateBossUI();

        if (bossBattleActive) {

            print(
                "🪶 Feather Blaster READY!",
                "success"
            );
        }

    }, FEATHER_COOLDOWN_TIME);
}

/* ================================================= */
/* CREATE FEATHER PROJECTILE                         */
/* ================================================= */

function createFeatherProjectile(
    startX,
    startY,
    targetX,
    targetY
) {

    const projectile =
        document.createElement("div");

    projectile.className =
        "feather-projectile";

    projectile.style.left =
        startX + "px";

    projectile.style.top =
        startY + "px";

    bossBattlefield.appendChild(
        projectile
    );

    const dx =
        targetX - startX;

    const dy =
        targetY - startY;

    const distance =
        Math.hypot(dx, dy);

    const duration =
        Math.max(
            150,
            distance * 2
        );

    projectile.style.transform =
        `translate(-50%, -50%) rotate(${Math.atan2(dy, dx)}rad)`;

    projectile.animate(
        [
            {
                left: startX + "px",
                top: startY + "px"
            },
            {
                left: targetX + "px",
                top: targetY + "px"
            }
        ],
        {
            duration,
            easing: "linear"
        }
    );

    setTimeout(
        () => projectile.remove(),
        duration + 50
    );
}

/* ================================================= */
/* BOSS ATTACK LOOP                                  */
/* ================================================= */

function startBossAttackLoop() {

    stopBossAttackLoop();

    bossAttackTimer =
        setInterval(() => {

            if (!bossBattleActive) {
                return;
            }

            bossAttack();

        }, 2500);

    bossProjectileTimer =
        setInterval(() => {

            if (!bossBattleActive) {
                return;
            }

            fireBossProjectile();

        }, 1000);
}

function stopBossAttackLoop() {

    if (
        bossAttackTimer !== null
    ) {

        clearInterval(
            bossAttackTimer
        );

        bossAttackTimer =
            null;
    }

    if (
        bossProjectileTimer !== null
    ) {

        clearInterval(
            bossProjectileTimer
        );

        bossProjectileTimer =
            null;
    }
}

/* ================================================= */
/* BOSS TEXT ATTACK                                  */
/* ================================================= */

function bossAttack() {

    if (!bossBattleActive) {
        return;
    }

    const attacks = [

        {
            name: "MEGA PECK",
            emoji: "💥🦆"
        },

        {
            name: "QUACK SHOCKWAVE",
            emoji: "🌊📢"
        },

        {
            name: "MEGA QUACK",
            emoji: "📢🦆"
        }
    ];

    const attack =
        attacks[
            Math.floor(
                Math.random() *
                attacks.length
            )
        ];

    print("");

    print(
        `${attack.emoji} MEGA DUCKEY USED ${attack.name}!`,
        "error"
    );

    print(
        "⚠️ Watch out for the incoming projectiles!"
    );
}

/* ================================================= */
/* FIRE BOSS PROJECTILE                             */
/* ================================================= */

function fireBossProjectile() {

    if (!bossBattleActive) {
        return;
    }

    const battlefieldWidth =
        bossBattlefield.clientWidth;

    const battlefieldHeight =
        bossBattlefield.clientHeight;

    const bossRect =
        megaDuckey.getBoundingClientRect();

    const battlefieldRect =
        bossBattlefield.getBoundingClientRect();

    const startX =
        bossRect.left -
        battlefieldRect.left +
        bossRect.width / 2;

    const startY =
        bossRect.top -
        battlefieldRect.top +
        bossRect.height / 2;

    const cursorRect =
        bossCursor.getBoundingClientRect();

    let targetX =
        cursorRect.left -
        battlefieldRect.left +
        cursorRect.width / 2;

    let targetY =
        cursorRect.top -
        battlefieldRect.top +
        cursorRect.height / 2;

    /* Add a little aiming variation */

    targetX +=
        (Math.random() - 0.5) * 120;

    targetY +=
        (Math.random() - 0.5) * 120;

    targetX =
        Math.max(
            10,
            Math.min(
                battlefieldWidth - 10,
                targetX
            )
        );

    targetY =
        Math.max(
            10,
            Math.min(
                battlefieldHeight - 10,
                targetY
            )
        );

    createBossProjectile(
        startX,
        startY,
        targetX,
        targetY
    );
}

/* ================================================= */
/* CREATE BOSS PROJECTILE                            */
/* ================================================= */

function createBossProjectile(
    startX,
    startY,
    targetX,
    targetY
) {

    const projectile =
        document.createElement("div");

    projectile.className =
        "boss-projectile";

    projectile.style.left =
        startX + "px";

    projectile.style.top =
        startY + "px";

    bossBattlefield.appendChild(
        projectile
    );

    const dx =
        targetX - startX;

    const dy =
        targetY - startY;

    const distance =
        Math.hypot(dx, dy);

    const speed =
        260;

    const vx =
        dx / distance * speed;

    const vy =
        dy / distance * speed;

    const projectileData = {

        element: projectile,

        x: startX,

        y: startY,

        vx,

        vy,

        radius: 11,

        dead: false
    };

    bossProjectiles.push(
        projectileData
    );
}

/* ================================================= */
/* PROJECTILE COLLISION LOOP                        */
/* ================================================= */

function updateBossProjectiles(deltaTime) {

    if (!bossBattleActive) {
        return;
    }

    const battlefieldWidth =
        bossBattlefield.clientWidth;

    const battlefieldHeight =
        bossBattlefield.clientHeight;

    const cursorRect =
        bossCursor.getBoundingClientRect();

    const battlefieldRect =
        bossBattlefield.getBoundingClientRect();

    const cursorX =
        cursorRect.left -
        battlefieldRect.left +
        cursorRect.width / 2;

    const cursorY =
        cursorRect.top -
        battlefieldRect.top +
        cursorRect.height / 2;

    const cursorRadius =
        15;

    for (
        let i = bossProjectiles.length - 1;
        i >= 0;
        i--
    ) {

        const projectile =
            bossProjectiles[i];

        if (projectile.dead) {

            bossProjectiles.splice(
                i,
                1
            );

            continue;
        }

        projectile.x +=
            projectile.vx *
            deltaTime;

        projectile.y +=
            projectile.vy *
            deltaTime;

        projectile.element.style.left =
            projectile.x + "px";

        projectile.element.style.top =
            projectile.y + "px";

        const distance =
            Math.hypot(
                projectile.x - cursorX,
                projectile.y - cursorY
            );

        /* COLLISION WITH CURSOR */

        if (
            distance <=
            projectile.radius +
            cursorRadius
        ) {

            projectile.dead =
                true;

            projectile.element.remove();

            bossProjectiles.splice(
                i,
                1
            );

            damagePlayer(10);

            continue;
        }

        /* Remove projectile outside battlefield */

        if (
            projectile.x < -50 ||
            projectile.x >
                battlefieldWidth + 50 ||
            projectile.y < -50 ||
            projectile.y >
                battlefieldHeight + 50
        ) {

            projectile.dead =
                true;

            projectile.element.remove();

            bossProjectiles.splice(
                i,
                1
            );
        }
    }
}

/* ================================================= */
/* PLAYER DAMAGE                                     */
/* ================================================= */

function damagePlayer(damage) {

    if (!bossBattleActive) {
        return;
    }

    playerHP =
        Math.max(
            0,
            playerHP - damage
        );

    updateBossUI();

    bossBattlefield.classList.remove(
        "player-hit"
    );

    void bossBattlefield.offsetWidth;

    bossBattlefield.classList.add(
        "player-hit"
    );

    print(
        `💥 A boss projectile hit you! -${damage} HP`,
        "error"
    );

    print(
        `❤️ Your HP: ${playerHP}/${MAX_PLAYER_HP}`
    );

    if (playerHP <= 0) {

        playerDefeated();
    }
}

/* ================================================= */
/* CLEAR PROJECTILES                                */
/* ================================================= */

function clearBossProjectiles() {

    bossProjectiles.forEach(
        projectile => {

            projectile.element.remove();
        }
    );

    bossProjectiles.length =
        0;
}

/* ================================================= */
/* PLAYER DEFEATED                                  */
/* ================================================= */

function playerDefeated() {

    bossBattleActive =
        false;

    currentBoss =
        null;

    stopBossAttackLoop();

    clearBossProjectiles();

    featherCooldown =
        false;

    bossDefeat.classList.add(
        "show"
    );

    print("");
    print("================================");

    print(
        "💀 YOU WERE DEFEATED!",
        "error"
    );

    print(
        "Mega Duckey wins! 🦆"
    );

    print(
        "Your boss battle has ended."
    );

    print(
        "Type /boss 1 to try again."
    );

    print("================================");

    setTimeout(() => {

        bossBattlefield.classList.remove(
            "boss-active"
        );

        bossDefeat.classList.remove(
            "show"
        );

    }, 1800);
}

/* ================================================= */
/* BOSS DEFEATED                                    */
/* ================================================= */

function defeatBoss() {

    if (!currentBoss) {
        return;
    }

    const defeatedID =
        currentBoss.id;

    const defeatedBossName =
        currentBoss.name;

    bossBattleActive =
        false;

    stopBossAttackLoop();

    clearBossProjectiles();

    featherCooldown =
        false;

    megaDuckey.classList.add(
        "defeated"
    );

    bossDefeatCounts[defeatedID] =
        (bossDefeatCounts[defeatedID] || 0) + 1;

    attackLevel += 10;

    const nextBoss =
        defeatedID + 1;

    if (
        bossData[nextBoss] &&
        nextBoss > unlockedBoss
    ) {

        unlockedBoss =
            nextBoss;
    }

    bossVictory.classList.add(
        "show"
    );

    print("");
    print("================================");

    print(
        `🏆 ${defeatedBossName} DEFEATED!`,
        "success"
    );

    print(
        "🪶 YOUR ATTACK LEVEL INCREASED!"
    );

    print(
        `🪶 New Feather Damage: ${attackLevel}`,
        "success"
    );

    print(
        `🏆 Boss ${defeatedID} defeats: ` +
        `${bossDefeatCounts[defeatedID]}`
    );

    if (bossData[nextBoss]) {

        print(
            `🔓 BOSS ${nextBoss} UNLOCKED!`,
            "success"
        );

        print(
            `Type /boss ${nextBoss} to fight them.`
        );

    } else {

        print(
            "There are no more bosses available yet."
        );
    }

    print("================================");

    currentBoss =
        null;

    setTimeout(() => {

        bossVictory.classList.remove(
            "show"
        );

        bossBattlefield.classList.remove(
            "boss-active"
        );

        megaDuckey.classList.remove(
            "defeated"
        );

    }, 2200);
}

/* ================================================= */
/* COMMAND PROCESSOR                                */
/* ================================================= */

function runCommand(command) {

    command =
        command.trim();

    if (!command) {
        return;
    }

    print(
        "> " + command
    );

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

    if (commandName === "/help") {

        help();

    } else if (
        commandName === "/spawn"
    ) {

        spawnDuck(
            parts.slice(1).join(" ")
        );

    } else if (
        commandName === "/remove"
    ) {

        removeDuck(
            parts.slice(1).join(" ")
        );

    } else if (
        commandName === "/say"
    ) {

        duckSay(
            parts[1],
            parts.slice(2).join(" ")
        );

    } else if (
        commandName === "/chaos"
    ) {

        chaos(parts[1]);

    } else if (
        commandName === "/enterfield"
    ) {

        enterArea("field");

    } else if (
        commandName === "/enterforest"
    ) {

        enterArea("forest");

    } else if (
        commandName === "/enterlake"
    ) {

        enterArea("lake");

    } else if (
        commandName === "/enterfarm"
    ) {

        enterArea("farm");

    } else if (
        commandName === "/entervillage"
    ) {

        enterArea("village");

    } else if (
        commandName === "/entermarket"
    ) {

        enterArea("market");

    } else if (
        commandName === "/exitfield"
    ) {

        exitArea();

    } else if (
        commandName === "/rain"
    ) {

        startRain();

    } else if (
        commandName === "/snow"
    ) {

        startSnow();

    } else if (
        commandName === "/quackcode"
    ) {

        quackCode(
            parts.slice(1).join(" ")
        );

    } else if (
        commandName === "/clearweather"
    ) {

        clearWeather();

    } else if (
        commandName === "/clearweathereffects"
    ) {

        clearWeatherEffects(
            parts[1]
        );

    } else if (
        commandName === "/boss"
    ) {

        startBoss(
            parts[1]
        );

    } else if (
        commandName === "/bossstatus"
    ) {

        bossStatus();

    } else if (
        commandName === "/code"
    ) {

        showCode();

    } else if (
        commandName === "/save"
    ) {

        saveGame(
            parts[1]
        );

    } else if (
        commandName === "/load"
    ) {

        loadGame(
            parts[1]
        );

    } else if (
        commandName === "/clear"
    ) {

        output.innerHTML =
            "";

    } else if (
        commandName === "/78096"
    ) {

        unlockSecretCommands();

    } else if (
        commandName === "/secrethelp"
    ) {

        secretHelp();

    } else if (
        commandName === "/duckcount"
    ) {

        if (!secretCommandsUnlocked) {

            print(
                "Unknown command.",
                "error"
            );

            return;
        }

        duckCount();

    } else if (
        commandName === "/listducks"
    ) {

        if (!secretCommandsUnlocked) {

            print(
                "Unknown command.",
                "error"
            );

            return;
        }

        listDucks();

    } else if (
        commandName === "/teleport"
    ) {

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

    } else if (
        commandName === "/quack"
    ) {

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

    } else if (
        commandName === "/freeze"
    ) {

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

    } else if (
        commandName === "/unfreeze"
    ) {

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

    } else {

        print(
            `Unknown command: ${commandName}`,
            "error"
        );

        print(
            "Type /help for available commands."
        );
    }
}

/* ================================================= */
/* INPUT                                             */
/* ================================================= */

if (input) {

    input.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter"
            ) {

                runCommand(
                    input.value
                );

                input.value =
                    "";
            }
        }
    );
}

/* ================================================= */
/* CLICK TO ATTACK                                   */
/* ================================================= */

bossBattlefield.addEventListener(
    "click",
    (event) => {

        if (!bossBattleActive) {
            return;
        }

        fireFeather();
    }
);

/* ================================================= */
/* RIGHT CLICK                                       */
/* ================================================= */

bossBattlefield.addEventListener(
    "contextmenu",
    (event) => {

        if (bossBattleActive) {

            event.preventDefault();

            print(
                "🖱️ Right-click does not fire. LEFT-CLICK to shoot a Feather!"
            );
        }
    }
);

/* ================================================= */
/* BOSS PROJECTILE GAME LOOP                         */
/* ================================================= */

let previousFrameTime =
    performance.now();

function bossGameLoop(currentTime) {

    const deltaTime =
        Math.min(
            (currentTime -
                previousFrameTime) / 1000,
            0.05
        );

    previousFrameTime =
        currentTime;

    updateBossProjectiles(
        deltaTime
    );

    requestAnimationFrame(
        bossGameLoop
    );
}

requestAnimationFrame(
    bossGameLoop
);

/* ================================================= */
/* DUCK MOVEMENT LOOP                                */
/* ================================================= */

setInterval(
    moveDucks,
    50
);

/* ================================================= */
/* STARTUP                                           */
/* ================================================= */

print(
    "Duckey Console v1.0"
);

print(
    "Type /help for commands."
);

print(
    "Try /help"
);

print(
    "⚔️ Boss battles are available with /boss 1!"
);
