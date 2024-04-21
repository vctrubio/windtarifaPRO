import pandas as pd
from sqlalchemy import create_engine

DB_POSTGRES = 'postgresql'
DB_USERNAME = 'trtp'
DB_PASSWORD = ''
DB_HOST = 'localhost'
DB_PORT = '5432'
DB_NAME = 'windtarifa'
DB_TABLE = 'weather'

# Create the SQLAlchemy engine
engine = create_engine(f'{DB_POSTGRES}://{DB_USERNAME}@{DB_HOST}:{DB_PORT}/{DB_NAME}')

# Fetch the data
df = pd.read_sql("SELECT * FROM weather ORDER BY t_date DESC, t_hour ASC", engine)

# Group by date and convert each group to a list of dictionaries
groups = df.groupby('t_date').apply(lambda group: group.to_dict('records'))

# Print the groups
for date, records in groups.items():
    print(f'Date: {date}')
    for record in records:
        print(f'  Hour: {record["t_hour"]}')