import pandas as pd
import psycopg2

from sqlalchemy import create_engine, MetaData, select
from psycopg2 import Error

DB_POSTGRES = 'postgresql'
DB_USERNAME = 'trtp'
DB_PASSWORD = ''
DB_HOST = 'localhost'
DB_PORT = '5432'
DB_NAME = 'windtarifa'
DB_TABLE = 'weather'

try:
    connection_str = f"postgresql://{DB_USERNAME}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    conn = psycopg2.connect(connection_str)
    cursor = conn.cursor()

    insert_query = """
            INSERT INTO weather (t_date, t_hour, ws_med, wd)
            VALUES (%s, %s, %s, %s)
        """

    values = ('2022-03-01', 0, 20, 190)
    cursor.execute(insert_query, values)
    conn.commit()

    print("Record inserted successfully")
    
except (Exception, Error) as error:
    print("Error while connecting to PostgreSQL:", error)
    
finally:
    conn.close()
