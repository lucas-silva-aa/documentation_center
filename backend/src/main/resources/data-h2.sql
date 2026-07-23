-- ============================================================
-- Dados de teste — banco H2 in-memory (perfil h2)
-- ============================================================

SET REFERENTIAL_INTEGRITY FALSE;

-- ----------------------------
-- Times (Branchs)
-- ----------------------------
INSERT INTO Branchs (id, nome, descricao, data) VALUES
(1, 'Time Backend',        'Equipe de desenvolvimento backend do TJGO',  '2026-01-10'),
(2, 'Time Frontend',       'Equipe de desenvolvimento frontend do TJGO', '2026-01-10'),
(3, 'Time Infraestrutura', 'Equipe de infraestrutura e DevOps do TJGO',  '2026-01-10');

-- ----------------------------
-- Usuários
-- ----------------------------
INSERT INTO Users (id, nome, descricao, senha, account_non_expired, account_non_locked, credentials_non_expired, enabled, admin, data, id_branch) VALUES
(1, 'Admin TJGO',    'Administrador da plataforma DTI',           'admin123', TRUE, TRUE, TRUE, TRUE, TRUE,  '2026-01-10', 1),
(2, 'Lucas Lacerda', 'Desenvolvedor Backend - Especializacao',    'senha123', TRUE, TRUE, TRUE, TRUE, FALSE, '2026-01-11', 1),
(3, 'Joao Marcelo',  'Desenvolvedor Frontend - Especializacao',  'senha123', TRUE, TRUE, TRUE, TRUE, FALSE, '2026-01-12', 2),
(4, 'Ana Beatriz',   'Analista de Sistemas DTI',                  'senha123', TRUE, TRUE, TRUE, TRUE, FALSE, '2026-01-13', 3);

-- ----------------------------
-- Sistemas (Folders)
-- ----------------------------
INSERT INTO Folders (id, id_branch, id_user, nome, descricao, data) VALUES
(1, 1, 1, 'PROJUD',         'Sistema de Processo Judicial Digital',       '2026-01-10'),
(2, 1, 1, 'SEI',            'Sistema Eletronico de Informacoes',          '2026-01-10'),
(3, 2, 1, 'Portal TJGO',    'Portal publico de servicos do TJGO',         '2026-01-10'),
(4, 2, 1, 'Intranet',       'Intranet institucional dos servidores',      '2026-01-10'),
(5, 3, 1, 'Infraestrutura', 'Servidores, redes e pipelines de CI/CD',    '2026-01-10');

-- ----------------------------
-- Documentações (Cards)
-- ----------------------------
INSERT INTO Cards (id, nome, descricao, thumbnail, data, resumo, tags, categoria, id_folder, id_branch, id_user) VALUES
(1,
 'Deploy do PROJUD com Docker',
 'Passo a passo completo para realizar o deploy do sistema PROJUD em ambiente de producao utilizando Docker Compose. Inclui configuracao de variaveis de ambiente, healthchecks e rollback.',
 NULL, '2026-02-01',
 'O PROJUD e deployado via Docker Compose em servidores RHEL do TJGO. O processo envolve build da imagem, push para o registry interno e restart controlado dos containers.',
 'docker,deploy,producao,docker-compose,devops',
 'DevOps',
 1, 1, 2),

(2,
 'Configuracao do Oracle Database no PROJUD',
 'Como configurar a conexao JNDI com o Oracle Database 19c no servidor JBoss para o PROJUD. Inclui configuracao do datasource, pool de conexoes e troubleshooting.',
 NULL, '2026-02-05',
 'A conexao Oracle e configurada via JNDI no JBoss EAP. As credenciais sao armazenadas no vault institucional e nunca devem ser commitadas no repositorio.',
 'oracle,jndi,jboss,banco-de-dados,pool',
 'Banco de Dados',
 1, 1, 2),

(3,
 'Autenticacao SSO no SEI',
 'Guia de integracao do SEI com o sistema de Single Sign-On institucional do TJGO via SAML 2.0 e Keycloak.',
 NULL, '2026-02-10',
 'O SEI usa SAML 2.0 para SSO via servidor Keycloak do TJGO. A integracao exige certificado digital valido emitido pela CA interna.',
 'sso,saml,keycloak,autenticacao,seguranca',
 'Seguranca',
 2, 1, 2),

(4,
 'API REST do Portal TJGO',
 'Documentacao tecnica dos endpoints REST expostos pelo Portal TJGO. Padrao OpenAPI 3.0, autenticacao JWT, versionamento por header.',
 NULL, '2026-03-01',
 'O Portal expoe APIs REST no padrao OpenAPI 3.0 com autenticacao via JWT. O rate limiting e de 100 req/min por IP.',
 'api,rest,jwt,openapi,swagger',
 'API',
 3, 2, 3),

(5,
 'Build e Publicacao do Frontend React',
 'Como buildar e publicar o frontend React do Portal TJGO. Inclui configuracao de variaveis de ambiente, pipeline Jenkins e publicacao no Nginx.',
 NULL, '2026-03-05',
 'O build usa npm run build e e publicado em um container Nginx. Variaveis de ambiente devem ser configuradas antes do build pois sao embutidas no bundle.',
 'react,build,nginx,jenkins,ci-cd',
 'Frontend',
 3, 2, 3),

(6,
 'Configuracao de VPN e Acesso Remoto',
 'Como solicitar e configurar o acesso VPN para conexao remota a intranet do TJGO. Inclui instalacao do cliente OpenVPN e resolucao de problemas comuns.',
 NULL, '2026-04-01',
 'A VPN institucional usa OpenVPN com certificado emitido pela CA interna do TJGO. A solicitacao e feita via chamado no SEI.',
 'vpn,acesso-remoto,openvpn,seguranca,infraestrutura',
 'Infraestrutura',
 5, 3, 4),

(7,
 'Pipeline CI/CD com Jenkins',
 'Documentacao do pipeline de integracao e entrega continua utilizado pelos times do TJGO. Inclui stages de build, teste, analise estatica e deploy.',
 NULL, '2026-04-10',
 'O pipeline Jenkins executa build Maven, testes unitarios, analise SonarQube e deploy automatico para staging. O deploy em producao requer aprovacao manual do lider tecnico.',
 'jenkins,ci-cd,sonarqube,maven,pipeline',
 'DevOps',
 5, 3, 4);

-- ----------------------------
-- Assinaturas
-- ----------------------------
INSERT INTO Assinaturas (codigo, user_obj_id, branch_obj_id, folder_obj_id, data) VALUES
(1, 2, 1,    NULL, '2026-01-20'),
(2, 2, NULL, 2,    '2026-02-01'),
(3, 3, 2,    NULL, '2026-01-20'),
(4, 3, NULL, 3,    '2026-02-01'),
(5, 4, 3,    NULL, '2026-01-25'),
(6, 1, 1,    NULL, '2026-01-10');

-- ----------------------------
-- Notificações
-- ----------------------------
INSERT INTO Notificacoes (codigo, user_obj_id, card_obj_id, mensagem, lida, data) VALUES
(1, 2, 3, 'Nova documentacao no SEI: Autenticacao SSO no SEI',               FALSE, '2026-02-10'),
(2, 3, 4, 'Nova documentacao no Portal TJGO: API REST do Portal TJGO',        FALSE, '2026-03-01'),
(3, 3, 5, 'Nova documentacao no Portal TJGO: Build e Publicacao do Frontend', TRUE,  '2026-03-05'),
(4, 4, 6, 'Nova doc em Infraestrutura: Configuracao de VPN e Acesso Remoto',  FALSE, '2026-04-01'),
(5, 4, 7, 'Nova doc em Infraestrutura: Pipeline CI/CD com Jenkins',            FALSE, '2026-04-10'),
(6, 1, 1, 'Nova documentacao no Time Backend: Deploy do PROJUD com Docker',   TRUE,  '2026-02-01');

SET REFERENTIAL_INTEGRITY TRUE;
