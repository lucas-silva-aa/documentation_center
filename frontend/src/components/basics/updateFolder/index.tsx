import { useEffect, useState } from "react";
import api from "../../../services/api";
import Alert from 'react-popup-alert';
import './index.css';
import React from 'react';
import { useLocation } from 'react-router-dom';

interface ibranch {
    codigo_branch: number;
    nome_branch: string;
}

interface LocationState { id?: number; }

const HomeBody: React.FC = () => {
    const [inputCodigo, setInputCodigo] = useState<number | ''>('');
    const [inputNome, setInputNome] = useState('');
    const [inputDescricao, setInputDescricao] = useState('');
    const [branches, setBranches] = useState<ibranch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<ibranch | null>(null);
    const [post, setPost] = useState(false);
    const [descricao, setDescricao] = useState('');
    const location = useLocation<LocationState>();

    useEffect(() => {
        const id = location.state?.id;
        if (!id) return;
        setInputCodigo(id);

        Promise.all([
            api.get('/v1/ts/branchs', { params: { limit: 100 } }),
            api.get('/v1/ts/folders/' + id),
        ]).then(([branchRes, folderRes]) => {
            const list: ibranch[] = branchRes.data?._embedded?.branchDTOList ?? [];
            setBranches(list);
            setInputNome(folderRes.data.nome_folder ?? '');
            setInputDescricao(folderRes.data.descricao_folder ?? '');
            const bid = folderRes.data.idBranch;
            const found = list.find(b => b.codigo_branch === bid);
            if (found) setSelectedBranch(found);
        }).catch(() => {});
    }, []);

    const postMsg = async () => {
        if (!inputCodigo) {
            setDescricao('Nenhum folder selecionado para editar');
            setPost(p => !p);
            return;
        }
        if (!selectedBranch) {
            setDescricao('Selecione uma branch');
            setPost(p => !p);
            return;
        }
        const userId = Number(localStorage.getItem('userId') ?? 1);
        let flag2 = false;
        await api.put('/v1/ts/folders/' + inputCodigo, {
            nome_folder: inputNome,
            descricao_folder: inputDescricao,
            idBranch: selectedBranch.codigo_branch,
            idUser: userId,
        }).then(r => r.data).catch(async error => {
            if (error.response) {
                setDescricao(error.response.data?.descricao ?? 'Erro ao atualizar');
                flag2 = true;
                setPost(p => !p);
            }
        });
        if (!flag2) window.location.reload();
    };

    useEffect(() => { if (post) onShowAlert('error'); }, [post]);
    const [alert, setAlert] = React.useState({ type: 'error', text: descricao, show: false });
    function onCloseAlert() { setAlert({ type: '', text: '', show: false }); setPost(p => !p); }
    function onShowAlert(type: string) { setAlert({ type, text: descricao, show: true }); }

    return (
        <>
            <Alert
                header={''} btnText={'Fechar'} text={alert.text} type={alert.type} show={alert.show}
                onClosePress={onCloseAlert} pressCloseOnOutsideClick={true} showBorderBottom={true}
                alertStyles={{ "background-color": "#f8f9fa", "width": "300px", "height": "100px", "display": "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", "left": "42%", "bottom": "30%", "border-radius": "8px", "border": "2px solid #C4C4C4", "position": "absolute" }}
                headerStyles={{}} textStyles={{}}
                buttonStyles={{ "background-color": "#efefef", "border-radius": "8px", "margin-bottom": "10px", "text-decoration": "none", "button-decoration": "none", "align-text": "center", "width": "70px", "border": "2px solid #C4C4C4", "height": "30px", "color": "#000", "padding-left": "10px" }}
            />
            <div id='CriarUserBody'>
                <h2 id='TitleBar'>Atualizar Folder {inputCodigo ? `#${inputCodigo}` : ''}</h2>
                <ul id='UserUl'>
                    <div id='UserForm'>
                        <div id='divH1'>
                            <h1>Nome*: </h1>
                            <h1>Descrição: </h1>
                            <h1>Branch*: </h1>
                        </div>
                        <div id='divInput'>
                            <input type="text" value={inputNome} onChange={e => setInputNome(e.target.value)} required />
                            <input type="text" value={inputDescricao} onChange={e => setInputDescricao(e.target.value)} />
                            <select
                                value={selectedBranch?.codigo_branch ?? ''}
                                onChange={e => {
                                    const found = branches.find(b => b.codigo_branch === Number(e.target.value));
                                    setSelectedBranch(found ?? null);
                                }}
                                required
                            >
                                <option value=''>Selecione uma branch...</option>
                                {branches.map(b => (
                                    <option key={b.codigo_branch} value={b.codigo_branch}>{b.nome_branch}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button type="submit" onClick={postMsg}>Atualizar</button>
                </ul>
            </div>
        </>
    );
};

export default HomeBody;
