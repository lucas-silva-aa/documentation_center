package com.example.documentation_center.repositories;

import com.example.documentation_center.models.Assinatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AssinaturaDAO extends JpaRepository<Assinatura, Integer> {

    List<Assinatura> findByUserObjId(Long userId);

    @Query("SELECT a FROM Assinatura a WHERE a.branchObj.id = :branchId")
    List<Assinatura> findByBranch(@Param("branchId") Integer branchId);

    @Query("SELECT a FROM Assinatura a WHERE a.folderObj.id = :folderId")
    List<Assinatura> findByFolder(@Param("folderId") Integer folderId);

    @Query("SELECT COUNT(a) > 0 FROM Assinatura a WHERE a.userObj.id = :userId AND a.branchObj.id = :branchId")
    boolean existsByUserAndBranch(@Param("userId") Integer userId, @Param("branchId") Integer branchId);

    @Query("SELECT COUNT(a) > 0 FROM Assinatura a WHERE a.userObj.id = :userId AND a.folderObj.id = :folderId")
    boolean existsByUserAndFolder(@Param("userId") Integer userId, @Param("folderId") Integer folderId);
}
