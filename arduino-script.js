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

// Define the pin
const PIN = 12

// the "length" of one unit -- 100 tends to sound the best but I'm really not sure what the logic is to it
// I just fiddled around until it sounded good.
let len = 100

// Define array of notes by octave as noted on handout.
// 2D array -- a[note][octave] is the usage
let a = {
    c: [16, 33, 65, 131, 262, 523, 1047, 2093, 4186],
    cs: [17, 35, 69, 139, 277, 554, 1109, 2217, 4435],
    d: [18, 37, 73, 147, 294, 587, 1175, 2349, 4699],
    ds: [19, 39, 78, 156, 311, 622, 1245, 2489, 4978],
    e: [21, 41, 82, 165, 330, 659, 1319, 2637, 5274],
    f: [22, 24, 87, 175, 349, 699, 1397, 2794, 5588],
    fs: [23, 46, 93, 185, 370, 740, 1480, 2960, 5920],
    g: [24, 49, 98, 196, 392, 784, 1568, 3136, 6272],
    gs: [26, 52, 104, 208, 415, 831, 1661, 3322, 6645],
    a: [28, 55, 110, 220, 440, 880, 1760, 3520, 7040],
    as: [29, 58, 117, 233, 466, 932, 1865, 3729, 7459],
    b: [31, 62, 124, 247, 494, 988, 1976, 3951, 7902]
}

// Define some notes that have the same tones as others so that we don't have to repeat numbers
a.db = a.cs
a.eb = a.ds
a.gb = a.fs
a.ab = a.gs
a.bb = a.as

// Import the "bars" notation from bars.txt (default) or the INPUTFILE environment variable, and split by newlines.
let STR = require('fs').readFileSync(process.env.INPUTFILE || 'bars.txt', 'utf-8').split('\n')

// A bit of cleanup -- Remove left and right hand notation by chopping off everything before and including ":"s
// We only have one speaker, so we'll do what we can.
if(STR.join('\n').includes(':'))
    STR = STR
        .map(a=>a.includes(':') ? a.split(':')[1] : a)


let outputArray = []
let tempArray = []

// Iterate over str by line
for(let line of STR) {

    // If we're at the end, clear the temporary array and dump its contents into the output array
    if(line == '') {
        outputArray.push(...tempArray)
        tempArray = []
        continue
    }

    // Detect octave from the first character in the string
    let oct = parseInt(line.charAt(0))

    // Keep our own count
    let i = 0

    // Cut off the octave and ":" since we've already dealt with that, and iterate over the remaining characters
    for(let cha of line.substring(2)) {
        if(cha == '|')
            continue
        if(cha != '-' && cha.toUpperCase() == cha) {
                cha += 's'
            }

        // If it's a '-' (a rest) and ONLY if there's nothing else in that spot, put a rest in the temp array.
        // The reason we are doing this is so that if there is two notes and one is a rest, it will pick the other note above the rest.
        if(cha == '-' && !tempArray[i])
             tempArray[i] = '-'
        else
            // If it's not a rest, and there is NOT a note there already, put it in place
            // Most of this logic is used to deal with the fact that there are multiple octaves going at once, so we need to not just use one.
            if(!tempArray[i] || cha != '-')  {
                try {
                    // If we have a Hz representation of the note (we should), put that in the temporary array.
                    tempArray[i] = a[cha.toLowerCase()][oct]
                }catch(e) {
                    // Worst comes to worst, just put a rest (nothing)
                    tempArray[i] = '-'
                }
            }
        i++
    }
}


// Augment the output array in order to turn it into valid C++ code.
outputArray = outputArray.map(note =>
    // If the note is a '-' (rest), then just put a delay in.
    // Otherwise, put a note. But also put a rest after it so that we have separation between notes.
    note == '-' ?
        `delay(${len})`
        : `tone(PIN, ${note}, ${len*2});\n\tdelay(${len})`
)

// Print the C code inside the proper loops to standard output where it can be collected by the user.
console.log(`
int PIN = ${PIN};

// Generated with a script to automatically generate a tone song in Arduino.

void setup() {
\t${outputArray.join(';\n\t') + ';'}
}
void loop() {}
`)
