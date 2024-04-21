import openmeteo_requests
import requests_cache

from retry_requests import retry
from params import *
from db import *

def df_to_sql(df):
    try:
        engine = init_engine
        df.to_sql(DB_TABLE, engine, if_exists='replace', index=False)
        print(f"\033[92m--{len(df)}-- rows added to the database\033[0m")
    except Exception as e:
        print(f'Error while inserting data into the database -- {e}')
    finally:
        engine.dispose()

def clean_df(df):
    df['t_date'] = df['t_date'].astype(str).str.split(" ", expand=True)[0]
    df['wind_speed_10m'] = np.round(df['wind_speed_10m'], 1)
    df['wind_speed_80m'] = np.round(df['wind_speed_80m'], 1)
    df['wind_speed_180m'] = np.round(df['wind_speed_180m'], 1)
    df['wind_direction_180m'] = np.round(df['wind_direction_180m'], 1)
    df['wind_direction_80m'] = np.round(df['wind_direction_80m'], 1)
    df['temperature_2m'] = np.round(df['temperature_2m'], 1)
    df['apparent_temperature'] = np.round(df['apparent_temperature'], 1)

    df = df[['t_date', 't_hour', 'wind_direction_180m', 'wind_direction_80m', 'wind_speed_180m', 'wind_speed_80m', 'wind_speed_10m', 'temperature_2m', 'apparent_temperature', 'rain', 'cloud_cover', 'cloud_cover_low', 'cloud_cover_mid', 'cloud_cover_high']]  
    return df
 
def setup():
    cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
    retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
    openmeteo = openmeteo_requests.Client(session = retry_session)
    return openmeteo

def get_hourly(hourly):
    variable_indices = {name: i for i, name in enumerate(params['hourly'])}
    data = {}
    for name, index in variable_indices.items():
        variable_values = hourly.Variables(index).ValuesAsNumpy()
        data[name] = variable_values
    df = pd.DataFrame(data)
    print(df)
     
    hourly_data = {"date": pd.date_range(
        start = pd.to_datetime(hourly.Time(), unit = "s", utc = True),
        end = pd.to_datetime(hourly.TimeEnd(), unit = "s", utc = True),
        freq = pd.Timedelta(seconds = hourly.Interval()),
        inclusive = "left"
    )}
    
    df['t_date'] = hourly_data['date']
    df['t_hour'] = df['t_date'].dt.hour
    return clean_df(df)


def api_call():
    try:
        openmeteo = setup()
        responses = openmeteo.weather_api(url, params=params)
        response = responses[0] # Process first location. Add a for-loop for multiple locations or weather models
        
        '''
        The output you're seeing indicates that hourly is an instance of the VariablesWithTime class from the openmeteo_sdk package.
        current = response.Current() vs response.Hourly()
        '''
        
        hourly = response.Hourly()
        df = get_hourly(hourly)
        df_to_sql(df)
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    api_call()

