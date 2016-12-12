const EQUALIZER_CENTER_FREQUENCIES = [
    100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250,
    1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000
];

let leftSynth = makeSynth();
let rightSynth = makeSynth();

let leftPanner = new Tone.Panner(-0.5);
let rightPanner = new Tone.Panner(0.5);
let equalizer = EQUALIZER_CENTER_FREQUENCIES.map(frequency => {
    let filter = Tone.context.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = frequency;
    filter.Q.value = 4.31;
    filter.gain.value = 0;
    return filter;
});

let echo = new Tone.FeedbackDelay('16n', 0.2);
let delay = Tone.context.createDelay(6.0); // borrow the AudioContext from Tone.js
let delayFade = Tone.context.createGain();

delay.delayTime.value = 6.0;
delayFade.gain.value = 0.75;

// Build up audio graph
leftSynth.connect(leftPanner);
rightSynth.connect(rightPanner);
leftPanner.connect(equalizer[0]);
rightPanner.connect(equalizer[0]);
equalizer.forEach((equalizerBand, index) => {
    if (index < equalizer.length - 1) {
        equalizerBand.connect(equalizer[index + 1]);
    } else {
        equalizerBand.connect(echo); // last band, connect to echo
    }
});
echo.toMaster();
echo.connect(delay);
delay.connect(Tone.context.destination);
delay.connect(delayFade);
delayFade.connect(delay);


var leftLoop = new Tone.Loop(time => {
    leftSynth.triggerAttackRelease('C5', '1n + 2n', time);
    leftSynth.setNote('D5', '+2n');
    leftSynth.triggerAttackRelease('E4', '0:2', '+6:0');
    leftSynth.triggerAttackRelease('G4', '0:2', '+11:2');
    leftSynth.triggerAttackRelease('E5', '2:0', '+19:0');
    leftSynth.setNote('G5', '+19:1:2');
    leftSynth.setNote('A5', '+19:3:0');
    leftSynth.setNote('G5', '+19:4:2');
}, '34m').start();

var rightLoop = new Tone.Loop(time => {
    rightSynth.triggerAttackRelease('D4', '1:2', '+5:0');
    rightSynth.setNote('E4', '+6:0');
    rightSynth.triggerAttackRelease('B3', '1m', '+11:2:2');
    rightSynth.setNote('G3', '+12:0:2');
    rightSynth.triggerAttackRelease('G4', '0:2', '+23:2');
}, '37m').start();

Tone.Transport.start();
initEqualizerUI(document.querySelector('.eq'), equalizer);
