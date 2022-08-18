import { IPaginaFormulario } from "../shared/pagina.create.interface";
import { IPaginaHTML } from "../shared/pagina.interface";
import { Prioridade } from "./models/prioridade.enum";
import { IRepositorioTarefa } from "./tarefa.interface";
import { TarefaRepositoryLocalStorage } from "./repositories/tarefa.repository.local-storage";
import { Tarefa } from "./models/tarefa.model";

class TarefaPaginaCadastro implements IPaginaHTML, IPaginaFormulario{

    private txtDescricao: HTMLInputElement
    private rdbPrioridade: HTMLInputElement;
    private btnSalvar: HTMLButtonElement;

    private idSelecionado: string;


    constructor(private repositorioTarefas: IRepositorioTarefa, id?: string) {
        this.configurarElementos();

        if(id){
            this.idSelecionado = id;

            const tarefaSelecionada = this.repositorioTarefas.selecionarPorId(id);

             if(tarefaSelecionada)
             this.preencherFormulario(tarefaSelecionada);
        }
    }


    private preencherFormulario(tarefaSelecionada: Tarefa){
        this.txtDescricao.value = tarefaSelecionada.descricao;

        switch(tarefaSelecionada.prioridade){
        case Prioridade.Baixa:
            this.rdbPrioridade = document.querySelector("input[value='Baixa']") as HTMLInputElement
            break;

            case Prioridade.Media:
                this.rdbPrioridade = document.querySelector("input[value='Média']") as HTMLInputElement
                break;
            case Prioridade.Baixa:
                this.rdbPrioridade = document.querySelector("input[value='Alta']") as HTMLInputElement
                 break;
        }

        this.rdbPrioridade.checked = true;
    }



    configurarElementos(): void {

        this.txtDescricao = document.getElementById("txtDescricao") as HTMLInputElement;
        this.btnSalvar = document.getElementById("btnSalvar") as HTMLButtonElement;
    
        this.btnSalvar.addEventListener("click",(_evt) => this.gravarRegistro())
    }

    gravarRegistro(): void {


      

     const tarefa = this.obterDadosFormulario();
     

     if(!this.VerificarCampos(tarefa))
     return;

        if (!this.idSelecionado)
        this.repositorioTarefas.inserir(tarefa);
        else
        this.repositorioTarefas.editar(tarefa.id,tarefa)

        
        window.location.href = "tarefa.list.html";
   
    }


    VerificarCampos(tarefa: Tarefa): boolean {
        if(this.repositorioTarefas.descricaoDuplicado(tarefa.descricao)){
            alert("descricao duplicada")
            return false
        }

        if (!tarefa.descricao){
            alert("descricao vazia")
            return false
        }

        return true;
    }


    
    private obterDadosFormulario(): Tarefa{
        const descricao = this.txtDescricao.value;
        const prioridade = this.obterPrioridadeSelecionada();

        let tarefa = null;

        if(!this.idSelecionado)
        tarefa = new Tarefa(descricao,prioridade)
        else
        tarefa = new Tarefa(descricao,prioridade,this.idSelecionado)

        return tarefa;
    }

    private obterPrioridadeSelecionada(): Prioridade{
        const rdbPrioridade = document.querySelector("input[type='radio']:checked")  as HTMLInputElement; 

        return rdbPrioridade.value as Prioridade
    }

}

const params  = new URLSearchParams(window.location.search);

const id = params.get("id") as string;


new TarefaPaginaCadastro(new TarefaRepositoryLocalStorage(), id);