package com.example.documentation_center.services;

import com.example.documentation_center.models.Card;
import com.example.documentation_center.models.Notificacao;
import com.example.documentation_center.models.User;
import com.example.documentation_center.repositories.AssinaturaDAO;
import com.example.documentation_center.repositories.NotificacaoDAO;
import com.example.documentation_center.services.exceptions.BusinessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificacaoServices {

    private final NotificacaoDAO notificacaoDAO;
    private final AssinaturaDAO assinaturaDAO;

    public NotificacaoServices(NotificacaoDAO notificacaoDAO, AssinaturaDAO assinaturaDAO) {
        this.notificacaoDAO = notificacaoDAO;
        this.assinaturaDAO = assinaturaDAO;
    }

    @Transactional
    public void notificarAssinantes(Card card) {
        String mensagem = String.format("Nova documentação publicada: \"%s\"", card.getNome());

        List<User> assinantes = new java.util.ArrayList<>();

        if (card.getIdBranch() != null) {
            assinaturaDAO.findByBranch(card.getIdBranch().intValue())
                    .stream().map(a -> a.getUserObj()).forEach(assinantes::add);
        }

        if (card.getIdFolder() != null) {
            assinaturaDAO.findByFolder(card.getIdFolder().intValue()).stream()
                    .map(a -> a.getUserObj())
                    .filter(u -> assinantes.stream().noneMatch(u2 -> u2.getId().equals(u.getId())))
                    .forEach(assinantes::add);
        }

        assinantes.forEach(user ->
                notificacaoDAO.save(new Notificacao(user, card, mensagem))
        );
    }

    @Transactional(readOnly = true)
    public Page<Notificacao> listarPorUsuario(Long userId, Pageable pageable) {
        return notificacaoDAO.findByUserObjIdOrderByDataHoraDesc(userId, pageable);
    }

    @Transactional(readOnly = true)
    public long contarNaoLidas(Long userId) {
        return notificacaoDAO.countByUserObjIdAndLidaFalse(userId);
    }

    @Transactional
    public void marcarComoLida(Integer notificacaoId) {
        Notificacao n = notificacaoDAO.findById(notificacaoId)
                .orElseThrow(() -> new BusinessException("Notificação não encontrada."));
        n.setLida(true);
        notificacaoDAO.save(n);
    }

    @Transactional
    public void marcarTodasComoLidas(Long userId) {
        notificacaoDAO.marcarTodasComoLidas(userId);
    }
}
