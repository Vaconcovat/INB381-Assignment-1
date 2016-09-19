/**
 * Created by mvandeberg on 25/08/15.
 */
var moving = false;
var translation = [0, 0];
var movingDirec = 1;
    var width = 100;
    var height = 100;
     var color = new Uint8Array(4);
     var gotIt = 0;

function main() {
    // Get A WebGL context
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // setup GLSL program
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");

    // lookup uniforms
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");

    // set the resolution
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    // Create a buffer.
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    var num1 =  Math.random();
    var num2 =  Math.random();
    var num3 =  Math.random();

    // Set a random color.
    gl.uniform4f(colorLocation, num1, num2, num3, 1);

    

    drawScene();

    // Setup a ui.

    $("#x").gmanSlider({slide: updatePosition(0), max: canvas.width });
    $("#y").gmanSlider({slide: updatePosition(1), max: canvas.height});
    var button = document.getElementById("button");
    
    button.addEventListener("mousedown", function(event){
        moving = !moving;
         console.log(gl);
    });
    
    setInterval(function moveIt(){
        if(moving){
            if(movingDirec == 1){
                if(translation[0] < 500){
                    translation[0] = translation[0]+movingDirec;
                }else{
                    movingDirec = -1;
                }
            }else{
                if(translation[0] > 0){
                    translation[0] = translation[0]+movingDirec;
                }else{
                    movingDirec = 1;
                }
            }
            console.log("trying to move");
            drawScene();
        }
    }, 1000/60);

    

    function updatePosition(index) {

        return function(event, ui){
            translation[index] = ui.value;
            drawScene();

        }


    }

    // Draw a the scene.
    function drawScene() {
        // Clear the canvas.
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Setup a rectangle
        setRectangle(gl, translation[0], translation[1], width, height);

        // Draw the rectangle.
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        
        setRectangle(gl, translation[0], translation[1]+150, width, height);
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        canvas.addEventListener("mousedown", function(event){
            var x = event.clientX;
            var y = canvas.height - event.clientY;
            gl.uniform4f(colorLocation, 1, 0.1, 1, 1);
            setRectangle(gl, translation[0], translation[1], width, height);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, color);
            if(color[0] == 255){       
                gotIt = 1;
            }
            gl.uniform4f(colorLocation, 0.5, 0.1, 1, 1);
            

            setRectangle(gl, translation[0], translation[1]+150, width, height);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, color);
            if(color[0] == 128){       
                gotIt = 2;
            }
           
            console.log(color);
        });
        canvas.addEventListener("mouseup", function(event){
                gotIt = 0;
        });

             
        canvas.addEventListener("mousemove", function(event){
            if(gotIt == 1){
                translation[0] = event.clientX+5;
                translation[1] = event.clientY;
            }else if(gotIt == 2){
                translation[0] = event.clientX+5;
                translation[1] = event.clientY-150;
            }

            setRectangle(gl, translation[0], translation[1], width, height);
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            setRectangle(gl, translation[0], translation[1]+150, width, height);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        });
            
        
    }
}

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2]),
        gl.STATIC_DRAW);
}