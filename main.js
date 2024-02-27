import * as THREE from 'three'; 
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



if ( WebGL.isWebGLAvailable() ) {

    // SETTING UP SCENE
    // creating new scene and camera
    const scene = new THREE.Scene(); 
    const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 100 ); 
    camera.position.x = 100;
    // setting up renderer size and background color
    const renderer = new THREE.WebGLRenderer(); 
    renderer.setSize( window.innerWidth, window.innerHeight); 
    renderer.setClearColor(0xffffff);
    document.body.appendChild( renderer.domElement );
    // setting up light color and strength
    const light = new THREE.PointLight( 0xffffff, 100, 0 );
    // setting up light location
    light.position.set( 0, 10, 0 );
    // adding light to scene
    scene.add( light );

    // create an AudioListener and add it to the camera
    const listener = new THREE.AudioListener();
    camera.add( listener );
    // create global audio source
    const sound = new THREE.Audio( listener );
    // load a sound
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( '/audioTest.mp3', function( buffer ) {
        sound.setBuffer(buffer);
        sound.play(0);
        sound.setLoop(true);
    }); 
    

    //Loading in DJ Deck
    var DJDeck;
    // new loader
    const loader = new GLTFLoader();
    // loading in file
    loader.load( '/Deck-plain-1.glb', function ( gltf ) {
        // adding rendering to scene
        DJDeck = gltf.scene
        scene.add( DJDeck );
    }, undefined, function ( error ) {
        console.error( error );
    } );

    var DJDisk;
    loader.load( '/disk.glb', function ( gltf ) {
        DJDisk = gltf.scene;
        DJDisk.translateX(0.439);
        DJDisk.translateZ(0.018)
        scene.add( DJDisk );




        // ... (your existing code)

// Assuming camera, renderer and scene are already defined
var isMouseDown = false;
var prevMousePos = { x: 0, y: 0 };
var raycaster = new THREE.Raycaster(); // create once
var mouse = new THREE.Vector2(); // create once
var initialRotation = 0;
var lastTime = 0;

renderer.domElement.addEventListener('mousedown', function(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObject(DJDisk);

    if (intersects.length > 0) {
        isMouseDown = true;
        prevMousePos.x = e.clientX;
        prevMousePos.y = e.clientY;
        initialRotation = DJDisk.rotation.y;
        lastTime = sound.context.currentTime;
    }
});

renderer.domElement.addEventListener('mouseup', function() {
    isMouseDown = false;
});

renderer.domElement.addEventListener('mousemove', function(e) {
    if (isMouseDown) {
        var dx = e.clientX - prevMousePos.x;
        DJDisk.rotation.y += dx * 0.01; // Adjust rotation speed as needed
        prevMousePos.x = e.clientX;
        prevMousePos.y = e.clientY;

        // Calculate the change in rotation
        var deltaRotation = DJDisk.rotation.y - initialRotation;

        // Use the change in rotation to calculate the new playback time
        var newTime = lastTime + deltaRotation * 10; // Adjust the multiplier as needed

        // Make sure the new time is within the duration of the audio file
        newTime = Math.max(0, Math.min(newTime, sound.buffer.duration));

        // Set the new playback time
        if (sound.isPlaying) {
            sound.stop();
        }
        sound.offset = newTime;
        sound.play();
    }
});

// ... (your existing code)

    }, undefined, function ( error ) {
        console.error( error );
    } );

    // Setting up the camera
    camera.position.set( 0, 2.4, -0.5 );
    camera.lookAt( 0, 0, 0 );

    // rendering
    function animate() {
        requestAnimationFrame( animate );    
        renderer.render( scene, camera );
    }	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}