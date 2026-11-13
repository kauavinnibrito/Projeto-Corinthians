CREATE DATABASE IF NOT EXISTS corinthians_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE corinthians_db;

CREATE TABLE IF NOT EXISTS posicoes (
    id_posicao INT NOT NULL AUTO_INCREMENT,
    nome_posicao VARCHAR(40) NOT NULL,
    PRIMARY KEY (id_posicao),
    UNIQUE KEY uq_posicoes_nome (nome_posicao)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS jogadores (
    id_jogador INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    numero_camisa INT NOT NULL,
    id_posicao INT NOT NULL,
    PRIMARY KEY (id_jogador),
    UNIQUE KEY uq_jogadores_numero (numero_camisa),
    CONSTRAINT ck_jogadores_numero CHECK (numero_camisa BETWEEN 1 AND 99),
    CONSTRAINT fk_jogadores_posicoes
        FOREIGN KEY (id_posicao) REFERENCES posicoes (id_posicao)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT IGNORE INTO posicoes (nome_posicao) VALUES
    ('Goleiro'),
    ('Zagueiro'),
    ('Lateral'),
    ('Meio-campista'),
    ('Atacante');
