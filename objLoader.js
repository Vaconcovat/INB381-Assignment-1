/**
 * Created by mvandeberg on 1/08/2015.
 */
 var count2 = 0;
 var clicked = 0;
 var count = 0;
 var posX = -10000;
 var movingDirec = 0.05;
 var movingDirec2 = 0.05;
 var vertexColors;
 var redVal;
 var blueVal;
 var greenVal;
 var color = new Uint8Array(4);
 var mult = 1;
 var mult2 = 1;

 var colorsArray = [];

function render(gl,scene,timestamp,previousTimestamp) {
    if(count == 0){
           // console.log(scene.object2.modelMatrix);
        mat4.scale(scene.object.modelMatrix, scene.object.modelMatrix, [0.4, 0.4, 0.4]);
        count++;
		mat4.scale(scene.object2.modelMatrix,scene.object2.modelMatrix, [0.4,0.4,0.4]);
		mat4.scale(scene.marker1.modelMatrix,scene.marker1.modelMatrix, [0.2,0.2,0.2]);
		mat4.scale(scene.marker2.modelMatrix,scene.marker2.modelMatrix, [0.2,0.2,0.2]);
		mat4.scale(scene.marker3.modelMatrix,scene.marker3.modelMatrix, [0.2,0.2,0.2]);
		mat4.scale(scene.marker4.modelMatrix,scene.marker4.modelMatrix, [0.2,0.2,0.2]);
    }
    
    mat4.rotate(
        scene.object2.modelMatrix, scene.object2.modelMatrix,Math.PI/16,
        [0, 1, 0]);
    
    mat4.rotate(
        scene.object.modelMatrix, scene.object.modelMatrix,Math.PI/16,
        [0, 1, 0]);

		
		//OBJECT 
    scene.object.modelMatrix[12] = scene.object.modelMatrix[12]+movingDirec*mult;
    //scene.object.modelMatrix[13] = 0.5;     

    movingDirec = checkxPosition(movingDirec, scene.object.modelMatrix);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(scene.program);
    gl.uniformMatrix4fv(scene.program.modelMatrixUniform, gl.FALSE,scene.object.modelMatrix);
    
    var normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix,mat4.multiply(mat4.create(),scene.object.modelMatrix,scene.viewMatrix));
    gl.uniformMatrix3fv(scene.program.normalMatrixUniform, gl.FALSE, normalMatrix);
    redVal = 0.5+scene.object.modelMatrix[12];
    blueVal= 0.75*scene.object.modelMatrix[12];
    greemVal= scene.object.modelMatrix[12];
    var colorVal = vec3.create();
    colorVal[0] = redVal;
    colorVal[2] = blueVal-1.5;
    scene.program.colorVal = gl.getUniformLocation(scene.program, 'colorVal');
    gl.uniform3fv(scene.program.colorVal, colorVal);

    
    gl.bindBuffer(gl.ARRAY_BUFFER, scene.object.vertexBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, scene.object.vertexCount);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
		//OBJECT2
    scene.object2.modelMatrix[12] = scene.object2.modelMatrix[12]+(1.5*movingDirec2*mult2);
    //scene.object2.modelMatrix[13] = -0.5;


    movingDirec2 = checkxPosition(movingDirec2, scene.object2.modelMatrix);
	gl.uniformMatrix4fv(scene.program.modelMatrixUniform, gl.FALSE,scene.object2.modelMatrix);
    
    var normalMatrix2 = mat3.create();
    mat3.normalFromMat4(normalMatrix2,mat4.multiply(mat4.create(),scene.object2.modelMatrix,scene.viewMatrix));
    gl.uniformMatrix3fv(scene.program.normalMatrixUniform, gl.FALSE, normalMatrix);
    redVal = 0.5+scene.object2.modelMatrix[12];
    blueVal= scene.object2.modelMatrix[12];
    colorVal[0] = redVal;
    colorVal[2] = blueVal-1.5;
    scene.program.colorVal = gl.getUniformLocation(scene.program, 'colorVal');
    gl.uniform3fv(scene.program.colorVal, colorVal);

    gl.bindBuffer(gl.ARRAY_BUFFER, scene.object2.vertexBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, scene.object2.vertexCount);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);     
	
	//marker1
	gl.uniformMatrix4fv(scene.program.modelMatrixUniform, gl.FALSE,scene.marker1.modelMatrix);
	var normalMatrixMarker1 = mat3.create();
    mat3.normalFromMat4(normalMatrixMarker1,mat4.multiply(mat4.create(),scene.marker1.modelMatrix,scene.viewMatrix));
    gl.uniformMatrix3fv(scene.program.normalMatrixUniform, gl.FALSE, normalMatrix);
	colorVal = vec3.create();
	scene.program.colorVal = gl.getUniformLocation(scene.program, 'colorVal');
    gl.uniform3fv(scene.program.colorVal, colorVal);
	gl.bindBuffer(gl.ARRAY_BUFFER, scene.marker1.vertexBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, scene.marker1.vertexCount);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);  
	
	//marker2
	gl.uniformMatrix4fv(scene.program.modelMatrixUniform, gl.FALSE,scene.marker2.modelMatrix);
	var normalMatrixMarker2 = mat3.create();
    mat3.normalFromMat4(normalMatrixMarker2,mat4.multiply(mat4.create(),scene.marker2.modelMatrix,scene.viewMatrix));
    gl.uniformMatrix3fv(scene.program.normalMatrixUniform, gl.FALSE, normalMatrix);
	colorVal = vec3.create();
	scene.program.colorVal = gl.getUniformLocation(scene.program, 'colorVal');
    gl.uniform3fv(scene.program.colorVal, colorVal);
	gl.bindBuffer(gl.ARRAY_BUFFER, scene.marker2.vertexBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, scene.marker2.vertexCount);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);  
	
	//marker3
	gl.uniformMatrix4fv(scene.program.modelMatrixUniform, gl.FALSE,scene.marker3.modelMatrix);
	var normalMatrixMarker3 = mat3.create();
    mat3.normalFromMat4(normalMatrixMarker3,mat4.multiply(mat4.create(),scene.marker3.modelMatrix,scene.viewMatrix));
    gl.uniformMatrix3fv(scene.program.normalMatrixUniform, gl.FALSE, normalMatrix);
	colorVal = vec3.create();
	scene.program.colorVal = gl.getUniformLocation(scene.program, 'colorVal');
    gl.uniform3fv(scene.program.colorVal, colorVal);
	gl.bindBuffer(gl.ARRAY_BUFFER, scene.marker3.vertexBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, scene.marker3.vertexCount);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);  
	
	//marker4
	gl.uniformMatrix4fv(scene.program.modelMatrixUniform, gl.FALSE,scene.marker4.modelMatrix);
	var normalMatrixMarker4 = mat3.create();
    mat3.normalFromMat4(normalMatrixMarker4,mat4.multiply(mat4.create(),scene.marker4.modelMatrix,scene.viewMatrix));
    gl.uniformMatrix3fv(scene.program.normalMatrixUniform, gl.FALSE, normalMatrix);
	colorVal = vec3.create();
	scene.program.colorVal = gl.getUniformLocation(scene.program, 'colorVal');
    gl.uniform3fv(scene.program.colorVal, colorVal);
	gl.bindBuffer(gl.ARRAY_BUFFER, scene.marker4.vertexBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, scene.marker4.vertexCount);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);  
    


    requestAnimationFrame(function(time) {
        render(gl,scene,time,timestamp);
    });
}



function createProgram(gl, shaderSpecs) {
    var program = gl.createProgram();
    for ( var i = 0 ; i < shaderSpecs.length ; i++ ) {
        var spec = shaderSpecs[i];
        var shader = gl.createShader(spec.type);
        gl.shaderSource(
            shader, document.getElementById(spec.container).text
        );
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

function init(object, object2, marker1, marker2, marker3, marker4) {

    vertexColors = vec3.fromValues(1.0, 0.0, 0.0);
    var surface = document.getElementById('rendering-surface');
    var gl = surface.getContext('experimental-webgl');

    gl.viewport(0,0,surface.width,surface.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    var program = createProgram(
        gl,
        [{container: 'vertex-shader', type: gl.VERTEX_SHADER},
            {container: 'fragment-shader', type: gl.FRAGMENT_SHADER}]);

    gl.useProgram(program);
    
    program.positionAttribute = gl.getAttribLocation(program, 'pos');
    gl.enableVertexAttribArray(program.positionAttribute);
    program.normalAttribute = gl.getAttribLocation(program, 'normal');
    gl.enableVertexAttribArray(program.normalAttribute);

    var vertexBuffer = gl.createBuffer();
    var vertexBuffer2 = gl.createBuffer();
	var vertexBufferMarker1 = gl.createBuffer();
	var vertexBufferMarker2 = gl.createBuffer();
	var vertexBufferMarker3 = gl.createBuffer();
	var vertexBufferMarker4 = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, object.vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, object2.vertices, gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferMarker1);
    gl.bufferData(gl.ARRAY_BUFFER, object2.vertices, gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferMarker2);
    gl.bufferData(gl.ARRAY_BUFFER, object2.vertices, gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferMarker3);
    gl.bufferData(gl.ARRAY_BUFFER, object2.vertices, gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferMarker4);
    gl.bufferData(gl.ARRAY_BUFFER, object2.vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(
        program.positionAttribute, 3, gl.FLOAT, gl.FALSE,
        Float32Array.BYTES_PER_ELEMENT * 6, 0);
    gl.vertexAttribPointer(
        program.normalAttribute, 3, gl.FLOAT, gl.FALSE,
        Float32Array.BYTES_PER_ELEMENT * 6,
        Float32Array.BYTES_PER_ELEMENT * 3);


    var projectionMatrix = mat4.create();
    mat4.perspective(
        projectionMatrix, 0.75, surface.width/surface.height,
        0.1, 100);
    program.projectionMatrixUniform = gl.getUniformLocation(
        program, 'projectionMatrix');
    gl.uniformMatrix4fv(
        program.projectionMatrixUniform, gl.FALSE,
        projectionMatrix);

    var viewMatrix = mat4.create();
    program.viewMatrixUniform = gl.getUniformLocation(
        program, 'viewMatrix');
    gl.uniformMatrix4fv(
        program.viewMatrixUniform, gl.FALSE, viewMatrix);

    var modelMatrix = mat4.create();
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [0, 0.5, -4]);
    program.modelMatrixUniform = gl.getUniformLocation(
        program, 'modelMatrix');
    
    gl.uniformMatrix4fv(
        program.modelMatrixUniform, gl.FALSE, modelMatrix);

    var modelMatrix2 = mat4.create();
    mat4.identity(modelMatrix2);
    mat4.translate(modelMatrix2, modelMatrix2, [0, -0.5, -4]);
	
	//marker1
	var modelMatrixMarker1 = mat4.create();
    mat4.identity(modelMatrixMarker1);
    mat4.translate(modelMatrixMarker1, modelMatrixMarker1, [-2, 0.5, -4]);
	
	//marker2
	var modelMatrixMarker2 = mat4.create();
    mat4.identity(modelMatrixMarker2);
    mat4.translate(modelMatrixMarker2, modelMatrixMarker2, [2, 0.5, -4]);
	
	//marker3
	var modelMatrixMarker3 = mat4.create();
    mat4.identity(modelMatrixMarker3);
    mat4.translate(modelMatrixMarker3, modelMatrixMarker3, [-2, -0.5, -4]);
	
	//marker4
	var modelMatrixMarker4 = mat4.create();
    mat4.identity(modelMatrixMarker4);
    mat4.translate(modelMatrixMarker4, modelMatrixMarker4, [2, -0.5, -4]);
	


    var normalMatrix = mat3.create()
    mat3.normalFromMat4(
        normalMatrix, mat4.multiply(
            mat4.create(), modelMatrix, viewMatrix));

    program.normalMatrixUniform = gl.getUniformLocation(
        program, 'normalMatrix');

    gl.uniformMatrix3fv(
        program.normalMatrixUniform, gl.FALSE, normalMatrix);


    var colorVal = vec3.create();
    program.colorVal = gl.getUniformLocation(program, 'colorVal');
    gl.uniform3fv(program.colorVal, colorVal);


    program.ambientLightColourUniform = gl.getUniformLocation(
        program, 'ambientLightColour');
    program.directionalLightUniform = gl.getUniformLocation(
        program, 'directionalLight');
    program.materialSpecularUniform = gl.getUniformLocation(
        program, 'materialSpecular');
    object.materialAmbientUniform = gl.getUniformLocation(
        program, 'materialAmbient');
    object.materialDiffuseUniform = gl.getUniformLocation(
        program, 'materialDiffuse');
    object.shininessUniform = gl.getUniformLocation(
        program, 'shininess');

    object2.materialAmbientUniform = gl.getUniformLocation(
        program, 'materialAmbient');
    object2.materialDiffuseUniform = gl.getUniformLocation(
        program, 'materialDiffuse');
    object2.shininessUniform = gl.getUniformLocation(
        program, 'shininess');

    
    


    var ambientLightColour = vec3.fromValues(0.2, 0.2, 0.2);
    gl.uniform3fv(
        program.ambientLightColourUniform, ambientLightColour);
    var directionalLight = vec3.fromValues(-0.5,0.5,0.5);
    gl.uniform3fv(
        program.directionalLightUniform, directionalLight);
    var materialSpecular = vec3.fromValues(0.5, 0.5, 0.5);
    gl.uniform3fv(
        program.materialSpecularUniform, materialSpecular);
		
	//object
    gl.uniform1f(object.shininessUniform, object.material.shininess);
    gl.uniform1f(object.materialAmbientUniform, object.material.ambient);
    gl.uniform1f(object.materialDiffuseUniform, object.material.diffuse);
    
	//object2
    gl.uniform1f(object2.shininessUniform, object2.material.shininess);
    gl.uniform1f(object2.materialAmbientUniform, object2.material.ambient);
    gl.uniform1f(object2.materialDiffuseUniform, object2.material.diffuse);
	
	//marker1
    gl.uniform1f(marker1.shininessUniform, marker1.material.shininess);
    gl.uniform1f(marker1.materialAmbientUniform, marker1.material.ambient);
    gl.uniform1f(marker1.materialDiffuseUniform, marker1.material.diffuse);
	
	//marker2
    gl.uniform1f(marker2.shininessUniform, marker2.material.shininess);
    gl.uniform1f(marker2.materialAmbientUniform, marker2.material.ambient);
    gl.uniform1f(marker2.materialDiffuseUniform, marker2.material.diffuse);
	
	//marker3
    gl.uniform1f(marker3.shininessUniform, marker3.material.shininess);
    gl.uniform1f(marker3.materialAmbientUniform, marker3.material.ambient);
    gl.uniform1f(marker3.materialDiffuseUniform, marker3.material.diffuse);
	
	//marker4
    gl.uniform1f(marker4.shininessUniform, marker4.material.shininess);
    gl.uniform1f(marker4.materialAmbientUniform, marker4.material.ambient);
    gl.uniform1f(marker4.materialDiffuseUniform, marker4.material.diffuse);
		
		
    object.modelMatrix = modelMatrix;
    object.vertexBuffer = vertexBuffer;

    object2.modelMatrix = modelMatrix2;
    object2.vertexBuffer = vertexBuffer2;
	
	marker1.modelMatrix = modelMatrixMarker1;
	marker1.vertexBuffer = vertexBufferMarker1;
	
	marker2.modelMatrix = modelMatrixMarker2;
	marker2.vertexBuffer = vertexBufferMarker2;
	
	marker3.modelMatrix = modelMatrixMarker3;
	marker3.vertexBuffer = vertexBufferMarker3;
	
	marker4.modelMatrix = modelMatrixMarker4;
	marker4.vertexBuffer = vertexBufferMarker4;





    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.useProgram(null);

    var scene = {
        program: program,
        object: object,
        object2: object2,
		marker1: marker1,
		marker2: marker2,
		marker3: marker3,
		marker4: marker4,
        start: Date.now(),
        projectionMatrix: projectionMatrix,
        colorVal: colorVal,

        viewMatrix: viewMatrix
    };
    surface.addEventListener("mousedown", function(event){
        
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        
        gl.bindBuffer(gl.ARRAY_BUFFER, null);


        gl.uniformMatrix4fv(
            scene.program.modelMatrixUniform, gl.FALSE,
            scene.object.modelMatrix);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, scene.object.vertexBuffer);
        gl.drawArrays(gl.TRIANGLES, 0, scene.object.vertexCount);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        var x = event.clientX;
        var y = surface.height -event.clientY; 
        console.log(y);
        gl.readPixels(x+350, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, color);
        if((color[0] != 0)||(color[1] != 0)||(color[2] != 0)||(color[3] != 0)){            
            if(y > 630){
                if(event.which == 1){
                    if(mult < 1.6){
                        mult = mult+0.5;
                    }
                }else if(event.which == 3){
                    if (mult > 0.1){
                        mult = mult - 0.5;
                    }
                }   
            }
        }
        gl.uniformMatrix4fv(
            scene.program.modelMatrixUniform, gl.FALSE,
            scene.object2.modelMatrix);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, scene.object2.vertexBuffer);
        gl.drawArrays(gl.TRIANGLES, 0, scene.object2.vertexCount);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.readPixels(x+350, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, color);
        if((color[0] != 0)||(color[1] != 0)||(color[2] != 0)||(color[3] != 0)){
            if(y < 630){
                if(event.which == 1){
                    if(mult2 < 1.6){
                        mult2 = mult2+0.5;
                    }
                }else if(event.which == 3){
                    if (mult2 > 0.1){
                        mult2 = mult2 - 0.5;
                    }
                }   
            }
        }
        
    });


      
    requestAnimationFrame(function(timestamp) {
        render(gl, scene, timestamp, 0);
        
    });
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

function loadMesh(filename) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", filename, false ); // false for synchronous request
    xmlHttp.send( null );

    init(loadMeshData(xmlHttp.responseText),loadMeshData(xmlHttp.responseText),loadMeshData(xmlHttp.responseText),loadMeshData(xmlHttp.responseText),loadMeshData(xmlHttp.responseText),loadMeshData(xmlHttp.responseText));

}

$(document).ready(function() {
    
    loadMesh('30OrMoreTriangles.obj')
});

function checkxPosition(movingDirec, modelMatrix){
    
    if(movingDirec == 0.05){
        if(modelMatrix[12] >= 2){
            movingDirec = -0.05;
            
        }
    }else{
        if(modelMatrix[12] <= -2){
            movingDirec = 0.05;
        }
    }
    return movingDirec
}

function readMouseMove(e){
    posX = e.clientX;
    clicked = 1;
    var posY = e.clientY;
}
