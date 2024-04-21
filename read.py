from db import *

def read_db_date():
    engine = init_engine
    query = f"SELECT * FROM {DB_TABLE} WHERE t_date = '{current_date}' AND t_hour >= '08' AND t_hour <= '22'"
    df = pd.read_sql_query(query, engine)
    engine.dispose()
    print(df)
    return df

def read_db_timenow():
    engine = init_engine
    query = f"SELECT * FROM {DB_TABLE} WHERE t_date = '{current_date}' AND t_hour = '{datetime.now().hour}'"
    df = pd.read_sql_query(query, engine)
    engine.dispose()
    print(df)
    return df

def read_db_all():
    engine = init_engine
    query = f"SELECT * FROM {DB_TABLE} WHERE t_date >= '{current_date}'"
    df = pd.read_sql_query(query, engine)
    engine.dispose()
    print(df)
    return df
