import { IPaginaFormulario } from "../shared/pagina.create.interface";
import { IPaginaHTML } from "../shared/pagina.interface";
import { IRepositorioContato } from "./contato.interface";
import { Contato} from "./models/contato.model";
import { ContatoRepositoryLocalStorage } from "./repositories/contato.repository.local-storage";

class ContatoPaginaCadastro implements IPaginaHTML, IPaginaFormulario{

    private txtNome: HTMLInputElement;
    private txtEmail: HTMLInputElement;
    private txtTelefone: HTMLInputElement;
    private txtEmpresa: HTMLInputElement;
    private txtCargo: HTMLInputElement;
    private btnSalvar: HTMLButtonElement;

    private idSelecionado: string;


    constructor(private repositorioContatos: IRepositorioContato, id?: string) {
        this.configurarElementos();

        if(id){
            this.idSelecionado = id;

            const contatoSelecionada = this.repositorioContatos.selecionarPorId(id);

             if(contatoSelecionada)
             this.preencherFormulario(contatoSelecionada);
        }
    }


    private preencherFormulario(contatoSelecionada: Contato){
        this.txtNome.value = contatoSelecionada.nome;
        this.txtCargo.value = contatoSelecionada.cargo!;
        this.txtEmpresa.value = contatoSelecionada.empresa!;
        this.txtEmail.value = contatoSelecionada.email;
        this.txtTelefone.value = contatoSelecionada.telefone;
    }



    configurarElementos(): void {

        this.txtNome = document.getElementById("txtNome") as HTMLInputElement;
        this.txtCargo = document.getElementById("txtCargo") as HTMLInputElement;
        this.txtEmpresa = document.getElementById("txtEmpresa") as HTMLInputElement;
        this.txtEmail = document.getElementById("txtEmail") as HTMLInputElement;
        this.txtTelefone = document.getElementById("txtTelefone") as HTMLInputElement;
        this.btnSalvar = document.getElementById("btnSalvar") as HTMLButtonElement;
    
        this.btnSalvar.addEventListener("click",(_evt) => this.gravarRegistro())
    }

    gravarRegistro(): void {

     const contato = this.obterDadosFormulario();


     if(!this.VerificarCampos(contato))
     return;

        if (!this.idSelecionado)
        this.repositorioContatos.inserir(contato);
        else
        this.repositorioContatos.editar(contato.id,contato)

        
        window.location.href = "contato.list.html";
   
    }


    private VerificarCampos(contato : Contato) : boolean {
     
        const regexEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

        const regexTelefone = new RegExp(/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/);

        if(!regexEmail.test(contato.email)){
            alert("email invalido");
        return false;
        }

        if(!regexTelefone.test(contato.telefone)){
            alert("telefone invalido");
        return false;
        }

        if(!contato.nome){
        alert("nome necessario");
        return false;
        }

        if(!contato.email){
            alert("email necessario");
            return false;
            }

            if(!contato.telefone){
                alert("telefone necessario");
                return false;
                }

        if(this.repositorioContatos.nomeDuplicado(contato.nome)){
            alert("nome ja existe");
            return false;
            }

            if(this.repositorioContatos.emailDuplicado(contato.email)){
                alert("email ja existe");
                return false;
                }
                if(this.repositorioContatos.telefoneDuplicado(contato.telefone)){
                    alert("telefone ja existe");
                    return false;
                    }




        return true;
    }

    private obterDadosFormulario(): Contato{


        const nome = this.txtNome.value;
        const cargo = this.txtCargo.value;
        const empresa = this.txtEmpresa.value;
        const telefone = this.txtTelefone.value;
        const email = this.txtEmail.value;

        let contato = null;

        if(!this.idSelecionado)
        contato = new Contato(nome,email,telefone,empresa,cargo)
        else
        contato = new Contato(nome,email,telefone,empresa,cargo,this.idSelecionado)

        return contato;
    }

}

const params  = new URLSearchParams(window.location.search);

const id = params.get("id") as string;


new ContatoPaginaCadastro(new ContatoRepositoryLocalStorage(), id);

