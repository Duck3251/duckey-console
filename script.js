const input = document.getElementById("commandInput");
const output = document.getElementById("output");

const ducks = new Map();

let secretCommandsUnlocked = false;
let fieldEntered = false;


/* ============================= */
/* NORMAL COMMANDS */
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
    "/exitfield": "Leave the duck field.",
    "/code": "Show the secret code puzzle.",
    "/save <number>": "Save your game to a numbered slot.",
    "/load <number>": "Load a numbered save slot.",
    "/clear": "Clear the console."
};


/* ============================= */
/* OUTPUT */
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
/* RANDOM DUCK TYPE */
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
/* CREATE DUCK DATA */
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
/* SPAWN DUCK */
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
/* REMOVE DUCK */
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


/* ============================= */
/* DUCK SAY */
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
/* CHAOS */
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

        while (
            ducks.has(name.toLowerCase())
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


/* ============================= */
/* ENTER FIELD */
/* ============================= */

function enterField() {
    const field =
        document.getElementById("field");

    field.style.display = "block";

    fieldEntered = true;

    print(
        "You entered the duck field! 🌳🦆",
        "success"
    );

    updateField();
}


/* ============================= */
/* EXIT FIELD */
/* ============================= */

function exitField() {
    const field =
        document.getElementById("field");

    field.style.display = "none";

    fieldEntered = false;

    print(
        "You left the duck field. 🚪",
        "success"
    );
}


/* ============================= */
/* CREATE DUCK VISUAL */
/* ============================= */

function createDuckVisual(duck) {

    const element =
        document.createElement("div");

    element.className =
        `field-duck ${duck.type}`;

    if (duck.frozen) {
        element.classList.add("frozen");
    }

    element.title = duck.name;


    /* BODY */

    const body =
        document.createElement("div");

    body.className = "duck-body";


    /* HEAD */

    const head =
        document.createElement("div");

    head.className = "duck-head";


    /* EYE */

    const eye =
        document.createElement("div");

    eye.className = "duck-eye";


    /* BEAK */

    const beak =
        document.createElement("div");

    beak.className = "duck-beak";


    /*
     * CORRECT STRUCTURE:
     *
     * field-duck
     * ├── duck-body
     * └── duck-head
     *     ├── duck-eye
     *     └── duck-beak
     *
     * The beak is ON THE HEAD.
     */

    head.appendChild(eye);
    head.appendChild(beak);

    element.appendChild(body);
    element.appendChild(head);

    return element;
}


/* ============================= */
/* UPDATE FIELD */
/* ============================= */

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


/* ============================= */
/* DUCK MOVEMENT */
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


        /* LEFT */

        if (duck.x <= 2) {
            duck.x = 2;
            duck.dx = Math.abs(duck.dx);
        }


        /* RIGHT */

        if (duck.x >= 94) {
            duck.x = 94;
            duck.dx = -Math.abs(duck.dx);
        }


        /* TOP */

        if (duck.y <= 25) {
            duck.y = 25;
            duck.dy = Math.abs(duck.dy);
        }


        /* BOTTOM */

        if (duck.y >= 90) {
            duck.y = 90;
            duck.dy = -Math.abs(duck.dy);
        }


        /* RANDOM WANDERING */

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
/* UPDATE DUCK POSITIONS */
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
/* HELP */
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
/* CODE PUZZLE */
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
/* SECRET UNLOCK */
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
/* SECRET HELP */
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
        "/freeze <name> - Freeze a duck"
    );

    print(
        "/freeze @all - Freeze all ducks"
    );

    print(
        "/unfreeze <name> - Unfreeze a duck"
    );

    print(
        "/unfreeze @all - Unfreeze all ducks"
    );
}


/* ============================= */
/* DUCK COUNT */
/* ============================= */

function duckCount() {

    print(
        `There are ${ducks.size} spawned ducks. 🦆`
    );
}


/* ============================= */
/* LIST DUCKS */
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
/* TELEPORT */
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
            "Enter the field first.",
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
/* QUACK ALL */
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
/* FREEZE DUCK */
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

    const key =
        target.toLowerCase();

    const duck =
        ducks.get(key);

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
/* UNFREEZE DUCK */
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

    const key =
        target.toLowerCase();

    const duck =
        ducks.get(key);

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


/* ============================= */
/* SAVE GAME */
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
        ducks: Array.from(
            ducks.entries()
        ),

        secretCommandsUnlocked:
            secretCommandsUnlocked
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
/* LOAD GAME */
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

                    if (
                        typeof duck.x !==
                        "number"
                    ) {
                        duck.x =
                            10 +
                            Math.random() * 80;
                    }

                    if (
                        typeof duck.y !==
                        "number"
                    ) {
                        duck.y =
                            35 +
                            Math.random() * 50;
                    }

                    if (
                        typeof duck.dx !==
                        "number"
                    ) {
                        duck.dx =
                            (Math.random() - 0.5) *
                            0.12;
                    }

                    if (
                        typeof duck.dy !==
                        "number"
                    ) {
                        duck.dy =
                            (Math.random() - 0.5) *
                            0.12;
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

        updateField();

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


/* ============================= */
/* COMMAND PROCESSOR */
/* ============================= */

function runCommand(command) {

    command = command.trim();

    if (!command) {
        return;
    }

    print("> " + command);


    /* SECRET CODE DISCOVERY */

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


    /* NORMAL COMMANDS */

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

    else if (commandName === "/enterfield") {

        enterField();

    }

    else if (commandName === "/exitfield") {

        exitField();

    }

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


    /* SECRET UNLOCK */

    else if (commandName === "/78096") {

        unlockSecretCommands();

    }

    else if (commandName === "/secrethelp") {

        secretHelp();

    }


    /* SECRET COMMANDS */

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
/* KEYBOARD INPUT */
/* ============================= */

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


/* ============================= */
/* MOVEMENT LOOP */
/* ============================= */

setInterval(
    moveDucks,
    50
);


/* ============================= */
/* STARTUP */
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
