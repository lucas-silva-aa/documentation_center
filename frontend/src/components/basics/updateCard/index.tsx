import { useEffect, useState } from "react";
import api from "../../../services/api";
import Alert from 'react-popup-alert'
import './index.css'
import React from 'react';
import 'reactjs-popup/dist/index.css';
import RichTextEditor from '../richTextEditor';
import { useLocation, useHistory } from 'react-router-dom';

interface ifolder {
    codigo_folder: number,
    nome_folder: string,
    descricao_folder: string,
    data_folder: string,
}

interface LocationState { id?: number; }

const HomeBody: React.FC = () => {
    const [inputCodigo, setInputCodigo] = useState<number | ''>('');
    const [inputNome, setInputNome] = useState('');
    const [inputDescricao, setInputDescricao] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [uploadingThumb, setUploadingThumb] = useState(false);
    const [folders, setFolders] = useState<ifolder[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<ifolder | null>(null);
    const [post, setPost] = useState(false);
    const [descricao, setDescricao] = useState('');
    const location = useLocation<LocationState>();
    const history = useHistory();

    useEffect(() => {
        Promise.all([
            api.get('/v1/ts/folders', { params: { limit: 100 } }),
        ]).then(([folderRes]) => {
            const list: ifolder[] = folderRes.data?._embedded?.folderDTOList ?? [];
            setFolders(list);

            const id = location.state?.id;
            if (!id) return;
            setInputCodigo(id);
            api.get('/v1/ts/cards/' + id).then(cardRes => {
                const d = cardRes.data;
                setInputNome(d.nome_card ?? '');
                setInputDescricao(d.descricao_card ?? '');
                setThumbnailUrl(d.thumbnail_card ?? '');
                if (d.thumbnail_card) setThumbnailPreview(d.thumbnail_card);
                const fid = d.idFolder;
                const found = list.find(f => f.codigo_folder === fid);
                if (found) setSelectedFolder(found);
            }).catch(() => {});
        }).catch(() => {});
    }, []);

    const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setThumbnailPreview(URL.createObjectURL(file));
        setUploadingThumb(true);
        try {
            const formData = new FormData();
            formData.append('arquivo', file);
            const res = await api.post('/v1/ts/imagens', formData);
            setThumbnailUrl(`http://localhost:8080/v1/ts/imagens/${res.data.id}`);
        } finally {
            setUploadingThumb(false);
        }
    };

    const postMsg = async () => {
        if (!inputCodigo) {
            setDescricao('Nenhum card selecionado para editar');
            setPost(p => !p);
            return;
        }
        let flag2 = false;
        await api.put('/v1/ts/cards/' + inputCodigo, {
            nome_card: inputNome,
            descricao_card: inputDescricao,
            ...(thumbnailUrl ? { thumbnail_card: thumbnailUrl } : {}),
            ...(selectedFolder ? { folderDTO: { codigo_folder: selectedFolder.codigo_folder } } : {}),
        }).then(response => response.data)
            .catch(async error => {
                if (error.response) {
                    await setDescricao(error.response.data?.descricao ?? 'Erro ao atualizar');
                    flag2 = true;
                    setPost(p => !p);
                }
            });
        if (!flag2) history.push('/');
    };

    useEffect(() => {
        if (post) onShowAlert('error');
    }, [post]);

    const [alert, setAlert] = React.useState({ type: 'error', text: descricao, show: false });

    function onCloseAlert() {
        setAlert({ type: '', text: '', show: false });
        setPost(p => !p);
    }
    function onShowAlert(type: string) {
        setAlert({ type, text: descricao, show: true });
    }

    return (
        <>
            <Alert
                header={''} btnText={'Fechar'} text={alert.text} type={alert.type} show={alert.show}
                onClosePress={onCloseAlert} pressCloseOnOutsideClick={true} showBorderBottom={true}
                alertStyles={{
                    "background-color": "#f8f9fa", "width": "300px", "height": "100px",
                    "display": "flex", "flex-direction": "column", "align-items": "center",
                    "justify-content": "center", "left": "42%", "bottom": "30%",
                    "border-radius": "8px", "border": "2px solid #C4C4C4", "position": "absolute"
                }}
                headerStyles={{}} textStyles={{}}
                buttonStyles={{
                    "background-color": "#efefef", "border-radius": "8px", "margin-bottom": "10px",
                    "text-decoration": "none", "button-decoration": "none", "align-text": "center",
                    "width": "70px", "border": "2px solid #C4C4C4", "height": "30px",
                    "color": "#000", "padding-left": "10px"
                }}
            />
            <div id='CriarUserBody'>
                <h2 id='TitleBar'>Atualizar Card {inputCodigo ? `#${inputCodigo}` : ''}</h2>
                <ul id='UserUl'>
                    <div id='UserForm'>
                        <div id='divH1'>
                            <h1>Nome*: </h1>
                            <h1>Thumbnail: </h1>
                            <h1>Folder: </h1>
                        </div>
                        <div id='divInput'>
                            <input id='input' type="text" value={inputNome} onChange={e => setInputNome(e.target.value)} required />

                            <div id='thumbnail-upload'>
                                <input type="file" accept="image/*" onChange={handleThumbnailChange} />
                                {uploadingThumb && <span>Enviando...</span>}
                                {thumbnailPreview && (
                                    <img src={thumbnailPreview} alt="preview" id='thumbnail-preview' />
                                )}
                            </div>

                            <select
                                id='input'
                                value={selectedFolder?.codigo_folder ?? ''}
                                onChange={e => {
                                    const found = folders.find(f => f.codigo_folder === Number(e.target.value));
                                    setSelectedFolder(found ?? null);
                                }}
                            >
                                <option value=''>Manter folder atual</option>
                                {folders.map(f => (
                                    <option key={f.codigo_folder} value={f.codigo_folder}>{f.nome_folder}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div id='editor-section'>
                        <h3>Conteúdo:</h3>
                        <RichTextEditor content={inputDescricao} onChange={setInputDescricao} />
                    </div>

                    <button type="submit" onClick={postMsg}>Atualizar</button>
                </ul>
            </div>
        </>
    );
};

export default HomeBody;
