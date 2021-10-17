const btn = document.querySelector(".btn")
const audio = document.querySelector("audio");
const visualizer = document.querySelector(".visualizer");

btn.addEventListener('click', evn => {
    // audio played or paused 
    audio.paused ? audio.play() : audio.pause();

    // add classname
    btn.classList.toggle('btn-play')
    btn.classList.toggle('btn-pause')

    window.AudioContext = window.AudioContext;
    const ctx = new window.AudioContext();
    const analyser = ctx.createAnalyser();
    const source = ctx.createMediaElementSource(audio);
    source.connect(analyser);
    source.connect(ctx.destination);
    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    
    let dataArray = new Uint8Array(bufferLength);
    let elements = [];
    for(let i = 0; i < bufferLength; i++) {
        const element = document.createElement('span');
        element.classList.add('element');
        elements.push(element);
        visualizer.appendChild(element);
    }

    const clamp = (num, min, max) => {
        if(num >= max) return max;
        if(num <= min) return min;
        return num;
    }

    const update = () => {
        requestAnimationFrame(update);
        analyser.getByteFrequencyData(dataArray);

        // testing on console
        // console.log(dataArray);

        for(let i = 0; i < bufferLength; i++) {
            let item = dataArray[i];
            item = item > 150 ? item / 1.5 : item * 1.25;
            elements[i].style.transform = `rotateZ(${i * (360 / bufferLength)}deg) translate(-50%, ${clamp(item, 100, 150)}px)`;
        }
    };
    update();


})