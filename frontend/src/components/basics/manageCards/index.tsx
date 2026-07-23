import { useEffect, useState, useRef } from "react";
import api from "../../../services/api";
import React from 'react'
import Alert from 'react-popup-alert'
import '../manageCards/index.css'
import { FiArrowDown, FiArrowUp, FiEdit, FiTrash, FiSearch } from "react-icons/fi";
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
interface ifolder {
    codigo_folder: number,
    nome_folder: string,
    descricao_folder: string,
    data_folder: string,
    branchDTO: ibranch,
    _links_folder: i_links
}
interface icard {
    codigo_card: number,
    nome_card: string,
    descricao_card: string,
    thumbnail_card: string,
    data_card: string,
    resumo_card: string,
    tags_card: string,
    categoria_card: string,
    folderDTO: ifolder,
    _links_card: i_links
}
interface i_links {
    self: iself
}
interface iself {
    href: string
}

const CATEGORIAS = ['', 'API', 'Banco de Dados', 'DevOps', 'Frontend', 'Infraestrutura', 'Segurança'];

const CardBody: React.FC = () => {
    const [Msg, setMsg] = useState<icard[]>([]);
    const [totalCards, setTotalCards] = useState(0);
    const [direction] = useState('desc');
    const [ordenation] = useState('codigo');
    const [page, setPage] = useState(0);
    const [busca, setBusca] = useState('');
    const [categoria, setCategoria] = useState('');
    const [codigo, setCodigo] = useState('');
    const [nome, setNome] = useState('');
    const [thumbnailLink, setThumbnailLink] = useState('');
    const [data, setData] = useState('');
    const [folderId, setFolderId] = useState('');
    const [folderNome, setFolderNome] = useState('');
    const [branchId, setBranchId] = useState('');
    const [branchNome, setBranchNome] = useState('');
    const [userId, setUserId] = useState('');
    const [userNome, setUserNome] = useState('');
    const [descricao2, setDescricao2] = useState('');
    const [resumo, setResumo] = useState('');
    const [tags, setTags] = useState('');
    const [categoriaCard, setCategoriaCard] = useState('');
    const [isOpen, setIsOpen] = useState(false);
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
            const endpoint = (busca || categoria) ? '/v1/ts/cards/pesquisa' : '/v1/ts/cards';
            try {
                const response = await api.get(endpoint, { params });
                const embedded = response.data?._embedded?.cardDTOList;
                setMsg(embedded ?? []);
                setTotalCards(response.data?.page?.totalElements ?? (embedded?.length ?? 0));
            } catch {
                setMsg([]);
                setTotalCards(0);
            }
        };
        loadMsg();
    }, [page, busca, categoria]);

    useEffect(() => { setPage(0); }, [busca, categoria]);

    const showAlert = (msg: string) => {
        alertMsg.current = msg;
        setAlertState({ show: true, text: msg });
    };

    const deleteMsg = async (id: string) => {
        if (!isAdmin) { showAlert('Você não tem permissão'); return; }
        await api.delete('/v1/ts/cards/' + id);
        window.location.reload();
    };

    const updateMsg = (id: number) => {
        if (!isAdmin) { showAlert('Você não tem permissão'); return; }
        history.push('/updatecard', { id });
    };

    const criarNovo = () => {
        if (!isAdmin) { showAlert('Você não tem permissão'); return; }
        history.push('/newcard');
    };

    const ExibirMsg = async (id: string) => {
        const response = await api.get('/v1/ts/cards/' + id);
        const d = response.data;
        setCodigo(d.codigo_card);
        setNome(d.nome_card);
        setDescricao2(d.descricao_card);
        setThumbnailLink(d.thumbnail_card);
        setData(d.data_card);
        setResumo(d.resumo_card ?? '');
        setTags(d.tags_card ?? '');
        setCategoriaCard(d.categoria_card ?? '');
        setFolderId(d.idFolder ?? '');
        setBranchId(d.idBranch ?? '');
        setUserId(d.idUser ?? '');
        setFolderNome('');
        setBranchNome('');
        setUserNome('');
        if (d.idFolder) api.get('/v1/ts/folders/' + d.idFolder)
            .then(r => setFolderNome(r.data.nome_folder ?? '')).catch(() => {});
        if (d.idBranch) api.get('/v1/ts/branchs/' + d.idBranch)
            .then(r => setBranchNome(r.data.nome_branch ?? '')).catch(() => {});
        if (d.idUser) api.get('/v1/ts/users/' + d.idUser)
            .then(r => setUserNome(r.data.nome_user ?? '')).catch(() => {});
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
            <div id='CardBody'>
                <div id='sidebar'>
                    {isAdmin && <button id='newObj' onClick={criarNovo}>Criar novo</button>}

                    <div id='searchBar'>
                        <FiSearch id='searchIcon' />
                        <input
                            id='searchInput'
                            placeholder='Buscar por nome...'
                            value={busca}
                            onChange={e => setBusca(e.target.value)}
                        />
                        <select
                            id='categoriaSelect'
                            value={categoria}
                            onChange={e => setCategoria(e.target.value)}
                        >
                            {CATEGORIAS.map(c => (
                                <option key={c} value={c}>{c || 'Todas as categorias'}</option>
                            ))}
                        </select>
                    </div>

                    <FiArrowUp className='carousel-icon' onClick={() => { if (page > 0) setPage(page - 1); }} />
                    {Msg.map(m => (
                        <div className='item-btn' key={m.codigo_card}>
                            <div className='item-text' onClick={() => ExibirMsg(m.codigo_card.toString())}>
                                <h6>{m.nome_card}</h6>
                                {m.resumo_card && <h4>{m.resumo_card}</h4>}
                            </div>
                            <div className='icons-buttons'>
                                {isAdmin && <FiEdit className='edit-btn' onClick={() => updateMsg(m.codigo_card)} />}
                                {isAdmin && (
                                    <Popup trigger={<FiTrash className='delete-btn' />} position="center center" open={isOpen}>
                                        <h4 id='popupText'>Tem certeza que deseja excluir?</h4>
                                        <button className='conf-delete' onClick={() => deleteMsg(m.codigo_card.toString())}>Sim</button>
                                        <button className='conf-delete' onClick={() => setIsOpen(!isOpen)}>Nao</button>
                                    </Popup>
                                )}
                            </div>
                        </div>
                    ))}
                    <FiArrowDown className='carousel-icon' onClick={() => {
                        if (Msg.length === PAGE_SIZE && (page + 1) * PAGE_SIZE < totalCards) setPage(page + 1);
                    }} />
                </div>
                <div>
                    <h2 id='TitleBar'>Lista de cards:</h2>
                    <ul id='CardUl'>
                        <div id='CardForm'>
                            <div id='divH1'>
                                <li>
                                    <h1>Id do Card: {codigo}</h1>
                                    <h1>Nome: {nome}</h1>
                                    {resumo && <h1>Resumo: {resumo}</h1>}
                                    {categoriaCard && <h1>Categoria: {categoriaCard}</h1>}
                                    {tags && <h1>Tags: {tags}</h1>}
                                    {thumbnailLink && (
                                        <img
                                            src={thumbnailLink}
                                            alt='thumbnail'
                                            id='card-thumbnail'
                                            onError={e => {
                                                const img = e.target as HTMLImageElement;
                                                img.onerror = null;
                                                img.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    {descricao2 && (
                                        <div id='descricao-html' dangerouslySetInnerHTML={{ __html: descricao2 }} />
                                    )}
                                    <h1>Data: {data}</h1>
                                    <h1>Folder Id: {folderId}</h1>
                                    <h1>Folder Nome: {folderNome}</h1>
                                    <h1>Branch Id: {branchId}</h1>
                                    <h1>Branch Nome: {branchNome}</h1>
                                    <h1>User Id: {userId}</h1>
                                    <h1>User Nome: {userNome}</h1>
                                </li>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        </>
    );
}
export default CardBody;
