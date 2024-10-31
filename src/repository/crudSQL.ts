export const SQL_TOKEN = {
	getUserToken: `
	  SELECT 
			username, 
			rol 
	  FROM users 
	  WHERE username = $1 AND password = $2`,

	getUserCredentials: `
		SELECT 
			password 
		FROM users 
		WHERE username = $1;`,
};

export const SQL_USUARIO = {
	fetchUser: `
		SELECT 
			user_id, nombre, apellido, 
			email, username, avatar_url, 
			rol, created_at, updated_at
		FROM users 
		WHERE users.username = $1;`,

	findAllUsers: `
		SELECT 
			users.nombre, users.apellido, users.username, 
			roles.nombre_rol as rol
		FROM users 
		JOIN roles ON users.rol = roles.id_rol;`,

	insertUser: `
		INSERT INTO users 
			(nombre, apellido, email, username, password, avatar_url, rol, created_at) 
		VALUES 
			($1, $2, $3, $4, $5, $6, $7::rol_enum, CURRENT_TIMESTAMP) 
		RETURNING user_id;`,

	checkUserExists: `
		SELECT 
			user_id 
		FROM users 
		WHERE email = $1 OR username = $2;`,
};
export const SQL_ESTABLECIMIENTOS = {
	createTable: `
	  CREATE TABLE IF NOT EXISTS lugaresUsta (
		id_lugar UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		nombreEvento VARCHAR(100) NOT NULL,
		direccionEvento VARCHAR(100) NOT NULL,
		aforoLugarEvento INT NOT NULL
	  )
	`,
	
	getAllLugares: `
	  SELECT * FROM lugaresUsta;
	`,
  
	getLugarById: `
	  SELECT * FROM lugaresUsta WHERE id_lugar = $1;
	`,
  
	insertLugar: `
	  INSERT INTO lugaresUsta (nombreEvento, direccionEvento, aforoLugarEvento)
	  VALUES ($1, $2, $3) RETURNING id_lugar;
	`,
  
	updateLugar: `
	  UPDATE lugaresUsta
	  SET nombreEvento = $1, direccionEvento = $2, aforoLugarEvento = $3
	  WHERE id_lugar = $4;
	`,
  
	deleteLugar: `
	  DELETE FROM lugaresUsta WHERE id_lugar = $1;
	`
  };
  