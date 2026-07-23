import { useEffect, useState } from "react";
import api from "../../../services/api";
import './index.css';
import React from 'react';
import Alert from 'react-popup-alert';

interface ibranch {
    codigo_branch: number;
    nome_branch: string;
}

const HomeBody: React.FC = () => {
    const [inputNome, setInputNome] = useState('');
    const [inputDescricao, setInputDescricao] = useState('');
    const [branches, setBranches] = useState<ibranch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<ibranch | null>(null);
    const [post, setPost] = useState(false);
    const [descricao, setDescricao] = useState('');

    useEffect(() => {
        api.get('/v1/ts/branchs', { params: { limit: 100 } })
            .then(res => setBranches(res.data?._embedded?.branchDTOList ?? []))
            .catch(() => setBranches([]));
    }, []);

    const postMsg = async () => {
        if (!selectedBranch) {
            setDescricao('Selecione uma branch');
            setPost(p => !p);
            return;
        }
        let flag2 = false;
        const userId = Number(localStorage.getItem('userId') ?? 1);
        await api.post('/v1/ts/folders', {
            nome_folder: inputNome,
            descricao_folder: inputDescricao,
            idBranch: selectedBranch.codigo_branch,
            idUser: userId,
        }).then(r => r.data).catch(async error => {
            if (error.response) {
                setDescricao(error.response.data?.descricao ?? 'Erro ao cadastrar');
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
            <div id='CriarFolderBody'>
                <h2 id='TitleBar'>Cadastro de Folder</h2>
                <ul id='FolderUl'>
                    <div id='FolderForm'>
                        <div id='divH1'>
                            <h1>Nome*: </h1>
                            <h1>Descrição: </h1>
                            <h1>Branch*: </h1>
                        </div>
                        <div id='divInput'>
                            <input id='input' type="text" value={inputNome} onChange={e => setInputNome(e.target.value)} required />
                            <input id='input' type="text" value={inputDescricao} onChange={e => setInputDescricao(e.target.value)} />
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
                    <button type="submit" onClick={postMsg}>Cadastrar</button>
                </ul>
            </div>
        </>
    );
};

export default HomeBody;
