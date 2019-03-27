/**
 * Arduino Song Code Generator - by Justin O'Boyle
 * https://github.com/justinoboyle
 * justin@justinoboyle.com
 *
 * This Node.JS script takes an input file of piano notation (I used notation from pianoletternotes.blogspot.com) and converts it into valid C++ code.
 *
 * Usage:
 * node arduino-script.js # Uses bars.txt as input
 *
 * or
 *
 * INPUTFILE=file.txt node arduino-script.js
 *
 * Remember to install Node.JS for your platform.
 * macOS: brew install nodejs
 * Linux: apt-get install nodejs / yay nodejs / yum install nodejs
 * Windows: Install the latest MSI package
 *
 * You may want to pipe it to your clipboard or to a file to paste into the Arduino IDE.
 * Example (macOS): node arduino-script.js | pbcopy
 */

const converter = require("./converter")

// Import the "bars" notation from bars.txt (default) or the INPUTFILE environment variable, and split by newlines.
let STR = require('fs').readFileSync(process.env.INPUTFILE || 'bars.txt', 'utf-8').split('\n')

console.log(converter(STR))