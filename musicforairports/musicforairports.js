let audioContext = new AudioContext();

startSong();

function startSong() {
    fetchSample('samples/AirportTerminal.wav').then(convolverBuffer => {
        let convolverNode = audioContext.createConvolver();
        let gainNode = audioContext.createGain();

        convolverNode.buffer = convolverBuffer;
        convolverNode.connect(gainNode);

        gainNode.gain.value = 0.5;
        gainNode.connect(audioContext.destination);

        var baseLength = getRandomIntInclusive(10, 23);

        startLoop('Grand Piano', 'F4',  convolverNode, baseLength, baseLength/2);
        startLoop('Grand Piano', 'Ab4', convolverNode, baseLength+1, baseLength);
        startLoop('Grand Piano', 'C5',  convolverNode, baseLength+0.9, baseLength*3.5);
        startLoop('Grand Piano', 'D5', convolverNode, baseLength-3, baseLength/1.7);
        startLoop('Grand Piano', 'Eb5', convolverNode, baseLength+0.4, baseLength+2);
        startLoop('Grand Piano', 'Fb5',  convolverNode, baseLength-2, baseLength*2.2);
        startLoop('Grand Piano', 'Ab5', convolverNode, baseLength-5, baseLength/4);
    });
}

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startLoop(instrument, note, destination, loopLengthSeconds, delaySeconds) {
    playSample(instrument, note, destination, delaySeconds);
    setInterval(
        () => playSample(instrument, note, destination, delaySeconds),
        loopLengthSeconds * 1000
    );
}


function playSample(instrument, note, destination, delaySeconds = 0) {
    getSample(instrument, note).then(({audioBuffer, distance}) => {
        let playbackRate = Math.pow(2, distance / 12);
        let bufferSource = audioContext.createBufferSource();

        bufferSource.buffer = audioBuffer;
        bufferSource.playbackRate.value = playbackRate;

        bufferSource.connect(destination);
        bufferSource.start(audioContext.currentTime + delaySeconds);
    });
}


function getSample(instrument, noteAndOctave) {
    let [, requestedNote, requestedOctave] = /^(\w[b#]?)(\d)$/.exec(noteAndOctave);
    requestedOctave = parseInt(requestedOctave, 10);
    requestedNote = flatToSharp(requestedNote);
    let sampleBank = SAMPLE_LIBRARY[instrument];
    let sample = getNearestSample(sampleBank, requestedNote, requestedOctave);
    let distance = getNoteDistance(requestedNote, requestedOctave, sample.note, sample.octave);

    return fetchSample(sample.file).then(audioBuffer => ({
        audioBuffer: audioBuffer,
        distance: distance
    }));
}

function fetchSample(path) {
    return fetch(encodeURIComponent(path))
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
}

function getNearestSample(sampleBank, note, octave) {
    let sortedBank = sampleBank.slice().sort((sampleA, sampleB) => {
        let distanceToA = Math.abs(getNoteDistance(note, octave, sampleA.note, sampleA.octave));
        let distanceToB = Math.abs(getNoteDistance(note, octave, sampleB.note, sampleB.octave));
        return distanceToA - distanceToB;
    });
    return sortedBank[0];
}

function getNoteDistance(note1, octave1, note2, octave2) {
    return noteValue(note1, octave1) - noteValue(note2, octave2);
}


function noteValue(note, octave) {
    return octave * 12 + OCTAVE.indexOf(note);
}

function flatToSharp(note) {
    switch (note) {
        case 'Bb': return 'A#';
        case 'Db': return 'C#';
        case 'Eb': return 'D#';
        case 'Gb': return 'F#';
        case 'Ab': return 'G#';
        default:   return note;
    }
}
