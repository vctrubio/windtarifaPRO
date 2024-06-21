import React, { useEffect, useState, useRef } from 'react';
import { showRow } from './Utils.jsx';
import { paramsWindSpeed, paramsWindDirection, paramsCloudCover } from './ApiCall.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';


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

        const loader = new GLTFLoader();
        loader.load('windLogo', (gltf) => {
            scene.add(gltf.scene);

            const selectedObjects = [];
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    selectedObjects.push(child);
                }
            });

            if (isMobile) {
                camera.position.set(0, 0, 1.6);
            } else {
                camera.position.set(0, 0, 1.4);
            }

            const updateModelRotation = () => {
                const windRadians = windDegree * (Math.PI / 180);
                gsap.to(gltf.scene.rotation, {
                    duration: 2.5,
                    y: windRadians,
                    ease: "power1.inOut",
                });
            };
            updateModelRotation();

            const composer = new EffectComposer(renderer);
            const renderPass = new RenderPass(scene, camera);

            composer.addPass(renderPass);

            const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
            outlinePass.edgeStrength = 2;
            outlinePass.edgeGlow = 0.7;
            outlinePass.edgeThickness = 1.5;
            outlinePass.visibleEdgeColor.set('#ffffff');
            outlinePass.selectedObjects = selectedObjects;
            composer.addPass(outlinePass);

            const animate = function () {
                requestAnimationFrame(animate);
                composer.render();
            };
            animate();
        });

        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, isMobile ? window.innerHeight * 0.6 : window.innerHeight * 0.8);
            composer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onWindowResize);

        return () => {
            window.removeEventListener('resize', onWindowResize);
            mountRef.current.removeChild(renderer.domElement);
        };
    }, [windDegree]);

    return <div ref={mountRef}></div>;
};



function getWindSpeedNow(ptrWindHr) {
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
        windDegree = 8;
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

function getWindChange(rows, date, time) {
    try {
        let sum = 0;
        let count = 0;
        for (let i = 1; i <= 3; i++) {
            if (rows[date] && rows[date][time + i]) {
                for (let param of paramsWindSpeed) {
                    sum += rows[date][time + i][param];
                }
                count++;
            }
        }
        const average = sum / (paramsWindSpeed.length * count);
        return Math.round(average);
    } catch (error) {
        // no +3 hours in the day
        return null; 
    }
}

function getWindName(ptrWindHr){
    const windDirection = getWindDegree(ptrWindHr);
    if (windDirection >= 35 && windDirection <= 100)
        return 'levante' //east
    else if (windDirection >= 100 && windDirection <= 175)
        return 'north'
    else if (windDirection >= 175 && windDirection <= 320)
        return 'poniente' //west
    else
        return 'south'
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
                        <div id="wind-knts">{getWindSpeedNow(ptrWindHr)} knts</div>
                        <div>{getWindChange(rows, date, time) - getWindSpeedNow(ptrWindHr)} : wind change next 3 hrs</div>
                        <div>{getWindName(ptrWindHr)} : wind direction</div>
                    </>
                ) : (
                    <div></div>
                )
            }
        </div>
    );
}