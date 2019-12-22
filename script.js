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

function blurfunc() {
    canvas = document.getElementById('can');
    context = canvas.getContext('2d');
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    
    for (var br=0; br<10; br+=1) {
        for (var i=0, n=data.length; i<n; i+=4) {
            var imgW = 4*canvas.width;
            var op = r = g = b = 0;
            var count = 0;
            // data of surrounding pixels
            var CloseData = [i-imgW-4, i-imgW, i-imgW+4, i+imgW-4, i+imgW, i+imgW+ 4];
            // calculating Sum value of all close pixels
            for (var e=0; e<CloseData.length; e+=1){
                if (CloseData[e] >= 0 && CloseData[e] <= data.length-3) {
                    op += data[CloseData[e]];
                    r += data[CloseData[e] + 1];
                    g += data[CloseData[e] + 2];
                    b += data[CloseData[e] + 3];
                    count += 1;
                }
            }
            // applying average values
            data[i] = (op / count)*1;
            data[i+1] = (r / count)*1;
            data[i+2] = (g / count)*1;
            data[i+3] = (b / count)+1;
        }
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




















