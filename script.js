var canvas;
var context;

//image input
function upload() {
  //Get input from file input
  var fileinput = document.getElementById("finput");
  //Make new SimpleImage from file input
  image = new SimpleImage(fileinput);
  //Get canvas
  var canvas = document.getElementById("can");
  //Draw image on canvas
  image.drawTo(canvas);
}

function invert() {
    canvas = document.getElementById('can');
    context = canvas.getContext('2d');
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data=imageData.data;
    for (var i = 0; i < data.length; i+= 4) {
        data[i] = data[i] ^ 255;
        data[i+1] = data[i+1] ^ 255;
        data[i+2] = data[i+2] ^ 255;
    }
    context.putImageData(imageData, 0, 0);
}

//function black_white() {
//    var image=document.getElementById('image');
//  //change all pixels of image to gray
// for (var pixel of image.values()) {
//    var avg = (pixel.getRed()+pixel.getGreen()+pixel.getBlue())/3;
//    pixel.setRed(avg);
//    pixel.setGreen(avg);
//    pixel.setBlue(avg);
//  }
//  //display new image
//  var canvas = document.getElementById("can");
//  image.drawTo(canvas);
//        
//    }




















