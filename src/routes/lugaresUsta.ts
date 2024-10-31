import { Router } from "express";
import LugaresController from "../controllers/lugaresControllers";

class RutasLugares {
  public router: Router;

  constructor() {
    this.router = Router();
    this.config();
  }

  public config(): void {
    this.router.get("/", LugaresController.getAllLugares);
    this.router.get("/:id", LugaresController.getLugarById);
    this.router.post("/", LugaresController.insertLugar);
    this.router.put("/:id", LugaresController.updateLugar);
    this.router.delete("/:id", LugaresController.deleteLugar);
  }
}

export default new RutasLugares().router;