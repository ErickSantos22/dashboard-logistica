// ======================
// BASE DE DADOS
// ======================

const dados = [
    { id: 301, transportadora: "RotaMax", regiao: "Sudeste", prazo: 3, real: 7 },
    { id: 302, transportadora: "ViaCargo", regiao: "Sul", prazo: 5, real: 5 },
    { id: 303, transportadora: "FlashLog", regiao: "Nordeste", prazo: 4, real: 9 },
    { id: 304, transportadora: "RotaMax", regiao: "Norte", prazo: 6, real: 4 },
    { id: 305, transportadora: "ViaCargo", regiao: "Centro-Oeste", prazo: 2, real: 6 },
    { id: 306, transportadora: "FlashLog", regiao: "Sul", prazo: 5, real: 12 },
    { id: 307, transportadora: "RotaMax", regiao: "Sul", prazo: 6, real: 9 },
    { id: 308, transportadora: "ViaCargo", regiao: "Sudeste", prazo: 3, real: 4 },
    { id: 309, transportadora: "FlashLog", regiao: "Norte", prazo: 5, real: 5 },
    { id: 310, transportadora: "ViaCargo", regiao: "Nordeste", prazo: 4, real: 8 }
];

// ======================
// VARIÁVEIS
// ======================

let chartTransportadora;
let chartRegiao;
let chartRanking;
let chartTendencia;

// ======================
// INICIALIZAÇÃO
// ======================

window.onload = () => {
    carregarFiltros();
    atualizarDashboard();
};

// ======================
// FILTROS
// ======================

function carregarFiltros() {

    const filtroRegiao =
        document.getElementById("filtroRegiao");

    const filtroTransportadora =
        document.getElementById("filtroTransportadora");

    const regioes =
        [...new Set(dados.map(i => i.regiao))];

    const transportadoras =
        [...new Set(dados.map(i => i.transportadora))];

    regioes.forEach(regiao => {

        filtroRegiao.innerHTML +=
        `<option value="${regiao}">${regiao}</option>`;

    });

    transportadoras.forEach(transp => {

        filtroTransportadora.innerHTML +=
        `<option value="${transp}">${transp}</option>`;

    });

    filtroRegiao.addEventListener(
        "change",
        atualizarDashboard
    );

    filtroTransportadora.addEventListener(
        "change",
        atualizarDashboard
    );
}

// ======================
// DASHBOARD
// ======================

function atualizarDashboard() {

    const regiao =
        document.getElementById("filtroRegiao").value;

    const transportadora =
        document.getElementById("filtroTransportadora").value;

    const lista = dados.filter(item => {

        const filtroRegiao =
            regiao === "Todos" ||
            item.regiao === regiao;

        const filtroTransportadora =
            transportadora === "Todos" ||
            item.transportadora === transportadora;

        return filtroRegiao && filtroTransportadora;

    });

    atualizarKPIs(lista);
    atualizarTabela(lista);
    atualizarAlertas(lista);
    atualizarGraficos(lista);
}

// ======================
// KPIs
// ======================

function atualizarKPIs(lista) {

    const atrasadas =
        lista.filter(i => i.real > i.prazo);

    const percentual =
        lista.length > 0
        ? ((atrasadas.length / lista.length) * 100).toFixed(1)
        : 0;

    const maiorAtraso =
        atrasadas.length > 0
        ? Math.max(...atrasadas.map(i => i.real - i.prazo))
        : 0;

    document.getElementById("totalEntregas").textContent =
        lista.length;

    document.getElementById("entregasAtrasadas").textContent =
        atrasadas.length;

    document.getElementById("percentualAtraso").textContent =
        percentual + "%";

    document.getElementById("maiorAtraso").textContent =
        maiorAtraso + " dias";
}

// ======================
// ALERTAS
// ======================

function atualizarAlertas(lista) {

    const ul =
        document.getElementById("listaAlertas");

    ul.innerHTML = "";

    const atrasadas =
        lista.filter(i => i.real > i.prazo);

    if(atrasadas.length === 0){

        ul.innerHTML =
        "<li>🟢 Nenhuma entrega atrasada encontrada.</li>";

        return;
    }

    const pior =
        [...atrasadas]
        .sort(
            (a,b)=>
            (b.real-b.prazo)-
            (a.real-a.prazo)
        )[0];

    ul.innerHTML += `
        <li>
            🔴 Entrega ${pior.id}
            possui atraso de
            ${pior.real-pior.prazo} dias.
        </li>
    `;
}

// ======================
// TABELA
// ======================

function atualizarTabela(lista){

    const tbody =
        document.getElementById("tabelaAtrasos");

    tbody.innerHTML = "";

    lista
    .filter(i => i.real > i.prazo)
    .forEach(item => {

        const atraso =
            item.real - item.prazo;

        let prioridade = "Baixa";
        let classe = "prioridade-baixa";

        if(atraso >= 5){
            prioridade = "Alta";
            classe = "prioridade-alta";
        }
        else if(atraso >= 3){
            prioridade = "Média";
            classe = "prioridade-media";
        }

        tbody.innerHTML += `
        <tr>
            <td>${item.id}</td>
            <td>${item.transportadora}</td>
            <td>${item.regiao}</td>
            <td>${item.prazo}</td>
            <td>${item.real}</td>
            <td>${atraso}</td>
            <td class="${classe}">
                ${prioridade}
            </td>
        </tr>
        `;
    });
}

// ======================
// GRÁFICOS
// ======================

function atualizarGraficos(lista){

    const atrasadas =
        lista.filter(i => i.real > i.prazo);

    gerarGraficoTransportadora(atrasadas);
    gerarGraficoRegiao(atrasadas);
    gerarGraficoRanking(atrasadas);
    gerarGraficoTendencia(atrasadas);
}

function gerarGraficoTransportadora(atrasadas){

    const contagem = {};

    atrasadas.forEach(item => {

        contagem[item.transportadora] =
        (contagem[item.transportadora] || 0) + 1;

    });

    if(chartTransportadora){
        chartTransportadora.destroy();
    }

    chartTransportadora = new Chart(
        document.getElementById("graficoTransportadoras"),
        {
            type:"bar",
            data:{
                labels:Object.keys(contagem),
                datasets:[{
                    label:"Atrasos",
                    data:Object.values(contagem)
                }]
            }
        }
    );
}

function gerarGraficoRegiao(atrasadas){

    const contagem = {};

    atrasadas.forEach(item => {

        contagem[item.regiao] =
        (contagem[item.regiao] || 0) + 1;

    });

    if(chartRegiao){
        chartRegiao.destroy();
    }

    chartRegiao = new Chart(
        document.getElementById("graficoRegioes"),
        {
            type:"doughnut",
            data:{
                labels:Object.keys(contagem),
                datasets:[{
                    data:Object.values(contagem)
                }]
            }
        }
    );
}

function gerarGraficoRanking(atrasadas){

    if(chartRanking){
        chartRanking.destroy();
    }

    const ranking =
        [...atrasadas]
        .sort(
            (a,b)=>
            (b.real-b.prazo)-
            (a.real-a.prazo)
        );

    chartRanking = new Chart(
        document.getElementById("graficoRanking"),
        {
            type:"bar",
            data:{
                labels:ranking.map(i=>"Entrega "+i.id),
                datasets:[{
                    label:"Dias de atraso",
                    data:ranking.map(
                        i=>i.real-i.prazo
                    )
                }]
            },
            options:{
                indexAxis:"y"
            }
        }
    );
}

function gerarGraficoTendencia(atrasadas){

    if(chartTendencia){
        chartTendencia.destroy();
    }

    chartTendencia = new Chart(
        document.getElementById("graficoTendencia"),
        {
            type:"line",
            data:{
                labels:atrasadas.map(i=>i.id),
                datasets:[{
                    label:"Dias de atraso",
                    data:atrasadas.map(
                        i=>i.real-i.prazo
                    ),
                    tension:0.4
                }]
            }
        }
    );
}
