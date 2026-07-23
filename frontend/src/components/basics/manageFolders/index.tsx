import { useEffect, useState } from "react";
import api from "../../../services/api";
import React from 'react'
import Alert from 'react-popup-alert'
import '../manageFolders/index.css'
import { useHistory } from 'react-router-dom';
import { FiArrowDown, FiArrowUp, FiEdit, FiTrash } from "react-icons/fi";
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
interface ifolder {
    codigo_folder: number,
    nome_folder: string,
    descricao_folder: string,
    data_folder: string,
    branchDTO: ibranch,
    _links_folder: i_links
}
interface i_links { self: iself }
interface iself { href: string }

const FolderBody: React.FC = () => {
    const [Msg, setMsg] = useState<ifolder[]>([]);
    const [Limit, setLimit] = useState<ifolder[]>([]);
    const [direction] = useState('desc');
    const [ordenation] = useState('codigo');
    const [page, setPage] = useState(0);
    const [codigo, setCodigo] = useState('');
    const [nome, setNome] = useState('');
    const [userId, setUserId] = useState('');
    const [userNome, setUserNome] = useState('');
    const [data, setData] = useState('');
    const [branchId, setBranchId] = useState('');
    const [branchNome, setBranchNome] = useState('');
    const [descricao2, setDescricao2] = useState('');

    const [isOpen, setIsOpen] = useState(false);
    const [alertState, setAlertState] = React.useState({ show: false, text: '' });
    const isAdmin = localStorage.getItem('admin') === 'true';
    const history = useHistory();

    useEffect(() => {
        const loadMsg = async () => {
            const response = await api.get('/v1/ts/folders', { params: { page, limit: 4, direction, ordenation } });
            const limit = await api.get('/v1/ts/folders');
            setMsg(Object.keys(response.data).length ? response.data._embedded.folderDTOList : []);
            setLimit(limit.data._embedded.folderDTOList);
        };
        loadMsg();
    }, [page]);

    const deleteMsg = async (id: string) => {
        await api.delete('/v1/ts/folders/' + id);
        window.location.reload();
    };

    const ExibirMsg = async (id: string) => {
        const response = await api.get('/v1/ts/folders/' + id);
        setCodigo(response.data.codigo_folder);
        setNome(response.data.nome_folder);
        setDescricao2(response.data.descricao_folder);
        setData(response.data.data_folder);
        const bid = response.data.idBranch;
        const uid = response.data.idUser;
        setBranchId(bid ?? '');
        setUserId(uid ?? '');
        setBranchNome('');
        setUserNome('');
        if (bid) {
            api.get('/v1/ts/branchs/' + bid)
                .then(r => setBranchNome(r.data.nome_branch ?? ''))
                .catch(() => {});
        }
        if (uid) {
            api.get('/v1/ts/users/' + uid)
                .then(r => setUserNome(r.data.nome_user ?? ''))
                .catch(() => {});
        }
    };

    return (
        <>
            <Alert
                header={''} btnText={'Fechar'} text={alertState.text} type={'error'}
                show={alertState.show} onClosePress={() => setAlertState({ show: false, text: '' })}
                pressCloseOnOutsideClick={true} showBorderBottom={true}
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
            <div id='FolderBody'>
                <div id='sidebar'>
                    {isAdmin && <button id='newObj' onClick={() => history.push('/newfolder')}>Criar novo</button>}
                    <FiArrowUp className='carousel-icon' onClick={() => { if (page > 0) setPage(page - 1); }} />
                    {Msg.map(m => (
                        <div className='item-btn' key={m.codigo_folder}>
                            <div className='item-text' onClick={() => ExibirMsg(m.codigo_folder.toString())}>
                                <h6>{m.nome_folder}</h6>
                                <h4>{m.descricao_folder}</h4>
                            </div>
                            <div className='icons-buttons'>
                                {isAdmin && <FiEdit className='edit-btn' onClick={() => history.push('/updatefolder', { id: m.codigo_folder })} />}
                                {isAdmin && (
                                    <Popup trigger={<FiTrash className='delete-btn' />} position="center center" open={isOpen}>
                                        <h4 id='popupText'>Tem certeza que deseja excluir?</h4>
                                        <button className='conf-delete' onClick={() => deleteMsg(m.codigo_folder.toString())}>Sim</button>
                                        <button className='conf-delete' onClick={() => setIsOpen(!isOpen)}>Nao</button>
                                    </Popup>
                                )}
                            </div>
                        </div>
                    ))}
                    <FiArrowDown className='carousel-icon' onClick={() => { if (Msg.length === 4 && page + 1 < Limit.length / 4) setPage(page + 1); }} />
                </div>
                <div>
                    <h2 id='TitleBar'>Lista de folders:</h2>
                    <ul id='FolderUl'>
                        <div id='FolderForm'>
                            <div id='divH1'>
                                <li>
                                    <h1>Id do Folder: {codigo}</h1>
                                    <h1>Nome: {nome}</h1>
                                    <h1>Descrição: {descricao2}</h1>
                                    <h1>Data: {data}</h1>
                                    <h1>Id da Branch: {branchId}</h1>
                                    <h1>Nome da Branch: {branchNome}</h1>
                                    <h1>Id do User: {userId}</h1>
                                    <h1>Nome do User: {userNome}</h1>
                                </li>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        </>
    );
}
export default FolderBody;
