// ==========================================
// 🦆 QUACKSCRIPT ENGINE
// Duckey Console - Advanced Mode
// ==========================================

const QuackScript = {
    variables: {},
    output: [],
    running: false,

    reset() {
        this.variables = {};
        this.output = [];
        this.running = false;
    },

    print(message) {
        this.output.push(message);
        console.log("[QUACKSCRIPT]", message);
        addQSOutput(message);
    },

    error(message) {
        const errorMessage = `QUACKSCRIPT ERROR: ${message}`;
        this.output.push(errorMessage);
        console.error(errorMessage);
        addQSOutput(errorMessage, true);
    },

    createVariable(name) {
        if (!name) {
            this.error("Variable name is missing.");
            return;
        }

        if (this.variables[name] !== undefined) {
            this.error(`Variable "${name}" already exists.`);
            return;
        }

        this.variables[name] = null;
        this.print(`Created variable "${name}".`);
    },

    setVariable(name, value) {
        if (this.variables[name] === undefined) {
            this.error(`Variable "${name}" does not exist.`);
            return;
        }

        this.variables[name] = value;
        this.print(`${name} = ${value}`);
    },

    run(code) {
        this.reset();
        this.running = true;

        clearQSOutput();
        addQSOutput("▶ Running QuackScript...");

        const lines = code.split(/\r?\n/);

        for (let i = 0; i < lines.length; i++) {
            if (!this.running) {
                addQSOutput("■ QuackScript stopped.");
                return;
            }

            const line = lines[i].trim();

            if (line === "") {
                continue;
            }

            // Comments
            if (line.startsWith("#")) {
                continue;
            }

            // QuackScript block markers
            if (
                line === "//" ||
                line === "-" ||
                line === "--" ||
                line === "\\\\"
            ) {
                continue;
            }

            this.executeLine(line, i + 1);
        }

        if (this.running) {
            addQSOutput("✓ QuackScript finished.");
        }

        this.running = false;
    },

    executeLine(line, lineNumber) {

        // Create Variable
        if (line.startsWith("Create Variable ")) {

            const name = line
                .substring("Create Variable ".length)
                .trim();

            this.createVariable(name);
            return;
        }

        // Variable assignment
        if (line.includes("=")) {

            const parts = line.split("=");

            if (parts.length !== 2) {
                this.error(
                    `Line ${lineNumber}: Invalid assignment.`
                );
                return;
            }

            const name = parts[0].trim();
            const valueText = parts[1].trim();

            let value;

            // Number
            if (
                valueText !== "" &&
                !isNaN(valueText)
            ) {
                value = Number(valueText);
            }

            // Text
            else if (
                valueText.startsWith('"') &&
                valueText.endsWith('"')
            ) {
                value = valueText.slice(1, -1);
            }

            else {
                // Sprite commands aren't variables yet
                this.print(`Read command: ${line}`);
                return;
            }

            this.setVariable(name, value);
            return;
        }

        // Sprite commands
        if (line === "Create Sprite") {
            this.print("Creating sprite...");
            return;
        }

        if (line.startsWith("Sprite Parts")) {
            this.print(`Sprite parts: ${line}`);
            return;
        }

        if (line.startsWith("Sprite Colour")) {
            this.print(`Sprite colours: ${line}`);
            return;
        }

        if (line.startsWith("Sprite =")) {
            this.print(`Sprite selected: ${line}`);
            return;
        }

        // Unknown command
        this.error(
            `Line ${lineNumber}: Unknown command "${line}".`
        );
    }
};


// ==========================================
// 🦆 ADVANCED TAB BUTTONS
// ==========================================

const qsEditor = document.getElementById("quackScriptEditor");
const qsOutput = document.getElementById("quackScriptOutput");

const qsRunButton = document.getElementById("qsRunButton");
const qsStopButton = document.getElementById("qsStopButton");
const qsNewButton = document.getElementById("qsNewButton");
const qsSaveButton = document.getElementById("qsSaveButton");
const qsLoadButton = document.getElementById("qsLoadButton");
const qsClearButton = document.getElementById("qsClearButton");
const qsFileInput = document.getElementById("qsFileInput");


// ==========================================
// OUTPUT
// ==========================================

function addQSOutput(message, error = false) {

    if (!qsOutput) return;

    const p = document.createElement("p");

    p.className = error
        ? "qs-error"
        : "qs-info";

    p.textContent = message;

    qsOutput.appendChild(p);

    qsOutput.scrollTop = qsOutput.scrollHeight;
}


function clearQSOutput() {

    if (!qsOutput) return;

    qsOutput.innerHTML = "";
}


// ==========================================
// ▶ RUN
// ==========================================

if (qsRunButton) {

    qsRunButton.addEventListener("click", () => {

        const code = qsEditor.value;

        if (!code.trim()) {
            addQSOutput(
                "QUACKSCRIPT ERROR: No code to run.",
                true
            );
            return;
        }

        QuackScript.run(code);
    });
}


// ==========================================
// ■ STOP
// ==========================================

if (qsStopButton) {

    qsStopButton.addEventListener("click", () => {

        QuackScript.running = false;

        addQSOutput("■ QuackScript stopped.");
    });
}


// ==========================================
// NEW
// ==========================================

if (qsNewButton) {

    qsNewButton.addEventListener("click", () => {

        qsEditor.value =
`#DuckeyIsBest

//

Create Variable Coins
Coins = 100`;

        clearQSOutput();

        addQSOutput(
            "New QuackScript created."
        );
    });
}


// ==========================================
// SAVE .QS
// ==========================================

if (qsSaveButton) {

    qsSaveButton.addEventListener("click", () => {

        const code = qsEditor.value;

        const blob = new Blob(
            [code],
            { type: "text/plain" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "duckey-script.qs";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        addQSOutput(
            "✓ Saved duckey-script.qs"
        );
    });
}


// ==========================================
// LOAD .QS
// ==========================================

if (qsLoadButton) {

    qsLoadButton.addEventListener("click", () => {

        qsFileInput.click();
    });
}


if (qsFileInput) {

    qsFileInput.addEventListener("change", (event) => {

        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {

            qsEditor.value = reader.result;

            clearQSOutput();

            addQSOutput(
                `✓ Loaded ${file.name}`
            );
        };

        reader.readAsText(file);

        // Allow loading the same file again
        event.target.value = "";
    });
}


// ==========================================
// CLEAR
// ==========================================

if (qsClearButton) {

    qsClearButton.addEventListener("click", () => {

        qsEditor.value = "";

        clearQSOutput();

        addQSOutput(
            "Editor cleared."
        );
    });
}
