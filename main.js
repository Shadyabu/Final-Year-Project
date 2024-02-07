import * as THREE from 'three'; 
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


if ( WebGL.isWebGLAvailable() ) {
    // creating new scene and camera
    const scene = new THREE.Scene(); 
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); 
    
    // setting up renderer size and background color
    const renderer = new THREE.WebGLRenderer(); 
    renderer.setSize( window.innerWidth, window.innerHeight); 
    renderer.setClearColor(0xffffff);
    document.body.appendChild( renderer.domElement );
    

    var DJDeck;
    // new loader
    const loader = new GLTFLoader();
    // loading in file
    loader.load( '/Nur DJ Pult.glb', function ( gltf ) {
        // adding rendering to scene
        DJDeck = gltf.scene
        DJDeck.rotateY(0.035);
        scene.add( DJDeck );
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );

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
    const sound = new THREE.PositionalAudio( listener );
    // load a sound
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( '/audioTest.mp3', function( buffer ) {
        sound.setBuffer(buffer);
        sound.setRefDistance(10);
        sound.play(0);
        sound.setLoop(true);
    }); 

    // creating a speaker object
    const sphere = new THREE.SphereGeometry( 0.1, 64, 32, 0, 6.283185307179586, 0, 6.283185307179586);
    const material = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    const speakerLeft = new THREE.Mesh( sphere, material );
    speakerLeft.position.set( 1.5, 0, 1.5);
    scene.add( speakerLeft );

    const speakerRight = new THREE.Mesh( sphere, material );
    speakerRight.position.set( -1.5, 0, 1.5);
    scene.add( speakerRight );

    speakerLeft.add(sound);
    speakerRight.add(sound);

    // Create a Three.js slider handle
    const sliderGeometry = new THREE.BoxGeometry(0.2, 0.04, 0.02);
    const sliderMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const sliderHandle = new THREE.Mesh(sliderGeometry, sliderMaterial);
    sliderHandle.position.set(-0.05, 0.1, 1.2); // Adjust the position as needed
    scene.add(sliderHandle);

    // Create a Three.js slider track
    const sliderTrackGeometry = new THREE.BoxGeometry(1, 0.02, 0.2);
    const sliderTrackMaterial = new THREE.MeshPhongMaterial({ color: 0x0088ff });
    const sliderTrack = new THREE.Mesh(sliderTrackGeometry, sliderTrackMaterial);
    sliderTrack.position.set(-0.05, 0.1, 1.2); // Adjust the position as needed
    scene.add(sliderTrack);

    // Event listener for the slider handle
    let isDragging = false;

    const handleMouseDown = function (event) {
        isDragging = true;
    };

    const handleMouseUp = function (event) {
        isDragging = false;
    };

    const handleMouseMove = function (event) {
        if (isDragging) {
            // Calculate the normalized position of the slider handle within the slider track
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

            // Raycasting to determine the intersection point between the mouse and the slider track
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2(mouseX, mouseY);
            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObject(sliderTrack);

            if (intersects.length > 0) {
                // Set the position of the slider handle based on the intersection point
                sliderHandle.position.x = intersects[0].point.x;

                // Adjust the volume based on the handle position
                const volume = (sliderHandle.position.x + 0.5) / 1;
                sound.setVolume(volume);
            }
        }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

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