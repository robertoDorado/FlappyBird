const stopButton4 = document.querySelector('#stopButton4');

let context,
    oscillator,
    contextGain,
    x = 1,
    type = '';

function start() {
    context = new AudioContext();
    oscillator = context.createOscillator();
    contextGain = context.createGain();

    oscillator.type = type;
    oscillator.connect(contextGain);
    contextGain.connect(context.destination);
    oscillator.start(0);
}

function stop() {
    start();
    contextGain.gain.exponentialRampToValueAtTime(
        0.0001, context.currentTime + x
    )
}

type = 'sawtooth';

stopButton4.addEventListener('click', function () {
    stop();
});
