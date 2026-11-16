from flask import Blueprint, jsonify, request

from services.geo_service import contar_focos_no_retangulo

analysis_bp = Blueprint("analysis", __name__, url_prefix="/api/analysis")

CAMPOS = ("south", "north", "west", "east")


@analysis_bp.route("/rectangle", methods=["POST"])
def analisar_retangulo():
    dados = request.get_json(silent=True)

    if not dados:
        return jsonify({"erro": "JSON inválido ou ausente."}), 400

    try:
        south, north, west, east = (float(dados[c]) for c in CAMPOS)
    except (KeyError, TypeError, ValueError):
        return jsonify({"erro": f"Envie números para: {', '.join(CAMPOS)}."}), 400

    if not (-90 <= south < north <= 90):
        return jsonify({"erro": "Latitudes inválidas (south deve ser menor que north)."}), 400

    if not (-180 <= west < east <= 180):
        return jsonify({"erro": "Longitudes inválidas (west deve ser menor que east)."}), 400

    total = contar_focos_no_retangulo(south, north, west, east)
    return jsonify({"total": total})