-- Active: 1727760906032@@aws-0-us-west-1.pooler.supabase.com@6543@postgres
DO $$
DECLARE
	r RECORD;
BEGIN
	FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
		EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE;';
	END LOOP;
	
	IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
		EXECUTE 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";';
	END IF;

	EXECUTE '
	CREATE TYPE rol_enum AS ENUM (
		''administrador'',
		''usuario'',
		''proveedor'',
		''establecimiento''
	);';

	EXECUTE '
	CREATE TABLE IF NOT EXISTS users (
		user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		nombre VARCHAR(100) NOT NULL,
		apellido VARCHAR(100) NOT NULL,
		email VARCHAR(100) UNIQUE NOT NULL,
		username VARCHAR(50) UNIQUE NOT NULL,
		password TEXT NOT NULL,
		avatar_url TEXT,
		rol rol_enum NOT NULL,
		created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMPTZ
	);';

	EXECUTE 'CREATE INDEX idx_users_username ON users (username);';
END $$;