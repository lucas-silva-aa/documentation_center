package com.example.documentation_center.controllers;

import com.example.documentation_center.dtos.FolderDTO;
import com.example.documentation_center.models.Folder;
import com.example.documentation_center.services.FolderServices;
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

@Tag(name = "FolderEndpoint")
@RestController
@RequestMapping("/v1/ts/folders")
public class FolderController {

    @Autowired
    private FolderServices service;

    //@Autowired
    //private PagedResourcesAssembler<FolderDTO> assembler;

    @Operation(summary = "Find all folder" )
    @GetMapping(produces = { "application/json", "application/xml", "application/x-yaml" })
    public ResponseEntity<CollectionModel<FolderDTO>>findAll(
            @RequestParam(value="page", defaultValue = "0") int page,
            @RequestParam(value="limit", defaultValue = "12") int limit,
            @RequestParam(value="direction", defaultValue = "asc") String direction) {

        var sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, limit, Sort.by(sortDirection, "id"));

        Page<FolderDTO> folder =  service.findAll(pageable);
        folder
                .stream()
                .forEach(p -> p.add(
                                linkTo(methodOn(FolderController.class).findById(p.getKey())).withSelfRel()
                        )
                );

        //PagedResources<?> resources = assembler.toResource(folder);

        return ResponseEntity.ok(CollectionModel.of(folder));
    }


    @Operation(summary = "Find folder by name" )
    @GetMapping(value = "/findFolderByName/{description}", produces = { "application/json", "application/xml", "application/x-yaml" })
    public ResponseEntity<CollectionModel<FolderDTO>> findPersonByName(
            @PathVariable("description") String description,
            @RequestParam(value="page", defaultValue = "0") int page,
            @RequestParam(value="limit", defaultValue = "12") int limit,
            @RequestParam(value="direction", defaultValue = "asc") String direction) {

        var sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, limit, Sort.by(sortDirection, "id"));

        Page<FolderDTO> folder =  service.findFolderByNome(description, pageable);
        folder
                .stream()
                .forEach(p -> p.add(
                                linkTo(methodOn(FolderController.class).findById(p.getKey())).withSelfRel()
                        )
                );

        //PagedResources<?> resources = assembler.toResource(folder);

        return ResponseEntity.ok(CollectionModel.of(folder));
    }

    @Operation(summary = "Find a specific folder by your ID" )
    @GetMapping(value = "/{id}", produces = { "application/json", "application/xml", "application/x-yaml" })
    public FolderDTO findById(@PathVariable("id") Long id) {
        FolderDTO folderDTO = service.findById(id);
        folderDTO.add(linkTo(methodOn(FolderController.class).findById(id)).withSelfRel());
        return folderDTO;
    }

    @Operation(summary = "Create a new folder")
    @PostMapping(produces = { "application/json", "application/xml", "application/x-yaml" },
            consumes = { "application/json", "application/xml", "application/x-yaml" })
    public FolderDTO create(@RequestBody FolderDTO folder,
                            @RequestParam(required = false) Long requesterId) {
        FolderDTO folderDTO = service.create(folder, requesterId);
        folderDTO.add(linkTo(methodOn(FolderController.class).findById(folderDTO.getKey())).withSelfRel());
        return folderDTO;
    }

    @Operation(summary = "Update a specific folder")
    @PutMapping(value = "/{id}", produces = { "application/json", "application/xml", "application/x-yaml" },
            consumes = { "application/json", "application/xml", "application/x-yaml" })
    public FolderDTO update(@PathVariable Long id, @RequestBody FolderDTO folder,
                            @RequestParam(required = false) Long requesterId) {
        folder.setKey(id);
        FolderDTO folderDTO = service.update(folder, requesterId);
        folderDTO.add(linkTo(methodOn(FolderController.class).findById(folderDTO.getKey())).withSelfRel());
        return folderDTO;
    }


/*    @ApiOperation(value = "Disable a folder by your ID" )
    @PatchMapping(value = "/{id}", produces = { "application/json", "application/xml", "application/x-yaml" })
    public FolderDTO disablePerson(@PathVariable("id") Long id) {
        FolderDTO folderDTO = service.disableFolder(id);
        folderDTO.add(linkTo(methodOn(FolderController.class).findById(id)).withSelfRel());
        return folderDTO;
    }*/

    @Operation(summary = "Delete a specific folder by your ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id,
                                    @RequestParam(required = false) Long requesterId) {
        service.delete(id, requesterId);
        return ResponseEntity.ok().build();
    }


}
