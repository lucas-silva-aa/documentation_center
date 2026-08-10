package com.example.documentation_center.models;

public enum NivelAcesso {
    COLABORADOR(1), GESTOR(2), ADMIN(3);

    private final int valor;

    NivelAcesso(int valor) {
        this.valor = valor;
    }

    public int getValor() {
        return valor;
    }
}
