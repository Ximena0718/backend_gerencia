import cors from "cors";
import { config } from "dotenv";
import express from "express";
import morgan from "morgan";

import seguridad from "../../middleware/Seguridad";
import rutasUsuario from "../../routes/rutasUsuario";
import rutasSinMiddleware from "../../routes/rutasSinMiddleware";
import tokenRuta from "../../routes/TokenRuta";

class Servidor {
	public app: express.Application;
	public port: String;
	public v1: string = "/api/v1/public";

	constructor() {
		this.app = express();
		config({ path: "./.env" });
		this.port = process.env.SERVER_PORT || "8082";
		this.iniciarConfig();
		this.activarRutas();
	}

	public iniciarConfig(): void {
		this.app.set("PORT", this.port);
		this.app.use(cors());
		this.app.use(morgan("dev"));
		this.app.use(express.json({ limit: "100mb" }));
		this.app.use(express.urlencoded({ extended: true }));
	}

	public activarRutas(): void {
		this.app.use(`${this.v1}/token`, tokenRuta);
		this.app.use(`${this.v1}/crearUsuarios`, rutasSinMiddleware);
		this.app.use(`${this.v1}/usuarios`, seguridad.revisar, rutasUsuario);
	}

	public arrancar(): void {
		const puerto = this.app.get("PORT");
		const servidor = this.app.listen(puerto, () => {
			console.log(`Servidor corriendo en el puerto ${puerto}`);
		});

		servidor.on("error", (error: any) => {
			if (error.code === "EADDRINUSE") {
				console.log(
					`Puerto ${puerto} está ocupado, intentando con el siguiente...`
				);
				const nuevoPuerto = parseInt(puerto) + 1;
				this.app.set("PORT", nuevoPuerto.toString());
				this.arrancar();
			}
		});
	}
}

export default Servidor;
