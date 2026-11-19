// Referência ao elemento HTML que exibirá o resultado
const painelResultado = document.getElementById("resultado-selecao");
function mostrarResultado(texto) {
    if (!painelResultado) {
        console.error("Elemento resultado-selecao não encontrado no HTML.");
        return;
    }
    painelResultado.innerHTML = texto;
}



// -------- Configura as ferramentas de desenho do mapa -------- 
const drawnItems = new L.FeatureGroup().addTo(map); // armazena os desenhos

map.addControl(new L.Control.Draw({
    draw: {
        rectangle: { showArea: false },
        polygon: false,
        polyline: false,
        circle: false,
        marker: false,
        circlemarker: false,
    },
    edit: { featureGroup: drawnItems, edit: false, remove: false },
}));



// -------- conta os focos dentro do retângulo desenhado -------- 
map.on(L.Draw.Event.CREATED, async (evento) => {

    drawnItems.clearLayers();
    drawnItems.addLayer(evento.layer);

    // Obtém os limites geográficos do retângulo
    const b = evento.layer.getBounds();

    // Organiza as coordenadas para enviar ao backend
    const corpo = {
        south: b.getSouth(),
        north: b.getNorth(),
        west: b.getWest(),
        east: b.getEast(),
    };

    // -------- envia os limites para o backend --------
    try {
        const resposta = await fetch("/api/analysis/rectangle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corpo),
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mostrarResultado(dados.erro || "Erro ao analisar a área.");
            return;
        }


        mostrarResultado(` ${dados.total} focos selecionados.`);

    } catch (e) {
        mostrarResultado("Falha de comunicação com o servidor.");
    }
});