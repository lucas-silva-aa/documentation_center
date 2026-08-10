package com.example.documentation_center.services;

import com.example.documentation_center.converter.DozerConverter;
import com.example.documentation_center.dtos.BranchDTO;
import com.example.documentation_center.exception.ResourceNotFoundException;
import com.example.documentation_center.models.Branch;
import com.example.documentation_center.models.Folder;
import com.example.documentation_center.models.User;
import com.example.documentation_center.repositories.*;
import com.example.documentation_center.services.exceptions.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class BranchServices {
    @Autowired
    BranchDAO branchDAO;

    @Autowired
    UserDAO userDAO;

    private void verificarAdmin(Long requesterId) {
        if (requesterId == null) return;
        User req = userDAO.findById(requesterId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Requisitante não encontrado"));
        if (!req.isAdmin3()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas administradores podem gerenciar branches");
        }
    }

    public BranchDTO create(BranchDTO branchDTO, Long requesterId) {
        verificarAdmin(requesterId);
        var entity = DozerConverter.parseObject(branchDTO, Branch.class);
        return DozerConverter.parseObject(branchDAO.save(entity), BranchDTO.class);
    }

    public Page<BranchDTO> findBranchByName(String name, Pageable pageable) {
        var page = branchDAO.findBranchByNome(name, pageable);
        return page.map(this::convertToBranchDTO);
    }

    public BranchDTO findBranchByName(String name) {
        var entity = branchDAO.findBranchByNome(name);
        if (entity != null) {
            return DozerConverter.parseObject(entity, BranchDTO.class);
        } else {
            throw new ResourceNotFoundException("Branch " + name + " not found!");
        }
    }

    public Page<BranchDTO> findAll(Pageable pageable) {
        var page = branchDAO.findAll(pageable);
        return page.map(this::convertToBranchDTO);
    }

    private BranchDTO convertToBranchDTO(Branch entity) {
        return DozerConverter.parseObject(entity, BranchDTO.class);
    }

    public BranchDTO findById(Long id) {
        var entity = branchDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID"));
        return DozerConverter.parseObject(entity, BranchDTO.class);
    }

    public BranchDTO update(BranchDTO branch, Long requesterId) {
        verificarAdmin(requesterId);
        var entity = branchDAO.findById(branch.getKey())
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID"));

        entity.setNome(branch.getNome());
        entity.setDescricao(branch.getDescricao());
        entity.setDataHora(branch.getDataHora());

        return DozerConverter.parseObject(branchDAO.save(entity), BranchDTO.class);
    }

  /*  @Transactional
    public AddressVO disableUser(Long id) {
        //branchDAO.disableBranch(id);
        var entity = branchDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID!"));
        branchDAO.disablePerson(id);
        return DozerConverter.parseObject(entity, AddressVO.class);
    }*/

    public void delete(Long id, Long requesterId) {
        verificarAdmin(requesterId);
        Branch entity = branchDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID"));
        branchDAO.delete(entity);
    }
}
