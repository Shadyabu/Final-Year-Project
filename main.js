import * as THREE from 'three'; 
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';



if ( WebGL.isWebGLAvailable() ) {

    // SETTING UP SCENE AND AUDIO
    // creating new scene and camera
    const scene = new THREE.Scene(); 
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 100 ); 
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
        // sound.setLoop(true);
    }); 
    // *************************************************************************

    

    // Loading in DJ Deck
    var DJDeck;
    // new loader
    const loader = new GLTFLoader();
    // loading in file
    loader.load( '3D-renderings/Deck-plain-1.glb', function ( gltf ) {
        // adding rendering to scene
        DJDeck = gltf.scene
        scene.add( DJDeck );
    }, undefined, function ( error ) {
        console.error( error );
    } );
    // *************************************************************************



    // Disk ************************************************************
    var DJDisk;
    loader.load( '3D-renderings/disk.glb', function ( gltf ) {
        DJDisk = gltf.scene;
        DJDisk.translateX(0.439);
        DJDisk.translateZ(0.018)
        scene.add( DJDisk );

        var isMouseDown = false;
        var prevMousePos = { x: 0, y: 0 };
        var raycaster = new THREE.Raycaster(); 
        var mouse = new THREE.Vector2(); 
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
                var newTime = lastTime - deltaRotation * 10; // Adjust the multiplier as needed
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
    }, undefined, function ( error ) {
        console.error( error );
    } );
    // *************************************************************************





    // knob *****************************************************************
    var knob;
    loader.load( '3D-renderings/knob.glb', function ( gltf ) {
        knob = gltf.scene
        knob.translateX(-0.001);
        knob.translateZ(0.115)
        scene.add( knob );
        var isMouseDown = false;
        var prevMousePos = { x: 0, y: 0 };
        var raycaster = new THREE.Raycaster(); 
        var mouse = new THREE.Vector2(); 

        renderer.domElement.addEventListener('mousedown', function(e) {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            var intersects = raycaster.intersectObject(knob);

            if (intersects.length > 0) {
                isMouseDown = true;
                prevMousePos.x = e.clientX;
                prevMousePos.y = e.clientY;
            }
        });

        renderer.domElement.addEventListener('mouseup', function() {
            isMouseDown = false;
        });

        renderer.domElement.addEventListener('mousemove', function(e) {
            if (isMouseDown) {
                var dx = e.clientX - prevMousePos.x;
                var newRotation = knob.rotation.y + dx * -0.05;
                if (newRotation <= 2.75 && newRotation >= -2.75) {
                    knob.rotation.y = newRotation;
                    eq.gain.value = newRotation * - 40; 
                }
                console.log(eq.gain.value)
                prevMousePos.x = e.clientX;
                prevMousePos.y = e.clientY;
            }
        });
    }, undefined, function ( error ) {
        console.error( error );
    } );
    // *************************************************************************





    // Play button ************************************************************
    var play
    loader.load( '3D-renderings/play-left.glb', function ( gltf ) {
        // adding rendering to scene
        play = gltf.scene
        scene.add( play );
        play.translateX(-0.015);
        play.translateZ(-0.022)

        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();

        function onMouseClick(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            var intersects = raycaster.intersectObjects([play]);
            if (intersects.length > 0) {
                if (sound.isPlaying) {
                    intersects[0].object.position.y = 0.5882995338439941;
                    console.log(intersects[0].object.position.y);
                    sound.pause(); 
                } else {
                    intersects[0].object.position.y = 0.5912995338439941; 
                    sound.play(); 
                    console.log(sound.gain)
                }
            }
        }
        window.addEventListener('click', onMouseClick, false);
    }, undefined, function ( error ) {
        console.error( error );
    } );
    // *************************************************************************




    // volume riser ************************************************************
    var volume
    var initialPosition = new THREE.Vector3();
    loader.load('3D-renderings/volume-riser-left.glb', function ( gltf ) {
        // adding rendering to scene
        volume = gltf.scene
        scene.add( volume );
        volume.translateX(-0.0134);
        volume.translateZ(0.002)

        var controls = new DragControls([volume], camera, renderer.domElement);

        controls.addEventListener('dragstart', function (event) {
            initialPosition.copy(event.object.position);
        });
        var minZ = -0.22184461895734392;
        var maxZ = -0.11135324310255112;
        function calculateVolume(zPosition, minZ, maxZ) {
            return (zPosition - minZ) / (maxZ - minZ);
        }
        controls.addEventListener('drag', function (event) {
            event.object.position.x = initialPosition.x;
            event.object.position.y = initialPosition.y;
            event.object.position.z = Math.max(minZ, Math.min(maxZ, event.object.position.z));
            var volumeLevel = calculateVolume(event.object.position.z, minZ, maxZ);
            sound.setVolume(volumeLevel);
        });
    }, undefined, function ( error ) {
        console.error( error );
    } );





    // tempo riser ************************************************************
    function calculatePlaybackRate(zPosition, minZ, maxZ) {
        var midZ = (minZ + maxZ) / 2;
        return 1 + 0.5 * (zPosition - midZ) / (midZ - minZ);   
    }

    var tempo
    var initialPosition = new THREE.Vector3();
    loader.load('3D-renderings/tempo-left.glb', function ( gltf ) {
        // adding rendering to scene
        tempo = gltf.scene
        scene.add( tempo );
        tempo.translateX(-0.0134);
        tempo.translateZ(-0.006)

        var controls = new DragControls([tempo], camera, renderer.domElement);

        controls.addEventListener('dragstart', function (event) {
            initialPosition.copy(event.object.position);
        });
        var minZ = -0.282081224508521;
        var maxZ = -0.13445486721481303;

        controls.addEventListener('drag', function (event) {
            event.object.position.x = initialPosition.x;
            event.object.position.y = initialPosition.y;
            event.object.position.z = Math.max(minZ, Math.min(maxZ, event.object.position.z));
            var newPlaybackRate = calculatePlaybackRate(event.object.position.z, minZ, maxZ);
            sound.setPlaybackRate(newPlaybackRate);

        });
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