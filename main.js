import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


if ( WebGL.isWebGLAvailable() ) {

    // SETTING UP SCENE AND AUDIO
    // creating new scene and camera
    const scene = new THREE.Scene(); 
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 100 ); 
    camera.position.x = 1;
    // setting up renderer size and background color
    const renderer = new THREE.WebGLRenderer(); 
    renderer.setSize( window.innerWidth, window.innerHeight); 
    renderer.setClearColor(0xffffff);
    document.body.appendChild( renderer.domElement );
    // setting up light color and strength
    const light = new THREE.PointLight( 0xffffff, 100, 0 );
    // setting up light location
    light.position.set( 0, 7, 0 );
    // adding light to scene
    scene.add( light );
    // create a new loader to load in 3D models
    const loader = new GLTFLoader();
    // zoom feature
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.enableZoom = true;
    controls.enableRotate = false;
    controls.maxDistance = 5;
    controls.minDistance = 1; 


    // Audio Source *************************************************************
    // create an AudioListener and add it to the camera
    const listenerLeft = new THREE.AudioListener();
    camera.add( listenerLeft );
    const listenerRight = new THREE.AudioListener();
    camera.add( listenerRight );

    // load a sound
    const audioLoader = new THREE.AudioLoader();

    // create sounds array
    const soundsRight = [
        new THREE.Audio(listenerRight),
        new THREE.Audio(listenerRight),
        new THREE.Audio(listenerRight),
        new THREE.Audio(listenerRight),
        new THREE.Audio(listenerRight)
    ];
    const soundsLeft = [
        new THREE.Audio(listenerLeft),
        new THREE.Audio(listenerLeft),
        new THREE.Audio(listenerLeft),
        new THREE.Audio(listenerLeft),
        new THREE.Audio(listenerLeft)
    ];
    // create sound names array
    const soundsRightNames = [
        "Dont Care (prod. ariritfm) - YT",
        "audioTest2",
        "audioTest3",
        "audioTest4",
        "audioTest5"
    ]
    const soundsLeftNames = [
        "tiffany - shadybabey",
        "audioTest2",
        "audioTest3",
        "audioTest4",
        "audioTest5"
    ]

    // load the sounds
    audioLoader.load('songs/Dont Care (prod ariritfm).mp3', function(buffer) {
        soundsRight[0].setBuffer(buffer);
    });
    audioLoader.load('/audioTest2.mp3', function(buffer) {
        soundsRight[1].setBuffer(buffer);
    });
    audioLoader.load('/audioTest3.mp3', function(buffer) {
        soundsRight[2].setBuffer(buffer);
    });
    audioLoader.load('/audioTest4.mp3', function(buffer) {
        soundsRight[3].setBuffer(buffer);
    });
    audioLoader.load('/audioTest5.mp3', function(buffer) {
        soundsRight[4].setBuffer(buffer);
    });

    audioLoader.load('songs/tiffany-143bpm Cmin-(@shady_._._).wav', function(buffer) {
        soundsLeft[0].setBuffer(buffer);
    });
    audioLoader.load('/audioTest2.mp3', function(buffer) {
        soundsLeft[1].setBuffer(buffer);
    });
    audioLoader.load('/audioTest3.mp3', function(buffer) {
        soundsLeft[2].setBuffer(buffer);
    });
    audioLoader.load('/audioTest4.mp3', function(buffer) {
        soundsLeft[3].setBuffer(buffer);
    });
    audioLoader.load('/audioTest5.mp3', function(buffer) {
        soundsLeft[4].setBuffer(buffer);
    });

    // soundObject to pass to functions and keep track of what sound is playing
    var soundObjectLeft = { currentIndex: 0, sounds: soundsLeft };
    var soundObjectRight = { currentIndex: 0, sounds: soundsRight };

    //create EQ Filters
    var lowShelfFilterLeft = listenerLeft.context.createBiquadFilter();
    lowShelfFilterLeft.type = "lowshelf";
    lowShelfFilterLeft.frequency.value = 300;
    lowShelfFilterLeft.connect(listenerLeft.context.destination);
    var lowShelfFilterRight = listenerRight.context.createBiquadFilter();
    lowShelfFilterRight.type = "lowshelf";
    lowShelfFilterRight.frequency.value = 300;
    lowShelfFilterRight.connect(listenerRight.context.destination);

    var highShelfFilterLeft = listenerLeft.context.createBiquadFilter();
    highShelfFilterLeft.type = "highshelf";
    highShelfFilterLeft.frequency.value = 5000;
    highShelfFilterLeft.connect(listenerLeft.context.destination);
    var highShelfFilterRight = listenerRight.context.createBiquadFilter();
    highShelfFilterRight.type = "highshelf";
    highShelfFilterRight.frequency.value = 5000;
    highShelfFilterRight.connect(listenerRight.context.destination);
    
    var peakingFilterLeft = listenerLeft.context.createBiquadFilter();
    peakingFilterLeft.type = "peaking";
    peakingFilterLeft.frequency.value = 1000;
    peakingFilterLeft.connect(listenerLeft.context.destination);
    var peakingFilterRight = listenerRight.context.createBiquadFilter();
    peakingFilterRight.type = "peaking";
    peakingFilterRight.frequency.value = 1000;
    peakingFilterRight.connect(listenerRight.context.destination);

    // needed to compensate for gain in filters
    var gainNodeLeft = listenerLeft.context.createGain();
    gainNodeLeft.gain.value= -3;
    gainNodeLeft.connect(listenerLeft.context.destination);
    var gainNodeRight = listenerRight.context.createGain();
    gainNodeRight.gain.value= -3;
    gainNodeRight.connect(listenerRight.context.destination);

    //Add Filters to Audio
    var filtersLeft = [peakingFilterLeft, highShelfFilterLeft, lowShelfFilterLeft, gainNodeLeft]
    var filtersRight = [peakingFilterRight, highShelfFilterRight, lowShelfFilterRight, gainNodeRight]

    for (let i = 0; i < soundsLeft.length; i++) { 
        soundsLeft[i].setFilters(filtersLeft);
    }

    for (let i = 0; i < soundsRight.length; i++) { 
        soundsRight[i].setFilters(filtersRight);
    }
      
    // *************************************************************************


    // popup loader *************************************************************
    // function which displays a message on screen, paremeters: message, name of the class of div (for css changes) and whether the message should disappear or not
    function showPopupMessage(message, className, timeOut) {
        var popupDiv = document.createElement("div");
        popupDiv.textContent = message;
        popupDiv.classList.add(className);
        document.body.appendChild(popupDiv);
        if (timeOut){
            setTimeout(function() {
                document.body.removeChild(popupDiv);
            }, 8000);
        }
        return popupDiv;
    }

    // array of classes for popups
    var loadingClasses = [
        "general",
        "knobs",
        "disk",
        "cue",
        "play",
        "skip",
        "tempo",
        "volume"
    ]

    //loading screen popup
    showPopupMessage(" ", "loadingScreen", true);

    
    function helpSlider(){
        var currentImageIndex = 0;
        var popupDiv = showPopupMessage(" ", loadingClasses[currentImageIndex], false);
        var nextButton = document.createElement("button");
        nextButton.classList.add("next");
        nextButton.addEventListener("click", function() {
            currentImageIndex = (currentImageIndex + 1) % loadingClasses.length;
            popupDiv.className = "";
            popupDiv.classList.add(loadingClasses[currentImageIndex]);
        });
        var prevButton = document.createElement("button");
        prevButton.classList.add("previous");
        prevButton.addEventListener("click", function() {
            currentImageIndex = (currentImageIndex - 1 + loadingClasses.length) % loadingClasses.length;
            popupDiv.className = "";
            popupDiv.classList.add(loadingClasses[currentImageIndex]);
        });
        var closeButton = document.createElement("button");
        closeButton.classList.add("close");
        closeButton.textContent = "x";
        closeButton.addEventListener("click", function() {
            document.body.removeChild(popupDiv);
        });
        popupDiv.appendChild(nextButton);
        popupDiv.appendChild(prevButton);
        popupDiv.appendChild(closeButton);
    }
    document.getElementById('helpIcon').addEventListener('click', function() {
        helpSlider()			
    });

    // song names displayed at bottom of screen 
    var rightSongDiv = showPopupMessage(soundsRightNames[soundObjectRight.currentIndex], "right-song", false);
    var leftSongDiv = showPopupMessage(soundsLeftNames[soundObjectLeft.currentIndex], "left-song", false);  
    // *************************************************************************


    // Skip Button *************************************************************
    var skipButtonLeft;
    var skipButtonLeftX = 0.06;
    var skipButtonLeftZ = -0.018;

    var skipButtonRight;
    var skipButtonRightX = -0.922;
    var skipButtonRightZ = -0.018;

    loadSkip(skipButtonLeft, skipButtonLeftX, skipButtonLeftZ, soundObjectLeft)
    loadSkip(skipButtonRight, skipButtonRightX, skipButtonRightZ, soundObjectRight)

    function loadSkip(skipButton, x, z, soundObject){
        loader.load('3D-renderings/skip-texture.glb', function(gltf) {
            skipButton = gltf.scene;
            skipButton.translateX(x);
            skipButton.translateZ(z);
            scene.add(skipButton);
    
            var raycaster = new THREE.Raycaster();
            var mouse = new THREE.Vector2();
    
            // written with the help of Copilot
            function onSkipButtonClick(event) {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
                raycaster.setFromCamera(mouse, camera);
                var intersects = raycaster.intersectObjects([skipButton]);
                if (intersects.length > 0) {
                    var speed = soundObject.sounds[soundObject.currentIndex].getPlaybackRate();
                    var volume = soundObject.sounds[soundObject.currentIndex].getVolume();

                    // this is so weird, i don't know why but the gain node deactivates 
                    // if volume is not equal to 0. Took a lot of testing but at least it works
                    soundObject.sounds[soundObject.currentIndex].setVolume(0);
                    soundObject.sounds[soundObject.currentIndex].stop();
                    soundObject.currentIndex = (soundObject.currentIndex + 1) % soundObject.sounds.length;
                    soundObject.sounds[soundObject.currentIndex] = soundObject.sounds[soundObject.currentIndex];
                    soundObject.sounds[soundObject.currentIndex].setPlaybackRate(speed);
                    soundObject.sounds[soundObject.currentIndex].setVolume(volume);
                    soundObject.sounds[soundObject.currentIndex].play();
                    rightSongDiv.textContent = soundsRightNames[soundObjectRight.currentIndex];
                    leftSongDiv.textContent = soundsLeftNames[soundObjectLeft.currentIndex];
                }
            }
            window.addEventListener('click', onSkipButtonClick, false);
            // end copilot
        }, undefined, function(error) {
            console.error(error);
        });
    }


    var previousButtonLeft;
    var previousButtonLeftX = 0.097;
    var previousButtonLeftZ = -0.018;

    var previousButtonRight;
    var previousButtonRightX = -0.887;
    var previousButtonRightZ = -0.018;

    loadPrevious(previousButtonLeft, previousButtonLeftX, previousButtonLeftZ, soundObjectLeft)
    loadPrevious(previousButtonRight, previousButtonRightX, previousButtonRightZ, soundObjectRight)

    function loadPrevious(previousButton, x, z, soundObject){
        loader.load('3D-renderings/previous-texture.glb', function(gltf) {
            previousButton = gltf.scene;
            previousButton.translateX(x);
            previousButton.translateZ(z);
            scene.add(previousButton);
    
            var raycaster = new THREE.Raycaster();
            var mouse = new THREE.Vector2();
    
            // written with help of copilot
            function onPreviousButtonClick(event) {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
                raycaster.setFromCamera(mouse, camera);
                var intersects = raycaster.intersectObjects([previousButton]);
            //end of copilot
                if (intersects.length > 0) {
                    var speed = soundObject.sounds[soundObject.currentIndex].getPlaybackRate();
                    var volume = soundObject.sounds[soundObject.currentIndex].getVolume();

                    soundObject.sounds[soundObject.currentIndex].setVolume(0);
                    soundObject.sounds[soundObject.currentIndex].stop();
                    if (soundObject.currentIndex == 0) {
                        soundObject.currentIndex = soundObject.sounds.length;
                    }
                    soundObject.currentIndex--;
                    soundObject.sounds[soundObject.currentIndex] = soundObject.sounds[soundObject.currentIndex];
                    soundObject.sounds[soundObject.currentIndex].setPlaybackRate(speed);
                    soundObject.sounds[soundObject.currentIndex].setVolume(volume);
                    soundObject.sounds[soundObject.currentIndex].play();
                    rightSongDiv.textContent = soundsRightNames[soundObjectRight.currentIndex];
                    leftSongDiv.textContent = soundsLeftNames[soundObjectLeft.currentIndex];
                }
            }
            window.addEventListener('click', onPreviousButtonClick, false);
        }, undefined, function(error) {
            console.error(error);
        });
    }
    // *************************************************************************


    


    // Loading in DJ Deck *******************************************************
    var DJDeck;
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    // loading in file
    loader.load( '3D-renderings/Deck-plain-3.glb', function ( gltf ) {
        // adding rendering to scene
        DJDeck = gltf.scene
        DJDeck.translateX(0.06);

        scene.add( DJDeck );
    }, undefined, function ( error ) {
        console.error( error );
    } );
    // *************************************************************************


    // Loading in DJ Deck *******************************************************
    var background;
    // loading in file
    loader.load( '3D-renderings/background6.glb', function ( gltf ) {
        // adding rendering to scene
        background = gltf.scene
        background.translateX(0.06);

        scene.add( background );
    }, undefined, function ( error ) {
        console.error( error );
    } );
    // *************************************************************************




    // Disk ********************************************************************
    var DJDiskLeft;
    var DJDiskLeftX = 0.499
    var DJDiskLeftZ = 0.018
    loadDisk(DJDiskLeft, DJDiskLeftX, DJDiskLeftZ, soundObjectLeft)

    var DJDiskRight;
    var DJDiskRightX = -0.4843 
    var DJDiskRightZ = 0.021
    loadDisk(DJDiskRight, DJDiskRightX, DJDiskRightZ, soundObjectRight)

    function loadDisk(DJDisk, x, z, soundObject) {
        loader.load( '3D-renderings/disk.glb', function ( gltf ) {
            DJDisk = gltf.scene;
            DJDisk.translateX(x);
            DJDisk.translateZ(z)
            scene.add( DJDisk );

            var isMouseDown = false;
            var prevMousePos = { x: 0, y: 0 };
            var raycaster = new THREE.Raycaster(); 
            var mouse = new THREE.Vector2(); 
            var initialRotation = 0;
            var lastTime = 0;

            // Written with the help of Copilot
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
                    lastTime = soundObject.sounds[soundObject.currentIndex].context.currentTime;
                }
            });
            renderer.domElement.addEventListener('mouseup', function() {
                isMouseDown = false;
            });
            renderer.domElement.addEventListener('mousemove', function(e) {
                if (isMouseDown) {
                    var dy = e.clientY - prevMousePos.y;
                    DJDisk.rotation.y += dy * 0.01; // Adjust rotation speed as needed
                    prevMousePos.x = e.clientX;
                    prevMousePos.y = e.clientY;
                    // Calculate the change in rotation
                    var deltaRotation = DJDisk.rotation.y - initialRotation;
                    // Use the change in rotation to calculate the new playback time
                    var newTime = lastTime - deltaRotation * 10; // Adjust the multiplier as needed
                    // Make sure the new time is within the duration of the audio file
                    newTime = Math.max(0, Math.min(newTime, soundObject.sounds[soundObject.currentIndex].buffer.duration));
                    // Set the new playback time
                    if (soundObject.sounds[soundObject.currentIndex].isPlaying) {
                        soundObject.sounds[soundObject.currentIndex].stop();
                    }
                    soundObject.sounds[soundObject.currentIndex].offset = newTime;
                    soundObject.sounds[soundObject.currentIndex].play();
                }
            });
            //end of Copilot
        }, undefined, function ( error ) {
            console.error( error );
        } );
    }
    // **********************************************************************





    // knob *****************************************************************
    var knobLeftMid;
    var knobLeftMidX = 0.059
    var knobLeftMidZ = 0.115
    loadKnob(knobLeftMid, knobLeftMidX, knobLeftMidZ, peakingFilterLeft)

    var knobRightMid;
    var knobRightMidX = -0.042
    var knobRightMidZ = 0.113
    loadKnob(knobRightMid, knobRightMidX, knobRightMidZ, peakingFilterRight)

    var knobRightHigh;
    var knobRightHighX = -0.042
    var knobRightHighZ = 0.180
    loadKnob(knobRightHigh, knobRightHighX, knobRightHighZ, highShelfFilterRight)
    
    var knobLeftHigh;
    var knobLeftHighX = 0.059
    var knobLeftHighZ = 0.180
    loadKnob(knobLeftHigh, knobLeftHighX, knobLeftHighZ, highShelfFilterLeft)
    
    var knobRightLow;
    var knobRightLowX = -0.042
    var knobRightLowZ = 0.045
    loadKnob(knobRightLow, knobRightLowX, knobRightLowZ, lowShelfFilterRight)
    
    var knobLeftLow;
    var knobLeftLowX = 0.059
    var knobLeftLowZ = 0.045
    loadKnob(knobLeftLow, knobLeftLowX, knobLeftLowZ, lowShelfFilterLeft)
    
    function mapRange(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }


    function loadKnob(knob, x, z, filter) {
        loader.load( '3D-renderings/knob.glb', function ( gltf ) {
            knob = gltf.scene
            knob.translateX(x);
            knob.translateZ(z)
            scene.add( knob );
            var isMouseDown = false;
            var prevMousePos = { x: 0, y: 0 };
            var raycaster = new THREE.Raycaster(); 
            var mouse = new THREE.Vector2(); 

            // Written with the help of Copilot
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
                    var dy = e.clientY - prevMousePos.y;
                    var newRotation = knob.rotation.y + dy * 0.05;
                    if (newRotation <= 2.75 && newRotation >= -2.75) {
                        knob.rotation.y = newRotation;

                        var minGain = -40;
                        var maxGain = 40;
                        var newGain = mapRange(newRotation, -2.75, 2.75, maxGain, minGain);

                        filter.gain.value = newGain;
                    }
                    prevMousePos.x = e.clientX;
                    prevMousePos.y = e.clientY;
                }
            });
            // end of Copilot
        }, undefined, function ( error ) {
            console.error( error );
        } );
    }
    
    // *************************************************************************





    // Play button ************************************************************
    var playButtonLeft;
    var playButtonLeftX = 0.045;
    var playButtonLeftZ = -0.022;
    playButton(playButtonLeft, playButtonLeftX, playButtonLeftZ, soundObjectLeft)

    var playButtonRight;
    var playButtonRightX = -0.937;
    var playButtonRightZ = -0.022;
    playButton(playButtonRight, playButtonRightX, playButtonRightZ, soundObjectRight)

    function playButton(play, x, z, soundObject){
        loader.load( '3D-renderings/play-left.glb', function ( gltf ) {
            // adding rendering to scene
            play = gltf.scene
            scene.add( play );
            play.translateX(x);
            play.translateZ(z)
    
            var raycaster = new THREE.Raycaster();
            var mouse = new THREE.Vector2();
    
            // written with help of copilot
            function onMouseClick(event) {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
                raycaster.setFromCamera(mouse, camera);
                var intersects = raycaster.intersectObjects([play]);
                if (intersects.length > 0) {
                    // end of copilot
                    if (soundObject.sounds[soundObject.currentIndex].isPlaying) {
                        intersects[0].object.position.y = 0.5912995338439941;
                        soundObject.sounds[soundObject.currentIndex].pause(); 
                    } else {
                        intersects[0].object.position.y = 0.5882995338439941; 
                        soundObject.sounds[soundObject.currentIndex].play(); 
                    }
                }
            }
            window.addEventListener('click', onMouseClick, false);
        }, undefined, function ( error ) {
            console.error( error );
        } );
    }
    
    // *************************************************************************


    // Cue button ************************************************************
    var cueButtonLeft;
    var cueButtonLeftX = 0.72;
    var cueButtonLeftZ = -0.181;
    cueButton(cueButtonLeft, cueButtonLeftX, cueButtonLeftZ, soundObjectLeft)

    var cueButtonRight;
    var cueButtonRightX = -0.264;
    var cueButtonRightZ = -0.181;
    cueButton(cueButtonRight, cueButtonRightX, cueButtonRightZ, soundObjectRight)

    function cueButton(cue, x, z, soundObject){
        loader.load( '3D-renderings/cue.glb', function ( gltf ) {
            // adding rendering to scene
            cue = gltf.scene
            scene.add( cue );
            cue.translateX(x);
            cue.translateZ(z)
            cue.translateY(0.014);

            var raycaster = new THREE.Raycaster();
            var mouse = new THREE.Vector2();
            var song;

            function onMouseDown(event) {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

                //copying over the sounds array.
                song = [...soundObject.sounds];

                raycaster.setFromCamera(mouse, camera);
                var intersects = raycaster.intersectObjects([cue]);
                if (intersects.length > 0) {
                    intersects[0].object.position.y = 0.574; 
                    song[soundObject.currentIndex].play(); 
                }
            }
    
            function onMouseUp(event) {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
                raycaster.setFromCamera(mouse, camera);
                var intersects = raycaster.intersectObjects([cue]);
                if (intersects.length > 0) {
                    intersects[0].object.position.y = 0.577;
                    song[soundObject.currentIndex].stop();
                }
                song = 0;
            }
    
            window.addEventListener('mousedown', onMouseDown, false);
            window.addEventListener('mouseup', onMouseUp, false);

        }, undefined, function ( error ) {
            console.error( error );
        } );
    }
    
    // *************************************************************************




    // volume riser ************************************************************
    var initialPosition = new THREE.Vector3();

    var volumeLeft;
    var volumeLeftX = 0.0464;
    var volumeLeftZ = 0.002;
    volumeFader(volumeLeft,volumeLeftX, volumeLeftZ, soundObjectLeft)

    var volumeRight;
    var volumeRightX = -0.0534;
    var volumeRightZ = 0.002;
    volumeFader(volumeRight,volumeRightX, volumeRightZ, soundObjectRight)
    var originalGain = [];

    function volumeFader (volume, x, z, soundObject){
        loader.load('3D-renderings/volume-riser-left.glb', function ( gltf ) {
            // adding rendering to scene
            volume = gltf.scene
            scene.add( volume );
            volume.translateX(x);
            volume.translateZ(z);
    
            var controls = new DragControls([volume], camera, renderer.domElement);
    
            // written with help of Copilot
            controls.addEventListener('dragstart', function (event) {
                initialPosition.copy(event.object.position);
            });
            var minZ = -0.22184461895734392;
            var maxZ = -0.11135324310255112;
            function calculateVolume(zPosition, minZ, maxZ) {
                return (zPosition - minZ) / (maxZ - minZ);
            }
            var volumeWasZero = false;
            controls.addEventListener('drag', function (event) {
                event.object.position.x = initialPosition.x;
                event.object.position.y = initialPosition.y;
                event.object.position.z = Math.max(minZ, Math.min(maxZ, event.object.position.z));
                var volumeLevel = calculateVolume(event.object.position.z, minZ, maxZ);
                soundObject.sounds[soundObject.currentIndex].setVolume(volumeLevel);
                console.log(soundObject.sounds[soundObject.currentIndex].getVolume());
                
                
                //because the eq filters mess with the volume
                var filters = soundObject.sounds[soundObject.currentIndex].getFilters();
                if (volumeWasZero){
                    volumeWasZero = false;
                    for (let i = 0; i < filters.length-1; i++){
                        filters[i].gain.value = originalGain[i];
                        console.log(originalGain[i]);
                    }
                }
                if (soundObject.sounds[soundObject.currentIndex].getVolume() == 0){
                    volumeWasZero = true;
                    //filter.length-1 because the last filter is a gainnode that compensates for loudness and shouldn't be changed.
                    for (let i = 0; i < filters.length-1; i++){
                        originalGain[i] = filters[i].gain.value;
                        filters[i].gain.value = 0;
                    }
                }
            });
            // end of Copilot
        }, undefined, function ( error ) {
            console.error( error );
        } );
    }
    // *************************************************************************

    





    // tempo riser ************************************************************
    function calculatePlaybackRate(zPosition, minZ, maxZ) {
        var midZ = (minZ + maxZ) / 2;
        return 1 + 0.5 * (zPosition - midZ) / (midZ - minZ);   
    }

    var tempoLeft;
    var tempoLeftX = 0.0466;
    var tempoLeftZ = -0.006;
    tempoFader(tempoLeft, tempoLeftX, tempoLeftZ, soundObjectLeft)

    var tempoRight;
    var tempoRightX = -0.9297;
    var tempoRightZ = -0.006;
    tempoFader(tempoRight, tempoRightX, tempoRightZ, soundObjectRight)

    function tempoFader(tempo, x, z, soundObject){
        loader.load('3D-renderings/tempo-left.glb', function ( gltf ) {
            // adding rendering to scene
            tempo = gltf.scene
            scene.add( tempo );
            tempo.translateX(x);
            tempo.translateZ(z)
    
            var controls = new DragControls([tempo], camera, renderer.domElement);
    
            // written with help of copilot
            controls.addEventListener('dragstart', function (event) {
                initialPosition.copy(event.object.position);
            });
            var minZ = -0.282081224508521;
            var maxZ = -0.13445486721481303;
    
            controls.addEventListener('drag', function (event) {
                event.object.position.x = initialPosition.x;
                event.object.position.y = initialPosition.y;
                event.object.position.z = Math.max(minZ, Math.min(maxZ, event.object.position.z));
                // end copilot
                var newPlaybackRate = calculatePlaybackRate(event.object.position.z, minZ, maxZ);
                soundObject.sounds[soundObject.currentIndex].setPlaybackRate(newPlaybackRate);
    
            });
        }, undefined, function ( error ) {
            console.error( error );
        } );
    }
    
    // *************************************************************************



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