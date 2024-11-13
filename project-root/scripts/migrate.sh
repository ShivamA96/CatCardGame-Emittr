#!/bin/bash
psql -h localhost -U user -d gamedb -f migrations.sql
