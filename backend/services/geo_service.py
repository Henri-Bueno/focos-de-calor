import geopandas as gpd
from shapely.geometry import box

from services.inpe_service import obter_focos


def contar_focos_no_retangulo(west, south, east, north):
    focos = obter_focos()

    if focos is None or focos.empty:
        return 0

    # Shapely usa (longitude, latitude)
    poligono = box(west, south, east, north)

    pontos = gpd.GeoDataFrame(
        focos,
        geometry=gpd.points_from_xy(focos["longitude"], focos["latitude"]),
        crs="EPSG:4326",
    )

    return int(pontos.within(poligono).sum())