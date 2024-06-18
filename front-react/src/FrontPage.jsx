import React, { useEffect, useState } from 'react';
import { showRow } from './Utils.jsx';
import { paramsWindSpeed, paramsWindDirection, paramsCloudCover } from './ApiCall.js';

const Render = () => {
    return (
        <>hello div</>
    );
}

function showWindSpeed(ptrWindHr) {
    let sum = 0;
    for (let param of paramsWindSpeed) {
        console.log(ptrWindHr[param])
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
        <div>
            <Render />
            {ptrWindHr && <div id="wind-knts">{showWindSpeed(ptrWindHr)} knts</div>}
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