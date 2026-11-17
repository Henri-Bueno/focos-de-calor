from flask import Blueprint, jsonify
from services.inpe_service import obter_focos


# Cria as rotas do INPE
inpe_bp = Blueprint("inpe", __name__, url_prefix="/api")


@inpe_bp.route("/focos", methods=["GET"])
def listar_focos():

    try:
        # Obtém os focos do INPE
        focos = obter_focos()

        # Retorna as coordenadas em formato JSON
        return jsonify({
            "total": len(focos),
            "focos": focos.to_dict(orient="records")
        })

    except Exception as erro:
        return jsonify({"erro": str(erro)}), 500
