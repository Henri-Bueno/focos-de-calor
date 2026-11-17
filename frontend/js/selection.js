const drawnItems = new L.FeatureGroup().addTo(map);

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

// Painel de resultado
const painel = L.control({ position: "bottomleft" });
painel.onAdd = function () {
    this._div = L.DomUtil.create("div", "painel-resultado");
    this._div.innerHTML = "Desenhe um retângulo para contar os focos.";
    return this._div;
};
painel.addTo(map);

function mostrarResultado(texto) {
    painel._div.innerHTML = texto;
}

map.on(L.Draw.Event.CREATED, async (evento) => {
    drawnItems.clearLayers();                 // mantém só uma seleção
    drawnItems.addLayer(evento.layer);

    const b = evento.layer.getBounds();
    const corpo = {
        south: b.getSouth(),
        north: b.getNorth(),
        west: b.getWest(),
        east: b.getEast(),
    };

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
        mostrarResultado(`Focos na área selecionada: <strong>${dados.total}</strong>`);
    } catch (e) {
        mostrarResultado("Falha de comunicação com o servidor.");
    }
});