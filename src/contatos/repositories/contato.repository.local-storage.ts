import { IRepositorioSerializavel } from "../../shared/repositorio-serializavel.interface";
import { IRepositorioContato } from "../contato.interface";
import { Contato } from "../models/contato.model";

export class ContatoRepositoryLocalStorage implements IRepositorioContato, IRepositorioSerializavel {
    private readonly localStorage: Storage;

    private contatos: Contato[];


    constructor(){
        this.localStorage = window.localStorage;

        this.contatos = this.selecionarTodos();
    }
   public gravar(): void {
        const contatosJsonString = JSON.stringify(this.contatos);

        this.localStorage.setItem("contatos",contatosJsonString);
    }

   public inserir(registro: Contato): void {
        this.contatos.push(registro);
        this.gravar();
    }

    public editar(id: string, registroEditado: Contato): void {
        
        const indexSelecionado = this.contatos.findIndex(x => x.id === id);

        this.contatos[indexSelecionado] = {
            id: id,
            nome: registroEditado.nome,
            telefone: registroEditado.telefone,
            empresa: registroEditado.empresa,
            cargo: registroEditado.cargo,
            email: registroEditado.email
        }

        this.gravar();

    }


    public excluir(id: string): void{
        this.contatos = this.contatos.filter(x => x.id !== id);

        
        this.gravar();
    }

    public selecionarTodos(): Contato[] {
        const dados = this.localStorage.getItem("contatos")

        if(!dados)
        return[];

        return JSON.parse(dados);
    }

    public selecionarPorId(id: string): Contato | undefined {
        return this.contatos.find(x => x.id === id);
    }

    public nomeDuplicado(nome: string): boolean{
         if(this.contatos.find(x => x.nome === nome) != undefined)
         return true;
         return false;
    }

    public emailDuplicado(email: string): boolean{
        if(this.contatos.find(x => x.email === email) != undefined)
        return true;
        return false;
   }

   public telefoneDuplicado(telefone: string): boolean{
    if(this.contatos.find(x => x.telefone === telefone) != undefined)
    return true;
    return false;
}

}