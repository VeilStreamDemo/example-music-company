.PHONY: seed-prod help

# Default target
help:
	@echo "Available targets:"
	@echo "  seed-prod    - Seed production database with Chinook data"
	@echo "                Usage: make seed-prod DATABASE_URL='postgresql://user:pass@host:port/dbname'"

# Seed production database
seed-prod:
	@if [ -z "$(DATABASE_URL)" ]; then \
		echo "Error: DATABASE_URL is required"; \
		echo "Usage: make seed-prod DATABASE_URL='postgresql://user:pass@host:port/dbname'"; \
		exit 1; \
	fi
	@echo "Seeding production database..."
	@psql "$(DATABASE_URL)" -f database/01_Chinook_PostgreSql.sql
	@DB_NAME=$$(echo "$(DATABASE_URL)" | sed -n 's|.*/\([^?]*\).*|\1|p'); \
	if [ -z "$$DB_NAME" ]; then \
		echo "Warning: Could not extract database name from DATABASE_URL, using 'chinook'"; \
		DB_NAME="chinook"; \
	fi; \
	sed "s/\\\\c chinook;/\\\\c $$DB_NAME;/" database/02_multiple_users.sql | psql "$(DATABASE_URL)"
	@echo "Database seeded successfully!"

