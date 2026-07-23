import { useEffect, useState } from "react";
import api from "../../../services/api";
import React from 'react'
import Alert from 'react-popup-alert'
import '../manageUsers/index.css'
import { FiArrowDown, FiArrowUp, FiEdit, FiTrash } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';

interface iuser {
    codigo_user: number,
    nome_user: string,
    descricao_user: string,
    senha_user: string,
    admin_user: string,
    data_user: string,
    _links_user: i_links
}
interface i_links { self: iself }
interface iself { href: string }

const UserBody: React.FC = () => {
    const [Msg, setMsg] = useState<iuser[]>([]);
    const [Limit, setLimit] = useState<iuser[]>([]);
    const [direction] = useState('desc');
    const [ordenation] = useState('codigo');
    const [page, setPage] = useState(0);
    const [codigo, setCodigo] = useState('');
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [admin, setAdmin] = useState('');
    const [date, setDate] = useState('');
    const [descricao2, setDescricao2] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [alertState, setAlertState] = React.useState({ show: false, text: '' });
    const isAdmin = localStorage.getItem('admin') === 'true';
    const history = useHistory();

    useEffect(() => {
        const loadMsg = async () => {
            const response = await api.get('/v1/ts/users', { params: { page, limit: 4, direction, ordenation } });
            const limit = await api.get('/v1/ts/users');
            setMsg(Object.keys(response.data).length ? response.data._embedded.userDTOList : []);
            setLimit(limit.data._embedded.userDTOList);
        };
        loadMsg();
    }, [page]);

    const deleteMsg = async (id: string) => {
        await api.delete('/v1/ts/users/' + id);
        window.location.reload();
    };

    const ExibirMsg = async (id: string) => {
        const response = await api.get('/v1/ts/users/' + id);
        setCodigo(response.data.codigo_user);
        setNome(response.data.nome_user);
        setDescricao2(response.data.descricao_user);
        setSenha(response.data.senha_user);
        setAdmin(response.data.admin_user);
        setDate(response.data.data_user);
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
            <div id='UserBody'>
                <div id='sidebar'>
                    {isAdmin && <button id='newObj' onClick={() => history.push('/newuser')}>Criar novo</button>}
                    <FiArrowUp className='carousel-icon' onClick={() => { if (page > 0) setPage(page - 1); }} />
                    {Msg.map(m => (
                        <div className='item-btn' key={m.codigo_user}>
                            <div className='item-text' onClick={() => ExibirMsg(m.codigo_user.toString())}>
                                <h6>{m.nome_user}</h6>
                                <h4>{m.descricao_user}</h4>
                            </div>
                            <div className='icons-buttons'>
                                {isAdmin && <FiEdit className='edit-btn' onClick={() => history.push('/updateuser', { id: m.codigo_user })} />}
                                {isAdmin && (
                                    <Popup trigger={<FiTrash className='delete-btn' />} position="center center" open={isOpen}>
                                        <h4 id='popupText'>Tem certeza que deseja excluir?</h4>
                                        <button className='conf-delete' onClick={() => deleteMsg(m.codigo_user.toString())}>Sim</button>
                                        <button className='conf-delete' onClick={() => setIsOpen(!isOpen)}>Nao</button>
                                    </Popup>
                                )}
                            </div>
                        </div>
                    ))}
                    <FiArrowDown className='carousel-icon' onClick={() => { if (Msg.length === 4 && page + 1 < Limit.length / 4) setPage(page + 1); }} />
                </div>
                <div>
                    <h2 id='TitleBar'>Lista de users:</h2>
                    <ul id='UserUl'>
                        <div id='UserForm'>
                            <div id='divH1'>
                                <li>
                                    <h1>Id do User: {codigo}</h1>
                                    <h1>Nome: {nome}</h1>
                                    <h1>Descrição: {descricao2}</h1>
                                    <h1>Senha: {senha}</h1>
                                    <h1>Admin: {admin}</h1>
                                    <h1>Data: {date}</h1>
                                </li>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        </>
    );
}
export default UserBody;
