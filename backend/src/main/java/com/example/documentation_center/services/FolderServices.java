package com.example.documentation_center.services;

import com.example.documentation_center.converter.DozerConverter;
import com.example.documentation_center.dtos.FolderDTO;
import com.example.documentation_center.exception.ResourceNotFoundException;
import com.example.documentation_center.models.*;
import com.example.documentation_center.repositories.BranchDAO;
import com.example.documentation_center.repositories.FolderDAO;
import com.example.documentation_center.repositories.UserDAO;
import com.example.documentation_center.services.exceptions.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Objects;
import java.util.Optional;

@Service
public class FolderServices {
    @Autowired
    private FolderDAO folderDAO;

    @Autowired
    private UserDAO userDAO;

    private User buscarRequisitante(Long requesterId) {
        return userDAO.findById(requesterId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Requisitante não encontrado"));
    }

    private void verificarPermissaoFolder(Folder folder, Long requesterId) {
        if (requesterId == null) return;
        User req = buscarRequisitante(requesterId);
        if (!req.isGestor()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas gestores ou administradores podem gerenciar folders");
        }
        if (!req.isAdmin3() && !Objects.equals(folder.getIdBranch(), req.getIdBranch())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Gestores só podem gerenciar folders de sua própria branch");
        }
    }

    private void verificarGestorOuAdmin(Long requesterId, Long idBranch) {
        if (requesterId == null) return;
        User req = buscarRequisitante(requesterId);
        if (!req.isGestor()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas gestores ou administradores podem criar folders");
        }
        if (!req.isAdmin3() && !Objects.equals(idBranch, req.getIdBranch())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Gestores só podem criar folders em sua própria branch");
        }
    }

    public FolderDTO create(FolderDTO folderDTO, Long requesterId) {
        var entity = DozerConverter.parseObject(folderDTO, Folder.class);
        if (entity.getDataHora() == null) entity.setDataHora(LocalDate.now());
        verificarGestorOuAdmin(requesterId, entity.getIdBranch());
        return DozerConverter.parseObject(folderDAO.save(entity), FolderDTO.class);
    }

    public Page<FolderDTO> findFolderByNome(String nome, Pageable pageable) {
        var page = folderDAO.findFolderByNome(nome, pageable);
        return page.map(this::convertToFolderDTO);
    }

    public FolderDTO findFolderByNome(String nome) {
        var entity = folderDAO.findFolderByNome(nome);
        if (entity != null) {
            return DozerConverter.parseObject(entity, FolderDTO.class);
        } else {
            throw new ResourceNotFoundException("Folder " + nome + " not found!");
        }
    }

    public Page<FolderDTO> findAll(Pageable pageable) {
        var page = folderDAO.findAll(pageable);
        return page.map(this::convertToFolderDTO);
    }

    private FolderDTO convertToFolderDTO(Folder entity) {
        return DozerConverter.parseObject(entity, FolderDTO.class);
    }

    public FolderDTO findById(Long id) {
        var entity = folderDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID"));
        return DozerConverter.parseObject(entity, FolderDTO.class);
    }

    public FolderDTO update(FolderDTO folder, Long requesterId) {
        var entity = folderDAO.findById(folder.getKey())
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID"));
        verificarPermissaoFolder(entity, requesterId);

        if (folder.getIdUser() != null) entity.setIdUser(folder.getIdUser());
        if (folder.getIdBranch() != null) entity.setIdBranch(folder.getIdBranch());
        entity.setNome(folder.getNome());
        entity.setDescricao(folder.getDescricao());
        if (folder.getDataHora() != null) entity.setDataHora(folder.getDataHora());

        return DozerConverter.parseObject(folderDAO.save(entity), FolderDTO.class);
    }

  /*  @Transactional
    public AddressVO disableUser(Long id) {
        //folderDAO.disableFolder(id);
        var entity = folderDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID!"));
        folderDAO.disablePerson(id);
        return DozerConverter.parseObject(entity, AddressVO.class);
    }*/

    public void delete(Long id, Long requesterId) {
        Folder entity = folderDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID"));
        verificarPermissaoFolder(entity, requesterId);
        folderDAO.delete(entity);
    }
}
