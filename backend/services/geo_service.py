import geopandas as gpd
from shapely.geometry import box
from services.inpe_service import obter_focos


def contar_focos_no_retangulo(west, south, east, north):
    focos = obter_focos() # recupera os focos

    if focos is None or focos.empty:
        return 0

    # Shapely usa (lonMin, latMin, lonMax, latMax)
    poligono = box(west, south, east, north)

      # --- Conversão das coordenadas em pontos geográficos ---
    pontos = gpd.GeoDataFrame(
        focos,
        geometry=gpd.points_from_xy(focos["longitude"], focos["latitude"]), # cria um ponto geográfico a partir das coordenadas
        crs="EPSG:4326",
    )

    return int(pontos.within(poligono).sum())