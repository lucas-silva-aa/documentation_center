import { useEffect, useState } from "react";
import api from "../../../services/api";
import React from "react";
// @ts-ignore
import './index.css';

interface ICard {
    codigo_card: number;
    nome_card: string;
}

interface INotificacao {
    codigo: number;
    mensagem: string;
    lida: boolean;
    dataHora: string;
    cardObj: ICard;
}

const NotificacoesBody: React.FC = () => {
    const [notificacoes, setNotificacoes] = useState<INotificacao[]>([]);
    const [naoLidas, setNaoLidas] = useState(0);
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem("userId");

    const carregar = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const [notifRes, countRes] = await Promise.all([
                api.get(`/v1/ts/notificacoes/usuario/${userId}`),
                api.get(`/v1/ts/notificacoes/usuario/${userId}/nao-lidas`)
            ]);
            setNotificacoes(notifRes.data.content || []);
            setNaoLidas(countRes.data.naoLidas || 0);
        } finally {
            setLoading(false);
        }
    };

    const marcarComoLida = async (id: number) => {
        await api.patch(`/v1/ts/notificacoes/${id}/lida`);
        setNotificacoes(prev =>
            prev.map(n => n.codigo === id ? { ...n, lida: true } : n)
        );
        setNaoLidas(prev => Math.max(0, prev - 1));
    };

    const marcarTodasLidas = async () => {
        if (!userId) return;
        await api.patch(`/v1/ts/notificacoes/usuario/${userId}/lidas`);
        setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
        setNaoLidas(0);
    };

    useEffect(() => { carregar(); }, []);

    if (!userId) {
        return <p id='sem-login'>Faça login para ver suas notificações.</p>;
    }

    return (
        <div id='notificacoes-body'>
            <div id='notif-header'>
                <h2>Notificações {naoLidas > 0 && <span id='badge'>{naoLidas}</span>}</h2>
                {naoLidas > 0 && (
                    <button id='btn-marcar-todas' onClick={marcarTodasLidas}>
                        Marcar todas como lidas
                    </button>
                )}
            </div>

            {loading && <p>Carregando...</p>}

            {!loading && notificacoes.length === 0 && (
                <p id='sem-notif'>Nenhuma notificação.</p>
            )}

            <ul id='notif-lista'>
                {notificacoes.map(n => (
                    <li key={n.codigo} className={`notif-item ${n.lida ? 'lida' : 'nao-lida'}`}>
                        <div id='notif-conteudo'>
                            <span id='notif-mensagem'>{n.mensagem}</span>
                            <span id='notif-data'>{n.dataHora}</span>
                        </div>
                        {!n.lida && (
                            <button
                                className='btn-lida'
                                onClick={() => marcarComoLida(n.codigo)}
                            >
                                Marcar como lida
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificacoesBody;
