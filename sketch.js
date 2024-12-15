var stepX;
var stepY;
let bodySegmentation;
let options = {
  maskType: "background",
};
let video;
let segmentation;
let showTitlePage = true;

function preload() {
  bodySegmentation = ml5.bodySegmentation("SelfieSegmentation", options);
}

function setup() {
  createCanvas(640, 480);
  noStroke();
  colorMode(HSB, height, width, 100);
  
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  
   bodySegmentation.detectStart(video, gotResults);
}

function draw() {
  if (showTitlePage) {
    drawTitlePage();
  } else {
    drawRainbowPage();
  }
}

function drawTitlePage() {
  text('surfing my memory web', width/2, height/2);
}

function drawRainbowPage() {
  background(200, 100, 200);
  
  stepX = mouseX + 4;
  stepY = mouseY + 4;
  
  for (var gridY=0; gridY < height; gridY += stepY) {
    for (var gridX=0; gridX < width; gridX += stepX) {
      fill(gridY, width - gridX, 100);
      rect(gridX, gridY, stepX, stepY);
    }
  }
  
  if (segmentation) {
    image(segmentation.mask, 0, 0, width, height);
  }
}

function gotResults(result) {
  segmentation = result;
}
