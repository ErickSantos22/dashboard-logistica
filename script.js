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
    configurarMenu();

    const conteudo =
        document.getElementById("conteudoPrincipal");

    setTimeout(() => {

        conteudo.classList.remove("mini");
        conteudo.classList.add("zoomed");

    }, 300);

};

// ======================
// MENU LATERAL
// ======================

function configurarMenu(){

    const links =
        document.querySelectorAll(".sidebar li");

    links.forEach(item => {

        item.addEventListener("click", () => {

            links.forEach(i =>
                i.classList.remove("active")
            );

            item.classList.add("active");

        });

    });

    const dashboardLink =
        document.querySelector(
            '.sidebar a[href="#dashboard"]'
        );

    dashboardLink.addEventListener(
        "click",
        efeitoPowerPoint
    );
}

// ======================
// EFEITO POWERPOINT
// ======================

function efeitoPowerPoint(){

    const conteudo =
        document.getElementById("conteudoPrincipal");

    conteudo.classList.remove("zoomed");

    conteudo.classList.add("mini");

    setTimeout(() => {

        conteudo.classList.remove("mini");

        conteudo.classList.add("zoomed");

    }, 200);

}

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
        [...new Set(
            dados.map(i => i.transportadora)
        )];

    regioes.forEach(regiao => {

        filtroRegiao.innerHTML +=
            `<option value="${regiao}">
            ${regiao}
            </option>`;

    });

    transportadoras.forEach(transp => {

        filtroTransportadora.innerHTML +=
            `<option value="${transp}">
            ${transp}
            </option>`;

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
        document.getElementById(
            "filtroRegiao"
        ).value;

    const transportadora =
        document.getElementById(
            "filtroTransportadora"
        ).value;

    const lista =
        dados.filter(item => {

            const filtroRegiao =
                regiao === "Todos" ||
                item.regiao === regiao;

            const filtroTransportadora =
                transportadora === "Todos" ||
                item.transportadora === transportadora;

            return (
                filtroRegiao &&
                filtroTransportadora
            );

        });

    atualizarKPIs(lista);
    atualizarTabela(lista);
    atualizarAlertas(lista);
    atualizarGraficos(lista);

}

// ======================
// KPIs
// ======================

function atualizarKPIs(lista){

    const atrasadas =
        lista.filter(
            i => i.real > i.prazo
        );

    const percentual =
        lista.length > 0
        ? (
            atrasadas.length /
            lista.length * 100
        ).toFixed(1)
        : 0;

    const maiorAtraso =
        atrasadas.length > 0
        ? Math.max(
            ...atrasadas.map(
                i => i.real - i.prazo
            )
        )
        : 0;

    totalEntregas.textContent =
        lista.length;

    entregasAtrasadas.textContent =
        atrasadas.length;

    percentualAtraso.textContent =
        percentual + "%";

    maiorAtraso.textContent =
        maiorAtraso + " dias";
}

// ======================
// ALERTAS
// ======================

function atualizarAlertas(lista){

    const ul =
        document.getElementById(
            "listaAlertas"
        );

    ul.innerHTML = "";

    const atrasadas =
        lista.filter(
            i => i.real > i.prazo
        );

    if(atrasadas.length === 0){

        ul.innerHTML =
        "<li>🟢 Nenhum atraso encontrado.</li>";

        return;
    }

    atrasadas
    .sort(
        (a,b)=>
        (b.real-b.prazo)-
        (a.real-a.prazo)
    )
    .slice(0,3)
    .forEach(item => {

        ul.innerHTML += `
            <li>
            🔴 Entrega ${item.id}
            com atraso de
            ${item.real-item.prazo}
            dias.
            </li>
        `;

    });

}

// ======================
// TABELA
// ======================

function atualizarTabela(lista){

    const tbody =
        document.getElementById(
            "tabelaAtrasos"
        );

    tbody.innerHTML = "";

    lista
    .filter(i => i.real > i.prazo)
    .forEach(item => {

        const atraso =
            item.real - item.prazo;

        let prioridade =
            "Baixa";

        let classe =
            "prioridade-baixa";

        if(atraso >= 5){

            prioridade = "Alta";
            classe =
            "prioridade-alta";

        }
        else if(atraso >= 3){

            prioridade = "Média";
            classe =
            "prioridade-media";

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
        lista.filter(
            i => i.real > i.prazo
        );

    gerarGraficoTransportadora(
        atrasadas
    );

    gerarGraficoRegiao(
        atrasadas
    );

    gerarGraficoRanking(
        atrasadas
    );

    gerarGraficoTendencia(
        atrasadas
    );

}

const azul = "#38bdf8";
const azulEscuro = "#1e40af";

// ======================

function gerarGraficoTransportadora(atrasadas){

    const contagem = {};

    atrasadas.forEach(item => {

        contagem[item.transportadora] =
            (contagem[item.transportadora] || 0) + 1;

    });

    if(chartTransportadora)
        chartTransportadora.destroy();

    chartTransportadora =
    new Chart(
        document.getElementById(
            "graficoTransportadoras"
        ),
        {
            type:"bar",
            data:{
                labels:Object.keys(contagem),
                datasets:[{
                    label:"Atrasos",
                    data:Object.values(contagem),
                    backgroundColor:azul
                }]
            }
        }
    );

}

// ======================

function gerarGraficoRegiao(atrasadas){

    const contagem = {};

    atrasadas.forEach(item => {

        contagem[item.regiao] =
            (contagem[item.regiao] || 0) + 1;

    });

    if(chartRegiao)
        chartRegiao.destroy();

    chartRegiao =
    new Chart(
        document.getElementById(
            "graficoRegioes"
        ),
        {
            type:"doughnut",
            data:{
                labels:Object.keys(contagem),
                datasets:[{
                    data:Object.values(contagem),
                    backgroundColor:[
                        "#38bdf8",
                        "#60a5fa",
                        "#2563eb",
                        "#1d4ed8",
                        "#0ea5e9"
                    ]
                }]
            }
        }
    );

}

// ======================

function gerarGraficoRanking(atrasadas){

    if(chartRanking)
        chartRanking.destroy();

    const ranking =
        [...atrasadas].sort(
            (a,b)=>
            (b.real-b.prazo)-
            (a.real-a.prazo)
        );

    chartRanking =
    new Chart(
        document.getElementById(
            "graficoRanking"
        ),
        {
            type:"bar",
            data:{
                labels:
                    ranking.map(
                        i=>"Entrega "+i.id
                    ),
                datasets:[{
                    label:"Dias",
                    data:
                        ranking.map(
                            i=>i.real-i.prazo
                        ),
                    backgroundColor:
                        azulEscuro
                }]
            },
            options:{
                indexAxis:"y"
            }
        }
    );

}

// ======================

function gerarGraficoTendencia(atrasadas){

    if(chartTendencia)
        chartTendencia.destroy();

    chartTendencia =
    new Chart(
        document.getElementById(
            "graficoTendencia"
        ),
        {
            type:"line",
            data:{
                labels:
                    atrasadas.map(
                        i=>i.id
                    ),
                datasets:[{
                    label:"Dias",
                    data:
                        atrasadas.map(
                            i=>i.real-i.prazo
                        ),
                    borderColor:azul,
                    tension:0.4
                }]
            }
        }
    );

}
