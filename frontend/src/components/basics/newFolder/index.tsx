import { useEffect, useState } from "react";
import api from "../../../services/api";
// @ts-ignore
import './index.css'
import React from 'react';
import Alert from 'react-popup-alert'
// @ts-ignore
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
const HomeBody: React.FC = () => {
    const [inputNome, setInputNome] = useState('');
    const [inputDescricao2, setInputDescricao2] = useState('');
    const [branchId, setBranchId] = useState<ibranch[]>([]);
    const [inputBranchId, setInputBranchId] = useState('');
    const [post, setPost] = useState(false);
    const [descricao, setDescricao] = useState("");


    const postMsg = async () => {
        let flag2 = false;
        const response = await api.post('/v1/ts/folders/', {
            "nome_folder": inputNome,
            "descricao_folder": inputDescricao2,
            "branchDTO": branchId
        }).then(response => response.data)
            .catch(async error => {
                if (error.response) {
                    await setDescricao(error.response.data.descricao)
                    flag2 = true;
                    setPost(!post)
                }
            });
        if (!flag2) {
            window.location.reload();
        }
    }
    useEffect(() => {
        if (post) {
            onShowAlert('error')
        }
    }, [post])
    const [alert, setAlert] = React.useState({
        type: 'error',
        text: descricao,
        show: false
    })
    function onCloseAlert() {
        setAlert({
            type: '',
            text: '',
            show: false
        })
        setPost(!post)
    }
    function onShowAlert(type: string) {
        setAlert({
            type: type,
            text: descricao,
            show: true
        })
    }

    useEffect(() => {
        const findBranchById = async () => {
            const response = await api.get('/v1/ts/branchs/' + inputBranchId)
            setBranchId(response.data)
        }
        findBranchById()
    }, [inputBranchId])

    return (
        <>
            <Alert
                header={''}
                btnText={'Fechar'}
                text={alert.text}
                type={alert.type}
                show={alert.show}
                onClosePress={onCloseAlert}
                pressCloseOnOutsideClick={true}
                showBorderBottom={true}
                alertStyles={{
                    "background-color": "#f8f9fa",
                    "width": "300px",
                    "height": "100px",
                    "display": "flex",
                    "flex-direction": "column",
                    "align-items": "center",
                    "justify-content": "center",
                    "left": "42%",
                    "bottom": "30%",
                    "border-radius": "8px",
                    "border": "2px solid #C4C4C4",
                    "position": "absolute"
                }}
                headerStyles={{}}
                textStyles={{}}
                buttonStyles={{
                    "background-color": "#efefef",
                    "border-radius": "8px",
                    "margin-bottom": "10px",
                    "text-decoration": "none",
                    "button-decoration": "none",
                    "align-text": "center",
                    "width": "70px",
                    "border": "2px solid #C4C4C4",
                    "height": "30px",
                    "color": "#000",
                    "padding-left": "10px"
                }}
            />
            <body id='CriarFolderBody'>
                <h2 id='TitleBar'>Cadastro de Folder</h2>
                <ul id='FolderUl'>
                    <div id='FolderForm'>
                        <div id='divH1'>
                            <h1>Nome*: </h1>
                            <h1>Descrição: </h1>
                            <h1>ID da Branch*: </h1>
                        </div>
                        <div id='divInput'>
                            <input id='input' type="text" value={inputNome} onChange={e => setInputNome(e.target.value)} required />
                            <input id='input' type="text" value={inputDescricao2} onChange={e => setInputDescricao2(e.target.value)} required />
                            <input id='input' type="text" value={inputBranchId} onChange={e => setInputBranchId(e.target.value)} required />
                        </div>
                    </div>
                    <button type="submit" onClick={postMsg}>Cadastrar</button>
                </ul>
            </body>
        </>
    );
}
export default HomeBody;
