# Arduino Song Code Generator

This Node.JS script takes an input file of piano notation (I used notation from pianoletternotes.blogspot.com) and converts it into valid C++ code.

[View script](https://github.com/justinoboyle/arduino-sound/blob/master/arduino-script.js)

## Usage

`node arduino-script.js` (Uses bars.txt as input)

or

`INPUTFILE=file.txt node arduino-script.js`

## Installation

* Remember to install Node.JS for your platform.
* macOS: brew install nodejs
* Linux: apt-get install nodejs / yay nodejs / yum install nodejs
* Windows: Install the latest MSI package

## Tips

You may want to pipe it to your clipboard or to a file to paste into the Arduino IDE.

Example (macOS): `node arduino-script.js | pbcopy`