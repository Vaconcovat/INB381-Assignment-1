 var counter = 0;
 var gl;
 var surface;

 var framebuffer;

 var program1;
 var program2;
 var program3;
 var program4;
 var program5;
 var program6;
 var program7;
 var program8;
 var program9;

 var projectionMatrix;
 var viewMatrix;

 var bodyobj;
 var upperWing1obj;
 var upperWing2obj;
 var lowerWing1obj;
 var lowerWing2obj;
 var groundobj;
 var headobj;
 var leg1obj;
 var leg2obj;

 var movingDirec = -1;
 var rot = 1;
 var rot2 = 1;
 var t = 90;

 
 var ypos1 = 0.5;
 var ypos2 = -0.5;


 var bodyId = 3;
 var upperWing1Id = 1;
 var upperWing2Id = 2;
 var lowerWing1Id = 0;
 var lowerWing2Id = 4;
 var groundId = 5;
 var headId = 6;
 var leg1Id = 7;
 var leg2Id = 8;





// var bodyHeight = 5.0;
// var bodyWidth = 1.0;
// var upperArmHeight = 3.0;
// var lowerArmHeight = 2.0;
// var upperArmWidth  = 0.5;
// var lowerArmWidth  = 0.5;
// var upperLegWidth  = 0.5;
// var lowerLegWidth  = 0.5;
// var lowerLegHeight = 2.0;
// var upperLegHeight = 3.0;
// var headHeight = 1.5;
// var headWidth = 1.0;

// var theta = [180, 180, 180, 180, 180];

var figure = [];

var stack = [];
var numNodes = 9;

//bool for keyboard control
var keyboardControl = true;
//bool for falling
var falling = false;
var falling_speed = 0;
//bool for spiriling
var spiral = false;
var spiral_rotspeed = 0.005;
var spiral_fallspeed = 0;
//movespeed
var movespeed = 0.01;
//do a flip
var flip = false;
var half = false;
//texture variables
var texture;
var texCoordsArray = new Float32Array([ 
                0,0,
                0,1,
                1,0,
                0,1,
                1,1,
                1,0,

                0,0,
                0,1,
                1,0,
                0,1,
                1,1,
                1,0,

                0,0,
                0,1,
                1,0,
                0,1,
                1,1,
                1,0,

                0,0,
                0,1,
                1,0,
                0,1,
                1,1,
                1,0,

                0,0,
                0,1,
                1,0,
                0,1,
                1,1,
                1,0,

                0,0,
                0,1,
                1,0,
                0,1,
                1,1,
                1,0]);
//initial position storage
var bodyMatrixStore = [];
var headMatrixStore = [];
var upperWing1MatrixStore = [];
var upperWing2MatrixStore = [];
var lowerWing1MatrixStore = [];
var lowerWing2MatrixStore = [];
var leg1MatrixStore = [];
var leg2MatrixStore = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

function initTextures() {
  texture = gl.createTexture();
  cubeImage = new Image();
  cubeImage.onload = function() { handleTextureLoaded(cubeImage, texture); }
  cubeImage.src = "checker.gif";
}

function handleTextureLoaded(image, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
}

function createProgram(gl, shaderSpecs) {
    var program = gl.createProgram();
    for ( var i = 0 ; i < shaderSpecs.length ; i++ ) {
        var spec = shaderSpecs[i];
        var shader = gl.createShader(spec.type);
        gl.shaderSource(shader, document.getElementById(spec.container).text);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw gl.getShaderInfoLog(shader);
        }
        gl.attachShader(program, shader);
        gl.deleteShader(shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw gl.getProgramInfoLog(program);
    }
    return program;
}

function init(body,upperWing1, upperWing2, lowerWing1, lowerWing2, ground,head, leg1, leg2) {
	console.log("INIT");
    bodyobj = body;
    upperWing1obj = upperWing1;
    upperWing2obj = upperWing2;
    lowerWing1obj = lowerWing1;
    lowerWing2obj = lowerWing2;
    headobj = head;
	groundobj = ground;
    leg1obj = leg1;
    leg2obj = leg2;
 
    vertexColors = vec3.fromValues(1.0, 0.0, 0.0);
    surface = document.getElementById('rendering-surface');
    gl = surface.getContext('experimental-webgl', {preserveDrawingBuffer: true});

    gl.viewport(0,0,surface.width,surface.height);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    program1 = createProgram(gl,[{container: 'vertex-shader', type: gl.VERTEX_SHADER},{container: 'fragment-shader', type: gl.FRAGMENT_SHADER}]);
    program2 = createProgram(gl,[{container: 'vertex-shader', type: gl.VERTEX_SHADER},{container: 'fragment-shader', type: gl.FRAGMENT_SHADER}]);
    program3 = createProgram(gl,[{container: 'vertex-shader', type: gl.VERTEX_SHADER},{container: 'fragment-shader', type: gl.FRAGMENT_SHADER}]);
    program4 = createProgram(gl,[{container: 'vertex-shader', type: gl.VERTEX_SHADER},{container: 'fragment-shader', type: gl.FRAGMENT_SHADER}]);
    program5 = createProgram(gl,[{container: 'vertex-shader', type: gl.VERTEX_SHADER},{container: 'fragment-shader', type: gl.FRAGMENT_SHADER}]);
	program6 = createProgram(gl,[{container: 'vertex-shader', type: gl.VERTEX_SHADER},{container: 'fragment-shader', type: gl.FRAGMENT_SHADER}]);
    program7 = createProgram(gl,[{container: 'vertex-shader', type: gl.VERTEX_SHADER},{container: 'fragment-shader', type: gl.FRAGMENT_SHADER}]);
    program8 = createProgram(gl,[{container: 'vertex-shader', type: gl.VERTEX_SHADER},{container: 'fragment-shader', type: gl.FRAGMENT_SHADER}]);
    program9 = createProgram(gl,[{container: 'vertex-shader', type: gl.VERTEX_SHADER},{container: 'fragment-shader', type: gl.FRAGMENT_SHADER}]);
    
	
	//BODY
	ObjectProgram(program1, bodyobj);
	mat4.scale(bodyobj.modelMatrix, bodyobj.modelMatrix, [0.2, 0.2, 0.2]);
	mat4.translate(bodyobj.modelMatrix, bodyobj.modelMatrix, [0, -1.5, 0]);
	bodyMatrixStore = clone(bodyobj.modelMatrix);
	
	//UPPER WING 1
	ObjectProgram(program2, upperWing1obj);
    mat4.scale(upperWing1obj.modelMatrix, upperWing1obj.modelMatrix, [0.2,0.2,0.2]);
    mat4.translate(upperWing1obj.modelMatrix, upperWing1obj.modelMatrix, [0, 1.6, 0]);
	upperWing1MatrixStore = clone(upperWing1obj.modelMatrix);

	//UPPER WING 2
	ObjectProgram(program3, upperWing2obj);
    mat4.scale(upperWing2obj.modelMatrix, upperWing2obj.modelMatrix, [0.2, 0.2, 0.2]);
    mat4.translate(upperWing2obj.modelMatrix, upperWing2obj.modelMatrix, [0, 1.6, 0]);
	upperWing2MatrixStore = clone(upperWing2obj.modelMatrix);

	//LOWER WING 1
	ObjectProgram(program4, lowerWing1obj);
    mat4.scale(lowerWing1obj.modelMatrix, lowerWing1obj.modelMatrix, [0.2, 0.2, 0.2]);
    mat4.translate(lowerWing1obj.modelMatrix, lowerWing1obj.modelMatrix, [0, 0.5, 0.1]);//0.5       
	lowerWing1MatrixStore = clone(lowerWing1obj.modelMatrix);
	
	//LOWER WING 2
	ObjectProgram(program5, lowerWing2obj);
    mat4.scale(lowerWing2obj.modelMatrix, lowerWing2obj.modelMatrix, [0.2, 0.2, 0.2]);
    mat4.translate(lowerWing2obj.modelMatrix, lowerWing2obj.modelMatrix, [0, 0.5, 0.1]);
    lowerWing2MatrixStore = clone(lowerWing2obj.modelMatrix);
	
	//ground
	ObjectProgram(program6, groundobj);
    mat4.scale(groundobj.modelMatrix, groundobj.modelMatrix, [5, 0.1, 0.1]);
    mat4.translate(groundobj.modelMatrix, groundobj.modelMatrix, [0, -10, 0]);

    //head
    ObjectProgram(program7, headobj);
    mat4.scale(headobj.modelMatrix, headobj.modelMatrix, [0.2, 0.2, 0.2]);
    mat4.translate(headobj.modelMatrix, headobj.modelMatrix, [0, -1.5, 0]);
    headMatrixStore = clone(headobj.modelMatrix);

     //leg1
    ObjectProgram(program8, leg1obj);
    mat4.scale(leg1obj.modelMatrix, leg1obj.modelMatrix, [0.2, 0.2, 0.2]);
    mat4.translate(leg1obj.modelMatrix, leg1obj.modelMatrix, [0, -1.5, 0]);
    leg1MatrixStore = clone(leg1obj.modelMatrix);

     //leg2
    ObjectProgram(program9, leg2obj);
    mat4.scale(leg2obj.modelMatrix, leg2obj.modelMatrix, [0.2, 0.2, 0.2]);
    mat4.translate(leg2obj.modelMatrix, leg2obj.modelMatrix, [0, -1.5, 0]);
    leg2MatrixStore = clone(leg2obj.modelMatrix);
	
	
	
    $(document).keypress(function(e){
        console.log(e.which);
		
		if(keyboardControl){
			//pressing D
			if(e.which == 100){
				Rotate(-0.1);
				document.getElementById("pressed").innerHTML = "Last pressed: D";
			//Pressing A
			}else if (e.which == 97){
				Rotate(0.1);
				document.getElementById("pressed").innerHTML = "Last pressed: A";
			//Pressing S
			}else if (e.which == 115){		
				if((bodyobj.modelMatrix[12]) < 1 && bodyobj.modelMatrix[12] > -1.0 && bodyobj.modelMatrix[14] < -3.5 && bodyobj.modelMatrix[14] > -5){
					//code for moving in the direction is facing
					mat4.translate(bodyobj.modelMatrix,bodyobj.modelMatrix, [0, 0, -0.1]);
					mat4.translate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, [0, 0, -0.1]);
					mat4.translate(upperWing2obj.modelMatrix,upperWing2obj.modelMatrix, [0, 0, -0.1]);
					mat4.translate(lowerWing1obj.modelMatrix,lowerWing1obj.modelMatrix, [0, 0, -0.1]);
					mat4.translate(lowerWing2obj.modelMatrix,lowerWing2obj.modelMatrix, [0, 0, -0.1]);
                    mat4.translate(headobj.modelMatrix,headobj.modelMatrix, [0, 0, -0.1]);
                    mat4.translate(leg1obj.modelMatrix,leg1obj.modelMatrix, [0, 0, -0.1]);
                    mat4.translate(leg2obj.modelMatrix,leg2obj.modelMatrix, [0, 0, -0.1]);
                       
				}
				document.getElementById("pressed").innerHTML = "Last pressed: S";
			}
			//pressing z
			else if(e.which == 122){
				falling = true;
				keyboardControl = false;
				document.getElementById("pressed").innerHTML = "Last pressed: Z";
			}
			//pressing x
			else if(e.which == 120){
				spiral = true;
				keyboardControl = false;
				document.getElementById("pressed").innerHTML = "Last pressed: X";
			}
			//pressing c
			else if(e.which == 99){
				flip = true;
				keyboardControl = false;
				document.getElementById("pressed").innerHTML = "Last pressed: C";
			}
			//pressing r
			else if(e.which == 114){
				ResetObjects();
				document.getElementById("pressed").innerHTML = "Last pressed: R";
			}
		}
		else{
			document.getElementById("pressed").innerHTML = "<b>Out of control!</b>";
		}
    });
    gl.useProgram(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    for(i=0; i<numNodes; i++) initNodes(i);   
    render(); 
}


function loadMeshData(string) {
    var lines = string.split("\n");
    var positions = [];
    var normals = [];
    var vertices = [];

    for ( var i = 0 ; i < lines.length ; i++ ) {
        var parts = lines[i].trimRight().split(' ');
        if ( parts.length > 0 ) {
            switch(parts[0]) {
                case 'v':  positions.push(
                    vec3.fromValues(
                        parseFloat(parts[1]),
                        parseFloat(parts[2]),
                        parseFloat(parts[3])
                    ));
                    break;
                case 'vn':
                    normals.push(
                        vec3.fromValues(
                            parseFloat(parts[1]),
                            parseFloat(parts[2]),
                            parseFloat(parts[3])));
                    break;
                case 'f': {
                    var f1 = parts[1].split('/');
                    var f2 = parts[2].split('/');
                    var f3 = parts[3].split('/');
                    Array.prototype.push.apply(
                        vertices, positions[parseInt(f1[0]) - 1]);
                    Array.prototype.push.apply(
                        vertices, normals[parseInt(f1[2]) - 1]);
                    Array.prototype.push.apply(
                        vertices, positions[parseInt(f2[0]) - 1]);
                    Array.prototype.push.apply(
                        vertices, normals[parseInt(f2[2]) - 1]);
                    Array.prototype.push.apply(
                        vertices, positions[parseInt(f3[0]) - 1]);
                    Array.prototype.push.apply(
                        vertices, normals[parseInt(f3[2]) - 1]);
                    break;
                }
            }
        }
    }
    console.log("Loaded mesh with " + (vertices.length / 6) + " vertices");

    return {
        primitiveType: 'TRIANGLES',
        vertices: new Float32Array(vertices),
        vertexCount: vertices.length / 6,
        material: {ambient: 0.2, diffuse: 0.5, shininess: 10.0}
    };
}

function loadMesh(filename1, filename2, filename3, filename4, filename5, filename6, filename7, filename8, filename9) {

    var xmlHttp1 = new XMLHttpRequest();
    xmlHttp1.open( "GET", filename1, false ); // false for synchronous request
    xmlHttp1.send( null );

    var xmlHttp2 = new XMLHttpRequest();
    xmlHttp2.open( "GET", filename2, false ); // false for synchronous request
    xmlHttp2.send( null );

    var xmlHttp3 = new XMLHttpRequest();
    xmlHttp3.open( "GET", filename3, false ); // false for synchronous request
    xmlHttp3.send( null );

    var xmlHttp4 = new XMLHttpRequest();
    xmlHttp4.open( "GET", filename4, false ); // false for synchronous request
    xmlHttp4.send( null );
	
    var xmlHttp5 = new XMLHttpRequest();
    xmlHttp5.open( "GET", filename5, false ); // false for synchronous request
    xmlHttp5.send( null );
	
	var xmlHttp6 = new XMLHttpRequest();
    xmlHttp6.open( "GET", filename6, false ); // false for synchronous request
    xmlHttp6.send( null );

    var xmlHttp7 = new XMLHttpRequest();
    xmlHttp7.open( "GET", filename7, false ); // false for synchronous request
    xmlHttp7.send( null );

    var xmlHttp8 = new XMLHttpRequest();
    xmlHttp8.open( "GET", filename8, false ); // false for synchronous request
    xmlHttp8.send( null );
    

    var xmlHttp9 = new XMLHttpRequest();
    xmlHttp9.open( "GET", filename9, false ); // false for synchronous request
    xmlHttp9.send( null );
    
    
    init(loadMeshData(xmlHttp1.responseText),loadMeshData(xmlHttp2.responseText),loadMeshData(xmlHttp3.responseText),loadMeshData(xmlHttp4.responseText),loadMeshData(xmlHttp5.responseText),loadMeshData(xmlHttp6.responseText),loadMeshData(xmlHttp7.responseText),loadMeshData(xmlHttp8.responseText),loadMeshData(xmlHttp9.responseText));

}

$(document).ready(function() {
    loadMesh('body2.obj','upperWing1.obj','upperWing1.obj', 'upperWing2.obj', 'upperWIng2.obj', 'upperWIng2.obj','head.obj', 'leg1.obj', 'leg2.obj')
});



function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

function initNodes(Id) {

    var m = mat4.create();

    switch(Id) {
		case bodyId:
			if(keyboardControl || spiral){
				if((bodyobj.modelMatrix[12]) < 1 && bodyobj.modelMatrix[12] > -1.0 && bodyobj.modelMatrix[14] < -3.5 && bodyobj.modelMatrix[14] > -10){
					mat4.translate(bodyobj.modelMatrix, bodyobj.modelMatrix, [0,0,-movespeed]);
				}else{
					mat4.translate(bodyobj.modelMatrix, bodyobj.modelMatrix, [0,0,0.015]);
				}
			}
			if(falling){
				mat4.translate(bodyobj.modelMatrix,bodyobj.modelMatrix, [0, -falling_speed, 0]);
				falling_speed = falling_speed + 0.0003;
				if(bodyobj.modelMatrix[13] < -1.3){
					falling = false;
					document.getElementById("text").innerHTML = "Keyboard Control Enabled!";
					keyboardControl = true;
					falling_speed = 0;
					ResetObjects();
				}
				else{
					document.getElementById("text").innerHTML = "<b>Falling!</b><br>Speed: " + (falling_speed * 100).toFixed(2);
				}
			}
			if(spiral){
				mat4.translate(bodyobj.modelMatrix,bodyobj.modelMatrix, [0, -spiral_fallspeed, 0]);
				spiral_fallspeed = spiral_fallspeed + 0.000005;
				Rotate(spiral_rotspeed);
				spiral_rotspeed = spiral_rotspeed + 0.00001;
				movespeed = 0.03;
				if(bodyobj.modelMatrix[13] < -1.3){
					spiral = false;
					document.getElementById("text").innerHTML = "Keyboard Control Enabled!";
					keyboardControl = true;
					spiral_fallspeed = 0;
					spiral_rotspeed = 0.005;
					movespeed = 0.01;
					ResetObjects();
				}
				else{
					document.getElementById("text").innerHTML = "<b>Spiraling!</b><br>Fall Speed: " + (spiral_fallspeed * 100).toFixed(2) + "<br> Rotational Speed: " + (spiral_rotspeed * 100).toFixed(2);
				}
			}
			if(flip){
				mat4.rotate(bodyobj.modelMatrix,bodyobj.modelMatrix, -0.1, [1, 0, 0]);
				if(bodyobj.modelMatrix[5] < -0.19){
					half = true;
				}
				if(bodyobj.modelMatrix[5] > 0.19 && half){
					half = false;
					flip = false;
					keyboardControl = true;
					ResetObjects();
				}
			}
			figure[bodyId] = createNode( m, body, null, headId );
			break;
    
		case upperWing1Id:
			if(keyboardControl || spiral){
				if((bodyobj.modelMatrix[12]) < 1 && bodyobj.modelMatrix[12] > -1.0 && bodyobj.modelMatrix[14] < -3.5 && bodyobj.modelMatrix[14] > -10){
					mat4.translate(upperWing1obj.modelMatrix, upperWing1obj.modelMatrix, [0,0,-movespeed]);
				}else{
					mat4.translate(upperWing1obj.modelMatrix, upperWing1obj.modelMatrix, [0,0,0.015]);
				}
			}
			if(falling){
				mat4.rotate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, -(rot*0.02), [0, 0, 1]);
                mat4.translate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, [0, -falling_speed, 0]);
                mat4.rotate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, rot*0.02, [0, 0, 1]);
			}

			if(spiral){
                mat4.rotate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, (-(rot)*0.02), [0, 0, 1]);
				mat4.translate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, [0, -spiral_fallspeed, 0]);
                mat4.rotate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, -(-(rot)*0.02), [0, 0, 1]);
			}
			
			mat4.rotate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, movingDirec*0.02, [0,0,1]);
			rot = rot+(movingDirec*1);        
			movingDirec = checkxPosition(movingDirec, rot);
			figure[upperWing1Id] = createNode( m, upperWing1, null, null );
			break;
			
		case upperWing2Id:
			if(keyboardControl || spiral){
				if((bodyobj.modelMatrix[12]) < 1 && bodyobj.modelMatrix[12] > -1.0 && bodyobj.modelMatrix[14] < -3.5 && bodyobj.modelMatrix[14] > -10){
					mat4.translate(upperWing2obj.modelMatrix, upperWing2obj.modelMatrix, [0,0,-movespeed]);
				}else{
					mat4.translate(upperWing2obj.modelMatrix, upperWing2obj.modelMatrix, [0,0,0.015]);
				}
			}
			
			if(falling){
                mat4.rotate(upperWing2obj.modelMatrix,upperWing2obj.modelMatrix, rot*0.02, [0, 0, 1]);
                mat4.translate(upperWing2obj.modelMatrix,upperWing2obj.modelMatrix, [0, -falling_speed, 0]);
                mat4.rotate(upperWing2obj.modelMatrix,upperWing2obj.modelMatrix, -(rot*0.02), [0, 0, 1]);
			}
			if(spiral){
				mat4.rotate(upperWing2obj.modelMatrix,upperWing2obj.modelMatrix, rot*0.02, [0, 0, 1]);
                mat4.translate(upperWing2obj.modelMatrix,upperWing2obj.modelMatrix, [0, -spiral_fallspeed, 0]);
                mat4.rotate(upperWing2obj.modelMatrix,upperWing2obj.modelMatrix, -(rot*0.02), [0, 0, 1]);
			}
			
			mat4.rotate(upperWing2obj.modelMatrix, upperWing2obj.modelMatrix, -1*movingDirec*0.02, [0,0,1]);
			figure[upperWing2Id] = createNode( m, upperWing2, null, null );
			break;
			
		case lowerWing1Id: //cone
			if(keyboardControl || spiral){
				if((bodyobj.modelMatrix[12]) < 1 && bodyobj.modelMatrix[12] > -1.0 && bodyobj.modelMatrix[14] < -3.5 && bodyobj.modelMatrix[14] > -10){
					mat4.translate(lowerWing1obj.modelMatrix, lowerWing1obj.modelMatrix, [0,0,-movespeed]);
				}else{
					mat4.translate(lowerWing1obj.modelMatrix, lowerWing1obj.modelMatrix, [0,0,0.015]);
				}
				
			}
			
			if(falling){
				mat4.translate(lowerWing1obj.modelMatrix,lowerWing1obj.modelMatrix, [0, -falling_speed, 0]);
			}
			if(spiral){
				mat4.translate(lowerWing1obj.modelMatrix,lowerWing1obj.modelMatrix, [0, -spiral_fallspeed, 0]);
			}
			
			figure[lowerWing1Id] = createNode( m, lowerWing1, lowerWing2Id, upperWing1Id );
			break;

		case lowerWing2Id: //neck?
			if(keyboardControl || spiral){
				if((bodyobj.modelMatrix[12]) < 1 && bodyobj.modelMatrix[12] > -1.0 && bodyobj.modelMatrix[14] < -3.5 && bodyobj.modelMatrix[14] > -10){
					mat4.translate(lowerWing2obj.modelMatrix, lowerWing2obj.modelMatrix, [0,0,-movespeed]);
				}else{
					mat4.translate(lowerWing2obj.modelMatrix, lowerWing2obj.modelMatrix, [0,0,0.015]);
				}
			}
			if(falling){
				mat4.translate(lowerWing2obj.modelMatrix,lowerWing2obj.modelMatrix, [0, -falling_speed, 0]);
			}
			if(spiral){
				mat4.translate(lowerWing2obj.modelMatrix,lowerWing2obj.modelMatrix, [0, -spiral_fallspeed, 0]);
			}
			
			figure[lowerWing2Id] = createNode( m, lowerWing2, bodyId, upperWing2Id );
			break;
			
		case groundId:
			figure[groundId] = createNode( m, ground, null, null);
			break;
        case headId:
                if(keyboardControl || spiral){
                if((bodyobj.modelMatrix[12]) < 1 && bodyobj.modelMatrix[12] > -1.0 && bodyobj.modelMatrix[14] < -3.5 && bodyobj.modelMatrix[14] > -10){
                    mat4.translate(headobj.modelMatrix, headobj.modelMatrix, [0,0,-movespeed]);
                }else{
                    mat4.translate(headobj.modelMatrix, headobj.modelMatrix, [0,0,0.015]);
                }
            }
            if(falling){
                mat4.translate(headobj.modelMatrix,headobj.modelMatrix, [0, -falling_speed, 0]);
            }
            if(spiral){
                mat4.translate(headobj.modelMatrix,headobj.modelMatrix, [0, -spiral_fallspeed, 0]);
            }
            
            figure[headId] = createNode( m, head, null, null);
            break;

        case leg1Id:
                if(keyboardControl || spiral){
                if((bodyobj.modelMatrix[12]) < 1 && bodyobj.modelMatrix[12] > -1.0 && bodyobj.modelMatrix[14] < -3.5 && bodyobj.modelMatrix[14] > -10){
                    mat4.translate(leg1obj.modelMatrix, leg1obj.modelMatrix, [0,0,-movespeed]);
                }else{
                    mat4.translate(leg1obj.modelMatrix, leg1obj.modelMatrix, [0,0,0.015]);
                }
            }
            if(falling){
                mat4.translate(leg1obj.modelMatrix,leg1obj.modelMatrix, [0, -falling_speed, 0]);
            }
            if(spiral){
                mat4.translate(leg1obj.modelMatrix,leg1obj.modelMatrix, [0, -spiral_fallspeed, 0]);
            }
            
            figure[leg1Id] = createNode( m, leg1, null, null);
            break;

         case leg2Id:
                if(keyboardControl || spiral){
                if((bodyobj.modelMatrix[12]) < 1 && bodyobj.modelMatrix[12] > -1.0 && bodyobj.modelMatrix[14] < -3.5 && bodyobj.modelMatrix[14] > -10){
                    mat4.translate(leg2obj.modelMatrix, leg2obj.modelMatrix, [0,0,-movespeed]);
                }else{
                    mat4.translate(leg2obj.modelMatrix, leg2obj.modelMatrix, [0,0,0.015]);
                }
            }
            if(falling){
                mat4.translate(leg2obj.modelMatrix,leg2obj.modelMatrix, [0, -falling_speed, 0]);
            }
            if(spiral){
                mat4.translate(leg2obj.modelMatrix,leg2obj.modelMatrix, [0, -spiral_fallspeed, 0]);
            }
            
            figure[leg2Id] = createNode( m, leg2, null, null);
            break;
    }
}

function traverse(Id) {
	if(Id == null) return;
	figure[Id].render();
	if(figure[Id].sibling != null){ 
		initNodes(lowerWing1Id);
		initNodes(lowerWing2Id);
		initNodes(bodyId);
        initNodes(upperWing2Id);
        initNodes(upperWing1Id);
        initNodes(headId);
        initNodes(leg1Id);
        initNodes(leg2Id);
		traverse(figure[Id].child);
    }
	if(figure[Id].child != null){
		
		traverse(figure[Id].sibling); 
    }   
}


function body() {
    ObjTraverse(program1, bodyobj);
}


function upperWing1(){
    ObjTraverse(program2, upperWing1obj);
}

function upperWing2(){ 
    ObjTraverse(program3, upperWing2obj);
}

function lowerWing1(){
    ObjTraverse(program4, lowerWing1obj);
}

function lowerWing2(){
    ObjTraverse(program5, lowerWing2obj)
}

function ground(){
	ObjTraverse(program6, groundobj);
}

function head(){
    ObjTraverse(program7, headobj);
}

function leg1(){
    ObjTraverse(program8, leg1obj);
}

function leg2(){
    ObjTraverse(program9, leg2obj);
}
var render = function() {
        gl.clear( gl.COLOR_BUFFER_BIT );
        traverse(lowerWing1Id);
		traverse(groundId)
        traverse(headId);
        traverse(leg1Id);
        traverse(leg2Id);
        requestAnimationFrame(render);
}

function checkxPosition(movingDirec, rot){
    if(movingDirec == -1){
        if(rot <= -90){
            movingDirec = 1;
        }
    }else{
        if(rot >= 0){
            movingDirec = -1;
        }
    }
    return movingDirec;
}

function Rotate(amt){
	mat4.rotate(bodyobj.modelMatrix,bodyobj.modelMatrix, amt, [0, 1, 0]);
    mat4.rotate(headobj.modelMatrix,headobj.modelMatrix, amt, [0, 1, 0]);
    mat4.rotate(leg1obj.modelMatrix,leg1obj.modelMatrix, amt, [0, 1, 0]);
    mat4.rotate(leg2obj.modelMatrix,leg2obj.modelMatrix, amt, [0, 1, 0]);
    mat4.rotate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, -(rot*0.02), [0, 0, 1]);
    mat4.rotate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, amt, [0, 1, 0]);
    mat4.rotate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, (rot*0.02), [0, 0, 1]);
    mat4.rotate(upperWing2obj.modelMatrix,upperWing2obj.modelMatrix, rot*0.02, [0, 0, 1]);
    mat4.rotate(upperWing2obj.modelMatrix,upperWing2obj.modelMatrix, amt, [0, 1, 0]);
    mat4.rotate(upperWing2obj.modelMatrix,upperWing2obj.modelMatrix, -(rot*0.02), [0, 0, 1]);
    mat4.rotate(lowerWing1obj.modelMatrix,lowerWing1obj.modelMatrix, amt, [0, 1, 0]);
    mat4.rotate(lowerWing2obj.modelMatrix,lowerWing2obj.modelMatrix, amt, [0, 1, 0]);
}

function ObjectProgram(program, obj){
	//-----------------------------------------------------------------------------
	//-------------------------------------------------------GENERIC
	//-----------------------------------------------------------------------------
    gl.useProgram(program);
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, obj.vertices, gl.STATIC_DRAW);

    program.positionAttribute = gl.getAttribLocation(program, 'pos');
    gl.vertexAttribPointer(program.positionAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6, 0);
    program.normalAttribute = gl.getAttribLocation(program, 'normal');
    gl.vertexAttribPointer(program.normalAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6,Float32Array.BYTES_PER_ELEMENT * 3);
    gl.enableVertexAttribArray(program.positionAttribute);

    gl.enableVertexAttribArray(program.normalAttribute);

	projectionMatrix = mat4.create();
	
	mat4.perspective(projectionMatrix, 0.75, surface.width/surface.height,0.1, 100);
   
	program.projectionMatrixUniform = gl.getUniformLocation(program, 'projectionMatrix');
	
	gl.uniformMatrix4fv(program.projectionMatrixUniform, gl.FALSE,projectionMatrix);

	viewMatrix = mat4.create();
   
	program.viewMatrixUniform = gl.getUniformLocation(program, 'viewMatrix');
   
	gl.uniformMatrix4fv(program.viewMatrixUniform, gl.FALSE, viewMatrix);

	var modelMatrix = mat4.create();
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0, ypos1, -4]);

	program.modelMatrixUniform = gl.getUniformLocation(program, 'modelMatrix');
	
	gl.uniformMatrix4fv(program.modelMatrixUniform, gl.FALSE, modelMatrix);

	var normalMatrix = mat3.create()
	mat3.normalFromMat4(normalMatrix, mat4.multiply(mat4.create(), modelMatrix, viewMatrix));

	program.normalMatrixUniform = gl.getUniformLocation(program, 'normalMatrix');

	gl.uniformMatrix3fv(program.normalMatrixUniform, gl.FALSE, normalMatrix);


	program.ambientLightColourUniform = gl.getUniformLocation(program, 'ambientLightColour');
	program.directionalLightUniform = gl.getUniformLocation(program, 'directionalLight');
	program.materialSpecularUniform = gl.getUniformLocation(program, 'materialSpecular');

	obj.materialAmbientUniform = gl.getUniformLocation(program, 'materialAmbient');
	obj.materialDiffuseUniform = gl.getUniformLocation(program, 'materialDiffuse');
	obj.shininessUniform = gl.getUniformLocation(program, 'shininess');


	var ambientLightColour = vec3.fromValues(0.2, 0.2, 0.2);
	gl.uniform3fv(program.ambientLightColourUniform, ambientLightColour);
	var directionalLight = vec3.fromValues(-0.5,0.5,0.5);
	gl.uniform3fv(program.directionalLightUniform, directionalLight);
	var materialSpecular = vec3.fromValues(0.5, 0.5, 0.5);
	gl.uniform3fv(program.materialSpecularUniform, materialSpecular);
		
	gl.uniform1f(obj.shininessUniform, obj.material.shininess);
	gl.uniform1f(obj.materialAmbientUniform, obj.material.ambient);
	gl.uniform1f(obj.materialDiffuseUniform, obj.material.diffuse);
	
	obj.modelMatrix = modelMatrix;
	obj.vertexBuffer = vertexBuffer;
  //  if(obj == upperWing1obj){
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, obj.vertices, gl.STATIC_DRAW );
    textureCoordAttribute = gl.getAttribLocation(program, "vTexCoord");
    gl.enableVertexAttribArray(textureCoordAttribute);
    gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
    initTextures();
    //}


    
    
	
	
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);	
    if(obj == lowerWing1obj){
	gl.drawArrays(gl.TRIANGLES, 0, obj.vertexCount);
        }
}

function ObjTraverse(program, obj){
    gl.useProgram(program);
    // Allocate a frame buffer body
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
    var normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix,mat4.multiply(mat4.create(),obj.modelMatrix,viewMatrix));
    gl.uniformMatrix3fv(program.normalMatrixUniform, gl.FALSE, normalMatrix);
    gl.enableVertexAttribArray(program.positionAttribute);
    gl.enableVertexAttribArray(program.normalAttribute);
    gl.vertexAttribPointer(program.positionAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6, 0);
    gl.vertexAttribPointer(program.normalAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6,Float32Array.BYTES_PER_ELEMENT * 3);
	gl.uniformMatrix4fv(program.modelMatrixUniform, gl.FALSE,obj.modelMatrix);
	gl.drawArrays(gl.TRIANGLES, 0, obj.vertexCount);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function ResetObjects(){
	//Body
	for(var i = 0; i < 16; i++){
		bodyobj.modelMatrix[i] = bodyMatrixStore[i];
	}
	//Upper1
	for(var i = 0; i < 16; i++){
		upperWing1obj.modelMatrix[i] = upperWing1MatrixStore[i];
	}
	//Upper2
	for(var i = 0; i < 16; i++){
		upperWing2obj.modelMatrix[i] = upperWing2MatrixStore[i];
	}
	//Lower1
	for(var i = 0; i < 16; i++){
		lowerWing1obj.modelMatrix[i] = lowerWing1MatrixStore[i];
	}
	//Lower2
	for(var i = 0; i < 16; i++){
		lowerWing2obj.modelMatrix[i] = lowerWing2MatrixStore[i];
	}
    //head
    for(var i = 0; i < 16; i++){
        headobj.modelMatrix[i] = headMatrixStore[i];
    }
    //leg1
    for(var i = 0; i < 16; i++){
        leg1obj.modelMatrix[i] = leg1MatrixStore[i];
    }
    //leg2
    for(var i = 0; i < 16; i++){
        leg2obj.modelMatrix[i] = leg2MatrixStore[i];
    }
    rot = 0;
}	