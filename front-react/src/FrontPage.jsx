import React, { useEffect, useState, useRef } from 'react';
import { showRow } from './Utils.jsx';
import { paramsWindSpeed, paramsWindDirection, paramsCloudCover } from './ApiCall.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from 'gsap';


/* @param windDegree: 
85 degrees: avatar look full left
-85 degree: avatar look full right
0 degree: avatar look front
*/


/*
90 degrees: avatar look full left
270 degree: avatar look full right
*/

const Render = ({ windDegree = 0 }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        const isMobile = window.innerWidth < 768;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, isMobile ? window.innerHeight * 0.6 : window.innerHeight * 0.8);
        mountRef.current.appendChild(renderer.domElement);

        const light = new THREE.AmbientLight(0xffffff);
        scene.add(light);

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('texture_0_albedo.jpg');
        const loader = new GLTFLoader();
        loader.load('windLogo', (gltf) => {
            scene.add(gltf.scene);

            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    // Clone the original mesh
                    const outlineMesh = child.clone();
                    // Scale it up a bit
                    outlineMesh.scale.multiplyScalar(1);
                    // Use a basic material with emissive color for the outline effect
                    outlineMesh.material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
                    // Add the outline mesh to the scene
                    scene.add(outlineMesh);
                }
            });
            
            if (isMobile) {
                camera.position.set(0, 0, 1.6);
            } else {
                camera.position.set(0, 0, 1.4);
            }

            // Animate model rotation based on wind degree
            const updateModelRotation = () => {
                const windRadians = windDegree * (Math.PI / 180);
                gsap.to(gltf.scene.rotation, {
                    duration: 2.5, // Duration of the animation in seconds
                    y: windRadians, // Target rotation in radians
                    ease: "power1.inOut", // Easing function for the animation
                });
            };
            updateModelRotation(); // Call it to apply initial rotation

            const animate = function () {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            };
            animate();
        });

        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
            renderer.render(scene, camera);
        };
        window.addEventListener('resize', onWindowResize);

        return () => {
            window.removeEventListener('resize', onWindowResize);
            mountRef.current.removeChild(renderer.domElement);
        };
    }, [windDegree]); // Depend on windDegree to re-render when it changes

    return <div ref={mountRef}></div>;
};


function showWindSpeed(ptrWindHr) {
    let sum = 0;
    for (let param of paramsWindSpeed) 
        sum += ptrWindHr[param];
    const average = sum / paramsWindSpeed.length;
    return Math.round(average);
}

function defineWindVector(windDegree) {
    // levante is between 70 and 90
    if (windDegree <= 70 && windDegree >= 15) {
        windDegree = 70;
    }
    // Poniente is between 250 and 275
    else if (windDegree >= 280 && windDegree <= 360) {
        windDegree = 280;
    }
    else if (windDegree <= 280 && windDegree <= 140) {
        windDegree = 140;
    }
    else {
        windDegree = 2;
    }

    if (windDegree <= 280 && windDegree >= 250) {
        windDegree -= 360;
    }
    return windDegree
}

function getWindDegree(ptrWindHr) {
    let sum = 0;
    for (let param of paramsWindDirection)
        sum += ptrWindHr[param];
    const average = sum / paramsWindDirection.length;
    return (defineWindVector(average))
}

export function FrontPage({ rows, date, time }) {
    const [ptrWindHr, setPtrWindHr] = useState(null);

    useEffect(() => {
        if (rows && date && time && rows[date] && rows[date][time]) {
            setPtrWindHr(rows[date][time]);
        }
    }, [rows, date, time]);

    useEffect(() => {
        window.r = rows;
        window.d = date;
        window.t = time;
        window.ptr = ptrWindHr;
    }, [rows, date, time, ptrWindHr]);

    return (
        <div style={{ height: '100vh' }}>
            {
                ptrWindHr ? (
                    <>
                        <Render windDegree={getWindDegree(ptrWindHr)} />
                        <div id="wind-knts">{showWindSpeed(ptrWindHr)} knts</div>
                    </>
                ) : (
                    <div></div>
                )
            }

            <div>wind change next 3 hrs</div>
        </div>
    );
}