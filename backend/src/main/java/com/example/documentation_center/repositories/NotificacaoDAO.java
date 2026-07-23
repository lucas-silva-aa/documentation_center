package com.example.documentation_center.repositories;

import com.example.documentation_center.models.Notificacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificacaoDAO extends JpaRepository<Notificacao, Integer> {

    Page<Notificacao> findByUserObjIdOrderByDataHoraDesc(Long userId, Pageable pageable);

    long countByUserObjIdAndLidaFalse(Long userId);

    @Modifying
    @Query("UPDATE Notificacao n SET n.lida = true WHERE n.userObj.id = :userId AND n.lida = false")
    void marcarTodasComoLidas(@Param("userId") Long userId);
}
