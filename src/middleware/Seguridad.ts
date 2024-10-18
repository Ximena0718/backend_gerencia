import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";

config({ path: "./.env" });

class Seguridad {
	public revisar(req: Request, res: Response, next: NextFunction) {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			return res
				.status(401)
				.json({ Respuesta: "Falta el token de autorización" });
		}

		const [bearer, token] = authHeader.split(" ");
		if (bearer !== "Bearer" || !token) {
			return res
				.status(401)
				.json({ Respuesta: "Formato del token incorrecto" });
		}

		try {
			const secretKey = process.env.JWT_SECRET_KEY || "LaSuperClave";
			const decoded = jwt.verify(token, secretKey);
			(req as any).user = decoded;
			next();
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				return res.status(401).json({ Respuesta: "El token ha expirado" });
			} else if (error instanceof jwt.JsonWebTokenError) {
				return res.status(401).json({ Respuesta: "El token no es válido" });
			} else {
				return res
					.status(500)
					.json({ Respuesta: "Error al procesar el token" });
			}
		}
	}

	public checkRole(rolesPermitidos: string[]) {
		return (req: Request, res: Response, next: NextFunction) => {
			const user = (req as any).user;
			if (!user || !rolesPermitidos.includes(user.rol)) {
				return res
					.status(403)
					.json({ Respuesta: "No tienes los permisos necesarios" });
			}
			next();
		};
	}
}

const seguridad = new Seguridad();
export default seguridad;
