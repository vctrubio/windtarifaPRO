function formatKey(key) {
    return key
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function showRow(row) {
    const windDData = [];
    const windSData = [];
    const temperatureData = [];
    const rainData = [];
    
    const cloudData = [];
    const time = row.t_hour;

    Object.entries(row)
        .filter(([key]) => !key.startsWith('t_'))
        .forEach(([key, value]) => {
            if (key.includes('wind_direction')) {
                windDData.push(<p key={key}>{formatKey(key)}: {value}</p>);
            }
            else if (key.includes('wind_speed')) {
                windSData.push(<p key={key}>{formatKey(key)}: {value}</p>);
            }
            else if (key.includes('temperature')) {
                temperatureData.push(<p key={key}>{formatKey(key)}: {value}</p>);
            }

            else if (key.includes('rain')) {
                rainData.push(<p key={key}>{formatKey(key)}: {value}</p>);
            } else if (key.includes('cloud')) {
                cloudData.push(<p key={key}>{formatKey(key)}: {value}</p>);
            }
        });

    return (
        <div>
            <h2>{time}:hrs</h2>
            <div>{windDData}</div>
            <br></br>
            <div>{windSData}</div>
            <br></br>
            <div>{cloudData}</div>
            <br></br>
            <div>{temperatureData}</div>
            <br></br>
            <div>{rainData}</div>
        </div>
    );
}