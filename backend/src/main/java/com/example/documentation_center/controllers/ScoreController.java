package com.example.documentation_center.controllers;

import com.example.documentation_center.dtos.ScoreDTO;
import com.example.documentation_center.models.Score;
import com.example.documentation_center.services.ScoreServices;
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

@Tag(name = "ScoreEndpoint")
@RestController
@RequestMapping("/api/score/v1")
public class ScoreController {

    @Autowired
    private ScoreServices service;

    //@Autowired
    //private PagedResourcesAssembler<ScoreDTO> assembler;

    @Operation(summary = "Find all score" )
    @GetMapping(produces = { "application/json", "application/xml", "application/x-yaml" })
    public ResponseEntity<CollectionModel<ScoreDTO>>findAll(
            @RequestParam(value="page", defaultValue = "0") int page,
            @RequestParam(value="limit", defaultValue = "12") int limit,
            @RequestParam(value="direction", defaultValue = "asc") String direction) {

        var sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, limit, Sort.by(sortDirection, "id"));

        Page<ScoreDTO> score =  service.findAll(pageable);
        score
                .stream()
                .forEach(p -> p.add(
                                linkTo(methodOn(ScoreController.class).findById(p.getKey())).withSelfRel()
                        )
                );

        //PagedResources<?> resources = assembler.toResource(score);

        return ResponseEntity.ok(CollectionModel.of(score));
    }


    @Operation(summary = "Find score by name" )
    @GetMapping(value = "/findScoreByName/{description}", produces = { "application/json", "application/xml", "application/x-yaml" })
    public ResponseEntity<CollectionModel<ScoreDTO>> findPersonByName(
            @PathVariable("description") String description,
            @RequestParam(value="page", defaultValue = "0") int page,
            @RequestParam(value="limit", defaultValue = "12") int limit,
            @RequestParam(value="direction", defaultValue = "asc") String direction) {

        var sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, limit, Sort.by(sortDirection, "id"));

        Page<ScoreDTO> score =  service.findScoreByNome(description, pageable);
        score
                .stream()
                .forEach(p -> p.add(
                                linkTo(methodOn(ScoreController.class).findById(p.getKey())).withSelfRel()
                        )
                );

        //PagedResources<?> resources = assembler.toResource(score);

        return ResponseEntity.ok(CollectionModel.of(score));
    }

    @Operation(summary = "Find a specific score by your ID" )
    @GetMapping(value = "/{id}", produces = { "application/json", "application/xml", "application/x-yaml" })
    public ScoreDTO findById(@PathVariable("id") Long id) {
        ScoreDTO scoreDTO = service.findById(id);
        scoreDTO.add(linkTo(methodOn(ScoreController.class).findById(id)).withSelfRel());
        return scoreDTO;
    }

    @Operation(summary = "Create a new score")
    @PostMapping(produces = { "application/json", "application/xml", "application/x-yaml" },
            consumes = { "application/json", "application/xml", "application/x-yaml" })
    public ScoreDTO create(@RequestBody ScoreDTO score) {
        ScoreDTO scoreDTO = service.create(score);
        scoreDTO.add(linkTo(methodOn(ScoreController.class).findById(scoreDTO.getKey())).withSelfRel());
        return scoreDTO;
    }

    @Operation(summary = "Update a specific score")
    @PutMapping(produces = { "application/json", "application/xml", "application/x-yaml" },
            consumes = { "application/json", "application/xml", "application/x-yaml" })
    public ScoreDTO update(@RequestBody ScoreDTO score) {
        ScoreDTO scoreDTO = service.update(score);
        scoreDTO.add(linkTo(methodOn(ScoreController.class).findById(scoreDTO.getKey())).withSelfRel());
        return scoreDTO;
    }


/*    @ApiOperation(value = "Disable a score by your ID" )
    @PatchMapping(value = "/{id}", produces = { "application/json", "application/xml", "application/x-yaml" })
    public ScoreDTO disablePerson(@PathVariable("id") Long id) {
        ScoreDTO scoreDTO = service.disableScore(id);
        scoreDTO.add(linkTo(methodOn(ScoreController.class).findById(id)).withSelfRel());
        return scoreDTO;
    }*/

    @Operation(summary = "Delete a specific score by your ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }


}
