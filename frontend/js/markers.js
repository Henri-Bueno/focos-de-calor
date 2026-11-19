// Elemento que mostra o carregamento dos focos
const statusFocos = document.getElementById('status-focos');





// Busca os focos no backend e adiciona os marcadores ao mapa
async function carregarFocos() {

    try {

        // Solicita os focos ao Flask
        const resposta = await fetch('/api/focos');

        if (!resposta.ok) {
            throw new Error('Erro ao buscar os focos do INPE.');
        }

        const dados = await resposta.json();

        // Cria um marcador para cada foco recebido
        dados.focos.forEach(foco => {

            L.circleMarker( // o leaflet recebe latitude e longitude e encontra o ponto exato no mapa
                [foco.latitude, foco.longitude],
                {
                    radius: 4,
                    color: '#991b1b',
                    fillColor: '#ef4444',
                    fillOpacity: 0.7
                }
            ).addTo(window.map);
        });

        //exibe numeros de focos totais
        statusFocos.textContent = `${dados.total.toLocaleString('pt-BR')} focos carregados.`;

    } catch (erro) {

        console.error(erro);
        statusFocos.textContent = 'Não foi possível carregar os focos.';

    }
}


// Executa o carregamento
carregarFocos();
