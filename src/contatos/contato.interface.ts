import { IRepositorio } from "../shared/repositorio.interface";
import { Contato } from "./models/contato.model";

export interface IRepositorioContato extends IRepositorio<Contato>{
    
     telefoneDuplicado(telefone: string): boolean;

     emailDuplicado(email: string): boolean;

     nomeDuplicado(nome: string): boolean;

}