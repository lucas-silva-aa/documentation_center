import { useEffect, useState } from "react";
import api from "../../../services/api";
import React from 'react'
import Alert from 'react-popup-alert'
import '../manageBranchs/index.css'
import { FiArrowDown, FiArrowUp, FiEdit, FiTrash } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import Popup from "reactjs-popup";

interface iuser {
    codigo_user: number,
    nome_user: string,
    descricao_user: string,
    senha_user: string,
    admin_user: string,
    data_user: string,
    _links_user: i_links
}
interface ibranch {
    codigo_branch: number,
    nome_branch: string,
    descricao_branch: string,
    data_branch: string,
    userDTO: iuser,
    _links_branch: i_links
}

interface i_links {
    self: iself
}
interface iself {
    href: string
}

const BranchBody: React.FC = () => {
    const [Msg, setMsg] = useState<ibranch[]>([]);
    const [Limit, setLimit] = useState<ibranch[]>([]);
    const [direction] = useState('desc');
    const [ordenation] = useState('codigo');
    const [page, setPage] = useState(0);
    const [codigo, setCodigo] = useState('');
    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [descricao2, setDescricao2] = useState("");
    const [alertState, setAlertState] = React.useState({ show: false, text: '' });
    const isAdmin = localStorage.getItem('admin') === 'true';
    const history = useHistory();

    useEffect(() => {
        const loadMsg = async () => {
            const response = await api.get('/v1/ts/branchs', { params: { page, limit: 4, direction, ordenation } });
            const limit = await api.get('/v1/ts/branchs');
            if (Object.keys(response.data).length) {
                setMsg(response.data._embedded.branchDTOList);
            } else {
                setMsg([]);
            }
            setLimit(limit.data._embedded.branchDTOList);
        }
        loadMsg()
    }, [page]);

    const deleteMsg = async (codigo: string) => {
        await api.delete('/v1/ts/branchs/' + codigo);
        window.location.reload();
    }

    const updateMsg = (id: number) => history.push('/updatebranch', { id });
    const criarNovo = () => history.push('/newbranch');

    const ExibirMsg = async (codigo: string) => {
        const response = await api.get('/v1/ts/branchs/' + codigo);
        setCodigo(response.data.codigo_branch)
        setNome(response.data.nome_branch)
        setDescricao2(response.data.descricao_branch)
        setData(response.data.data_branch)
    }

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
                headerStyles={{}}
                textStyles={{}}
                buttonStyles={{
                    "background-color": "#efefef", "border-radius": "8px", "margin-bottom": "10px",
                    "width": "70px", "border": "2px solid #C4C4C4", "height": "30px",
                    "color": "#000", "padding-left": "10px"
                }}
            />
            <div id='BranchBody'>
                <div id='sidebar'>
                    {isAdmin && <button id='newObj' onClick={criarNovo}>Criar novo</button>}
                    <FiArrowUp className='carousel-icon' onClick={() => { if (page - 1 >= 0) setPage(page - 1) }} />
                    {Msg.map(m => (
                        <div className='item-btn' key={m.codigo_branch}>
                            <div className='item-text' onClick={() => ExibirMsg(m.codigo_branch.toString())}>
                                <h6>{m.nome_branch}</h6>
                                <h4>{m.descricao_branch}</h4>
                            </div>
                            <div className='icons-buttons'>
                                {isAdmin && <FiEdit className='edit-btn' onClick={() => updateMsg(m.codigo_branch)} />}
                                {isAdmin && (
                                    <Popup trigger={<FiTrash className='delete-btn' />} position="center center" open={isOpen}>
                                        <h4 id='popupText'>Tem certeza que deseja excluir?</h4>
                                        <button className='conf-delete' onClick={() => deleteMsg(m.codigo_branch.toString())}>Sim</button>
                                        <button className='conf-delete' onClick={() => setIsOpen(!isOpen)}>Nao</button>
                                    </Popup>
                                )}
                            </div>
                        </div>
                    ))}
                    <FiArrowDown className='carousel-icon' onClick={() => { if (Msg.length === 4 && page + 1 < Limit.length / 4) { setPage(page + 1) } }} />
                </div>
                <div>
                    <h2 id='TitleBar'>Lista de branchs:</h2>
                    <ul id='BranchUl'>
                        <div id='BranchForm'>
                            <div id='divH1'>
                                <li>
                                    <h1>Id do Branch: {codigo}</h1>
                                    <h1>Nome: {nome}</h1>
                                    <h1>Descrição: {descricao2}</h1>
                                    <h1>Data de criação: {data}</h1>
                                </li>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        </>
    );
}
export default BranchBody;
