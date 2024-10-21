import bcrypt from "bcrypt";
import { Request, Response } from "express";
import UsuarioDAO from "../dao/usuarioDAO";
import { User, UsuarioCreationResult, userData } from "../interface/interfaces";
import Result from "../utils/Result";

class usuarioController {
	public async insertUser(req: Request, res: Response) {
		const { nombre, apellido, email, username, password, avatar_url, rol } =
			req.body;

		const fieldsToValidate = [
			{ name: "nombre", value: nombre, type: "string" },
			{ name: "apellido", value: apellido, type: "string" },
			{ name: "email", value: email, type: "string" },
			{ name: "username", value: username, type: "string" },
			{ name: "password", value: password, type: "string" },
			{ name: "avatar_url", value: avatar_url, type: "string" },
			{ name: "rol", value: rol, type: "string" },
		];

		const invalidField = fieldsToValidate.find(
			({ value, type }) => typeof value !== type
		);

		if (invalidField) {
			return res
				.status(400)
				.json(`Invalid data type for field '${invalidField.name}'`);
		}

		try {
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(password, saltRounds);

			const data: userData = {
				nombre,
				apellido,
				email,
				username,
				password: hashedPassword,
				avatar_url,
				rol,
			};

			const result: Result<UsuarioCreationResult, string> =
				await UsuarioDAO.createUser(data);

			if (result.isSuccess) {
				return res.status(200).json(result.getValue());
			} else {
				return res.status(400).json({ error: result.errorValue() });
			}
		} catch (error: any) {
			return res
				.status(500)
				.json(`Error al crear el usuario: ${error.message}`);
		}
	}

	public async insertMultipleUsers(req: Request, res: Response): Promise<void> {
		const users: userData[] = req.body;

		if (!Array.isArray(users)) {
			res.status(400).json({ mensaje: "Se esperaba un array de usuarios" });
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
				const data: userData = {
					nombre,
					apellido,
					email,
					username,
					password: hashedPassword,
					avatar_url,
					rol,
				};

				return UsuarioDAO.createUser(data);
			});

			const results = await Promise.all(insertions);
			const failed = results.filter((result) => !result.isSuccess);
			const successful = results.filter((result) => result.isSuccess);
			const insertedIds = successful.map((result) => result.getValue().user_id);

			if (failed.length > 0) {
				res
					.status(400)
					.json({ mensaje: "Error en algunas inserciones", errores: failed });
			} else {
				res.status(200).json({
					mensaje: "Todos los usuarios insertados exitosamente",
					cantidad: successful.length,
					ids: insertedIds,
				});
			}
		} catch (error: any) {
			res
				.status(500)
				.json({ mensaje: `Error al crear usuarios: ${error.message}` });
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
				res.status(400).json({ mensaje: result.errorValue() });
			}
		} catch (error: any) {
			res
				.status(500)
				.json({ mensaje: `Error al obtener el usuario: ${error.message}` });
		}
	}
}

const UsuarioController = new usuarioController();
export default UsuarioController;
