DB_ROOT_NAME = trtp
DB_NAME = windtarifa

psql:
	@psql -d windtarifa

db_create:
	@psql -c "CREATE DATABASE $(DB_NAME);"

db_drop:
	@psql -c "DROP DATABASE $(DB_NAME);"

db_list:
	@psql -c "\l"

db_table:
	@psql -d windtarifa -f schema.sql

db_ls:
	@psql -d windtarifa -c "SELECT * FROM weather ORDER BY t_date DESC, t_hour ASC;"

start:
	@python3 main.py 