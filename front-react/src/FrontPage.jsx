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

const Render = () => {
    const mountRef = useRef(null);
    const [windDegree, setWindDegree] = useState(-10); // Example: 0 degrees

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
        
            if (isMobile) {
                camera.position.set(0, 0, 1.6);
            } else {
                camera.position.set(0, 0, 1.4);
            }
        
            // Animate model rotation based on wind degree
            const updateModelRotation = () => {
                const windRadians = windDegree * (Math.PI / 180);
                gsap.to(gltf.scene.rotation, {
                    duration: 1, // Duration of the animation in seconds
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
    for (let param of paramsWindSpeed) {
        // console.log(ptrWindHr[param])
        sum += ptrWindHr[param];
    }
    const average = sum / paramsWindSpeed.length;
    return Math.round(average);
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
            <Render />
            {ptrWindHr && <div id="wind-knts">{showWindSpeed(ptrWindHr)} knts</div>}
            <div>wind change next 3 hrs</div>
            <div>wind direction: poniente o levante</div>
        </div>
    );
}


// {ptrWindHr ? (
//     <div>
//         {Object.entries(ptrWindHr).map(([key, value]) => (
//             <div key={key}>
//                 <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
//             </div>
//         ))}
//     </div>
// ) : (
//     <div>Loading...</div>
// )}