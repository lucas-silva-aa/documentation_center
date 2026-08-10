-- ============================================================
-- Migração: novos campos e tabelas (resumo, tags, assinaturas, notificações)
-- Compatível com Oracle (principal) e MySQL (dev)
-- ============================================================

-- 0. Sistema de permissões por nível (COLABORADOR=1, GESTOR=2, ADMIN=3)
-- Oracle:
ALTER TABLE Users ADD nivel_acesso NUMBER(1) DEFAULT 1 NOT NULL;
UPDATE Users SET nivel_acesso = 3 WHERE admin = 1;
UPDATE Users SET nivel_acesso = 1 WHERE admin = 0;
COMMIT;
-- MySQL:
-- ALTER TABLE Users ADD COLUMN nivel_acesso TINYINT(1) DEFAULT 1 NOT NULL;
-- UPDATE Users SET nivel_acesso = 3 WHERE admin = 1;
-- UPDATE Users SET nivel_acesso = 1 WHERE admin = 0;

-- 1. Novos campos na tabela Cards (documentações)
-- Oracle:
ALTER TABLE Cards ADD (resumo VARCHAR2(500), tags VARCHAR2(300), categoria VARCHAR2(100));
-- MySQL:
-- ALTER TABLE Cards ADD COLUMN resumo VARCHAR(500), ADD COLUMN tags VARCHAR(300), ADD COLUMN categoria VARCHAR(100);


-- 2. Tabela de Assinaturas
-- Oracle:
CREATE TABLE Assinaturas (
    codigo       NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_obj_codigo   NUMBER NOT NULL,
    branch_obj_codigo NUMBER,
    folder_obj_codigo NUMBER,
    data         DATE NOT NULL,
    CONSTRAINT fk_assinatura_user   FOREIGN KEY (user_obj_codigo)   REFERENCES Users(codigo),
    CONSTRAINT fk_assinatura_branch FOREIGN KEY (branch_obj_codigo) REFERENCES Branchs(codigo),
    CONSTRAINT fk_assinatura_folder FOREIGN KEY (folder_obj_codigo) REFERENCES Folders(codigo)
);
-- MySQL:
-- CREATE TABLE Assinaturas (
--     codigo            INT AUTO_INCREMENT PRIMARY KEY,
--     user_obj_codigo   INT NOT NULL,
--     branch_obj_codigo INT,
--     folder_obj_codigo INT,
--     data              DATE NOT NULL,
--     FOREIGN KEY (user_obj_codigo)   REFERENCES Users(codigo),
--     FOREIGN KEY (branch_obj_codigo) REFERENCES Branchs(codigo),
--     FOREIGN KEY (folder_obj_codigo) REFERENCES Folders(codigo)
-- );


-- 3. Tabela de Imagens (BLOB para upload inline no editor)
-- Oracle:
CREATE TABLE Imagens (
    id    NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dados BLOB NOT NULL,
    tipo  VARCHAR2(100) NOT NULL,
    nome  VARCHAR2(255)
);
-- MySQL:
-- CREATE TABLE Imagens (
--     id    BIGINT AUTO_INCREMENT PRIMARY KEY,
--     dados LONGBLOB NOT NULL,
--     tipo  VARCHAR(100) NOT NULL,
--     nome  VARCHAR(255)
-- );

-- 4. Remover campo imageLink da tabela Cards
-- Oracle:
ALTER TABLE Cards DROP COLUMN imageLink;
-- MySQL:
-- ALTER TABLE Cards DROP COLUMN imageLink;

-- 5. Ampliar descricao para CLOB (suporte a HTML rico)
-- Oracle:
ALTER TABLE Cards MODIFY descricao CLOB;
-- MySQL:
-- ALTER TABLE Cards MODIFY COLUMN descricao LONGTEXT;


-- 6. Tabela de Notificações
-- Oracle:
CREATE TABLE Notificacoes (
    codigo           NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_obj_codigo  NUMBER NOT NULL,
    card_obj_codigo  NUMBER NOT NULL,
    mensagem         VARCHAR2(300) NOT NULL,
    lida             NUMBER(1) DEFAULT 0 NOT NULL,
    data             DATE NOT NULL,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_obj_codigo) REFERENCES Users(codigo),
    CONSTRAINT fk_notif_card FOREIGN KEY (card_obj_codigo) REFERENCES Cards(codigo)
);
-- MySQL:
-- CREATE TABLE Notificacoes (
--     codigo          INT AUTO_INCREMENT PRIMARY KEY,
--     user_obj_codigo INT NOT NULL,
--     card_obj_codigo INT NOT NULL,
--     mensagem        VARCHAR(300) NOT NULL,
--     lida            TINYINT(1) DEFAULT 0 NOT NULL,
--     data            DATE NOT NULL,
--     FOREIGN KEY (user_obj_codigo) REFERENCES Users(codigo),
--     FOREIGN KEY (card_obj_codigo) REFERENCES Cards(codigo)
-- );
