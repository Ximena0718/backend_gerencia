import { Router } from "express";
import DbController from "../controllers/dbController";

class RutasBD {
  public rutas: Router;

  constructor() {
    this.rutas = Router();
    this.lasRutas();
  }

  public lasRutas(): void {
		// /api/v1/public/db
		this.rutas.delete("/create", DbController.createTables);
		this.rutas.delete("/drop", DbController.dropTables);
		this.rutas.delete("/truncate", DbController.truncateTables);
	}
}

const rutasBD = new RutasBD();
export default rutasBD.rutas;