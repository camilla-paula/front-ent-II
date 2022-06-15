"use strict";
const inputEmail = document.getElementById("email");
const inputSenha1 = document.getElementById("senha1");
const inputSenha2 = document.getElementById("senha2");
const botaoCadastrar = document.getElementById("btnCadastro");
const inputEmailLogin = document.getElementById("emailLogin");
const senhaLogin = document.getElementById("password");
function cadastrar() {
    if (!verificarEmail(inputEmail.value)) {
        return alert("Insira um email válido");
    }
    if (!verificarSenhas(inputSenha1.value, inputSenha2.value)) {
        return alert("Insira uma senha válida");
    }
    const novoUsuario = {
        email: inputEmail.value,
        senha: inputSenha1.value,
    };
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (usuarios.findIndex((usuario) => usuario.email === novoUsuario.email) !== -1) {
        alert(`O email ${novoUsuario.email} já possui cadastro. Faça Login na página principal`);
        location.href = "index.html";
        return;
    }
    usuarios.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert(`Conta ${inputEmail.value} cadastrada com sucesso!`);
    limparCampos();
    location.href = "index.html";
    return;
}
function verificarEmail(email) {
    if (email.length >= 5) {
        return true;
    }
    return false;
}
function verificarSenhas(senha1, senha2) {
    if (senha1 !== senha2) {
        alert("As senhas não conferem");
    }
    else if (senha1.length >= 3) {
        return true;
    }
    return false;
}
function login() {
    const usuarioLogin = {
        email: inputEmailLogin.value,
        senha: senhaLogin.value,
    };
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    if (usuarios.findIndex((usuario) => usuario.email === usuarioLogin.email) === -1) {
        alert(`O email ${usuarioLogin.email} não possui cadastro.`);
        location.href = "conta.html";
        return;
    }
    else if (usuarios.find((usuario) => usuarioLogin.email === usuario.email &&
        usuarioLogin.senha === usuario.senha)) {
        location.href = "recados.html";
        return;
    }
    alert("Email e/ou senha inválidos");
    limparCamposLogin();
    return;
}
function limparCampos() {
    inputEmail.value = "";
    inputSenha1.value = "";
    inputSenha2.value = "";
}
function limparCamposLogin() {
    inputEmailLogin.value = "";
    senhaLogin.value = "";
}
function sair() {
    location.href = "index.html";
}
const usuarioLogin = JSON.parse(localStorage.getItem("usuarios") || "");
const formulario = document.getElementById("formularioNovo");
const tabela = document.getElementById("corpoTabela");
let indice = 0;
const recuperarLocalStorage = () => {
    const listaRecados = JSON.parse(localStorage.getItem(usuarioLogin) || "[]");
    return listaRecados;
};
const atualizarLocalStorage = (listaRecados) => {
    localStorage.getItem(usuarioLogin, JSON.stringify(listaRecados));
};
const salvarRecado = (event) => {
    event.preventDeFault();
    const nome = formulario.nomeRecado.value;
    const descricao = formulario.descRecado.value;
    const listaRecados = recuperarLocalStorage();
    if (estamosEditando === true) {
        const recadoParaEditar = listaRecados[indice];
        recadoParaEditar.nome = nome;
        recadoParaEditar.descricao = descricao;
        listaRecados[indice] = recadoParaEditar;
        estamosEditando = false;
        alert("Recado editado com sucesso!");
    }
    else {
        listaRecados.push({
            id: definirID() + 1,
            nome,
            descricao,
        });
        alert("Recado adicionado com sucesso!");
    }
    atualizarLocalStorage(listaRecados);
    preencherTabela();
    formulario.reset();
};
const preencherTabela = () => {
    const listaDeRecados = recuperarLocalStorage();
    tabela.innerHTML = "";
    for (const recado of listaDeRecados) {
        tabela.innerHTML += `
          <tr>
            <td>${recado.id}</td>
            <td>${recado.nome}</td>
            <td>${recado.descricao}</td>
            <td>
              <img class="imgButton"
                src="./assets/iconeeditar.png"
                alt="imagem de anotacao"
                onclick="editarRecado(${recado.id})">
            </td>
            <td>
              <img class="imgButton"
                src="./assets/iconelixeira.png"
                alt="imagem de anotacao"
                onclick="removerRecado(${recado.id})">
            </td>
          </tr>
         `;
    }
};
const removerRecado = (id) => {
    const listaRecados = recuperarLocalStorage();
    const indiceRecado = listaRecados.findIndex((recado) => recado.id === id);
    if (indiceRecado < 0)
        return;
    listaRecados.splice(indiceRecado, 1);
    atualizarLocalStorage(listaRecados);
    alert("Recado removido com sucesso!");
    preencherTabela();
};
const editarRecado = (id) => {
    const listaRecados = recuperarLocalStorage();
    const indiceRecado = listaRecados.findIndex((recado) => recado.id === id);
    const recadoEdit = listaRecados[indiceRecado];
    formulario.nomeRecado.value = recadoEdit.nome;
    formulario.descRecado.value = recadoEdit.descricao;
    estamosEditando = true;
    indice = indiceRecado;
};
const definirID = () => {
    let max = 0;
    const listaRecados = recuperarLocalStorage();
    listaRecados.forEach((recado) => {
        if (recado.id > max) {
            max = recado.id;
        }
    });
    return max;
};
formulario.addEventListener("submit", salvarRecado);
document.addEventListener("DOMContentLoaded", preencherTabela);
