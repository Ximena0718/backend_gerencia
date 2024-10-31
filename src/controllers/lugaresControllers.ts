import { Request, Response } from "express";
import LugaresDAO from "../dao/lugaresDAOS";

class LugaresController {

  // Obtener todos los lugares
  public async getAllLugares(req: Request, res: Response): Promise<void> {
    const result = await LugaresDAO.getAllLugares();
    if (result.isSuccess) {
      res.status(200).json(result.getValue());
    } else {
      res.status(500).json({ mensaje: result.errorValue() });
    }
  }

  // Obtener un lugar por ID
  public async getLugarById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await LugaresDAO.getLugarById(id);
    if (result.isSuccess) {
      res.status(200).json(result.getValue());
    } else {
      res.status(404).json({ mensaje: result.errorValue() });
    }
  }

  // Insertar un nuevo lugar
  public async insertLugar(req: Request, res: Response): Promise<void> {
    const { nombreEvento, direccionEvento, aforoLugarEvento } = req.body;
    const result = await LugaresDAO.insertLugar({ nombreEvento, direccionEvento, aforoLugarEvento });
    if (result.isSuccess) {
      res.status(201).json({ id: result.getValue() });
    } else {
      res.status(500).json({ mensaje: result.errorValue() });
    }
  }

  // Actualizar un lugar existente
  public async updateLugar(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { nombreEvento, direccionEvento, aforoLugarEvento } = req.body;
    const result = await LugaresDAO.updateLugar(id, { nombreEvento, direccionEvento, aforoLugarEvento });
    if (result.isSuccess) {
      res.status(200).json({ mensaje: result.getValue() });
    } else {
      res.status(500).json({ mensaje: result.errorValue() });
    }
  }

  // Eliminar un lugar por ID
  public async deleteLugar(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await LugaresDAO.deleteLugar(id);
    if (result.isSuccess) {
      res.status(200).json({ mensaje: result.getValue() });
    } else {
      res.status(500).json({ mensaje: result.errorValue() });
    }
  }
}

export default new LugaresController();
