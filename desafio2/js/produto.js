const KEY_BD = '@produtosestudo'


var listaRegistros = {
    ultimoIdGerado:0,
    produtos:[]
}


var FILTRO = ''


function gravarBD(){
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros) )
}

function lerBD(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        listaRegistros = JSON.parse(data)
    }
    desenhar()
}


function pesquisar(value){
    FILTRO = value;
    desenhar()
}


function desenhar(){
    const tbody = document.getElementById('listaRegistrosBody')
    if(tbody){
        var data = listaRegistros.produto;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( produto => {
                return expReg.test( produto.nome ) || expReg.test( produto.codico )
                || expReg.test( produto.descricao ) || expReg.test( produto.preco )
               
            } )
        }
        data = data
            .sort( (a, b) => {
                return a.nome < b.nome ? -1 : 1
            })
            .map( produto => {
                return `<tr>
                        <td>${produto.id}</td>
                        <td>${produto.nome}</td>
                        <td>${produto.codico}</td>
                        <td>${produto.descricao}</td>
                        <td>${produto.preco}</td>
                        <td>
                            <button onclick='vizualizar("cadastro",false,${produto.id})'>Editar</button>
                            <button class='vermelho' onclick='perguntarSeDeleta(${produto.id})'>Deletar</button>
                        </td>
                    </tr>`
            } )
        tbody.innerHTML = data.join('')
    }
}

function insertProduto(nome, codico, descricao, preco){
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.produtos.push({
        id, nome, codico, descricao, preco, 
    })
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function editUsuario(id, nome, codico, descricao, preco){
    var produto = listaRegistros.usuarios.find( produto => produto.id == id )
    produto.nome = nome;
    produto.codico = codico;
    produto.descricao = descricao;
    produto.preco = preco;

    gravarBD()
    desenhar()
    vizualizar('lista')
}

function deleteProduto(id){
    listaRegistros.produtos = listaRegistros.produtos.filter( usuario => {
        return produto.id != id
    } )
    gravarBD()
    desenhar()
}

function perguntarSeDeleta(id){
    if(confirm('Quer deletar o registro de id '+id)){
        deleteUsuario(id)
    }
}


function limparEdicao(){
    document.getElementById('nome').value = ''
    document.getElementById('codico').value = ''
    document.getElementById('descricao').value = ''
    document.getElementById('preco').value = ''
   
}

function vizualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const usuario = listaRegistros.usuarios.find( produto => produto.id == id )
            if(usuario){
                document.getElementById('id').value = produto.id
                document.getElementById('nome').value = produto.nome
                document.getElementById('codico').value = produto.codico
                document.getElementById('descricao').value = produto.descricao
                document.getElementById('preco').value = produto.preco

            }
        }
        document.getElementById('nome').focus()
        document.getElementById('codico').focus()
        document.getElementById('descricao').focus()
        document.getElementById('preco').focus()
       
    }
}



function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        nome: document.getElementById('nome').value,
        codico: document.getElementById('codico').value,
        descricao: document.getElementById('descricao').value,
        preco: document.getElementById('preco').value,

    }
    if(data.id){
        editUsuario( data.id, data.nome, data.codico, data.descricao, data.preco )
    }else{
        insertUsuario( data.id, data.nome, data.codico, data.descricao, data.preco )
    }
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })

})