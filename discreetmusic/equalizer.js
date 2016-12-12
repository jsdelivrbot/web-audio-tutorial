function initEqualizerUI(container, equalier) {
    equalizer.forEach(equalizerBand => {
        let frequency = equalizerBand.frequency.value;

        let wrapper = document.createElement('div');
        let slider = document.createElement('div');
        let label = document.createElement('label');

        wrapper.classList.add('slider-wrapper');
        slider.classList.add('slider');
        label.textContent = frequency >= 1000 ? `${frequency / 1000}K` : frequency;

        noUiSlider.create(slider, {
            start: 0, // initial gain: 0db
            range: { min: -12, max: 12 }, // allowed gain range: -12db to +12db
            step: 0.1,
            orientation: 'vertical',
            direction: 'rtl' // -12db goes at the bottom, 12db at the top
        });

        slider.noUiSlider.on('update', ([value]) => {
            let gain = +value;
            equalizerBand.gain.value = gain;
        });

        wrapper.appendChild(slider);
        wrapper.appendChild(label);
        container.appendChild(wrapper);
    });
}
