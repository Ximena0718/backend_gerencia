import pool from "../config/connection/conexion";
import { SQL_ESTABLECIMIENTOS } from "../repository/crudSQL";
import Result from "../utils/Result";

export interface Lugar {
  id_lugar: string;
  nombreEvento: string;
  direccionEvento: string;
  aforoLugarEvento: number;
}

export default class LugaresDAO {

  // Obtener todos los registros
  public static async getAllLugares(): Promise<Result<Lugar[]>> {
    try {
      const lugares = await pool.manyOrNone(SQL_ESTABLECIMIENTOS.getAllLugares);
      return Result.success(lugares);
    } catch (error: any) {
      return Result.fail(`Error al obtener los lugares: ${error.message}`);
    }
  }

  // Obtener un lugar por ID
  public static async getLugarById(id: string): Promise<Result<Lugar>> {
    try {
      const lugar = await pool.oneOrNone(SQL_ESTABLECIMIENTOS.getLugarById, [id]);
      return lugar ? Result.success(lugar) : Result.fail("Lugar no encontrado");
    } catch (error: any) {
      return Result.fail(`Error al obtener el lugar: ${error.message}`);
    }
  }

  // Insertar un nuevo lugar
  public static async insertLugar(data: Omit<Lugar, 'id_lugar'>): Promise<Result<string>> {
    try {
      const id = await pool.one(SQL_ESTABLECIMIENTOS.insertLugar, [
        data.nombreEvento,
        data.direccionEvento,
        data.aforoLugarEvento
      ]);
      return Result.success(id.id_lugar);
    } catch (error: any) {
      return Result.fail(`Error al insertar el lugar: ${error.message}`);
    }
  }

  // Actualizar un lugar existente
  public static async updateLugar(id: string, data: Omit<Lugar, 'id_lugar'>): Promise<Result<string>> {
    try {
      await pool.none(SQL_ESTABLECIMIENTOS.updateLugar, [
        data.nombreEvento,
        data.direccionEvento,
        data.aforoLugarEvento,
        id
      ]);
      return Result.success("Lugar actualizado correctamente");
    } catch (error: any) {
      return Result.fail(`Error al actualizar el lugar: ${error.message}`);
    }
  }

  // Eliminar un lugar por ID
  public static async deleteLugar(id: string): Promise<Result<string>> {
    try {
      await pool.none(SQL_ESTABLECIMIENTOS.deleteLugar, [id]);
      return Result.success("Lugar eliminado correctamente");
    } catch (error: any) {
      return Result.fail(`Error al eliminar el lugar: ${error.message}`);
    }
  }
}