import pandas as pd
from sqlalchemy import create_engine

DB_POSTGRES = 'postgresql'
DB_USERNAME = 'trtp'
DB_PASSWORD = ''
DB_HOST = 'localhost'
DB_PORT = '5432'
DB_NAME = 'windtarifa'
DB_TABLE = 'weather'

engine = create_engine(f'{DB_POSTGRES}://{DB_USERNAME}@{DB_HOST}:{DB_PORT}/{DB_NAME}')

# Sample DataFrame with data to be inserted
data = {
    't_date': ['2022-03-01', '2022-01-02', '2022-01-03'],
    't_hour': [2, 2, 2],
    'ws_low': [2, 3, 4],
    'ws_med': [4, 5, 6],
    'wd': [180, 180, 180]
}

df = pd.DataFrame(data)

try:
    df.to_sql(DB_TABLE, engine, if_exists='append', index=False)
except:
    print('Error while inserting data into the database -- DUPLICATES')

