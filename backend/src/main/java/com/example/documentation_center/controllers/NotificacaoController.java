package com.example.documentation_center.controllers;

import com.example.documentation_center.models.Notificacao;
import com.example.documentation_center.services.NotificacaoServices;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/ts/notificacoes")
@Tag(name = "Endpoint de Notificações")
public class NotificacaoController {

    private final NotificacaoServices service;

    public NotificacaoController(NotificacaoServices service) {
        this.service = service;
    }

    @GetMapping("/usuario/{userId}")
    @Operation(summary = "Lista notificações de um usuário (paginado)")
    public ResponseEntity<Page<Notificacao>> listarPorUsuario(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        return ResponseEntity.ok(service.listarPorUsuario(userId, pageable));
    }

    @GetMapping("/usuario/{userId}/nao-lidas")
    @Operation(summary = "Conta notificações não lidas de um usuário")
    public ResponseEntity<Map<String, Long>> contarNaoLidas(@PathVariable Long userId) {
        long count = service.contarNaoLidas(userId);
        return ResponseEntity.ok(Map.of("naoLidas", count));
    }

    @PatchMapping("/{id}/lida")
    @Operation(summary = "Marca uma notificação como lida")
    public ResponseEntity<Void> marcarComoLida(@PathVariable Integer id) {
        service.marcarComoLida(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/usuario/{userId}/lidas")
    @Operation(summary = "Marca todas as notificações do usuário como lidas")
    public ResponseEntity<Void> marcarTodasComoLidas(@PathVariable Long userId) {
        service.marcarTodasComoLidas(userId);
        return ResponseEntity.noContent().build();
    }
}
