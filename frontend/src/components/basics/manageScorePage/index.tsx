import { useEffect, useState } from "react";
import api from "../../../services/api";
import React from 'react';
import './index.css';

interface iScore {
    id: number,
    nomeLogin: string,
    pontos: number,
    time: string,
    sistema: string,
    dataHora: string,
}

const ScoreBody: React.FC = () => {
    const [scores, setScores] = useState<iScore[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/v1/ts/scores', { params: { limit: 50, direction: 'desc' } })
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : (res.data?._embedded?.scoreDTOList ?? []);
                setScores(data);
            })
            .catch(() => setScores([]))
            .finally(() => setLoading(false));
    }, []);

    const medalha = (i: number) => {
        if (i === 0) return 'ouro';
        if (i === 1) return 'prata';
        if (i === 2) return 'bronze';
        return '';
    };

    const emoji = (i: number) => {
        if (i === 0) return '🥇';
        if (i === 1) return '🥈';
        if (i === 2) return '🥉';
        return `#${i + 1}`;
    };

    return (
        <div id='ScoreBody'>
            <h2 id='TitleBar'>🏆 Ranking de Colaboradores</h2>
            <ul id='ScoreUl'>
                {loading && <p id='score-vazio'>Carregando...</p>}
                {!loading && scores.length === 0 && (
                    <p id='score-vazio'>Nenhum score registrado ainda.</p>
                )}
                {scores.map((s, i) => (
                    <div key={s.id} className='score-row'>
                        <span className={`score-posicao ${medalha(i)}`}>{emoji(i)}</span>
                        <div className='score-info'>
                            <span className='score-nome'>{s.nomeLogin}</span>
                            <span className='score-meta'>{s.time} · {s.sistema}</span>
                        </div>
                        <span className='score-pontos'>{s.pontos} pts</span>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default ScoreBody;
