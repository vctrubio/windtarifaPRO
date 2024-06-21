import React, { useEffect, useState, useRef } from 'react';
import { showRow } from './Utils.jsx';
import { paramsWindSpeed, paramsWindDirection, paramsCloudCover } from './ApiCall.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Render = () => {
    const mountRef = useRef(null);
    useEffect(() => {
        const isMobile = window.innerWidth < 768; // Example breakpoint for mobile devices

        //rendered
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / (window.innerHeight),
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        if (isMobile) {
            renderer.setSize(window.innerWidth, window.innerHeight * 0.6);
        }
        else{
            renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
        }
        mountRef.current.appendChild(renderer.domElement);

        //light
        const light = new THREE.AmbientLight(0xffffff); // Soft white light
        scene.add(light);

        //load model
        const textureLoader = new THREE.TextureLoader(); // Define textureLoader here
        const texture = textureLoader.load('texture_0_albedo.jpg');
        const loader = new GLTFLoader();
        loader.load('windLogo', (gltf) => {
            scene.add(gltf.scene);
          
            // const model = gltf.scene
            // model.traverse((child) => {
            //     if (child.isMesh) {
            //         child.material.map = texture;
            //         child.material.needsUpdate = true;
            //     }
            // });


            if (isMobile) {
                camera.position.set(0, 0, 1.6); // Further back for mobile devices
            } else {
                camera.position.set(0, 0, 1.4); // Closer for larger screens
            }
            const animate = function () {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            };
            animate();
        });



        // Resize event listener
        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
            renderer.render(scene, camera);
        };
        window.addEventListener('resize', onWindowResize);

        return () => {
            mountRef.current.removeChild(renderer.domElement);
        };
    }, []);

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