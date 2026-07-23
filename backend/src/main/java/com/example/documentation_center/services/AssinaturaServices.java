package com.example.documentation_center.services;

import com.example.documentation_center.models.Assinatura;
import com.example.documentation_center.models.Branch;
import com.example.documentation_center.models.Folder;
import com.example.documentation_center.models.User;
import com.example.documentation_center.repositories.AssinaturaDAO;
import com.example.documentation_center.repositories.BranchDAO;
import com.example.documentation_center.repositories.FolderDAO;
import com.example.documentation_center.repositories.UserDAO;
import com.example.documentation_center.services.exceptions.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AssinaturaServices {

    private final AssinaturaDAO assinaturaDAO;
    private final UserDAO userDAO;
    private final BranchDAO branchDAO;
    private final FolderDAO folderDAO;

    public AssinaturaServices(AssinaturaDAO assinaturaDAO, UserDAO userDAO, BranchDAO branchDAO, FolderDAO folderDAO) {
        this.assinaturaDAO = assinaturaDAO;
        this.userDAO = userDAO;
        this.branchDAO = branchDAO;
        this.folderDAO = folderDAO;
    }

    @Transactional
    public Assinatura assinarBranch(Integer userId, Integer branchId) {
        if (assinaturaDAO.existsByUserAndBranch(userId, branchId)) {
            throw new BusinessException("Usuário já assina esse time.");
        }
        User user = userDAO.findById(userId.longValue()).orElseThrow(() -> new BusinessException("Usuário não encontrado."));
        Branch branch = branchDAO.findById(branchId.longValue()).orElseThrow(() -> new BusinessException("Time não encontrado."));
        return assinaturaDAO.save(new Assinatura(user, branch, null));
    }

    @Transactional
    public Assinatura assinarFolder(Integer userId, Integer folderId) {
        if (assinaturaDAO.existsByUserAndFolder(userId, folderId)) {
            throw new BusinessException("Usuário já assina esse sistema.");
        }
        User user = userDAO.findById(userId.longValue()).orElseThrow(() -> new BusinessException("Usuário não encontrado."));
        Folder folder = folderDAO.findById(folderId.longValue()).orElseThrow(() -> new BusinessException("Sistema não encontrado."));
        return assinaturaDAO.save(new Assinatura(user, null, folder));
    }

    @Transactional
    public void cancelarAssinatura(Integer assinaturaId) {
        if (!assinaturaDAO.existsById(assinaturaId)) {
            throw new BusinessException("Assinatura não encontrada.");
        }
        assinaturaDAO.deleteById(assinaturaId);
    }

    @Transactional(readOnly = true)
    public List<Assinatura> listarPorUsuario(Long userId) {
        return assinaturaDAO.findByUserObjId(userId);
    }

    @Transactional(readOnly = true)
    public List<Assinatura> listarPorBranch(Integer branchId) {
        return assinaturaDAO.findByBranch(branchId);
    }

    @Transactional(readOnly = true)
    public List<Assinatura> listarPorFolder(Integer folderId) {
        return assinaturaDAO.findByFolder(folderId);
    }
}
