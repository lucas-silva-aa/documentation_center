package com.example.documentation_center.services;

import com.example.documentation_center.converter.DozerConverter;
import com.example.documentation_center.dtos.CardDTO;
import com.example.documentation_center.dtos.ScoreDTO;
import com.example.documentation_center.dtos.UserDTO;
import com.example.documentation_center.exception.ResourceNotFoundException;
import com.example.documentation_center.models.*;
import com.example.documentation_center.repositories.*;
import com.example.documentation_center.services.exceptions.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import java.time.LocalDate;
import java.util.Objects;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class CardServices {

    @Autowired
    CardDAO cardDAO;

    @Autowired
    UserDAO userDAO;

    @Autowired
    NotificacaoServices notificacaoServices;

    private User buscarRequisitante(Long requesterId) {
        return userDAO.findById(requesterId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Requisitante não encontrado"));
    }

    private void verificarPermissaoCard(Card card, Long requesterId) {
        if (requesterId == null) return;
        User req = buscarRequisitante(requesterId);
        boolean isGestor = req.getNivelAcessoValor() >= 2;
        boolean isOwner = Objects.equals(card.getIdUser(), requesterId);
        if (!isGestor && !isOwner) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sem permissão para modificar este card");
        }
    }

    @Transactional
    public CardDTO create(CardDTO cardDTO) {
        if (cardDTO.getNome() == null || cardDTO.getNome().isBlank()) {
            throw new BusinessException("Os campos com * são obrigatórios!");
        }
        var entity = DozerConverter.parseObject(cardDTO, Card.class);

        if (cardDTO.getFolderDTO() != null && cardDTO.getFolderDTO().getKey() != null) {
            entity.setIdFolder(cardDTO.getFolderDTO().getKey());
        }
        if (cardDTO.getIdBranch() != null) entity.setIdBranch(cardDTO.getIdBranch());
        if (cardDTO.getIdUser() != null) entity.setIdUser(cardDTO.getIdUser());
        if (entity.getDataHora() == null) entity.setDataHora(LocalDate.now());
        Card saved = cardDAO.save(entity);
        notificacaoServices.notificarAssinantes(saved);
        return DozerConverter.parseObject(saved, CardDTO.class);
    }

    public Page<CardDTO> findCardByName(String name, Pageable pageable) {
        var page = cardDAO.findCardByNome(name, pageable);
        return page.map(this::convertToCardDTO);
    }

    public CardDTO findCardByName(String name) {
        var entity = cardDAO.findCardByNome(name);
        if (entity != null) {
            return DozerConverter.parseObject(entity, CardDTO.class);
        } else {
            throw new ResourceNotFoundException("Card " + name + " not found!");
        }
    }

    public Page<CardDTO> findAll(Pageable pageable) {
        var page = cardDAO.findAll(pageable);
        return page.map(this::convertToCardDTO);
    }

    private CardDTO convertToCardDTO(Card entity) {
        return DozerConverter.parseObject(entity, CardDTO.class);
    }

    public CardDTO findById(Long id) {
        var entity = cardDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID"));
        return DozerConverter.parseObject(entity, CardDTO.class);
    }


    @Transactional
    public CardDTO update(Long id, CardDTO card, Long requesterId) {
        var entity = cardDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID"));
        verificarPermissaoCard(entity, requesterId);
        if (card.getNome() != null) entity.setNome(card.getNome());
        if (card.getDescricao() != null) entity.setDescricao(card.getDescricao());
        if (card.getThumbnail() != null) entity.setThumbnail(card.getThumbnail());
        if (card.getResumo() != null) entity.setResumo(card.getResumo());
        if (card.getTags() != null) entity.setTags(card.getTags());
        if (card.getCategoria() != null) entity.setCategoria(card.getCategoria());
        if (card.getFolderDTO() != null && card.getFolderDTO().getKey() != null) {
            entity.setIdFolder(card.getFolderDTO().getKey());
        }
        return DozerConverter.parseObject(cardDAO.save(entity), CardDTO.class);
    }

    @Transactional(readOnly = true)
    public Page<CardDTO> pesquisar(String nome, String categoria, String tag, Pageable pageable) {
        boolean temNome = nome != null && !nome.isBlank();
        boolean temCategoria = categoria != null && !categoria.isBlank();
        boolean temTag = tag != null && !tag.isBlank();
        Page<Card> result;
        if (temNome && temCategoria && temTag) {
            result = cardDAO.findByNomeContainsIgnoreCaseAndCategoriaIgnoreCaseAndTagsContainingIgnoreCase(nome, categoria, tag, pageable);
        } else if (temNome && temCategoria) {
            result = cardDAO.findByNomeContainsIgnoreCaseAndCategoriaIgnoreCase(nome, categoria, pageable);
        } else if (temNome && temTag) {
            result = cardDAO.findByNomeContainsIgnoreCaseAndTagsContainingIgnoreCase(nome, tag, pageable);
        } else if (temCategoria && temTag) {
            result = cardDAO.findByCategoriaIgnoreCaseAndTagsContainingIgnoreCase(categoria, tag, pageable);
        } else if (temNome) {
            result = cardDAO.findByNomeContainsIgnoreCase(nome, pageable);
        } else if (temCategoria) {
            result = cardDAO.findByCategoriaIgnoreCase(categoria, pageable);
        } else if (temTag) {
            result = cardDAO.findByTagsContainingIgnoreCase(tag, pageable);
        } else {
            result = cardDAO.findAll(pageable);
        }
        return result.map(CardDTO::new);
    }

    public void delete(Long id, Long requesterId) {
        Card entity = cardDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID"));
        verificarPermissaoCard(entity, requesterId);
        cardDAO.delete(entity);
    }


       /*
        //<editor-fold defaultstate="collapsed" desc="delombok">
        @SuppressWarnings("all")
        public CardServices(CardDAO cardDAO, FolderDAO folderDAO, BranchDAO branchDAO, UserDAO userDAO,
                            IaService iaService, NotificacaoServices notificacaoServices) {
            this.cardDAO = cardDAO;
            this.folderDAO = folderDAO;
            this.branchDAO = branchDAO;
            this.userDAO = userDAO;
            this.iaService = iaService;
            this.notificacaoServices = notificacaoServices;
        }
    */
}
