// ==========================================
// 🦆 QUACKSCRIPT ENGINE
// Duckey Console - Advanced Mode
// ==========================================

const QuackScript = {
    variables: {},
    output: [],

    reset() {
        this.variables = {};
        this.output = [];
    },

    print(message) {
        this.output.push(message);
        console.log("[QUACKSCRIPT]", message);
    },

    error(message) {
        const errorMessage = `QUACKSCRIPT ERROR: ${message}`;
        this.output.push(errorMessage);
        console.error(errorMessage);
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

        const lines = code.split(/\r?\n/);

        for (let i = 0; i < lines.length; i++) {
            const rawLine = lines[i];
            const lineNumber = i + 1;

            const line = rawLine.trim();

            // Ignore empty lines
            if (line === "") {
                continue;
            }

            // Ignore comments
            if (line.startsWith("#")) {
                continue;
            }

            this.executeLine(line, lineNumber);
        }

        return this.output;
    },

    executeLine(line, lineNumber) {

        // ------------------------------------------
        // Create Variable
        // ------------------------------------------

        if (line.startsWith("Create Variable ")) {
            const name = line
                .substring("Create Variable ".length)
                .trim();

            this.createVariable(name);
            return;
        }

        // ------------------------------------------
        // Variable assignment
        // Example:
        // Coins = 100
        // ------------------------------------------

        if (line.includes("=")) {
            const parts = line.split("=");

            if (parts.length !== 2) {
                this.error(`Line ${lineNumber}: Invalid assignment.`);
                return;
            }

            const name = parts[0].trim();
            const valueText = parts[1].trim();

            if (!name) {
                this.error(`Line ${lineNumber}: Missing variable name.`);
                return;
            }

            let value;

            // Number
            if (!isNaN(valueText) && valueText !== "") {
                value = Number(valueText);
            }

            // Text
            else if (
                valueText.startsWith('"') &&
                valueText.endsWith('"')
            ) {
                value = valueText.slice(1, -1);
            }

            // Unknown value
            else {
                this.error(
                    `Line ${lineNumber}: Unknown value "${valueText}".`
                );
                return;
            }

            this.setVariable(name, value);
            return;
        }

        // ------------------------------------------
        // Unknown command
        // ------------------------------------------

        this.error(
            `Line ${lineNumber}: Unknown command "${line}".`
        );
    }
};


// ==========================================
// 🦆 Easy function for the Advanced Console
// ==========================================

function runQuackScript(code) {
    return QuackScript.run(code);
}


// ==========================================
// 🧪 TEST
// ==========================================

const testQuackScript = `
#DuckeyIsBest

Create Variable Coins
Coins = 100
`;

runQuackScript(testQuackScript);
