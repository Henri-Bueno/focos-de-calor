from flask import Flask

from routes.inpe_routes import inpe_bp


app = Flask(
    __name__,
    static_folder="../frontend",
    static_url_path=""
)


# Registra as rotas do INPE
app.register_blueprint(inpe_bp)


@app.route("/")
def home():
    return app.send_static_file("index.html")


if __name__ == "__main__":
    app.run(debug=True)