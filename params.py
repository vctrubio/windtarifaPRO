params = {
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
	# "forecast_days": 3
}

url = "https://api.open-meteo.com/v1/forecast"

#ECMWF