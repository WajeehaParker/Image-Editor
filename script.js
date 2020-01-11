var canvas;
var context;
var imageData;
var data;
var undo=[];
var redo=[];
var originalImage = null;

//image input
function upload() {
  //Get input from file input
  var fileinput = document.getElementById("finput");
  //Make new SimpleImage from file input
  image = new SimpleImage(fileinput);
  originalImage = new SimpleImage(fileinput);
  //Get canvas
  var canvas = document.getElementById("can");
  //Draw image on canvas
  image.drawTo(canvas);

//   var imgcanvas = document.getElementById("can");
// var fileinput = document.getElementById("finput");
// image = new SimpleImage(fileinput);
// image.drawTo(imgcanvas);
}

function reset() {
//  if (imageIsLoaded(image)) {
//    var canvas = document.getElementById("can");
//    originalImage.drawTo(canvas);
//  }
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
function Dark() {
  //change all pixels of image to gray
  for (var pixel of image.values()) {
    var avg = (pixel.getRed()+pixel.getGreen()+pixel.getBlue())/3;
    pixel.setRed(avg);
    pixel.setGreen(avg);
    pixel.setBlue(avg);
  }
  //display new image
  var canvas = document.getElementById("can");
  image.drawTo(canvas);
}

function Red() {
  for (var pixel of image.values()) {
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    if (avg < 128) {
      pixel.setRed(2 * avg);
      pixel.setGreen(0);
      pixel.setBlue(0);
    } else {
      pixel.setRed(255);
      pixel.setGreen(2 * avg - 255);
      pixel.setBlue(2 * avg - 255);
    }
  }
    
    //display new image
  var canvas = document.getElementById("can");
  image.drawTo(canvas);
}

function invert() {
//    fetchData();
//    undo.push(imageData);
//    for (var i = 0; i < data.length; i+= 4) {
//        data[i] = data[i] ^ 255;
//        data[i+1] = data[i+1] ^ 255;
//        data[i+2] = data[i+2] ^ 255;
//    }
//    context.putImageData(imageData, 0, 0);
    for (var pixel of image.values()) {
          pixel.setRed(pixel.getRed()^255);
          pixel.setGreen(pixel.getGreen()^255);
          pixel.setBlue(pixel.getBlue()^255);
    }
    
    //display new image
  var canvas = document.getElementById("can");
  image.drawTo(canvas);
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
//    var max = 0;
//    var min = 255;
//    for (var i=0; i < data.length; i+=4) {
//        // Fetch maximum and minimum pixel values
//        if (data[i] > max) { max = data[i]; }
//        if (data[i] < min) { min = data[i]; }
//        // Grayscale by averaging RGB values
//        var r = data[i];
//        var g = data[i+1];
//        var b = data[i+2];
//        var v = 0.3333*r + 0.3333*g + 0.3333*b;
//        data[i] = data[i+1] = data[i+2] = v;
//    }
//    for (var i=0; i < data.length; i+=4) {
//        // Normalize each pixel to scale 0-255
//        var v = (data[i] - min) * 255/(max-min);
//        data[i] = data[i+1] = data[i+2] = v;
//    }
//    return data;
    for (var pixel of image.values()) {
        var avg = (pixel.getRed()+pixel.getGreen()+pixel.getBlue())/3;
        pixel.setRed(avg);
        pixel.setGreen(avg);
        pixel.setBlue(avg);
      }
    return image;
}


function showColorBox(){
    var colorBox=document.getElementById('colorBox');
    if(colorBox.style.display==='none'){
        colorBox.style.display='block';
        fetchData();
        undo.push(imageData);
    } else{
        colorBox.style.display='none';
    }
}

function duoTone(){
    imageData = undo.pop();
    undo.push(imageData);
    data=imageData.data;
    image=grayScale();
    var color=document.getElementById('color1');
    var r1=parseInt("0x"+color.value.slice(1,3));
    var g1=parseInt("0x"+color.value.slice(3,5));
    var b1=parseInt("0x"+color.value.slice(5,7));
    color=document.getElementById('color2');
    var r2=parseInt("0x"+color.value.slice(1,3));
    var g2=parseInt("0x"+color.value.slice(3,5));
    var b2=parseInt("0x"+color.value.slice(5,7));
    
    var gradient = [];
    for (var i = 0; i < (256*4); i += 4) {
        gradient[i] = ((256-(i/4))*r1 + (i/4)*r2)/256;
        gradient[i+1] = ((256-(i/4))*g1 + (i/4)*g2)/256;
        gradient[i+2] = ((256-(i/4))*b1 + (i/4)*b2)/256;
        gradient[i+3] = 255;
    }
//    for (var i = 0; i < data.length; i += 4) {
//        data[i] = gradient[data[i]*4];
//        data[i+1] = gradient[data[i+1]*4 + 1];
//        data[i+2] = gradient[data[i+2]*4 + 2];
//    }
    var i=0;
    for (var pixel of image.values()) {
        pixel.setRed(gradient[pixel.getRed()*4]);
        pixel.setGreen(gradient[pixel.getGreen()*4 + 1]);
        pixel.setBlue(gradient[pixel.getBlue*4 + 2]);
        i++;
      }
//    context.putImageData(imageData, 0, 0);
    var canvas = document.getElementById("can");
  image.drawTo(canvas);
}

//undo
//ctx.globalCompositeOperation ="xor"
//ctx.drawImage(img2, 100, 100);

 function sepia() { 
    //get image data 
    //var imgData = context.getImageData(0, 0, editor.width, editor.height), 
    fetchData();
    undo.push(imageData);
        // pxData = imgData.data, 
        // length = pxData.length; 
        for(var i = 0; i< data.length; i+=4) { 
            //convert to grayscale 
            var r = data[i], 
                g = data[i + 1], 
                b = data[i + 2], 
            sepiaR = r * .393 + g * .769 + b * .189, 
            sepiaG = r * .349 + g * .686 + b * .168, 
            sepiaB = r * .272 + g * .534 + b * .131; 
            data[i] = sepiaR; 
            data[i + 1] = sepiaG; 
            data[i + 2] = sepiaB;                              
        } 
                      
        //paint sepia image back 
        context.putImageData(imageData, 0, 0);  
}

function pixelate(){
    fetchData();
    undo.push(imageData);
    var sample_size = 10;
   var w = canvas.width;
    var h = canvas.height;
    for (var y = 0; y < h; y += sample_size) {
        for (var x = 0; x < w; x += sample_size) {
          var p = (x + (y*w)) * 4;
          context.fillStyle = "rgba(" + data[p] + "," + data[p + 1] + "," + data[p + 2] + "," + data[p + 3] + ")";
          context.fillRect(x, y, sample_size, sample_size);
        }
      }

      // context.putImageData(imageData, 0, 0);
    }
function Noise(){
    fetchData();
    undo.push(imageData);
    var p1 = 0.99;
var p2 = 0.99;
var p3 = 0.99;
var er = 0; // extra red
var eg = 0; // extra green
var eb = 0; // extra blue
    // var data = imgd.data;
  for (var i = 0, n = data.length; i < n; i += 4) {

       // generating random color coefficients

       var randColor1 = 0.6 + Math.random() * 0.4;

       var randColor2 = 0.6 + Math.random() * 0.4;

       var randColor3 = 0.6 + Math.random() * 0.4;

        // assigning random colors to our data

        data[i] = data[i]*p2*randColor1+er; // green

        data[i+1] = data[i+1]*p2*randColor2+eg; // green

        data[i+2] = data[i+2]*p3*randColor3+eb; // blue

    }

    // put image date back to context

   context.putImageData(imageData, 0, 0);
    
    }

//-----------borders----------------
function showBorders(){
    var f=document.getElementById("filters");
    var b=document.getElementById("border");
    if(f.style.display==='none'){
        f.style.display='block';
        b.style.display='none';
    } else{
        b.style.display='block';
        f.style.display='none';        
    } 
}

function applyFrame(e){    
    fetchData();
    data2=data;
    undo.push(imageData);
    var fileinput = document.getElementById(e);
    image = new SimpleImage(fileinput);
    image.width=canvas.width;
    image.height=canvas.height;
    image.drawTo(canvas);
    fetchData();
    for (var i = 0; i < data.length; i+= 4) {
        if(data[i+3]<255){
            data[i]=data2[i];
            data[i+1]=data2[i+1];
            data[i+2]=data2[i+2];
            data[i+3]=data2[i+3];
        }
    }
    context.putImageData(imageData, 0, 0);
}














