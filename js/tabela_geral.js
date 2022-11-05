let fii_user = [];
let fii_table = [];

async function carregarDadosUser(url) {
    await fetch(url)
        .then(resp => resp.json())
        .then(json => fii_user = json);
    carregarDadosFundos();
}

async function carregarDadosFundos() {

    for (let fii of fii_user) {
        let json = await fetch(`https://api-simple-flask.herokuapp.com/api/${fii.nome}`)
            .then(resp => resp.json());
        fii_table.push(json);
        console.log(fii_table[0].fundo)
    }
    exibirTabela();
}

carregarDadosUser("json/fii.json");

function exibirTabela() {
    let SomaCotas = 0 
    let SomaInvestimento = 0
    let SomaProvento = 0
    let i = 0;
    let saida = "<table>"
    let cor = 0.60
    for (i = 0; i < 14; i++) {

        if(((fii_table[i].ultimoRendimento.rendimento*100) / fii_table[i].valorAtual) <= cor || ((fii_table[i].proximoRendimento.rendimento*100) / fii_table[i].valorAtual) <= cor){
            saida += `<tr class='negativo'>`
        }else {
            saida += `<tr class='positivo'>`
        }
        
        saida += `<th> ${fii_table[i].fundo} </th>`
        saida += `<th> ${fii_table[i].setor} </th>`

        if (fii_table[i].proximoRendimento.dataBase == "-") {
            saida += `<th>${fii_table[i].ultimoRendimento.dataBase}</th>`
        } else {
            saida += `<th>${fii_table[i].proximoRendimento.dataBase}</th>`
        }

        if (fii_table[i].proximoRendimento.dataPag == "-") {
            saida += `<th>${fii_table[i].ultimoRendimento.dataPag}</th>`
        } else {
            saida += `<th>${fii_table[i].proximoRendimento.dataPag}</th>`
        }

        if(fii_table[i].proximoRendimento.rendimento == "-" ){
            saida += `<th>R$${fii_table[i].ultimoRendimento.rendimento}</th>`
            SomaProvento += (fii_table[i].ultimoRendimento.rendimento* fii_user[i].qtde)
        }else{
            saida += `<th>R$${fii_table[i].proximoRendimento.rendimento}</th>`
            SomaProvento += (fii_table[i].ultimoRendimento.rendimento * fii_user[i].qtde)
        }

        saida += `<th>R$${fii_table[i].valorAtual}</th>`
        saida += `<th>${fii_user[i].qtde}</th>`
        SomaCotas += fii_user[i].qtde
        
        saida += `<th>R$${fii_user[i].totalgasto}</th>`
        SomaInvestimento += fii_user[i].totalgasto

        saida += `<th>R$${(fii_user[i].totalgasto / fii_user[i].qtde).toFixed(2)}</th>`

        if(fii_table[i].proximoRendimento.rendimento == "-"){
            saida += `<th>${((fii_table[i].ultimoRendimento.rendimento*100) / fii_table[i].valorAtual).toFixed(2)}%</th>`
        }else{
            saida += `<th>${((fii_table[i].proximoRendimento.rendimento*100) / fii_table[i].valorAtual).toFixed(2)}%</th>`
        }

        saida += `<th>${fii_table[i].dividendYield}%</th>`
        saida += `<th>R$ ${fii_table[i].rendimentoMedio24M.toFixed(2)}</th>`
        saida += `</tr>`
    }
    
    saida += `<tr class='fundo_total'>`
    saida += `<th><th>`
    saida += `<th>Total Geral<th>`
    saida += `<th>R$${(SomaProvento).toFixed(2)}<th>`
    saida += `<th>${SomaCotas}<th><span>R$${SomaInvestimento.toFixed(2)}</span>`
    saida += `<th><th>`
    saida += `<th><th>`
    saida += `</tr>`

    saida += "</table>"

    document.getElementById("tabela").innerHTML = saida

    console.log(saida)
    console.log(SomaProvento)

    /* Implemente aqui os cálculos solicitados no PDF,
    os cálculos devem ter como base, uma repetição no vetor fii_user
    e para cada fundo, consulte suas demais informações no vetor fii_table

    DICA para procurar um fundo do vetor fii_user no vetor fii_table
    let dados_fii = fii_table.find( (item) => item.fundo.indexOf(fii.nome.toUpperCase()) >= 0);

    Dentro da repetição, após os cálculos, monte a linha na tabela com o comando

    document.querySelector("table").innerHTML += variável

    Note que o cabeçalho da tabela já está pronto no HTML.
    Fora do for, adicione na tabela a linha final de total conforme exemplo no PDF.
    */
}