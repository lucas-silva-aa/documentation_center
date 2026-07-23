package com.example.documentation_center.services;

import com.example.documentation_center.converter.DozerConverter;
import com.example.documentation_center.dtos.CardDTO;
import com.example.documentation_center.exception.ResourceNotFoundException;
import com.example.documentation_center.models.Card;
import com.example.documentation_center.repositories.CardDAO;
import com.example.documentation_center.services.exceptions.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import java.time.LocalDate;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CardServices {

    @Autowired
    CardDAO cardDAO;

    @Autowired
    NotificacaoServices notificacaoServices;

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
        return new CardDTO(saved);
    }

    public Page<CardDTO> findAll(Pageable pageable) {
        return cardDAO.findAll(pageable).map(CardDTO::new);
    }

    public CardDTO findById(Long id) {
        var entity = cardDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID"));
        return new CardDTO(entity);
    }

    @Transactional
    public CardDTO update(Long id, CardDTO card) {
        var entity = cardDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID"));
        if (card.getNome() != null) entity.setNome(card.getNome());
        if (card.getDescricao() != null) entity.setDescricao(card.getDescricao());
        if (card.getThumbnail() != null) entity.setThumbnail(card.getThumbnail());
        if (card.getResumo() != null) entity.setResumo(card.getResumo());
        if (card.getTags() != null) entity.setTags(card.getTags());
        if (card.getCategoria() != null) entity.setCategoria(card.getCategoria());
        if (card.getFolderDTO() != null && card.getFolderDTO().getKey() != null) {
            entity.setIdFolder(card.getFolderDTO().getKey());
        }
        return new CardDTO(cardDAO.save(entity));
    }

    @Transactional(readOnly = true)
    public Page<CardDTO> pesquisar(String nome, String categoria, Pageable pageable) {
        boolean temNome = nome != null && !nome.isBlank();
        boolean temCategoria = categoria != null && !categoria.isBlank();
        Page<Card> result;
        if (temNome && temCategoria) {
            result = cardDAO.findByNomeContainsIgnoreCaseAndCategoriaIgnoreCase(nome, categoria, pageable);
        } else if (temNome) {
            result = cardDAO.findByNomeContainsIgnoreCase(nome, pageable);
        } else if (temCategoria) {
            result = cardDAO.findByCategoriaIgnoreCase(categoria, pageable);
        } else {
            result = cardDAO.findAll(pageable);
        }
        return result.map(CardDTO::new);
    }

    public void delete(Long id) {
        Card entity = cardDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID"));
        cardDAO.delete(entity);
    }
}
