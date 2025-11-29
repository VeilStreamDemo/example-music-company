
psql_source_database:
	psql -h localhost -U user -d chinook -p 5432 -W

psql_proxy:
	psql -h localhost -U user -d chinook -p 5435 -W

psql_proxy_alice:
	psql -h localhost -U alice -d chinook -p 5435 -W

psql_proxy_bob:
	psql -h localhost -U bob -d chinook -p 5435 -W

psql_proxy_chris:
	psql -h localhost -U chris -d chinook -p 5435 -W