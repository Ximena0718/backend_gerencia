import bcrypt from "bcrypt";
import { Request, Response } from "express";
import UsuarioDAO from "../dao/usuarioDAO";
import { User, UsuarioCreationResult } from "../interface/interfaces";
import Result from "../utils/Result";

class usuarioController {
	public async insertUser(req: Request, res: Response): Promise<void> {
		const { nombre, apellido, email, username, password, avatar_url, rol } =
			req.body;

		const validFields = [
			{ field: nombre, type: "string" },
			{ field: apellido, type: "string" },
			{ field: email, type: "string" },
			{ field: username, type: "string" },
			{ field: password, type: "string" },
			{ field: avatar_url, type: "string" },
			{ field: rol, type: "string" },
		];

		const invalidField = validFields.find(
			({ field, type }) => typeof field !== type
		);

		if (invalidField) {
			res.status(400).json({ Respuesta: "Invalid input data types" });
			return;
		}

		try {
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(password, saltRounds);

			const data = {
				nombre,
				apellido,
				email,
				username,
				password: hashedPassword,
				avatar_url,
				rol: rol as
					| "administrador"
					| "usuario"
					| "proveedor"
					| "establecimiento",
			};
			const result: Result<UsuarioCreationResult, string> =
				await UsuarioDAO.createUser(data);

			if (result.isSuccess) {
				res.status(200).json(result.getValue());
			} else {
				res.status(400).json({ Respuesta: result.errorValue() });
			}
		} catch (error: any) {
			res
				.status(500)
				.json({ Respuesta: `Error al crear el usuario: ${error.message}` });
		}
	}

	public async insertMultipleUsers(req: Request, res: Response): Promise<void> {
		const users = req.body;

		if (!Array.isArray(users)) {
			res.status(400).json({ Respuesta: "Se esperaba un array de usuarios" });
			return;
		}

		try {
			const insertions = users.map(async (user) => {
				const { nombre, apellido, email, username, password, avatar_url, rol } =
					user;

				if (!password) {
					throw new Error(
						"Contraseña no proporcionada para el usuario " + username
					);
				}

				const saltRounds = 10;
				const hashedPassword = await bcrypt.hash(password, saltRounds);
				const userData = {
					nombre,
					apellido,
					email,
					username,
					password: hashedPassword,
					avatar_url,
					rol,
				};

				return UsuarioDAO.createUser(userData);
			});

			const results = await Promise.all(insertions);
			const failed = results.filter((result) => !result.isSuccess);

			if (failed.length > 0) {
				res
					.status(400)
					.json({ Respuesta: "Error en algunas inserciones", errores: failed });
			} else {
				res
					.status(200)
					.json({ Respuesta: "Todos los usuarios insertados exitosamente" });
			}
		} catch (error: any) {
			res
				.status(500)
				.json({ Respuesta: `Error al crear usuarios: ${error.message}` });
		}
	}

	public async fetchUser(req: Request, res: Response): Promise<void> {
		const requestedUsername: string = req.params.username;
		const loggedInUser = (req as any).user.username;

		try {
			if (requestedUsername === loggedInUser) {
				await UsuarioDAO.updateUserLoginTimestamp(requestedUsername);
			}

			const result: Result<User, string> = await UsuarioDAO.getUser(
				requestedUsername
			);

			if (result.isSuccess) {
				const user = result.getValue();
				if (loggedInUser === requestedUsername) {
					res.status(200).json(user);
				} else {
					res.status(200).json({
						user_id: user.user_id,
						username: user.username,
					});
				}
			} else {
				res.status(400).json({ Respuesta: result.errorValue() });
			}
		} catch (error: any) {
			res
				.status(500)
				.json({ Respuesta: `Error al obtener el usuario: ${error.message}` });
		}
	}
}

const UsuarioController = new usuarioController();
export default UsuarioController;
