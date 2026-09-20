// ==========================================
// 🦆 QUACKSCRIPT ENGINE
// Duckey Console - Advanced Mode
// ==========================================

function createQuackSprite(name) {
    const field = document.getElementById("field");

    if (!field) {
        console.error("QUACKSCRIPT ERROR: #field not found.");
        return null;
    }

    const sprite = document.createElement("div");

    sprite.className = "qs-sprite";
    sprite.dataset.spriteName = name;

    sprite.innerHTML = `
        <div class="qs-duck-body"></div>

        <div class="qs-duck-head">
            <div class="qs-duck-eye"></div>
            <div class="qs-duck-beak"></div>
        </div>
    `;

    sprite.style.left = "50%";
    sprite.style.top = "50%";

    field.appendChild(sprite);

    return sprite;
}


// ==========================================
// 🦆 QUACKSCRIPT
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

        console.log(
            "[QUACKSCRIPT]",
            message
        );

        addQSOutput(message);
    },

    error(message) {

        const errorMessage =
            `QUACKSCRIPT ERROR: ${message}`;

        this.output.push(errorMessage);

        console.error(errorMessage);

        addQSOutput(
            errorMessage,
            true
        );
    },


    // ==========================================
    // VARIABLES
    // ==========================================

    createVariable(name) {

        if (!name) {

            this.error(
                "Variable name is missing."
            );

            return;
        }

        if (
            this.variables[name] !== undefined
        ) {

            this.error(
                `Variable "${name}" already exists.`
            );

            return;
        }

        this.variables[name] = null;

        this.print(
            `Created variable "${name}".`
        );
    },


    setVariable(name, value) {

        if (
            this.variables[name] === undefined
        ) {

            this.error(
                `Variable "${name}" does not exist.`
            );

            return;
        }

        this.variables[name] = value;

        this.print(
            `${name} = ${value}`
        );
    },


    // ==========================================
    // RUN QUACKSCRIPT
    // ==========================================

    run(code) {

        this.reset();

        this.running = true;

        clearQSOutput();

        addQSOutput(
            "▶ Running QuackScript..."
        );

        const lines =
            code.split(/\r?\n/);


        for (
            let i = 0;
            i < lines.length;
            i++
        ) {

            if (!this.running) {

                addQSOutput(
                    "■ QuackScript stopped."
                );

                return;
            }


            const line =
                lines[i].trim();


            // Ignore empty lines
            if (line === "") {
                continue;
            }


            // ==================================
            // COMMENTS
            // ==================================

            if (
                line.startsWith("#")
            ) {
                continue;
            }


            // ==================================
            // BLOCK MARKERS
            // ==================================

            if (
                line === "//" ||
                line === "-" ||
                line === "--" ||
                line === "\\\\"
            ) {
                continue;
            }


            this.executeLine(
                line,
                i + 1
            );
        }


        if (this.running) {

            addQSOutput(
                "✓ QuackScript finished."
            );
        }

        this.running = false;
    },


    // ==========================================
    // EXECUTE ONE LINE
    // ==========================================

    executeLine(
        line,
        lineNumber
    ) {


        // ==================================
        // CREATE VARIABLE
        // ==================================

        if (
            line.startsWith(
                "Create Variable "
            )
        ) {

            const name =
                line
                    .substring(
                        "Create Variable ".length
                    )
                    .trim();

            this.createVariable(name);

            return;
        }


        // ==================================
        // CREATE SPRITE
        // ==================================

        if (
            line === "Create Sprite"
        ) {

            this.print(
                "Creating sprite..."
            );

            return;
        }


        // ==================================
        // SPRITE PARTS
        // ==================================

        if (
            line.startsWith(
                "Sprite Parts"
            )
        ) {

            this.print(
                `Sprite parts: ${line}`
            );

            return;
        }


        // ==================================
        // SPRITE COLOUR
        // ==================================

        if (
            line.startsWith(
                "Sprite Colour"
            )
        ) {

            this.print(
                `Sprite colours: ${line}`
            );

            return;
        }


        // ==================================
        // SPRITE = NAME
        // ==================================

        if (
            line.startsWith(
                "Sprite ="
            )
        ) {

            const spriteName =
                line
                    .substring(
                        "Sprite =".length
                    )
                    .trim();


            if (!spriteName) {

                this.error(
                    `Line ${lineNumber}: Sprite name is missing.`
                );

                return;
            }


            const sprite =
                createQuackSprite(
                    spriteName
                );


            if (sprite) {

                this.print(
                    `Created sprite "${spriteName}".`
                );
            }

            return;
        }


        // ==================================
        // VARIABLE ASSIGNMENT
        // ==================================

        if (
            line.includes("=")
        ) {

            const parts =
                line.split("=");


            if (
                parts.length !== 2
            ) {

                this.error(
                    `Line ${lineNumber}: Invalid assignment.`
                );

                return;
            }


            const name =
                parts[0].trim();

            const valueText =
                parts[1].trim();


            if (!name) {

                this.error(
                    `Line ${lineNumber}: Missing variable name.`
                );

                return;
            }


            let value;


            // Number
            if (
                valueText !== "" &&
                !isNaN(valueText)
            ) {

                value =
                    Number(valueText);
            }


            // Text
            else if (
                valueText.startsWith('"') &&
                valueText.endsWith('"')
            ) {

                value =
                    valueText.slice(
                        1,
                        -1
                    );
            }


            // Other command/value
            else {

                this.error(
                    `Line ${lineNumber}: Unknown value "${valueText}".`
                );

                return;
            }


            this.setVariable(
                name,
                value
            );

            return;
        }


        // ==================================
        // UNKNOWN COMMAND
        // ==================================

        this.error(
            `Line ${lineNumber}: Unknown command "${line}".`
        );
    }
};


// ==========================================
// 🦆 ADVANCED TAB ELEMENTS
// ==========================================

const qsEditor =
    document.getElementById(
        "quackScriptEditor"
    );

const qsOutput =
    document.getElementById(
        "quackScriptOutput"
    );

const qsRunButton =
    document.getElementById(
        "qsRunButton"
    );

const qsStopButton =
    document.getElementById(
        "qsStopButton"
    );

const qsNewButton =
    document.getElementById(
        "qsNewButton"
    );

const qsSaveButton =
    document.getElementById(
        "qsSaveButton"
    );

const qsLoadButton =
    document.getElementById(
        "qsLoadButton"
    );

const qsClearButton =
    document.getElementById(
        "qsClearButton"
    );

const qsFileInput =
    document.getElementById(
        "qsFileInput"
    );


// ==========================================
// OUTPUT
// ==========================================

function addQSOutput(
    message,
    error = false
) {

    if (!qsOutput) {
        return;
    }


    const p =
        document.createElement("p");


    p.className =
        error
            ? "qs-error"
            : "qs-info";


    p.textContent =
        message;


    qsOutput.appendChild(p);


    qsOutput.scrollTop =
        qsOutput.scrollHeight;
}


function clearQSOutput() {

    if (!qsOutput) {
        return;
    }

    qsOutput.innerHTML = "";
}


// ==========================================
// ▶ RUN .QS
// ==========================================

if (qsRunButton) {

    qsRunButton.addEventListener(
        "click",
        () => {

            const code =
                qsEditor.value;


            if (!code.trim()) {

                addQSOutput(
                    "QUACKSCRIPT ERROR: No code to run.",
                    true
                );

                return;
            }


            QuackScript.run(code);
        }
    );
}


// ==========================================
// ■ STOP
// ==========================================

if (qsStopButton) {

    qsStopButton.addEventListener(
        "click",
        () => {

            QuackScript.running =
                false;


            addQSOutput(
                "■ QuackScript stopped."
            );
        }
    );
}


// ==========================================
// NEW
// ==========================================

if (qsNewButton) {

    qsNewButton.addEventListener(
        "click",
        () => {

            qsEditor.value =
``;


            clearQSOutput();


            addQSOutput(
                "New QuackScript created."
            );
        }
    );
}


// ==========================================
// SAVE .QS
// ==========================================

if (qsSaveButton) {

    qsSaveButton.addEventListener(
        "click",
        () => {

            const code =
                qsEditor.value;


            const blob =
                new Blob(
                    [code],
                    {
                        type:
                            "text/plain"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                "duckey-script.qs";


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            URL.revokeObjectURL(
                url
            );


            addQSOutput(
                "✓ Saved duckey-script.qs"
            );
        }
    );
}


// ==========================================
// LOAD .QS
// ==========================================

if (qsLoadButton) {

    qsLoadButton.addEventListener(
        "click",
        () => {

            qsFileInput.click();
        }
    );
}


if (qsFileInput) {

    qsFileInput.addEventListener(
        "change",
        (event) => {

            const file =
                event.target.files[0];


            if (!file) {
                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                () => {

                    qsEditor.value =
                        reader.result;


                    clearQSOutput();


                    addQSOutput(
                        `✓ Loaded ${file.name}`
                    );
                };


            reader.readAsText(
                file
            );


            // Allow the same file
            // to be loaded again
            event.target.value =
                "";
        }
    );
}


// ==========================================
// CLEAR
// ==========================================

if (qsClearButton) {

    qsClearButton.addEventListener(
        "click",
        () => {

            qsEditor.value =
                "";


            clearQSOutput();


            addQSOutput(
                "Editor cleared."
            );
        }
    );
}
