import React, { useState } from 'react';
import api from '../../../services/api';
import './index.css';

const LoginBody: React.FC = () => {
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !senha) return;
        setLoading(true);
        setErro('');
        try {
            const res = await api.get('/v1/ts/users/nomes', {
                params: { nomes: nome, senhas: senha },
            });
            if (res.data) {
                localStorage.setItem('login', nome);
                localStorage.setItem('admin', res.data.admin_user);
                localStorage.setItem('userId', res.data.codigo_user);
                window.location.href = '/';
            }
        } catch {
            setErro('Usuário ou senha inválidos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id='login-page'>
            <form id='login-card' onSubmit={handleLogin}>
                <h1>Documentation Center</h1>
                <p className='login-subtitle'>TJGO — Diretoria de Tecnologia da Informação</p>

                <div className='login-field'>
                    <label>Usuário</label>
                    <input
                        type='text'
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        placeholder='Seu nome de usuário'
                        autoFocus
                    />
                </div>

                <div className='login-field'>
                    <label>Senha</label>
                    <input
                        type='password'
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        placeholder='Sua senha'
                    />
                </div>

                {erro && <p id='login-error'>{erro}</p>}

                <button id='btn-login' type='submit' disabled={loading || !nome || !senha}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
};

export default LoginBody;
