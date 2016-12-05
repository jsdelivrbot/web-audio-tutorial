let audioContext = new AudioContext();

fetch('itsgonnarain.mp3')
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
        let sourceNode = audioContext.createBufferSource(audioBuffer);
        sourceNode.buffer = audioBuffer;
        sourceNode.loop = true;
        sourceNode.loopStart = 2.98;
        sourceNode.loopEnd = 3.80;
        sourceNode.connect(audioContext.destination);
        sourceNode.start();
    })
    .catch(console.error);
