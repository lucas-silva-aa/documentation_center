package com.example.documentation_center.services;

import com.example.documentation_center.converter.DozerConverter;
import com.example.documentation_center.dtos.UserDTO;
import com.example.documentation_center.exception.ResourceNotFoundException;
import com.example.documentation_center.models.User;
import com.example.documentation_center.repositories.UserDAO;
import com.example.documentation_center.services.exceptions.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserServices implements UserDetailsService {

    @Autowired
    UserDAO userDAO;

    //public UserServices(UserDAO userDAO) {
      //  this.userDAO = userDAO;
    //}

    public UserServices(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    @Override
    public UserDetails loadUserByUsername(String nome) throws UsernameNotFoundException {
        //logger.info("Finding one user by name " + nome + "!");
        var user = userDAO.findByNome(nome);
        if (user != null) {
            return user;
        } else {
            throw new UsernameNotFoundException("Nome " + nome + " not found!");
        }
    }

    public UserDTO create(UserDTO userDTO) {
        var entity = DozerConverter.parseObject(userDTO, User.class);
        return DozerConverter.parseObject(userDAO.save(entity), UserDTO.class);
    }

    public Page<UserDTO> findUserByNome(String firstName, Pageable pageable) {
        var page = userDAO.findUserByNome(firstName, pageable);
        return page.map(this::convertToUserDTO);
    }

    public UserDTO findUserByNome(String nome) {
        var entity = userDAO.findUserByNome(nome);
        if (entity != null) {
            return DozerConverter.parseObject(entity, UserDTO.class);
        } else {
            throw new ResourceNotFoundException("Nome " + nome + " not found!");
        }
    }

    public Page<UserDTO> findAll(Pageable pageable) {
        var page = userDAO.findAll(pageable);
        return page.map(this::convertToUserDTO);
    }

    private UserDTO convertToUserDTO(User entity) {
        return DozerConverter.parseObject(entity, UserDTO.class);
    }

    public UserDTO findById(Long id) {
        var entity = userDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID"));
        return DozerConverter.parseObject(entity, UserDTO.class);
    }

    public UserDTO update(UserDTO user) {
        var entity = userDAO.findById(user.getKey())
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID"));

        entity.setNome(user.getNome());
        entity.setSenha(user.getSenha());
        entity.setDescricao(user.getDescricao());
        entity.setAdmin(user.getAdmin());
        entity.setDataHora(user.getDataHora());

        var vo = DozerConverter.parseObject(userDAO.save(entity), UserDTO.class);
        return vo;
    }

    @Transactional
    public UserDTO disableUser(Long id) {
        //userDAO.disableUser(id);
        var entity = userDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID!"));
        userDAO.disablePerson(id);
        return DozerConverter.parseObject(entity, UserDTO.class);
    }

    public UserDTO findByNomeAndSenha(String nome, String senha) {
        var entity = userDAO.findByNomeAndSenha(nome, senha);
        if (entity != null) {
            return DozerConverter.parseObject(entity, UserDTO.class);
        }
        throw new ResourceNotFoundException("Usuário não encontrado ou senha incorreta");
    }

    public void delete(Long id) {
        User entity = userDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID"));
        userDAO.delete(entity);
    }

}
