from flask import Flask
from app.routes import paginas_bp, jogadores_bp, posicoes_bp


def create_app():
    app = Flask(__name__)
    app.url_map.strict_slashes = False
    app.register_blueprint(paginas_bp)
    app.register_blueprint(jogadores_bp, url_prefix="/api/jogadores")
    app.register_blueprint(posicoes_bp, url_prefix="/api/posicoes")
    return app
