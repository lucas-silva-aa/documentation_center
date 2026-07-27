import { useEffect, useState } from "react";
import api from "../../../services/api";
import React from "react";
// @ts-ignore
import './index.css';

interface IAssinatura {
    codigo: number;
    branchObj: { codigo: number; nome: string } | null;
    folderObj: { codigo: number; nome: string } | null;
    dataHora: string;
}

const AssinaturasBody: React.FC = () => {
    const [assinaturas, setAssinaturas] = useState<IAssinatura[]>([]);
    const [loading, setLoading] = useState(true);

    // inputs para nova assinatura
    const [branchId, setBranchId] = useState('');
    const [folderId, setFolderId] = useState('');
    const [mensagem, setMensagem] = useState('');

    const userId = localStorage.getItem("userId");

    const carregar = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await api.get(`/v1/ts/assinaturas/usuario/${userId}`);
            setAssinaturas(res.data || []);
        } finally {
            setLoading(false);
        }
    };

    const assinarBranch = async () => {
        if (!branchId || !userId) return;
        try {
            await api.post('/v1/ts/assinaturas/branch', { userId: Number(userId), branchId: Number(branchId) });
            setBranchId('');
            setMensagem('Assinatura de time realizada!');
            carregar();
        } catch (e: any) {
            setMensagem(e?.response?.data?.mensagem || 'Erro ao assinar time.');
        }
    };

    const assinarFolder = async () => {
        if (!folderId || !userId) return;
        try {
            await api.post('/v1/ts/assinaturas/folder', { userId: Number(userId), folderId: Number(folderId) });
            setFolderId('');
            setMensagem('Assinatura de sistema realizada!');
            carregar();
        } catch (e: any) {
            setMensagem(e?.response?.data?.mensagem || 'Erro ao assinar sistema.');
        }
    };

    const cancelar = async (id: number) => {
        await api.delete(`/v1/ts/assinaturas/${id}`);
        setAssinaturas(prev => prev.filter(a => a.codigo !== id));
    };

    useEffect(() => { carregar(); }, []);

    if (!userId) {
        return <p id='sem-login'>Faça login para gerenciar suas assinaturas.</p>;
    }

    return (
        <div id='assinaturas-body'>
            <h2>Minhas Assinaturas</h2>

            {mensagem && <p id='msg-feedback'>{mensagem}</p>}

            <div id='assinar-form'>
                <div className='assinar-bloco'>
                    <h4>Assinar Time (Branch)</h4>
                    <input
                        type="number"
                        placeholder="ID do Time"
                        value={branchId}
                        onChange={e => setBranchId(e.target.value)}
                        id='input-assinar'
                    />
                    <button onClick={assinarBranch} id='btn-assinar'>Assinar</button>
                </div>
                <div className='assinar-bloco'>
                    <h4>Assinar Sistema (Folder)</h4>
                    <input
                        type="number"
                        placeholder="ID do Sistema"
                        value={folderId}
                        onChange={e => setFolderId(e.target.value)}
                        id='input-assinar'
                    />
                    <button onClick={assinarFolder} id='btn-assinar'>Assinar</button>
                </div>
            </div>

            {loading && <p>Carregando...</p>}

            {!loading && assinaturas.length === 0 && (
                <p id='sem-assinatura'>Você não assina nenhum time ou sistema ainda.</p>
            )}

            <ul id='assinatura-lista'>
                {assinaturas.map(a => (
                    <li key={a.codigo} className='assinatura-item'>
                        <div id='assin-info'>
                            {a.branchObj && <span>Time: <strong>{a.branchObj.nome}</strong></span>}
                            {a.folderObj && <span>Sistema: <strong>{a.folderObj.nome}</strong></span>}
                            <span id='assin-data'>{a.dataHora}</span>
                        </div>
                        <button className='btn-cancelar' onClick={() => cancelar(a.codigo)}>
                            Cancelar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AssinaturasBody;
