package com.example.documentation_center.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "Users")
public class User implements Serializable, UserDetails {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "descricao")
    private String descricao;

    @JsonIgnore
    @Column(name = "senha", nullable = false)
    private String senha;

    @Column(name = "account_non_expired")
    private Boolean accountNonExpired;

    @Column(name = "account_non_locked")
    private Boolean accountNonLocked;

    @Column(name = "credentials_non_expired")
    private Boolean credentialsNonExpired;

    @Column(nullable = false)
    private Boolean enabled;

    @Column(name = "admin")
    private boolean admin;

    @Column(name = "data", nullable = false)
    private LocalDate dataHora;

    //@ManyToOne
    //private Branch branchObj;

    @Column(name = "id_branch", nullable = false, length = 10)
    private Long idBranch;

    public User(Long id, String nome, String descricao, String senha, Boolean accountNonExpired, Boolean accountNonLocked, Boolean credentialsNonExpired, Boolean enabled, Boolean admin, Long idBranch) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.senha = senha;
        this.accountNonExpired = accountNonExpired;
        this.accountNonLocked = accountNonLocked;
        this.credentialsNonExpired = credentialsNonExpired;
        this.enabled = enabled;
        this.admin = admin;
        this.dataHora = LocalDate.now();
        this.idBranch = idBranch;
    }

    public User(){

    }

    // user details methods

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.permissions != null ? this.permissions : new ArrayList<>();
    }

    @Override
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.nome;
    }

    @Override
    public boolean isAccountNonExpired() {
        return this.accountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return this.accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return this.credentialsNonExpired;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }

    //ends user details methods


    @Transient
    private List<Permissions> permissions;

    public List<String> getRoles() {
        if (this.permissions == null) return new ArrayList<>();
        List<String> roles = new ArrayList<>();
        for (Permissions permission : this.permissions) {
            roles.add(permission.getDescription());
        }
        return roles;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public Boolean getAccountNonExpired() {
        return accountNonExpired;
    }

    public void setAccountNonExpired(Boolean accountNonExpired) {
        this.accountNonExpired = accountNonExpired;
    }

    public Boolean getAccountNonLocked() {
        return accountNonLocked;
    }

    public void setAccountNonLocked(Boolean accountNonLocked) {
        this.accountNonLocked = accountNonLocked;
    }

    public Boolean getCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    public void setCredentialsNonExpired(Boolean credentialsNonExpired) {
        this.credentialsNonExpired = credentialsNonExpired;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Boolean getAdmin() {
        return admin;
    }

    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }

    public LocalDate getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDate dataHora) {
        this.dataHora = dataHora;
    }

    public Long getIdBranch() {
        return idBranch;
    }

    public void setIdBranch(Long idBranch) {
        this.idBranch = idBranch;
    }


    public List<Permissions> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<Permissions> permissions) {
        this.permissions = permissions;
    }


    @Override
    public boolean equals(Object o) {
        if (!(o instanceof User user)) return false;
        return Objects.equals(getId(), user.getId()) && Objects.equals(getNome(), user.getNome()) && Objects.equals(getDescricao(), user.getDescricao()) && Objects.equals(getSenha(), user.getSenha()) && Objects.equals(isAccountNonExpired(), user.isAccountNonExpired()) && Objects.equals(isAccountNonLocked(), user.isAccountNonLocked()) && Objects.equals(isCredentialsNonExpired(), user.isCredentialsNonExpired()) && Objects.equals(isEnabled(), user.isEnabled()) && Objects.equals(getAdmin(), user.getAdmin()) && Objects.equals(getDataHora(), user.getDataHora()) && Objects.equals(getIdBranch(), user.getIdBranch());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getNome(), getDescricao(), getSenha(), isAccountNonExpired(), isAccountNonLocked(), isCredentialsNonExpired(), isEnabled(), getAdmin(), getDataHora(), getIdBranch());
    }
}

