const URL = "https://teachablemachine.withgoogle.com/models/ZALOpK01t/";

let model, webcam, labelContainer, maxPredictions;

window.addEventListener('load', async () => {
    // Start loading model and setting up webcam in parallel
    const modelPromise = loadModel();
    const webcamPromise = setupWebcam();

    // Wait for both to complete
    await modelPromise;
    await webcamPromise;

    document.getElementById("loading-overlay").style.display = "none";
    document.querySelector(".center-container").style.display = "block";
    window.requestAnimationFrame(loop);
});

async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { 
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function setupWebcam() {
    const flip = true; 
    webcam = new tmImage.Webcam(640, 480, flip);
    await webcam.setup(); 
    await webcam.play();
    document.getElementById("webcam-container").appendChild(webcam.canvas);
}

async function loop() {
    webcam.update(); 
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
