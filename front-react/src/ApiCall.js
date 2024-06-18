import { fetchWeatherApi } from 'openmeteo';

const params = {
	"latitude": 36.0139,
	"longitude": -5.607,
	"timezone": "Europe/Berlin",
	"wind_speed_unit": "kn",
	"hourly": [
		"temperature_2m", "apparent_temperature",
		"rain", "cloud_cover", "cloud_cover_low", "cloud_cover_mid", "cloud_cover_high",
		"wind_speed_10m", "wind_speed_80m", "wind_speed_180m",
		"wind_direction_180m", "wind_direction_80m"
	],
	// "forecast_days": 3
};

export const paramsWindSpeed = ["wind_speed_10m","wind_speed_80m", "wind_speed_180m"];
export const paramsWindDirection = ["wind_direction_180m", "wind_direction_80m"];
export const paramsCloudCover = ["cloud_cover", "cloud_cover_low", "cloud_cover_mid", "cloud_cover_high"];

const range = (start, stop, step) =>
	Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

async function apiCall() {
	const url = "https://api.open-meteo.com/v1/forecast";
	const responses = await fetchWeatherApi(url, params);
	const response = responses[0];
	
	const utcOffsetSeconds = response.utcOffsetSeconds();

	const hourly = response.hourly();
	const variableIndices = {};
	params.hourly.forEach((name, i) => {
		variableIndices[name] = i;
	});

	let theData = {
		timestamp: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
			(t) => new Date((t + utcOffsetSeconds) * 1000)
		)
	};

	for (const [name, index] of Object.entries(variableIndices)) {
		theData[name] = hourly.variables(index).valuesArray();
	}
	console.log('calling...')

	return theData;
}

function dataToJson(data) {
	let json = {};
	for (let i = 0; i < data.timestamp.length; i++) {
		const date = data.timestamp[i].toISOString().split('T')[0];
		const hour = data.timestamp[i].getUTCHours()

		if (!json[date])
			json[date] = {};
		if (!json[date][hour])
			json[date][hour] = {};

		for (const [name, value] of Object.entries(data)) {
			if (name !== 'timestamp') 
				json[date][hour][name] = Number(Number(value[i]).toFixed(1));
			
			json[date][hour]['t_time'] = data.timestamp[i]
			json[date][hour]['t_date'] = date;
			json[date][hour]['t_hour'] = hour;
		}
	}
	return json;
}

export function returnDataJson(){
    return apiCall().then(data => {
        if (data)
            return dataToJson(data);
        else
            return null;
    });
}