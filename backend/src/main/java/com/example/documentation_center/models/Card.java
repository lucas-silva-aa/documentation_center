package com.example.documentation_center.models;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "Cards")
public class Card implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Lob
    @Column(name = "descricao")
    private String descricao;

    @Column(name = "thumbnail")
    private String thumbnail;

    @Column(name = "data", nullable = false)
    private LocalDate dataHora;

    @Column(name = "resumo", length = 2000)
    private String resumo;

    @Column(name = "tags", length = 300)
    private String tags;

    @Column(name = "categoria", length = 100)
    private String categoria;

    @Column(name = "id_folder", nullable = false, length = 10)
    private Long idFolder;

    @Column(name = "id_branch", nullable = false, length = 10)
    private Long idBranch;

    @Column(name = "id_user", nullable = false, length = 10)
    private Long idUser;

    public Card() {}

    public Card(Long id, String nome, String descricao, String thumbnail, Long idFolder, Long idBranch, Long idUser) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.thumbnail = thumbnail;
        this.dataHora = LocalDate.now();
        this.idFolder = idFolder;
        this.idBranch = idBranch;
        this.idUser = idUser;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }

    public LocalDate getDataHora() { return dataHora; }
    public void setDataHora(LocalDate dataHora) { this.dataHora = dataHora; }

    public Long getIdFolder() { return idFolder; }
    public void setIdFolder(Long idFolder) { this.idFolder = idFolder; }

    public Long getIdBranch() { return idBranch; }
    public void setIdBranch(Long idBranch) { this.idBranch = idBranch; }

    public Long getIdUser() { return idUser; }
    public void setIdUser(Long idUser) { this.idUser = idUser; }

    public String getResumo() { return resumo; }
    public void setResumo(String resumo) { this.resumo = resumo; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Card card)) return false;
        return Objects.equals(getId(), card.getId()) && Objects.equals(getNome(), card.getNome())
                && Objects.equals(getDescricao(), card.getDescricao()) && Objects.equals(getThumbnail(), card.getThumbnail())
                && Objects.equals(getDataHora(), card.getDataHora()) && Objects.equals(getIdFolder(), card.getIdFolder())
                && Objects.equals(getIdBranch(), card.getIdBranch()) && Objects.equals(getIdUser(), card.getIdUser());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getNome(), getDescricao(), getThumbnail(), getDataHora(), getIdFolder(), getIdBranch(), getIdUser());
    }
}
