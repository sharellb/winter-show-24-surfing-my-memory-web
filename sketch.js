var stepX;
var stepY;
let bodySegmentation;
let maskoptions = {
  maskType: "background",
};
let video;
let segmentation;
let internet1, internet2, internet3, internet4;
let song;
let sketch;
let faces = [];
let lipColor = "pink";
let eyeShadowColor = "blue";
let options = {
  maxFaces: 1,
  refineLandmarks: false,
  flipped: false 
};
const orderedUpperLipsIndices= [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 20, 29, 28, 27, 26, 25, 24, 23, 22, 31];
const leftEyeIndices= [ 
  15, 14, 13, 12, 11, 10, 9, 8
];
const rightEyeIndices= [ 
  15, 14, 13, 12, 11, 10, 9, 8
];

let showTitlePage = true;
let currentImageIndex = 0;
let images = [];

function preload() {
  faceMesh = ml5.faceMesh(options);
  bodySegmentation = ml5.bodySegmentation("SelfieSegmentation", maskoptions);
  internet1 = loadImage('assets/photos/internet-1.png');
  internet2 = loadImage('assets/photos/internet-2.png');
  internet3 = loadImage('assets/photos/internet-3.png');
  internet4 = loadImage('assets/photos/internet-4.png');
}

function setup() {
  createCanvas(640, 480);
  
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  
  bodySegmentation.detectStart(video, gotResults);
  faceMesh.detectStart(video, gotFaces);
  
  song = createAudio('/assets/audio/on-my-time.mp3');
  images.push(internet1);
  images.push(internet2);
  images.push(internet3);
  images.push(internet4);
  currentImageIndex = 0;
}

function draw() {
  noStroke();
  song.showControls();
  if (showTitlePage) {
    backgroundImage = images[currentImageIndex];
    image(backgroundImage, 0, 0, width, height, 0, 0, backgroundImage.width, backgroundImage.height);
  } else {
    drawRainbowPage();
  }

  if (segmentation) {
    image(segmentation.mask, 0, 0, width, height);
  }

  if (faces.length > 0) {
    let face = faces[0];
    lipColor = color(235, 109, 209);
    drawLips();
    drawEyes();
  }
}

function drawLips() {
  push();
  strokeWeight(13);
  stroke(lipColor);
  
  if (faces.length > 0 && faces[0].lips) { 
    let lips = faces[0].lips;
    
    strokeWeight(10);
    for (let i=0; i < lips.keypoints.length; i++) {
      let currentKeypoint = lips.keypoints[orderedUpperLipsIndices[[i]]];
      let nextKeypoint = lips.keypoints[orderedUpperLipsIndices[[i + 1]]];
      
      if (currentKeypoint && nextKeypoint) {
        line(currentKeypoint.x, currentKeypoint.y, nextKeypoint.x, nextKeypoint.y);
      }
    }
  }
  
  pop();
}

function drawEyes() {
  push();
  strokeWeight(13);
  stroke(eyeShadowColor);

  // draw left eye
  if (faces.length > 0 && faces[0].leftEye) { 
    let leftEye = faces[0].leftEye;
    
    strokeWeight(3);
    for (let i=0; i < leftEye.keypoints.length; i++) {
      let currentKeypoint = leftEye.keypoints[leftEyeIndices[i]];
      let nextKeypoint = leftEye.keypoints[leftEyeIndices[[i + 1]]];
      
      if (currentKeypoint && nextKeypoint) {
        line(currentKeypoint.x, currentKeypoint.y, nextKeypoint.x, nextKeypoint.y);
      }
    }
  }

  // draw right eye
  
  if (faces.length > 0 && faces[0].rightEye) { 
    let rightEye = faces[0].rightEye;
    
    strokeWeight(3);
    for (let i=0; i < rightEye.keypoints.length; i++) {
      let currentKeypoint = rightEye.keypoints[leftEyeIndices[i]];
      let nextKeypoint = rightEye.keypoints[leftEyeIndices[i + 1]];
      
      if (currentKeypoint && nextKeypoint) {
        line(currentKeypoint.x, currentKeypoint.y, nextKeypoint.x, nextKeypoint.y);
      }
    }
  }
  
  pop();
}


function drawRainbowPage() {
  // On My Time
  colorMode(HSB, height, width, 100);
  background(200, 100, 200);

  let rainbowX = mouseX;
  let rainbowY = mouseY;

  stepX = rainbowX + 4;
  stepY = rainbowY + 4;
  
  for (var gridY = 0; gridY < height; gridY += stepY) {
    for (var gridX = 0; gridX < width; gridX += stepX) {
      fill(gridY, width - gridX, 100);
      rect(gridX, gridY, stepX, stepY);
    }
  }
}

// Testing functions

function gotResults(result) {
  segmentation = result;
}


function gotFaces(results) {
  faces = results;
}

// Useful functions

function randomColor() {
  let randColor = color(random(255), random(255), random(255));
  return randColor;
}

function mouseClicked() {
  showTitlePage = !showTitlePage;
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (currentImageIndex + 1 > images.length - 1) {
      currentImageIndex = 0;
    } else {
      currentImageIndex = currentImageIndex + 1;
    }
  }
}
