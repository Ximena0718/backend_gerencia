import { Router } from "express";

import TokenController from "../controllers/tokenController";

class TokenRuta {
	public rutas: Router;

	constructor() {
		this.rutas = Router();
		this.lasRutas();
	}

	public lasRutas(): void {
		// /api/v1/public/token
		this.rutas.post("/", TokenController.createToken);
	}
}
const tokenRuta = new TokenRuta();
export default tokenRuta.rutas;
