
// Elemento que mostra o carregamento dos focos
const statusFocos = document.getElementById('status-focos');


// Busca os focos no backend e adiciona os marcadores ao mapa
async function carregarFocos() {

    try {
        statusFocos.textContent = 'Carregando focos do INPE...';

        // Solicita os focos ao Flask
        const resposta = await fetch('/api/focos');

        if (!resposta.ok) {
            throw new Error('Erro ao buscar os focos do INPE.');
        }

        // Recebe os dados em formato JSON
        const dados = await resposta.json();

        // Cria um marcador para cada foco recebido
        dados.focos.forEach(foco => {

            L.circleMarker(
                [foco.latitude, foco.longitude],
                {
                    radius: 4,
                    color: '#991b1b',
                    fillColor: '#ef4444',
                    fillOpacity: 0.7
                }
            ).addTo(window.map);

        });

        statusFocos.textContent =
            `${dados.total.toLocaleString('pt-BR')} focos carregados.`;

        console.log('Total de focos:', dados.total);

    } catch (erro) {

        console.error(erro);

        statusFocos.textContent = 'Não foi possível carregar os focos.';

    }
}


// Executa o carregamento dos focos
carregarFocos();
