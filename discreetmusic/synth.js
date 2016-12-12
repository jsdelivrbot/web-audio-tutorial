function makeSynth() {
    let envelope = {
        attack: 0.1,
        release: 4,
        releaseCurve: 'linear'
    };

    let filterEnvelope = {
        baseFrequency: 200,
        octaves: 2,
        attack: 0,
        decay: 0,
        release: 1000
    };

    return new Tone.DuoSynth({
        harmonicity: 1,
        volume: -20,
        voice0: {
            oscillator: { type: 'sawtooth' },
            envelope,
            filterEnvelope
        },
        voice1: {
            oscillator: { type: 'sine' },
            envelope,
            filterEnvelope
        },
        vibratoRate: 0.5,
        vibratoAmount: 0.1
    });
}
