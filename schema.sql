DROP TABLE IF EXISTS weather;

CREATE TABLE IF NOT EXISTS weather (
	id SERIAL PRIMARY KEY,
	t_date DATE NOT NULL,
	t_hour INT NOT NULL,
	wind_speed_10m FLOAT,
	wind_speed_80m FLOAT NOT NULL,
	wind_speed_180m FLOAT,
	wind_direction_180m FLOAT NOT NULL,
	temperature_2m FLOAT,
	apparent_temperature FLOAT,
	rain FLOAT,
	cloud_cover INT,
	cloud_cover_low INT,
	cloud_cover_mid INT,
	cloud_cover_high INT,
	CONSTRAINT valid_hour CHECK (t_hour BETWEEN 0 AND 23),
	CONSTRAINT valid_ws_low CHECK (wind_speed_10m BETWEEN 0 AND 100),
	CONSTRAINT valid_ws_med CHECK (wind_speed_80m BETWEEN 0 AND 100),
	CONSTRAINT valid_ws_high CHECK (wind_speed_180m BETWEEN 0 AND 100),
	CONSTRAINT valid_wd CHECK (wind_direction_180m BETWEEN 0 AND 360),
	CONSTRAINT unique_date_hour UNIQUE (t_date, t_hour)
);

