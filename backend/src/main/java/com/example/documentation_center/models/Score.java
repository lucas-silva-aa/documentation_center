package com.example.documentation_center.models;

import jakarta.persistence.*;

//import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "Scores")
public class Score implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nomeLogin", nullable = false)
    private String nomeLogin;

    @Column(name = "pontos", nullable = false)
    private Integer pontos;

    @Column(name = "time", nullable = false)
    private String time;

    @Column(name = "sistema", nullable = false)
    private String sistema;

    @Column(name = "data", nullable = false)
    private LocalDate dataHora;

    public Score(Long id, String nomeLogin, Integer pontos, String time, String sistema) {
        this.id = id;
        this.nomeLogin = nomeLogin;
        this.pontos = pontos;
        this.sistema = sistema;
        this.time = time;
        this.dataHora = LocalDate.now();
    }

    public Score(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeLogin() {
        return nomeLogin;
    }

    public void setNomeLogin(String nomeLogin) {
        this.nomeLogin = nomeLogin;
    }

    public Integer getPontos() {
        return pontos;
    }

    public void setPontos(Integer pontos) {
        this.pontos = pontos;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getSistema() {
        return sistema;
    }

    public void setSistema(String sistema) {
        this.sistema = sistema;
    }

    public LocalDate getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDate dataHora) {
        this.dataHora = dataHora;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Score score)) return false;
        return Objects.equals(getId(), score.getId()) && Objects.equals(getNomeLogin(), score.getNomeLogin()) && Objects.equals(getPontos(), score.getPontos()) && Objects.equals(getTime(), score.getTime()) && Objects.equals(getSistema(), score.getSistema()) && Objects.equals(getDataHora(), score.getDataHora());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getNomeLogin(), getPontos(), getTime(), getSistema(), getDataHora());
    }
}

