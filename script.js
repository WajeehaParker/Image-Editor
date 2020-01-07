var canvas;
var context;
var imageData;
var data;
var undo=[];
var redo=[];

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

function fetchData(){
    canvas = document.getElementById('can');
    context = canvas.getContext('2d');
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    data=imageData.data;
}

function delImage(){
    fetchData();
    for (var i = data.length; --i >= 0; )
        data[i] = 0;
    context.putImageData(imageData, 0, 0);
    undo.push(imageData);
}

function crop(){
//    fetchData();
//    context.strokeStyle="blue";
//    context.beginPath();
//    context.moveTo(0,0);
//    context.lineTo(canvas.width, 0);
//    context.lineTo(canvas.width, canvas.height);
//    context.lineTo(0, canvas.height);
//    context.lineTo(0, 0);
//    context.stroke();
    
}

function iundo(){
    if(undo.length==0)
        delImage();
    else{
        idata=undo.pop();
        redo.push(idata);
        context.putImageData(idata, 0, 0);
    }
}

function iredo(){
    idata=redo.pop();
    undo.push(idata);
    context.putImageData(idata, 0, 0);
}

function saveImg(){
    fetchData();
    var download = document.getElementById("download");
    var image = document.getElementById("can").toDataURL("image/png").replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
}

//-----------filters----------------

function invert() {
    fetchData();
    undo.push(imageData);
    for (var i = 0; i < data.length; i+= 4) {
        data[i] = data[i] ^ 255;
        data[i+1] = data[i+1] ^ 255;
        data[i+2] = data[i+2] ^ 255;
    }
    context.putImageData(imageData, 0, 0);
}

function blurfunc() {
    fetchData();
    undo.push(imageData);
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

function grayScale(){
    var max = 0;
    var min = 255;
    for (var i=0; i < data.length; i+=4) {
        // Fetch maximum and minimum pixel values
        if (data[i] > max) { max = data[i]; }
        if (data[i] < min) { min = data[i]; }
        // Grayscale by averaging RGB values
        var r = data[i];
        var g = data[i+1];
        var b = data[i+2];
        var v = 0.3333*r + 0.3333*g + 0.3333*b;
        data[i] = data[i+1] = data[i+2] = v;
    }
    for (var i=0; i < data.length; i+=4) {
        // Normalize each pixel to scale 0-255
        var v = (data[i] - min) * 255/(max-min);
        data[i] = data[i+1] = data[i+2] = v;
    }
    return data;
}

//function showColorBox(){
//     document.getElementById('colorBox').style.display='block'; 
//    document.getElementById('colorBox').style.marginTop="-30px";
//    
//    fetchData();
//    temp=data;
//}

//function duoTone(){
//    var rgb1=document.getElementById("color1").value;
//    var rgb2=document.getElementById("color2").value;
//    
//    var bigint = parseInt(rgb1, 16);
//    var r1 = (bigint >> 16) & 255;
//    var g1 = (bigint >> 8) & 255;
//    var b1 = bigint & 255;
//    
//    bigint = parseInt(rgb2, 16);
//    var r2 = (bigint >> 16) & 255;
//    var g2 = (bigint >> 8) & 255;
//    var b2 = bigint & 255;
//    
//    data=temp;
//    fetchData();
//    data=grayScale(data);
//    var rgb1 = hexToRgb("#55a9e2");
//    var rgb2 = hexToRgb("#de2d2b");
//    var gradient = [];
//    for (var i = 0; i < (256*4); i += 4) {
//        gradient[i] = ((256-(i/4))*rgb1.r + (i/4)*rgb2.r)/256;
//        gradient[i+1] = ((256-(i/4))*rgb1.g + (i/4)*rgb2.g)/256;
//        gradient[i+2] = ((256-(i/4))*rgb1.b + (i/4)*rgb2.b)/256;
//        gradient[i+3] = 255;
//    }
    
//    var gradient = [];
//    for (var i = 0; i < (256*4); i += 4) {
//        gradient[i] = ((256-(i/4))*85 + (i/4)*254)/256;
//        gradient[i+1] = ((256-(i/4))*169 + (i/4)*254)/256;
//        gradient[i+2] = ((256-(i/4))*226 + (i/4)*254)/256;
//        gradient[i+3] = 255;
//    }
//    for (var i = 0; i < data.length; i += 4) {
//        data[i] = gradient[data[i]*4];
//        data[i+1] = gradient[data[i+1]*4 + 1];
//        data[i+2] = gradient[data[i+2]*4 + 2];
//    }
//    context.putImageData(imageData, 0, 0);
//}

function duoTone(){
    fetchData();
    undo.push(imageData);
    data=grayScale(data);
    var gradient = [];
    for (var i = 0; i < (256*4); i += 4) {
        gradient[i] = ((256-(i/4))*85 + (i/4)*254)/256;
        gradient[i+1] = ((256-(i/4))*169 + (i/4)*254)/256;
        gradient[i+2] = ((256-(i/4))*226 + (i/4)*254)/256;
        gradient[i+3] = 255;
    }
    for (var i = 0; i < data.length; i += 4) {
        data[i] = gradient[data[i]*4];
        data[i+1] = gradient[data[i+1]*4 + 1];
        data[i+2] = gradient[data[i+2]*4 + 2];
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


//undo
//ctx.globalCompositeOperation ="xor"
//ctx.drawImage(img2, 100, 100);



//-----------borders----------------














