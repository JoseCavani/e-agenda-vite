import { IRepositorio } from "../shared/repositorio.interface";
import { Tarefa } from "./models/tarefa.model";

export interface IRepositorioTarefa extends IRepositorio<Tarefa>{

    descricaoDuplicado(descricao: string): boolean;

}