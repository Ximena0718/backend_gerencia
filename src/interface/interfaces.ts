export interface User {
	user_id: string;
	nombre: string;
	apellido: string;
	email: string;
	username: string;
	password: string;
	avatar_url: string;
	rol: "administrador" | "usuario" | "proveedor" | "establecimiento";
	created_at: Date;
	updated_at: Date;
}

export interface Token {
	username: string;
	password: string;
}

export interface DataToken {
	username: string;
	rol: string;
}

export interface UsuarioCreationResult {
	user_id: string;
}
