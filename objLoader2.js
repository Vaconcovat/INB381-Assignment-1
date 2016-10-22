 var counter = 0;
 var gl;
 var surface;

 var framebuffer;

 var program1;
 var program2;
 var program3;
 var program4;

 var projectionMatrix;
 var viewMatrix;

 var bodyobj;
 var upperWing1obj;
 var upperWing2obj;
 var lowerWing1obj;
 var lowerWing2obj;

 var movingDirec = -1;
 var rot = 1;
 var rot2 = 1;
 var t = 90;

 
 var ypos1 = 0.5;
 var ypos2 = -0.5;


 var bodyId = 3;
 var upperWing1Id = 1;;
 var upperWing2Id = 2;
 var lowerWing1Id = 0;
 var lowerWing2Id = 4;

var bodyHeight = 5.0;
var bodyWidth = 1.0;
var upperArmHeight = 3.0;
var lowerArmHeight = 2.0;
var upperArmWidth  = 0.5;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.5;
var lowerLegWidth  = 0.5;
var lowerLegHeight = 2.0;
var upperLegHeight = 3.0;
var headHeight = 1.5;
var headWidth = 1.0;

var theta = [180, 180, 180, 180, 180];

var figure = [];

var stack = [];
var numNodes = 5;

//bool for keyboard control
var keyboardControl = true;

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);


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

function init(body,upperWing1, upperWing2, lowerWing1, lowerWing2) {

    bodyobj = body;
    upperWing1obj = upperWing1;
    upperWing2obj = upperWing2;
    lowerWing1obj = lowerWing1;
    lowerWing2obj = lowerWing2;
 
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


    gl.useProgram(program1);
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, bodyobj.vertices, gl.STATIC_DRAW);

    program1.positionAttribute = gl.getAttribLocation(program1, 'pos');
    gl.vertexAttribPointer(program1.positionAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6, 0);
    program1.normalAttribute = gl.getAttribLocation(program1, 'normal');
    gl.vertexAttribPointer(program1.normalAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6,Float32Array.BYTES_PER_ELEMENT * 3);
    gl.enableVertexAttribArray(program1.positionAttribute);

    gl.enableVertexAttribArray(program1.normalAttribute);

	projectionMatrix = mat4.create();
	
	mat4.perspective(projectionMatrix, 0.75, surface.width/surface.height,0.1, 100);
   
	program1.projectionMatrixUniform = gl.getUniformLocation(program1, 'projectionMatrix');
	
	gl.uniformMatrix4fv(program1.projectionMatrixUniform, gl.FALSE,projectionMatrix);

	viewMatrix = mat4.create();
   
	program1.viewMatrixUniform = gl.getUniformLocation(program1, 'viewMatrix');
   
	gl.uniformMatrix4fv(program1.viewMatrixUniform, gl.FALSE, viewMatrix);

	var modelMatrix = mat4.create();
	mat4.identity(modelMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0, ypos1, -4]);

	program1.modelMatrixUniform = gl.getUniformLocation(program1, 'modelMatrix');
	
	gl.uniformMatrix4fv(program1.modelMatrixUniform, gl.FALSE, modelMatrix);

	var normalMatrix = mat3.create()
	mat3.normalFromMat4(normalMatrix, mat4.multiply(mat4.create(), modelMatrix, viewMatrix));

	program1.normalMatrixUniform = gl.getUniformLocation(program1, 'normalMatrix');

	gl.uniformMatrix3fv(program1.normalMatrixUniform, gl.FALSE, normalMatrix);


	program1.ambientLightColourUniform = gl.getUniformLocation(program1, 'ambientLightColour');
	program1.directionalLightUniform = gl.getUniformLocation(program1, 'directionalLight');
	program1.materialSpecularUniform = gl.getUniformLocation(program1, 'materialSpecular');

	bodyobj.materialAmbientUniform = gl.getUniformLocation(program1, 'materialAmbient');
	bodyobj.materialDiffuseUniform = gl.getUniformLocation(program1, 'materialDiffuse');
	bodyobj.shininessUniform = gl.getUniformLocation(program1, 'shininess');


	var ambientLightColour = vec3.fromValues(0.2, 0.2, 0.2);
	gl.uniform3fv(program1.ambientLightColourUniform, ambientLightColour);
	var directionalLight = vec3.fromValues(-0.5,0.5,0.5);
	gl.uniform3fv(program1.directionalLightUniform, directionalLight);
	var materialSpecular = vec3.fromValues(0.5, 0.5, 0.5);
	gl.uniform3fv(program1.materialSpecularUniform, materialSpecular);
		
	//body
	gl.uniform1f(bodyobj.shininessUniform, bodyobj.material.shininess);
	gl.uniform1f(bodyobj.materialAmbientUniform, bodyobj.material.ambient);
	gl.uniform1f(bodyobj.materialDiffuseUniform, bodyobj.material.diffuse);
	
	bodyobj.modelMatrix = modelMatrix;
	bodyobj.vertexBuffer = vertexBuffer;
	mat4.scale(bodyobj.modelMatrix, bodyobj.modelMatrix, [0.2, 0.2, 0.2]);
	mat4.translate(bodyobj.modelMatrix, bodyobj.modelMatrix, [0, -1.5, 0]);
	gl.bindBuffer(gl.ARRAY_BUFFER, bodyobj.vertexBuffer);
			
	gl.drawArrays(gl.TRIANGLES, 0, bodyobj.vertexCount);

    gl.useProgram(program2);
    
    var vertexBuffer8 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer8);
    gl.bufferData(gl.ARRAY_BUFFER, upperWing1obj.vertices, gl.STATIC_DRAW);

    program2.positionAttribute = gl.getAttribLocation(program2, 'pos');
    gl.vertexAttribPointer(program2.positionAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6, 0);
    program2.normalAttribute = gl.getAttribLocation(program2, 'normal');
    gl.vertexAttribPointer(program2.normalAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6,Float32Array.BYTES_PER_ELEMENT * 3);
    gl.enableVertexAttribArray(program2.positionAttribute);

    gl.enableVertexAttribArray(program2.normalAttribute);

    program2.projectionMatrixUniform = gl.getUniformLocation(program2, 'projectionMatrix');
    
    gl.uniformMatrix4fv(program2.projectionMatrixUniform, gl.FALSE,projectionMatrix);

    var viewMatrix8 = mat4.create();
   
    program2.viewMatrixUniform = gl.getUniformLocation(program2, 'viewMatrix');
   
    gl.uniformMatrix4fv(program2.viewMatrixUniform, gl.FALSE, viewMatrix8);

    var modelMatrix8 = mat4.create();
    mat4.identity(modelMatrix8);
    mat4.translate(modelMatrix8, modelMatrix8, [0, ypos1, -4]);

    
    
    program2.modelMatrixUniform = gl.getUniformLocation(program2, 'modelMatrix');
    
    gl.uniformMatrix4fv(program2.modelMatrixUniform, gl.FALSE, modelMatrix8);

    var normalMatrix8 = mat3.create()
    mat3.normalFromMat4(normalMatrix8, mat4.multiply(mat4.create(), modelMatrix8, viewMatrix8));

    program2.normalMatrixUniform = gl.getUniformLocation(program2, 'normalMatrix');

    gl.uniformMatrix3fv(program2.normalMatrixUniform, gl.FALSE, normalMatrix8);

     program2.ambientLightColourUniform = gl.getUniformLocation(program2, 'ambientLightColour');
    program2.directionalLightUniform = gl.getUniformLocation(program2, 'directionalLight');
    program2.materialSpecularUniform = gl.getUniformLocation(program2, 'materialSpecular');

    upperWing1obj.materialAmbientUniform = gl.getUniformLocation(program2, 'materialAmbient');
    upperWing1obj.materialDiffuseUniform = gl.getUniformLocation(program2, 'materialDiffuse');
    upperWing1obj.shininessUniform = gl.getUniformLocation(program2, 'shininess');


    var ambientLightColour = vec3.fromValues(0.2, 0.2, 0.2);
    gl.uniform3fv(program2.ambientLightColourUniform, ambientLightColour);
    var directionalLight = vec3.fromValues(-0.5,0.5,0.5);
    gl.uniform3fv(program2.directionalLightUniform, directionalLight);
    var materialSpecular = vec3.fromValues(0.5, 0.5, 0.5);
    gl.uniform3fv(program2.materialSpecularUniform, materialSpecular);

    gl.uniform1f(upperWing1obj.shininessUniform, upperWing1obj.material.shininess);
    gl.uniform1f(upperWing1obj.materialAmbientUniform, upperWing1obj.material.ambient);
    gl.uniform1f(upperWing1obj.materialDiffuseUniform, upperWing1obj.material.diffuse);

    upperWing1obj.modelMatrix = modelMatrix8;
    upperWing1obj.vertexBuffer = vertexBuffer8;
    mat4.scale(upperWing1obj.modelMatrix, upperWing1obj.modelMatrix, [0.2,0.2,0.2]);
    mat4.translate(upperWing1obj.modelMatrix, upperWing1obj.modelMatrix, [0, 1.6, 0]);
    mat4.rotate(upperWing1obj.modelMatrix, upperWing1obj.modelMatrix, -0.5, [0, 0, 1]);

    gl.drawArrays(gl.TRIANGLES,0 ,upperWing1obj.vertexCount);

    gl.useProgram(program3);
    
    
    var vertexBuffer10 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer10);
    gl.bufferData(gl.ARRAY_BUFFER, upperWing2obj.vertices, gl.STATIC_DRAW);

    program3.positionAttribute = gl.getAttribLocation(program3, 'pos');
    gl.vertexAttribPointer(program3.positionAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6, 0);
    program3.normalAttribute = gl.getAttribLocation(program3, 'normal');
    gl.vertexAttribPointer(program3.normalAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6,Float32Array.BYTES_PER_ELEMENT * 3);
    gl.enableVertexAttribArray(program3.positionAttribute);

    gl.enableVertexAttribArray(program3.normalAttribute);

   

    program3.projectionMatrixUniform = gl.getUniformLocation(program3, 'projectionMatrix');
    
    gl.uniformMatrix4fv(program3.projectionMatrixUniform, gl.FALSE,projectionMatrix);

    var viewMatrix10 = mat4.create();
   
    program3.viewMatrixUniform = gl.getUniformLocation(program3, 'viewMatrix');
   
    gl.uniformMatrix4fv(program3.viewMatrixUniform, gl.FALSE, viewMatrix10);

    var modelMatrix10 = mat4.create();
    mat4.identity(modelMatrix10);
    mat4.translate(modelMatrix10, modelMatrix10, [0, ypos1, -4]);

    
    
    program3.modelMatrixUniform = gl.getUniformLocation(program3, 'modelMatrix');
    
    gl.uniformMatrix4fv(program3.modelMatrixUniform, gl.FALSE, modelMatrix10);

    var normalMatrix10 = mat3.create()
    mat3.normalFromMat4(normalMatrix10, mat4.multiply(mat4.create(), modelMatrix10, viewMatrix10));

    program3.normalMatrixUniform = gl.getUniformLocation(program3, 'normalMatrix');

    gl.uniformMatrix3fv(program3.normalMatrixUniform, gl.FALSE, normalMatrix10);

    program3.ambientLightColourUniform = gl.getUniformLocation(program3, 'ambientLightColour');
    program3.directionalLightUniform = gl.getUniformLocation(program3, 'directionalLight');
    program3.materialSpecularUniform = gl.getUniformLocation(program3, 'materialSpecular');

    upperWing2obj.materialAmbientUniform = gl.getUniformLocation(program3, 'materialAmbient');
    upperWing2obj.materialDiffuseUniform = gl.getUniformLocation(program3, 'materialDiffuse');
    upperWing2obj.shininessUniform = gl.getUniformLocation(program3, 'shininess');


    var ambientLightColour = vec3.fromValues(0.2, 0.2, 0.2);
    gl.uniform3fv(program3.ambientLightColourUniform, ambientLightColour);
    var directionalLight = vec3.fromValues(-0.5,0.5,0.5);
    gl.uniform3fv(program3.directionalLightUniform, directionalLight);
    var materialSpecular = vec3.fromValues(0.5, 0.5, 0.5);
    gl.uniform3fv(program3.materialSpecularUniform, materialSpecular);

    gl.uniform1f(upperWing2obj.shininessUniform, upperWing2obj.material.shininess);
    gl.uniform1f(upperWing2obj.materialAmbientUniform, upperWing2obj.material.ambient);
    gl.uniform1f(upperWing2obj.materialDiffuseUniform, upperWing2obj.material.diffuse);

    upperWing2obj.modelMatrix = modelMatrix10;
    upperWing2obj.vertexBuffer = vertexBuffer10;

    mat4.scale(upperWing2obj.modelMatrix, upperWing2obj.modelMatrix, [0.2, 0.2, 0.2]);
    mat4.translate(upperWing2obj.modelMatrix, upperWing2obj.modelMatrix, [0, 1.6, 0.1]);
    mat4.rotate(upperWing2obj.modelMatrix, upperWing2obj.modelMatrix, 0.5, [0, 0, 1]);
    
    gl.drawArrays(gl.TRIANGLES, 0, upperWing2obj.vertexCount);

    gl.useProgram(program4);
    
    var vertexBuffer4 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer4);
    gl.bufferData(gl.ARRAY_BUFFER, lowerWing1obj.vertices, gl.STATIC_DRAW);

    program4.positionAttribute = gl.getAttribLocation(program4, 'pos');
     gl.vertexAttribPointer(program4.positionAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6, 0);
    program4.normalAttribute = gl.getAttribLocation(program4, 'normal');
    gl.vertexAttribPointer(program4.normalAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6,Float32Array.BYTES_PER_ELEMENT * 3);
    gl.enableVertexAttribArray(program4.positionAttribute);

    gl.enableVertexAttribArray(program4.normalAttribute);

    program4.projectionMatrixUniform = gl.getUniformLocation(program4, 'projectionMatrix');
    
    gl.uniformMatrix4fv(program4.projectionMatrixUniform, gl.FALSE,projectionMatrix);

    var viewMatrix4 = mat4.create();
   
    program4.viewMatrixUniform = gl.getUniformLocation(program4, 'viewMatrix');
   
    gl.uniformMatrix4fv(program4.viewMatrixUniform, gl.FALSE, viewMatrix4);

    var modelMatrix4 = mat4.create();
    mat4.identity(modelMatrix4);
    mat4.translate(modelMatrix4, modelMatrix4, [0, ypos1, -4]);

    
    
    program4.modelMatrixUniform = gl.getUniformLocation(program4, 'modelMatrix');
    
    gl.uniformMatrix4fv(program4.modelMatrixUniform, gl.FALSE, modelMatrix4);

    var normalMatrix4 = mat3.create()
    mat3.normalFromMat4(normalMatrix4, mat4.multiply(mat4.create(), modelMatrix4, viewMatrix4));

    program4.normalMatrixUniform = gl.getUniformLocation(program4, 'normalMatrix');

    gl.uniformMatrix3fv(program4.normalMatrixUniform, gl.FALSE, normalMatrix4);

     program4.ambientLightColourUniform = gl.getUniformLocation(program4, 'ambientLightColour');
    program4.directionalLightUniform = gl.getUniformLocation(program4, 'directionalLight');
    program4.materialSpecularUniform = gl.getUniformLocation(program4, 'materialSpecular');

    lowerWing1obj.materialAmbientUniform = gl.getUniformLocation(program4, 'materialAmbient');
    lowerWing1obj.materialDiffuseUniform = gl.getUniformLocation(program4, 'materialDiffuse');
    lowerWing1obj.shininessUniform = gl.getUniformLocation(program4, 'shininess');


    var ambientLightColour = vec3.fromValues(0.2, 0.2, 0.2);
    gl.uniform3fv(program4.ambientLightColourUniform, ambientLightColour);
    var directionalLight = vec3.fromValues(-0.5,0.5,0.5);
    gl.uniform3fv(program4.directionalLightUniform, directionalLight);
    var materialSpecular = vec3.fromValues(0.5, 0.5, 0.5);
    gl.uniform3fv(program4.materialSpecularUniform, materialSpecular);

    gl.uniform1f(lowerWing1obj.shininessUniform, lowerWing1obj.material.shininess);
    gl.uniform1f(lowerWing1obj.materialAmbientUniform, lowerWing1obj.material.ambient);
    gl.uniform1f(lowerWing1obj.materialDiffuseUniform, lowerWing1obj.material.diffuse);

    lowerWing1obj.modelMatrix = modelMatrix4;
    lowerWing1obj.vertexBuffer = vertexBuffer4;

    mat4.scale(lowerWing1obj.modelMatrix, lowerWing1obj.modelMatrix, [0.2, 0.2, 0.2]);
    mat4.translate(lowerWing1obj.modelMatrix, lowerWing1obj.modelMatrix, [0, 0.5, 0.1]);//0.5       

    gl.drawArrays(gl.TRIANGLES, 0, lowerWing1obj.vertexCount);

    gl.useProgram(program5);

    var vertexBuffer5 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer5);
    gl.bufferData(gl.ARRAY_BUFFER, lowerWing2obj.vertices, gl.STATIC_DRAW);

    program5.positionAttribute = gl.getAttribLocation(program5, 'pos');
     gl.vertexAttribPointer(program5.positionAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6, 0);
    program5.normalAttribute = gl.getAttribLocation(program5, 'normal');
    gl.vertexAttribPointer(program5.normalAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6,Float32Array.BYTES_PER_ELEMENT * 3);
    gl.enableVertexAttribArray(program5.positionAttribute);

    gl.enableVertexAttribArray(program5.normalAttribute);

    program5.projectionMatrixUniform = gl.getUniformLocation(program5, 'projectionMatrix');
    
    gl.uniformMatrix4fv(program5.projectionMatrixUniform, gl.FALSE,projectionMatrix);

    var viewMatrix5 = mat4.create();
   
    program5.viewMatrixUniform = gl.getUniformLocation(program5, 'viewMatrix');
   
    gl.uniformMatrix4fv(program5.viewMatrixUniform, gl.FALSE, viewMatrix5);

    var modelMatrix5 = mat4.create();
    mat4.identity(modelMatrix5);
    mat4.translate(modelMatrix5, modelMatrix5, [0, ypos1, -4]);

    
    
    program5.modelMatrixUniform = gl.getUniformLocation(program5, 'modelMatrix');
    
    gl.uniformMatrix4fv(program5.modelMatrixUniform, gl.FALSE, modelMatrix5);

    var normalMatrix5 = mat3.create()
    mat3.normalFromMat4(normalMatrix5, mat4.multiply(mat4.create(), modelMatrix5, viewMatrix5));

    program5.normalMatrixUniform = gl.getUniformLocation(program5, 'normalMatrix');

    gl.uniformMatrix3fv(program5.normalMatrixUniform, gl.FALSE, normalMatrix5);

    program5.ambientLightColourUniform = gl.getUniformLocation(program5, 'ambientLightColour');
    program5.directionalLightUniform = gl.getUniformLocation(program5, 'directionalLight');
    program5.materialSpecularUniform = gl.getUniformLocation(program5, 'materialSpecular');

    lowerWing2obj.materialAmbientUniform = gl.getUniformLocation(program5, 'materialAmbient');
    lowerWing2obj.materialDiffuseUniform = gl.getUniformLocation(program5, 'materialDiffuse');
    lowerWing2obj.shininessUniform = gl.getUniformLocation(program5, 'shininess');


    var ambientLightColour = vec3.fromValues(0.2, 0.2, 0.2);
    gl.uniform3fv(program5.ambientLightColourUniform, ambientLightColour);
    var directionalLight = vec3.fromValues(-0.5,0.5,0.5);
    gl.uniform3fv(program5.directionalLightUniform, directionalLight);
    var materialSpecular = vec3.fromValues(0.5, 0.5, 0.5);
    gl.uniform3fv(program5.materialSpecularUniform, materialSpecular);

    gl.uniform1f(lowerWing2obj.shininessUniform, lowerWing2obj.material.shininess);
    gl.uniform1f(lowerWing2obj.materialAmbientUniform, lowerWing2obj.material.ambient);
    gl.uniform1f(lowerWing2obj.materialDiffuseUniform, lowerWing2obj.material.diffuse);

    lowerWing2obj.modelMatrix = modelMatrix5;
    lowerWing2obj.vertexBuffer = vertexBuffer5;

    mat4.scale(lowerWing2obj.modelMatrix, lowerWing2obj.modelMatrix, [0.2, 0.2, 0.2]);
    mat4.translate(lowerWing2obj.modelMatrix, lowerWing2obj.modelMatrix, [0, 0.5, 0.1]);

    gl.drawArrays(gl.TRIANGLES,0 ,lowerWing2obj.vertexCount);

    
    $(document).keypress(function(e){
        console.log(e.which);
		//pressing z
		if(e.which == 122){
			if(keyboardControl){
				document.getElementById("text").innerHTML = "Keyboard Control Disabled!";
				keyboardControl = false;
			}
			else{
				document.getElementById("text").innerHTML = "Keyboard Control Enabled!";
				keyboardControl = true;
			}
		}
		if(keyboardControl){
			//pressing A
			if(e.which == 100){
				RotateLeft();
			//Pressing D
			}else if (e.which == 97){
				RotateRight();
			//Pressing S
			}else if (e.which == 115){		
				if((bodyobj.modelMatrix[12]) < 1 && bodyobj.modelMatrix[12] > -1.0 && bodyobj.modelMatrix[14] < -3.5 && bodyobj.modelMatrix[14] > -5){
					//code for moving in the direction is facing
					mat4.translate(bodyobj.modelMatrix,bodyobj.modelMatrix, [0, 0, -0.1]);
					mat4.translate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, [0, 0, -0.1]);
					mat4.translate(upperWing2obj.modelMatrix,upperWing2obj.modelMatrix, [0, 0, -0.1]);
					mat4.translate(lowerWing1obj.modelMatrix,lowerWing1obj.modelMatrix, [0, 0, -0.1]);
					mat4.translate(lowerWing2obj.modelMatrix,lowerWing2obj.modelMatrix, [0, 0, -0.1]);
				}
			}
		}
		else{
			
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

function loadMesh(filename1, filename2, filename3, filename4, filename5) {

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
    
    init(loadMeshData(xmlHttp1.responseText),loadMeshData(xmlHttp2.responseText),loadMeshData(xmlHttp3.responseText),loadMeshData(xmlHttp4.responseText),loadMeshData(xmlHttp5.responseText));

}

$(document).ready(function() {
    loadMesh('body.obj','upperWing2.obj','upperWing2.obj', 'upperWing2.obj', 'upperWIng2.obj')
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
			if((bodyobj.modelMatrix[12]) < 1 && bodyobj.modelMatrix[12] > -1.0 && bodyobj.modelMatrix[14] < -3.5 && bodyobj.modelMatrix[14] > -5){
				mat4.translate(bodyobj.modelMatrix, bodyobj.modelMatrix, [0,0,-0.01]);
			}else{
				mat4.translate(bodyobj.modelMatrix, bodyobj.modelMatrix, [0,0,0.015]);
			}
			figure[bodyId] = createNode( m, body, null, null );
			break;
    
		case upperWing1Id:
			if((bodyobj.modelMatrix[12]) < 1 && bodyobj.modelMatrix[12] > -1.0 && bodyobj.modelMatrix[14] < -3.5 && bodyobj.modelMatrix[14] > -5){
				mat4.translate(upperWing1obj.modelMatrix, upperWing1obj.modelMatrix, [0,0,-0.01]);
			}else{
				mat4.translate(upperWing1obj.modelMatrix, upperWing1obj.modelMatrix, [0,0,0.015]);
			}
			mat4.rotate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, rot2*movingDirec*(rot*0.02), [0,0,1]);
			mat4.rotate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, rot2*-1*movingDirec*((rot-1)*0.02), [0,0,1]);
			rot = rot+(movingDirec*1);        
			movingDirec = checkxPosition(movingDirec, rot);
			figure[upperWing1Id] = createNode( m, upperWing1, null, null );
			break;
			
		case upperWing2Id:
			if((bodyobj.modelMatrix[12]) < 1 && bodyobj.modelMatrix[12] > -1.0 && bodyobj.modelMatrix[14] < -3.5 && bodyobj.modelMatrix[14] > -5){
				mat4.translate(upperWing2obj.modelMatrix, upperWing2obj.modelMatrix, [0,0,-0.01]);
			}else{
				mat4.translate(upperWing2obj.modelMatrix, upperWing2obj.modelMatrix, [0,0,0.015]);
			}
			mat4.rotate(upperWing2obj.modelMatrix, upperWing2obj.modelMatrix, -1*movingDirec*0.02, [0,0,1]);
			figure[upperWing2Id] = createNode( m, upperWing2, null, null );
			break;
			
		case lowerWing1Id:
			mat4.translate(lowerWing1obj.modelMatrix, lowerWing1obj.modelMatrix, [0,0,-0.01]);
			figure[lowerWing1Id] = createNode( m, lowerWing1, lowerWing2Id, upperWing1Id );
			break;

		case lowerWing2Id:
			if((bodyobj.modelMatrix[12]) < 1 && bodyobj.modelMatrix[12] > -1.0 && bodyobj.modelMatrix[14] < -3.5 && bodyobj.modelMatrix[14] > -5){
				mat4.translate(lowerWing2obj.modelMatrix, lowerWing2obj.modelMatrix, [0,0,-.01]);
			}else{
				mat4.translate(lowerWing2obj.modelMatrix, lowerWing2obj.modelMatrix, [0,0,0.015]);
			}
			figure[lowerWing2Id] = createNode( m, lowerWing2, bodyId, upperWing2Id );
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
		traverse(figure[Id].child);
    }
	if(figure[Id].child != null){
		initNodes(upperWing2Id);
		initNodes(upperWing1Id);
		traverse(figure[Id].sibling); 
    }   
}

//still working on splittong up the fucntion so that it does the render stuff and not init stuff
function body() {
    gl.useProgram(program1);
    // Allocate a frame buffer body
    gl.useProgram(program1); 
    gl.bindBuffer(gl.ARRAY_BUFFER, bodyobj.vertexBuffer);
    var normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix,mat4.multiply(mat4.create(),bodyobj.modelMatrix,viewMatrix));
    gl.uniformMatrix3fv(program1.normalMatrixUniform, gl.FALSE, normalMatrix);
    gl.enableVertexAttribArray(program1.positionAttribute);
    gl.enableVertexAttribArray(program1.normalAttribute);
    gl.vertexAttribPointer(program1.positionAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6, 0);
    gl.vertexAttribPointer(program1.normalAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6,Float32Array.BYTES_PER_ELEMENT * 3);
	gl.uniformMatrix4fv(program1.modelMatrixUniform, gl.FALSE,bodyobj.modelMatrix);
	gl.drawArrays(gl.TRIANGLES, 0, bodyobj.vertexCount);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
}


function upperWing1(){
    gl.useProgram(program2);
    gl.bindBuffer(gl.ARRAY_BUFFER, upperWing1obj.vertexBuffer);
    var normalMatrix8 = mat3.create();
	mat3.normalFromMat4(normalMatrix8,mat4.multiply(mat4.create(),upperWing1obj.modelMatrix,viewMatrix));
    gl.uniformMatrix3fv(program2.normalMatrixUniform, gl.FALSE, normalMatrix8);
    gl.enableVertexAttribArray(program2.positionAttribute);
    gl.enableVertexAttribArray(program2.normalAttribute);
    gl.vertexAttribPointer(program2.positionAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6, 0);
    gl.vertexAttribPointer(program2.normalAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6,Float32Array.BYTES_PER_ELEMENT * 3);
    gl.uniformMatrix4fv(program2.modelMatrixUniform, gl.FALSE,upperWing1obj.modelMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, upperWing1obj.vertexCount);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function upperWing2(){ 
    gl.useProgram(program3);
    gl.bindBuffer(gl.ARRAY_BUFFER, upperWing2obj.vertexBuffer);
	var normalMatrix10 = mat3.create();
	mat3.normalFromMat4(normalMatrix10,mat4.multiply(mat4.create(),upperWing2obj.modelMatrix,viewMatrix));
    gl.uniformMatrix3fv(program3.normalMatrixUniform, gl.FALSE, normalMatrix10);
    gl.enableVertexAttribArray(program3.positionAttribute);
    gl.enableVertexAttribArray(program3.normalAttribute);
    gl.vertexAttribPointer(program3.positionAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6, 0);
    gl.vertexAttribPointer(program3.normalAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6,Float32Array.BYTES_PER_ELEMENT * 3);
    gl.uniformMatrix4fv(program3.modelMatrixUniform, gl.FALSE,upperWing2obj.modelMatrix);
    mat4.rotate(upperWing2obj, upperWing2obj, theta[upperWing2Id], [0,1,0]);
    gl.drawArrays(gl.TRIANGLES, 0, upperWing2obj.vertexCount);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function lowerWing1(){
    gl.useProgram(program4);
	gl.bindBuffer(gl.ARRAY_BUFFER, lowerWing1obj.vertexBuffer);
    var normalMatrix4 = mat3.create();
    mat3.normalFromMat4(normalMatrix4,mat4.multiply(mat4.create(),lowerWing1obj.modelMatrix,viewMatrix));
    gl.uniformMatrix3fv(program4.normalMatrixUniform, gl.FALSE, normalMatrix4);
    gl.enableVertexAttribArray(program4.positionAttribute);
    gl.enableVertexAttribArray(program4.normalAttribute);
    gl.vertexAttribPointer(program4.positionAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6, 0);
    gl.vertexAttribPointer(program4.normalAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6,Float32Array.BYTES_PER_ELEMENT * 3);
    gl.uniformMatrix4fv(program4.modelMatrixUniform, gl.FALSE,lowerWing1obj.modelMatrix);
    //mat4.rotate(lowerWing1obj, lowerWing1obj, theta[lowerWing1Id], [0,1,0]);
    //gl.drawArrays(gl.TRIANGLES, 0, lowerWing1obj.vertexCount);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function lowerWing2(){
    gl.useProgram(program5);    
    gl.bindBuffer(gl.ARRAY_BUFFER, lowerWing1obj.vertexBuffer);
    var normalMatrix5 = mat3.create();
    mat3.normalFromMat4(normalMatrix5,mat4.multiply(mat4.create(),lowerWing2obj.modelMatrix,viewMatrix));
    gl.uniformMatrix3fv(program5.normalMatrixUniform, gl.FALSE, normalMatrix5);
    gl.enableVertexAttribArray(program5.positionAttribute);
    gl.enableVertexAttribArray(program5.normalAttribute);
    gl.vertexAttribPointer(program5.positionAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6, 0);
    gl.vertexAttribPointer(program5.normalAttribute, 3, gl.FLOAT, gl.FALSE,Float32Array.BYTES_PER_ELEMENT * 6,Float32Array.BYTES_PER_ELEMENT * 3);
    gl.uniformMatrix4fv(program5.modelMatrixUniform, gl.FALSE,lowerWing2obj.modelMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, lowerWing2obj.vertexCount);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
var render = function() {
        gl.clear( gl.COLOR_BUFFER_BIT );
        traverse(lowerWing1Id);
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

function RotateLeft(){
	mat4.rotate(bodyobj.modelMatrix,bodyobj.modelMatrix, -0.1, [0, 1, 0]);
    mat4.rotate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, 0.52-(rot*0.02), [0, 0, 1]);
    mat4.rotate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, -0.1, [0, 1, 0]);
    mat4.rotate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, -(0.52-(rot*0.02)), [0, 0, 1]);
    mat4.rotate(upperWing2obj.modelMatrix,upperWing2obj.modelMatrix, -(0.5-(rot*0.02)), [0, 0, 1]);
    mat4.rotate(upperWing2obj.modelMatrix,upperWing2obj.modelMatrix, -0.1, [0, 1, 0]);
    mat4.rotate(upperWing2obj.modelMatrix,upperWing2obj.modelMatrix, 0.5-(rot*0.02), [0, 0, 1]);
    mat4.rotate(lowerWing1obj.modelMatrix,lowerWing1obj.modelMatrix, -0.1, [0, 1, 0]);
    mat4.rotate(lowerWing2obj.modelMatrix,lowerWing2obj.modelMatrix, -0.1, [0, 1, 0]);
}

function RotateRight(){
	mat4.rotate(bodyobj.modelMatrix,bodyobj.modelMatrix, 0.1, [0, 1, 0]);
    mat4.rotate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, 0.52-(rot*0.02), [0, 0, 1]);
    mat4.rotate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, 0.1, [0, 1, 0]);
    mat4.rotate(upperWing1obj.modelMatrix,upperWing1obj.modelMatrix, -(0.52-(rot*0.02)), [0, 0, 1]);
    mat4.rotate(upperWing2obj.modelMatrix,upperWing2obj.modelMatrix, -(0.5-(rot*0.02)), [0, 0, 1]);
    mat4.rotate(upperWing2obj.modelMatrix,upperWing2obj.modelMatrix, 0.1, [0, 1, 0]);
    mat4.rotate(upperWing2obj.modelMatrix,upperWing2obj.modelMatrix, 0.5-(rot*0.02), [0, 0, 1]);
    mat4.rotate(lowerWing1obj.modelMatrix,lowerWing1obj.modelMatrix, 0.1, [0, 1, 0]);
    mat4.rotate(lowerWing2obj.modelMatrix,lowerWing2obj.modelMatrix, 0.1, [0, 1, 0]);
}
