function createGrid(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
        arr[i] = new Array(rows).fill(0);
    }

    return arr;
}

let grid;
let cols, rows;
let hueVal = 50;
let w = 5;

function setup() {
    const width = 1600;
    const height = 800;
    createCanvas(width, height);
    colorMode(HSB, 360, 255, 255);
    cols = width / w;
    rows = height / w;
    grid = createGrid(cols, rows);
    createHueSlider();
}

function colInBounds(col) {
    return (col >= 0 && col < cols);
}

function rowInBounds(row) {
    return (row >= 0 && row < rows);
}

function inGridBounds(col, row) {
    return colInBounds(col) && rowInBounds(row);
}

function createHueSlider() {
    const slideContainer = document.createElement("div")
    slideContainer.className = "slidecontainer";

    // Create the input slider
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "1";
    slider.max = "360";
    slider.value = "50";
    slider.className = "slider";
    slider.id = "myRange";

    // Append the slider to the container
    slideContainer.appendChild(slider);
    document.body.appendChild(slideContainer);

    slider.addEventListener("input", () => {
        hueVal = parseInt(slider.value);
        document.documentElement.style.setProperty('--slider-color', `hsl(${hueVal}, 100%, 50%)`);
    })
}

function spawnSand() {
    if (mouseIsPressed) {
        let x = floor(mouseX / w);
        let y = floor(mouseY / w);
        const extent = 2;

        for (let i = -extent; i <= extent; i++) {
            for (let k = -extent; k <= extent; k++) {
                if (Math.random() > 0.6) {
                    let col = x + i;
                    let row = y + k;
                    if (inGridBounds(col, row)) {
                        grid[col][row] = hueVal;
                    }
                }
            }
        }
    }
}

function draw() {
    background(0);
    spawnSand();

    // Draw the grid
    for (let i = 0; i < cols; i++) {
        for (let k = 0; k < rows; k++) {
            noStroke();
            if (grid[i][k] > 0) {
                fill(grid[i][k], 255, 255);
                square(i * w, k * w, w);
            }
        }
    }

    // Create the next grid state
    let nextGrid = createGrid(cols, rows);

    for (let i = 0; i < cols; i++) {
        for (let k = 0; k < rows; k++) {
            const state = grid[i][k];

            if (state > 0) {
                let below = rowInBounds(k + 1) ? grid[i][k + 1] : -1;

                if (below === 0) {
                    nextGrid[i][k + 1] = state;
                } else {
                    let fallDir = Math.random() < 0.5 ? -1 : 1;
                    let belowLeft = colInBounds(i - fallDir) ? grid[i - fallDir][k + 1] : -1;
                    let belowRight = colInBounds(i + fallDir) ? grid[i + fallDir][k + 1] : -1;

                    if (belowLeft === 0) {
                        nextGrid[i - fallDir][k + 1] = state;
                    } else if (belowRight === 0) {
                        nextGrid[i + fallDir][k + 1] = state;
                    } else {
                        nextGrid[i][k] = state;
                    }
                }
            }
        }
    }

    grid = nextGrid;
}
