package com.example.documentation_center.controllers;

import com.example.documentation_center.dtos.CardDTO;
import com.example.documentation_center.models.Card;
import com.example.documentation_center.services.CardServices;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.hateoas.CollectionModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Tag(name = "CardEndpoint")
@RestController
@RequestMapping("/v1/ts/cards")
public class CardController {

    @Autowired
    private CardServices service;

    //@Autowired
    //private PagedResourcesAssembler<CardDTO> assembler;

    @Operation(summary = "Find all card" )
    @GetMapping(produces = { "application/json", "application/xml", "application/x-yaml" })
    public ResponseEntity<CollectionModel<CardDTO>>findAll(
            @RequestParam(value="page", defaultValue = "0") int page,
            @RequestParam(value="limit", defaultValue = "12") int limit,
            @RequestParam(value="direction", defaultValue = "asc") String direction) {

        var sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, limit, Sort.by(sortDirection, "id"));

        Page<CardDTO> card =  service.findAll(pageable);
        card
                .stream()
                .forEach(p -> p.add(
                                linkTo(methodOn(CardController.class).findById(p.getKey())).withSelfRel()
                        )
                );

        //PagedResources<?> resources = assembler.toResource(card);

        return ResponseEntity.ok(CollectionModel.of(card));
    }


@Operation(summary = "Find a specific card by your ID" )
    @GetMapping(value = "/{id}", produces = { "application/json", "application/xml", "application/x-yaml" })
    public CardDTO findById(@PathVariable("id") Long id) {
        CardDTO cardDTO = service.findById(id);
        cardDTO.add(linkTo(methodOn(CardController.class).findById(id)).withSelfRel());
        return cardDTO;
    }

    @Operation(summary = "Create a new card")
    @PostMapping(produces = { "application/json", "application/xml", "application/x-yaml" },
            consumes = { "application/json", "application/xml", "application/x-yaml" })
    public CardDTO create(@RequestBody CardDTO card) {
        CardDTO cardDTO = service.create(card);
        cardDTO.add(linkTo(methodOn(CardController.class).findById(cardDTO.getKey())).withSelfRel());
        return cardDTO;
    }

    @Operation(summary = "Update a specific card")
    @PutMapping(value = "/{id}", produces = { "application/json", "application/xml", "application/x-yaml" },
            consumes = { "application/json", "application/xml", "application/x-yaml" })
    public CardDTO update(@PathVariable Long id, @RequestBody CardDTO card,
                          @RequestParam(required = false) Long requesterId) {
        CardDTO cardDTO = service.update(id, card, requesterId);
        cardDTO.add(linkTo(methodOn(CardController.class).findById(cardDTO.getKey())).withSelfRel());
        return cardDTO;
    }

    @Operation(summary = "Search cards by name, category and/or tag")
    @GetMapping(value = "/pesquisa", produces = { "application/json", "application/xml", "application/x-yaml" })
    public ResponseEntity<CollectionModel<CardDTO>> pesquisar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String tag,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "limit", defaultValue = "12") int limit,
            @RequestParam(value = "direction", defaultValue = "asc") String direction) {
        var sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, limit, Sort.by(sortDirection, "id"));
        Page<CardDTO> cards = service.pesquisar(nome, categoria, tag, pageable);
        cards.stream().forEach(p -> p.add(linkTo(methodOn(CardController.class).findById(p.getKey())).withSelfRel()));
        return ResponseEntity.ok(CollectionModel.of(cards));
    }


/*    @ApiOperation(value = "Disable a card by your ID" )
    @PatchMapping(value = "/{id}", produces = { "application/json", "application/xml", "application/x-yaml" })
    public CardDTO disablePerson(@PathVariable("id") Long id) {
        CardDTO cardDTO = service.disableCard(id);
        cardDTO.add(linkTo(methodOn(CardController.class).findById(id)).withSelfRel());
        return cardDTO;
    }*/

    @Operation(summary = "Delete a specific card by your ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id,
                                    @RequestParam(required = false) Long requesterId) {
        service.delete(id, requesterId);
        return ResponseEntity.ok().build();
    }


}
