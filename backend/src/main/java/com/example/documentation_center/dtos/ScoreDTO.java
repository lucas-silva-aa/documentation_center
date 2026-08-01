package com.example.documentation_center.dtos;
import com.example.documentation_center.dtos.ValidationsGroups.UserId;
import com.example.documentation_center.models.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.github.dozermapper.core.Mapping;
import org.springframework.hateoas.RepresentationModel;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

public class ScoreDTO extends RepresentationModel<ScoreDTO> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Mapping("id")
    @JsonProperty("id")
    private Long key;
    private String nomeLogin;
    private String time;
    private String sistema;
    private Integer pontos;
    private LocalDate dataHora;


    public ScoreDTO(){

    }

    public Long getKey() {
        return key;
    }

    public void setKey(Long key) {
        this.key = key;
    }

    public String getNomeLogin() {
        return nomeLogin;
    }

    public void setNomeLogin(String nomeLogin) {
        this.nomeLogin = nomeLogin;
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

    public Integer getPontos() {
        return pontos;
    }

    public void setPontos(Integer pontos) {
        this.pontos = pontos;
    }

    public LocalDate getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDate dataHora) {
        this.dataHora = dataHora;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof ScoreDTO scoreDTO)) return false;
        if (!super.equals(o)) return false;
        return Objects.equals(getKey(), scoreDTO.getKey()) && Objects.equals(getNomeLogin(), scoreDTO.getNomeLogin()) && Objects.equals(getTime(), scoreDTO.getTime()) && Objects.equals(getSistema(), scoreDTO.getSistema()) && Objects.equals(getPontos(), scoreDTO.getPontos()) && Objects.equals(getDataHora(), scoreDTO.getDataHora());
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), getKey(), getNomeLogin(), getTime(), getSistema(), getPontos(), getDataHora());
    }
}
