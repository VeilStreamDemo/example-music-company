# Use the latest official Postgres image
FROM postgres:latest

COPY 01_Chinook_PostgreSql.sql /docker-entrypoint-initdb.d/01_Chinook_PostgreSql.sql
COPY 02_multiple_users.sql /docker-entrypoint-initdb.d/02_multiple_users.sql