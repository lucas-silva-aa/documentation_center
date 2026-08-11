package com.example.documentation_center.repositories;

import com.example.documentation_center.models.Folder;
import com.example.documentation_center.models.Score;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScoreDAO extends JpaRepository<Score, Long> {

    @Query("SELECT u FROM Score u WHERE u.nomeLogin =:nomeLogin")
    Score findScoreByNome(@Param("nomeLogin") String nomeLogin);

    @Query("SELECT p FROM Score p WHERE p.nomeLogin LIKE LOWER(CONCAT ('%',:nomeLogin,'%'))")
    Page<Score> findScoreByNome(@Param("nomeLogin") String nomeLogin, Pageable pageable);
}
