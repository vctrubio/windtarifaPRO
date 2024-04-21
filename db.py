import pandas as pd
import numpy as np
from datetime import datetime
from sqlalchemy import create_engine

DB_POSTGRES = 'postgresql'
DB_USERNAME = 'trtp'
DB_PASSWORD = ''
DB_HOST = 'localhost'
DB_PORT = '5432'
DB_NAME = 'windtarifa'
DB_TABLE = 'weather'

init_engine = create_engine(f'{DB_POSTGRES}://{DB_USERNAME}@{DB_HOST}:{DB_PORT}/{DB_NAME}')
current_date = datetime.now().strftime('%Y-%m-%d')
