import { useEffect, useState, useRef } from "react";
import api from "../../../services/api";
import React from 'react'
import Alert from 'react-popup-alert'
// @ts-ignore
import '../manageScorePage/index.css'
import { FiArrowDown, FiArrowUp, FiEdit, FiTrash, FiSearch } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import Popup from "reactjs-popup";

interface iScore{
    nomeLogin: string,
    pontos: number,
    time: string,
    sistema: string,
    dataHora: string,
    _links_card: i_links
}
interface i_links {
    self: iself
}
interface iself {
    href: string
}

const CATEGORIAS = ['', 'API', 'Banco de Dados', 'DevOps', 'Frontend', 'Infraestrutura', 'Segurança'];

const ScoreBody: React.FC = () => {
    const [Msg, setMsg] = useState<iScore[]>([]);
    const [totalScores, setTotalScores] = useState(0);
    const [direction] = useState('desc');
    const [ordenation] = useState('codigo');
    const [page, setPage] = useState(0);
    const [busca, setBusca] = useState('');
    const [categoria, setCategoria] = useState('');
    const [codigo, setCodigo] = useState('');
    const [nomeLogin, setNomeLogin] = useState('');
    const [time, setTime] = useState('');
    const [sistema, setSistema] = useState('');
    const [dataHora, setDataHora] = useState('');
    const [pontos, setPontos] = useState(0);
    const alertMsg = useRef('');
    const [alertState, setAlertState] = useState({ show: false, text: '' });
    const isAdmin = localStorage.getItem('admin') === 'true';
    const history = useHistory();

    const PAGE_SIZE = 4;

    useEffect(() => {
        const loadMsg = async () => {
            const params: any = { page, limit: PAGE_SIZE, direction, ordenation };
            if (busca) params.nome = busca;
            if (categoria) params.categoria = categoria;
            const endpoint = (busca || categoria) ? '/v1/ts/scores/pesquisa' : '/v1/ts/scores';
            try {
                const response = await api.get(endpoint, { params });
                const embedded = response.data?._embedded?.scoreDTOList;
                setMsg(embedded ?? []);
                setTotalScores(response.data?.page?.totalElements ?? (embedded?.length ?? 0));
            } catch {
                setMsg([]);
                setTotalScores(0);
            }
        };
        loadMsg();
    }, [page, busca, categoria]);

    // reseta página ao mudar filtro
    useEffect(() => { setPage(0); }, [busca, categoria]);

    const showAlert = (msg: string) => {
        alertMsg.current = msg;
        setAlertState({ show: true, text: msg });
    };

    const ExibirMsg = async (id: string) => {
        const response = await api.get('/v1/ts/scores/' + id);
        const d = response.data;
        setNomeLogin(d.nomeLogin);
        setPontos(d.pontos);
        setDataHora(d.dataHora);
        setSistema(d.sistema);
        setTime(d.time);
    };

    return (
        <>
            <Alert
                header={''}
                btnText={'Fechar'}
                text={alertState.text}
                type={'error'}
                show={alertState.show}
                onClosePress={() => setAlertState({ show: false, text: '' })}
                pressCloseOnOutsideClick={true}
                showBorderBottom={true}
                alertStyles={{
                    "background-color": "#f8f9fa", "width": "300px", "height": "100px",
                    "display": "flex", "flex-direction": "column", "align-items": "center",
                    "justify-content": "center", "left": "42%", "bottom": "30%",
                    "border-radius": "8px", "border": "2px solid #C4C4C4", "position": "absolute"
                }}
                headerStyles={{}} textStyles={{}}
                buttonStyles={{
                    "background-color": "#efefef", "border-radius": "8px", "margin-bottom": "10px",
                    "width": "70px", "border": "2px solid #C4C4C4", "height": "30px",
                    "color": "#000", "padding-left": "10px"
                }}
            />
            <body id='ScoreBody'>
                <div>
                    <h1 id='TitleBar'>Análise de colaboradores:</h1>
                    <ul id='ScoreUl'>
                        <div id='ScoreForm'>
                            <h2 id='TitleBar'>Score dos colaboradores:</h2>
                            {Msg.map(m => (
                                <>  
                                <div id='divH1'>
                                    <h3>Nome:</h3>
                                    <h3> Pontuação:</h3>
                                </div>
                                <div id='divH2'>
                                    <h3>{m.nomeLogin}:</h3>
                                    <h3>{m.pontos}</h3>
                                </div>
                                <h2 id='TitleBar'>Score dos times:</h2>
                                <div id='divH1'>
                                    <h3>Nome:</h3>
                                    <h3> Pontuação:</h3>
                                </div>
                                <div id='divH2'>
                                    <h3>{m.time}:</h3>
                                    <h3>{m.pontos}</h3>
                                </div>
                                <h2 id='TitleBar'>Score dos sistemas:</h2>
                                <div id='divH1'>
                                    <h3>Nome:</h3>
                                    <h3> Pontuação:</h3>
                                </div><div id='divH2'>
                                    <h3>{m.sistema}:</h3>
                                    <h3>{m.pontos}</h3>
                                </div>
                                </>
                            ))}
                        </div>
                    </ul>                    
                </div>
            </body>
        </>
    );
}
export default ScoreBody;