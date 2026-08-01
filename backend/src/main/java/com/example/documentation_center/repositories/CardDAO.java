package com.example.documentation_center.repositories;

import com.example.documentation_center.models.Card;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CardDAO extends JpaRepository<Card, Long> {

    @Query("SELECT u FROM Card u WHERE u.descricao =:descricao")
    Card findCardByNome(@Param("descricao") String descricao);

    // @Modifying
    // @Query("UPDATE Person p SET p.enabled = false WHERE p.id =:id")
    //void disablePerson(@Param("id") Long id);

    @Query("SELECT p FROM Card p WHERE p.descricao LIKE LOWER(CONCAT ('%',:descricao,'%'))")
    Page<Card> findCardByNome(@Param("descricao") String descricao, Pageable pageable);
    Page<Card> findByNomeContainsIgnoreCase(String searchTerm, Pageable pageable);
    Page<Card> findByNomeContainsIgnoreCaseAndCategoriaIgnoreCase(String nome, String categoria, Pageable pageable);
    Page<Card> findByCategoriaIgnoreCase(String categoria, Pageable pageable);

    Page<Card> findByTagsContainingIgnoreCase(String tag, Pageable pageable);
    Page<Card> findByNomeContainsIgnoreCaseAndTagsContainingIgnoreCase(String nome, String tag, Pageable pageable);
    Page<Card> findByCategoriaIgnoreCaseAndTagsContainingIgnoreCase(String categoria, String tag, Pageable pageable);
    Page<Card> findByNomeContainsIgnoreCaseAndCategoriaIgnoreCaseAndTagsContainingIgnoreCase(String nome, String categoria, String tag, Pageable pageable);
}
