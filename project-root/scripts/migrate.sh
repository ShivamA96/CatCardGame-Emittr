#!/bin/bash
echo "Enter password for PostgreSQL user 'user':"
read -s PGPASSWORD
export PGPASSWORD
psql -h localhost -U user -d gamedb -f migrations.sql
unset PGPASSWORD