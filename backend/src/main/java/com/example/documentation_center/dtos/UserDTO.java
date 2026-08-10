package com.example.documentation_center.dtos;

import com.example.documentation_center.dtos.ValidationsGroups.UserId;
import com.example.documentation_center.models.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.github.dozermapper.core.Mapping;
import org.springframework.hateoas.RepresentationModel;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

public class UserDTO extends RepresentationModel<UserDTO> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Mapping("id")
    @JsonProperty("codigo_user")
    private Long key;
    @JsonProperty("nome_user")
    private String nome;
    @JsonProperty("descricao_user")
    private String descricao;
    @JsonProperty("senha_user")
    private String senha;
    @JsonProperty("admin_user")
    private Boolean admin;
    @JsonProperty("nivel_acesso")
    private Integer nivelAcesso;
    @JsonProperty("id_branch")
    private Long idBranch;
    @JsonProperty("data_user")
    private LocalDate dataHora;


    public UserDTO(){

    }

    public LocalDate getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDate dataHora) {
        this.dataHora = dataHora;
    }

    public Boolean getAdmin() {
        return admin;
    }

    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }

    public Integer getNivelAcesso() {
        return nivelAcesso;
    }

    public void setNivelAcesso(Integer nivelAcesso) {
        this.nivelAcesso = nivelAcesso;
    }

    public Long getIdBranch() {
        return idBranch;
    }

    public void setIdBranch(Long idBranch) {
        this.idBranch = idBranch;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Long getKey() {
        return key;
    }

    public void setKey(Long key) {
        this.key = key;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof UserDTO userDTO)) return false;
        if (!super.equals(o)) return false;
        return Objects.equals(getKey(), userDTO.getKey()) && Objects.equals(getNome(), userDTO.getNome()) && Objects.equals(getDescricao(), userDTO.getDescricao()) && Objects.equals(getSenha(), userDTO.getSenha()) && Objects.equals(getAdmin(), userDTO.getAdmin()) && Objects.equals(getDataHora(), userDTO.getDataHora());
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), getKey(), getNome(), getDescricao(), getSenha(), getAdmin(), getDataHora());
    }
}
