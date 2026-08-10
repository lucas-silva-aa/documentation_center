package com.example.documentation_center.controllers;

import com.example.documentation_center.dtos.BranchDTO;
import com.example.documentation_center.models.Branch;
import com.example.documentation_center.services.BranchServices;
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

@Tag(name = "BranchEndpoint")
@RestController
@RequestMapping("/v1/ts/branchs")
public class BranchController {

    @Autowired
    private BranchServices service;

    //@Autowired
    //private PagedResourcesAssembler<BranchVO> assembler;

    @Operation(summary = "Find all branch")
    @GetMapping(produces = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity<CollectionModel<BranchDTO>> findAll(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "limit", defaultValue = "12") int limit,
            @RequestParam(value = "direction", defaultValue = "asc") String direction) {

        var sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, limit, Sort.by(sortDirection, "id"));

        Page<BranchDTO> branch = service.findAll(pageable);
        branch
                .stream()
                .forEach(p -> p.add(
                                linkTo(methodOn(BranchController.class).findById(p.getKey())).withSelfRel()
                        )
                );

        //PagedResources<?> resources = assembler.toResource(branch);

        return ResponseEntity.ok(CollectionModel.of(branch));
    }


    @Operation(summary = "Find branch by name")
    @GetMapping(value = "/findBranchByName/{description}", produces = {"application/json", "application/xml", "application/x-yaml"})
    public ResponseEntity<CollectionModel<BranchDTO>> findPersonByName(
            @PathVariable("description") String description,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "limit", defaultValue = "12") int limit,
            @RequestParam(value = "direction", defaultValue = "asc") String direction) {

        var sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, limit, Sort.by(sortDirection, "id"));

        Page<BranchDTO> branch = service.findBranchByName(description, pageable);
        branch
                .stream()
                .forEach(p -> p.add(
                                linkTo(methodOn(BranchController.class).findById(p.getKey())).withSelfRel()
                        )
                );

        //PagedResources<?> resources = assembler.toResource(branch);

        return ResponseEntity.ok(CollectionModel.of(branch));
    }

    @Operation(summary = "Find a specific branch by your ID")
    @GetMapping(value = "/{id}", produces = {"application/json", "application/xml", "application/x-yaml"})
    public BranchDTO findById(@PathVariable("id") Long id) {
        BranchDTO branchDTO = service.findById(id);
        branchDTO.add(linkTo(methodOn(BranchController.class).findById(id)).withSelfRel());
        return branchDTO;
    }

    @Operation(summary = "Create a new branch")
    @PostMapping(produces = {"application/json", "application/xml", "application/x-yaml"},
            consumes = {"application/json", "application/xml", "application/x-yaml"})
    public BranchDTO create(@RequestBody BranchDTO branch,
                            @RequestParam(required = false) Long requesterId) {
        BranchDTO branchDTO = service.create(branch, requesterId);
        branchDTO.add(linkTo(methodOn(BranchController.class).findById(branchDTO.getKey())).withSelfRel());
        return branchDTO;
    }

    @Operation(summary = "Update a specific branch")
    @PutMapping(value = "/{id}", produces = {"application/json", "application/xml", "application/x-yaml"},
            consumes = {"application/json", "application/xml", "application/x-yaml"})
    public BranchDTO update(@PathVariable Long id, @RequestBody BranchDTO branch,
                            @RequestParam(required = false) Long requesterId) {
        branch.setKey(id);
        BranchDTO branchDTO = service.update(branch, requesterId);
        branchDTO.add(linkTo(methodOn(BranchController.class).findById(branchDTO.getKey())).withSelfRel());
        return branchDTO;
    }


/*    @ApiOperation(value = "Disable a branch by your ID" )
    @PatchMapping(value = "/{id}", produces = { "application/json", "application/xml", "application/x-yaml" })
    public BranchDTO disablePerson(@PathVariable("id") Long id) {
        BranchDTO branchDTO = service.disableBranch(id);
        branchDTO.add(linkTo(methodOn(BranchController.class).findById(id)).withSelfRel());
        return branchDTO;
    }*/

    @Operation(summary = "Delete a specific branch by your ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id,
                                    @RequestParam(required = false) Long requesterId) {
        service.delete(id, requesterId);
        return ResponseEntity.ok().build();
    }

}