package com.example.documentation_center.controllers;

import com.example.documentation_center.dtos.AssinaturaDTO;
import com.example.documentation_center.models.Assinatura;
import com.example.documentation_center.services.AssinaturaServices;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/ts/assinaturas")
@Tag(name = "Endpoint de Assinaturas")
public class AssinaturaController {

    private final AssinaturaServices service;

    public AssinaturaController(AssinaturaServices service) {
        this.service = service;
    }

    @GetMapping("/usuario/{userId}")
    @Operation(summary = "Lista todas as assinaturas de um usuário")
    public ResponseEntity<List<AssinaturaDTO>> listarPorUsuario(@PathVariable Integer userId) {
        List<AssinaturaDTO> dtos = service.listarPorUsuario(userId).stream()
                .map(AssinaturaDTO::new).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/branch")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Assina um time (branch)")
    public ResponseEntity<Assinatura> assinarBranch(@RequestBody Map<String, Integer> body) {
        Integer userId = body.get("userId");
        Integer branchId = body.get("branchId");
        return ResponseEntity.status(HttpStatus.CREATED).body(service.assinarBranch(userId, branchId));
    }

    @PostMapping("/folder")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Assina um sistema (folder)")
    public ResponseEntity<Assinatura> assinarFolder(@RequestBody Map<String, Integer> body) {
        Integer userId = body.get("userId");
        Integer folderId = body.get("folderId");
        return ResponseEntity.status(HttpStatus.CREATED).body(service.assinarFolder(userId, folderId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancela uma assinatura")
    public ResponseEntity<Void> cancelar(@PathVariable Integer id) {
        service.cancelarAssinatura(id);
        return ResponseEntity.noContent().build();
    }
}
