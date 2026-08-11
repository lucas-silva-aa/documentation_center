package com.example.documentation_center.services;


import com.example.documentation_center.converter.DozerConverter;
import com.example.documentation_center.dtos.ScoreDTO;
import com.example.documentation_center.exception.ResourceNotFoundException;
import com.example.documentation_center.models.*;
import com.example.documentation_center.repositories.ScoreDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ScoreServices {
    @Autowired
    private ScoreDAO scoreDAO;
    //private BranchDAO branchDAO;
    //private UserDAO userDAO;

    public ScoreDTO create(ScoreDTO scoreDTO) {
        var entity = DozerConverter.parseObject(scoreDTO, Score.class);
        return DozerConverter.parseObject(scoreDAO.save(entity), ScoreDTO.class);
    }

    public Page<ScoreDTO> findScoreByNome(String nome, Pageable pageable) {
        var page = scoreDAO.findScoreByNome(nome, pageable);
        return page.map(this::convertToScoreDTO);
    }

    public ScoreDTO findScoreByNome(String nome) {
        var entity = scoreDAO.findScoreByNome(nome);
        if (entity != null) {
            return DozerConverter.parseObject(entity, ScoreDTO.class);
        } else {
            throw new ResourceNotFoundException("Score " + nome + " not found!");
        }
    }

    public Page<ScoreDTO> findAll(Pageable pageable) {
        var page = scoreDAO.findAll(pageable);
        return page.map(this::convertToScoreDTO);
    }

    private ScoreDTO convertToScoreDTO(Score entity) {
        return DozerConverter.parseObject(entity, ScoreDTO.class);
    }

    public ScoreDTO findById(Long id) {
        var entity = scoreDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID"));
        return DozerConverter.parseObject(entity, ScoreDTO.class);
    }

    public ScoreDTO update(ScoreDTO score) {
        var entity = scoreDAO.findById(score.getKey())
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID"));

        //entity.setId(score.getKey());
        entity.setNomeLogin(score.getNomeLogin());
        entity.setTime(score.getTime());
        entity.setPontos(score.getPontos());
        entity.setSistema(score.getSistema());
        entity.setDataHora(score.getDataHora());

        return DozerConverter.parseObject(scoreDAO.save(entity), ScoreDTO.class);
    }

  /*  @Transactional
    public AddressVO disableUser(Long id) {
        //scoreDAO.disableScore(id);
        var entity = scoreDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID!"));
        scoreDAO.disablePerson(id);
        return DozerConverter.parseObject(entity, AddressVO.class);
    }*/

    public void delete(Long id) {
        Score entity = scoreDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID"));
        scoreDAO.delete(entity);
    }
}
