import re
import requests
from pathlib import Path
import pandas as pd


# URL do INPE para obter CSVs de focos de calor
URL_INPE = "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/diario/Brasil/"

# Pasta onde o CSV será salvo
PASTA_DADOS = Path(__file__).resolve().parent.parent / "data"

# Guarda os focos já carregados
focos_cache = None


def obter_focos():
    global focos_cache

    # Se os dados já foram carregados, reutiliza
    if focos_cache is not None:
        return focos_cache

    # Cria a pasta de dados, caso não exista
    PASTA_DADOS.mkdir(parents=True, exist_ok=True)



    # --- Baixa o CSV do INPE ---

    # Acessa a URL do INPE
    resposta = requests.get(URL_INPE, timeout=30)
    resposta.raise_for_status() #verifica se deu algum erro

    # Busca os nomes dos arquivos CSV e coloca em uma lista
    arquivos = re.findall(
        r"focos_diario_br_\d{8}\.csv",
        resposta.text
    )

    if not arquivos:
        raise RuntimeError("Nenhum arquivo CSV foi encontrado.")

    # Seleciona o arquivo mais recente
    nome_arquivo = max(arquivos)

    # Baixa o arquivo selecionado
    resposta = requests.get(
        URL_INPE + nome_arquivo,
        timeout=120
    )
    resposta.raise_for_status()  #verifica se deu algum erro

    # Salva o CSV na pasta do projeto
    caminho_csv = PASTA_DADOS / nome_arquivo
    caminho_csv.write_bytes(resposta.content)



    # --- ler o CSV e processar os dados ---

    # Lê os dados utilizando Pandas
    df = pd.read_csv(caminho_csv)

    # Padroniza os nomes das colunas
    df.columns = df.columns.str.strip().str.lower()

    # Padroniza possíveis nomes alternativos
    df = df.rename(columns={
        "lat": "latitude",
        "lon": "longitude"
    })

    # Separa somente latitude e longitude
    focos = df[["latitude", "longitude"]].copy()

    # Garante que as coordenadas sejam numéricas
    focos["latitude"] = pd.to_numeric(
        focos["latitude"],
        errors="coerce"
    )

    focos["longitude"] = pd.to_numeric(
        focos["longitude"],
        errors="coerce"
    )

    # Remove coordenadas inválidas
    focos = focos.dropna()

    focos = focos[
        focos["latitude"].between(-90, 90)
        & focos["longitude"].between(-180, 180)
    ]

    # Guarda os dados para reutilização
    focos_cache = focos.reset_index(drop=True)

    return focos_cache