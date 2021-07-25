const KEY_BD = '@usuariosestudo'


var listaRegistros = {
    ultimoIdGerado:0,
    usuarios:[]
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
        var data = listaRegistros.usuarios;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( usuario => {
                return expReg.test( usuario.nome ) || expReg.test( usuario.email )
                || expReg.test( usuario.telefone ) || expReg.test( usuario.rua )
                || expReg.test( usuario.uf )       || expReg.test( usuario.numero )
                || expReg.test( usuario.cep )
            } )
        }
        data = data
            .sort( (a, b) => {
                return a.nome < b.nome ? -1 : 1
            })
            .map( usuario => {
                return `<tr>
                        <td>${usuario.id}</td>
                        <td>${usuario.nome}</td>
                        <td>${usuario.email}</td>
                        <td>${usuario.telefone}</td>
                        <td>${usuario.rua}</td>
                        <td>${usuario.uf}</td>
                        <td>${usuario.numero}</td>
                        <td>${usuario.cep}</td>
                        <td>
                            <button onclick='vizualizar("cadastro",false,${usuario.id})'>Editar</button>
                            <button class='vermelho' onclick='perguntarSeDeleta(${usuario.id})'>Deletar</button>
                        </td>
                    </tr>`
            } )
        tbody.innerHTML = data.join('')
    }
}

function insertUsuario(nome, email, telefone, rua, uf, numero, cep){
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.usuarios.push({
        id, nome, email, telefone, rua, uf, numero, cep
    })
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function editUsuario(id, nome, fone){
    var usuario = listaRegistros.usuarios.find( usuario => usuario.id == id )
    usuario.nome = nome;
    usuario.email = email;
    usuario.telefone = telefone;
    usuario.rua = rua;
    usuario.uf = uf;
    usuario.numero = numero;
    usuario.cep = cep;

    gravarBD()
    desenhar()
    vizualizar('lista')
}

function deleteUsuario(id){
    listaRegistros.usuarios = listaRegistros.usuarios.filter( usuario => {
        return usuario.id != id
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
    document.getElementById('email').value = ''
    document.getElementById('telefone').value = ''
    document.getElementById('rua').value = ''
    document.getElementById('uf').value = ''
    document.getElementById('numero').value = ''
    document.getElementById('cep').value = ''
}

function vizualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const usuario = listaRegistros.usuarios.find( usuario => usuario.id == id )
            if(usuario){
                document.getElementById('id').value = usuario.id
                document.getElementById('nome').value = usuario.nome
                document.getElementById('email').value = usuario.email
                document.getElementById('telefone').value = usuario.telefone
                document.getElementById('rua').value = usuario.rua
                document.getElementById('uf').value = usuario.uf
                document.getElementById('numero').value = usuario.numero
                document.getElementById('cep').value = usuario.cep
            }
        }
        document.getElementById('nome').focus()
        document.getElementById('email').focus()
        document.getElementById('telefone').focus()
        document.getElementById('rua').focus()
        document.getElementById('uf').focus()
        document.getElementById('numero').focus()
        document.getElementById('cep').focus()
    }
}



function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        rua: document.getElementById('rua').value,
        uf: document.getElementById('uf').value,
        numero: document.getElementById('numero').value,
        cep: document.getElementById('cep').value,



    }
    if(data.id){
        editUsuario(data.id, data.nome, data.email, data.telefone, data.rua, data.uf, data.numero, data.cep)
    }else{
        insertUsuario( data.nome, data.email, data.telefone, data.rua, data.uf, data.numero, data.cep)
    }
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })

})