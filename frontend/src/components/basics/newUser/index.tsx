import { useEffect, useState } from "react";
import api from "../../../services/api";
import Alert from 'react-popup-alert'
// @ts-ignore
import './index.css'
import React from 'react';
// @ts-ignore
import 'reactjs-popup/dist/index.css';

const HomeBody: React.FC = () => {
    const [inputNome, setInputNome] = useState('');
    const [inputSenha, setInputSenha] = useState('');
    const [inputAdmin, setInputAdmin] = useState('false');
    const [inputDescricao, setInputDescricao] = useState('');
    const [post, setPost] = useState(false);
    const [descricao, setDescricao] = useState("");

    const postMsg = async () => {
        let flag2 = false;
        const response = await api.post('/v1/ts/users', {
            "nome_user": inputNome,
            "descricao_user": inputDescricao,
            "senha_user": inputSenha,
            "admin_user": inputAdmin
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
            <body id='CriarUserBody'>
                <h2 id='TitleBar'>Cadastro de User</h2>
                <ul id='UserUl'>
                    <div id='UserForm'>
                        <div id='divH1'>
                            <h1>Nome*: </h1>
                            <h1>Senha*: </h1>
                            <h1>Descrição: </h1>
                            <h1>Admin*: </h1>
                        </div>
                        <div id='divInput'>
                            <input id='input' type="text" value={inputNome} onChange={e => setInputNome(e.target.value)} required />
                            <input id='input' type="text" value={inputSenha} onChange={e => setInputSenha(e.target.value)} required />
                            <input id='input' type="text" value={inputDescricao} onChange={e => setInputDescricao(e.target.value)} required />
                            <div className="radios">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="exampleRadios" id="statusRadiosInput" value="option1" onChange={e => setInputAdmin(e.target.value)} />
                                    <label className="form-check-label" >
                                        Sim
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="exampleRadios" id="statusRadiosInput" value="option2" onChange={e => setInputAdmin(e.target.value)} />
                                    <label className="form-check-label" >
                                        Não
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" onClick={postMsg}>Cadastrar</button>
                </ul>
            </body>
        </>
    );
}
export default HomeBody;
