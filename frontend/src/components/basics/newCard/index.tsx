import { useEffect, useState } from "react";
import api from "../../../services/api";
import './index.css'
import React from 'react';
import Alert from 'react-popup-alert'
import 'reactjs-popup/dist/index.css';
import RichTextEditor from '../richTextEditor';

interface ifolder {
    codigo_folder: number,
    nome_folder: string,
    descricao_folder: string,
    data_folder: string,
    idBranch?: number,
    idUser?: number,
}

const HomeBody: React.FC = () => {
    const [inputNome, setInputNome] = useState('');
    const [inputDescricao, setInputDescricao] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [uploadingThumb, setUploadingThumb] = useState(false);
    const [folders, setFolders] = useState<ifolder[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<ifolder | null>(null);
    const [post, setPost] = useState(false);
    const [descricao, setDescricao] = useState('');

    const [resumo, setResumo] = useState('');
    const [loadingResumo, setLoadingResumo] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [categoria, setCategoria] = useState('');
    const [loadingTags, setLoadingTags] = useState(false);

    useEffect(() => {
        api.get('/v1/ts/folders', { params: { limit: 100 } })
            .then(res => setFolders(res.data?._embedded?.folderDTOList ?? []))
            .catch(() => setFolders([]));
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

    const gerarResumo = async () => {
        if (!inputNome && !inputDescricao) return;
        setLoadingResumo(true);
        try {
            const response = await api.post('/v1/ts/ia/resumo', { titulo: inputNome, conteudo: inputDescricao });
            setResumo(response.data.resumo || '');
        } catch {
            setResumo('Não foi possível gerar o resumo.');
        } finally {
            setLoadingResumo(false);
        }
    };

    const sugerirTags = async () => {
        if (!inputNome && !inputDescricao) return;
        setLoadingTags(true);
        try {
            const response = await api.post('/v1/ts/ia/sugestoes', { titulo: inputNome, conteudo: inputDescricao });
            const json = JSON.parse(response.data);
            setTags(json.tags || []);
            setCategoria(json.categoria || '');
        } catch {
            setTags([]); setCategoria('');
        } finally {
            setLoadingTags(false);
        }
    };

    const removerTag = (tag: string) => setTags(tags.filter(t => t !== tag));

    const postMsg = async () => {
        if (!selectedFolder) {
            setDescricao('Selecione um folder');
            setPost(p => !p);
            return;
        }
        const userId = Number(localStorage.getItem('userId') ?? 1);
        let flag2 = false;
        await api.post('/v1/ts/cards', {
            nome_card: inputNome,
            descricao_card: inputDescricao,
            thumbnail_card: thumbnailUrl || null,
            resumo_card: resumo || null,
            tags_card: tags.length > 0 ? tags.join(',') : null,
            categoria_card: categoria || null,
            folderDTO: { codigo_folder: selectedFolder.codigo_folder },
            idBranch: selectedFolder.idBranch ?? null,
            idUser: userId,
        }).then(response => response.data)
            .catch(async error => {
                if (error.response) {
                    await setDescricao(error.response.data.descricao);
                    flag2 = true;
                    setPost(p => !p);
                }
            });
        if (!flag2) window.location.reload();
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
            <div id='CriarCardBody'>
                <h2 id='TitleBar'>Cadastro de Card</h2>
                <ul id='CardUl'>
                    <div id='CardForm'>
                        <div className='form-row'>
                            <span className='form-label'>Nome*:</span>
                            <input type="text" value={inputNome} onChange={e => setInputNome(e.target.value)} required />
                        </div>

                        <div className='form-row'>
                            <span className='form-label'>Thumbnail:</span>
                            <div id='thumbnail-upload'>
                                <input type="file" accept="image/*" onChange={handleThumbnailChange} />
                                {uploadingThumb && <span>Enviando...</span>}
                                {thumbnailPreview && (
                                    <img src={thumbnailPreview} alt="preview" id='thumbnail-preview' />
                                )}
                            </div>
                        </div>

                        <div className='form-row'>
                            <span className='form-label'>Folder*:</span>
                            <select
                                value={selectedFolder?.codigo_folder ?? ''}
                                onChange={e => {
                                    const found = folders.find(f => f.codigo_folder === Number(e.target.value));
                                    setSelectedFolder(found ?? null);
                                }}
                                required
                            >
                                <option value=''>Selecione um folder...</option>
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

                    <div id='ia-section'>
                        <h3>Resumo automático (TL;DR)</h3>
                        <button type="button" onClick={gerarResumo}
                            disabled={loadingResumo || (!inputNome && !inputDescricao)} id='btn-ia'>
                            {loadingResumo ? 'Gerando...' : '✨ Gerar Resumo via IA'}
                        </button>
                        {resumo !== '' && (
                            <div id='ia-resumo'>
                                <label>Resumo (editável antes de salvar):</label>
                                <textarea value={resumo} onChange={e => setResumo(e.target.value)} rows={3} id='textarea-resumo' />
                                <button type="button" id='btn-descartar' onClick={() => setResumo('')}>Descartar resumo</button>
                            </div>
                        )}
                    </div>

                    <div id='ia-section'>
                        <h3>Tags e Categoria (IA)</h3>
                        <button type="button" onClick={sugerirTags}
                            disabled={loadingTags || (!inputNome && !inputDescricao)} id='btn-ia'>
                            {loadingTags ? 'Analisando...' : '🏷️ Sugerir Tags via IA'}
                        </button>
                        {(tags.length > 0 || categoria) && (
                            <div id='ia-tags'>
                                {categoria && (
                                    <div id='categoria-box'>
                                        <label>Categoria: </label>
                                        <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} id='input-categoria' />
                                    </div>
                                )}
                                {tags.length > 0 && (
                                    <div id='tags-chips'>
                                        <label>Tags (clique para remover):</label>
                                        <div id='chips-container'>
                                            {tags.map(tag => (
                                                <span key={tag} className='tag-chip' onClick={() => removerTag(tag)} title='Clique para remover'>
                                                    {tag} ✕
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <button type="submit" onClick={postMsg}>Cadastrar</button>
                </ul>
            </div>
        </>
    );
};

export default HomeBody;
