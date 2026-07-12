# 03 — Acompanhamento do Projeto

## Objetivo

Este documento acompanha o avanço do Caderno App.

Ele compara planejamento, execução, validação e próxima tarefa, mantendo um registro curto e verificável do estado real do projeto.

## Estado atual resumido

- Etapa 0 — Documentação inicial — Aprovado — Commit 8fe295d
- Etapa 1 — Estrutura inicial do backend — Aprovado — Commit ea17644
- Etapa 2 — Entidades de domínio — Aprovado — Commit d1dc494
- Etapa 3 — Regras de negócio do domínio — Aprovado — Commit 96c10f7
- Etapa 4 — Persistência inicial — Aprovado — Commit edcd466
- Etapa 5 — Serviços de aplicação — Aprovado — Commit affecbf
- Etapa 6 — Camada de entrada/API — Aprovado — Commit de35a07
- Etapa 7 — Testes, validações e CI — Aprovado — Commit a565446
- Etapa 8 — Preparação para exportação imprimível — Aprovado — Commit 5040ff2
- M1 — Manutenção de estilo C# — Aprovado — Commit 18b174a
- Etapa 9 — Especificação técnica do editor A4 — Aprovado — Commit da971ec
- M2 — Normalização Markdown inicial — Parcialmente corrigida — Commit a6458d7
- M2.1 — Correção de quebras Markdown — Parcialmente corrigida — Commit dce4e7b
- M2.2 — Correção final do acompanhamento — Reprovada na formatação — Commit fd12ed6
- M2.3 — Correção forçada de quebras Markdown — Reprovada na validação remota — Commit a8f7cdc
- M2.4 — Correção LF sem BOM — Aprovado — Commit 040ced6
- Etapa 10 — Planejamento do frontend/editor A4 — Aprovado — Commit f17ab23
- Etapa 11 — Estrutura inicial do frontend — Aprovado — Commit 30253e2
- M3 — CI do frontend — Aprovado — Commit 6b817b4
- Etapa 12 — Layout visual base do frontend — Aprovado — Commit de7dba3
- Etapa 13 — Protótipo visual do editor A4 — Aprovado — Commit b1edd01
- Etapa 14 — Integração inicial com Tiptap — Aprovado — Commit 07f0c12
- Etapa 15 — Troca funcional entre páginas do editor — Aprovado — Commit dd739fa
- Etapa 16 — Salvamento local temporário com localStorage — Em validação

## Decisões técnicas aprovadas

- Backend em C#.
- Target framework `net10.0`.
- Arquitetura separada em Api, Application, Domain e Infrastructure.
- Banco local SQLite com Entity Framework Core.
- Minimal APIs para camada HTTP.
- Organização do app como fichário digital: Matéria > Módulo > Anotação > Página A4.
- Módulos, tags e favoritos desde o MVP.
- Página A4 como entidade real.
- Conteúdo salvo por página.
- `ContentFormat` padrão `"html"`.
- HTML controlado como formato inicial de conteúdo.
- Frontend responsável pela paginação visual no MVP.
- Backend não fará quebra visual automática de página no MVP.
- Endpoint `GET /api/notes/{id}/printable` como base para exportação futura.
- PDF real ainda não implementado.
- Frontend planejado com React, TypeScript e Vite.
- Editor rich text recomendado: Tiptap.
- CSS modularizado recomendado inicialmente.
- Tailwind CSS mantido como possibilidade futura.
- Estrutura inicial do frontend criada em `frontend/caderno-app-web`.
- CI separado em dois jobs: backend e frontend.
- Layout visual base criado com sidebar, topbar, área central e página A4 simulada.
- Primeira tela visual criada com dados mockados de matérias, módulos, anotações, tags, favorito e conteúdo.
- A Etapa 12 mantém o frontend sem integração com API, Tiptap, editor A4 funcional ou exportação PDF.
- Protótipo visual do editor A4 criado com toolbar de formatação, navegação de páginas e área que simula edição.
- Anotação selecionada evoluída para duas páginas mockadas com numeração, dimensões A4 e `ContentFormat` controlado.
- Editor A4 inicial integrado com Tiptap para edição rich text local.
- Pacotes Tiptap instalados: `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-underline`, `@tiptap/extension-highlight` e `@tiptap/extension-text-align`.
- Toolbar executa comandos iniciais de negrito, itálico, sublinhado, lista com marcadores, lista numerada, marca-texto e alinhamento à esquerda, centralizado e à direita.
- Seletores de fonte e tamanho permanecem visuais/desabilitados nesta etapa.
- Edição local ainda não persiste no backend.
- Ainda não há integração com API, paginação automática, salvamento real ou PDF.
- PageNavigator permite selecionar páginas da anotação ativa localmente.
- Conteúdo editado com Tiptap é mantido separadamente por página durante a sessão.
- Botão `+ Página` cria página local mockada com tamanho A4 e conteúdo HTML inicial simples.
- Troca de páginas não chama API e não salva no backend.
- Rascunho temporário do editor salvo no `localStorage` com a chave `caderno-app:active-note-pages`.
- Páginas editadas persistem no navegador após recarregar a tela.
- Páginas criadas localmente persistem no navegador após recarregar a tela.
- Há opção para limpar o rascunho local e restaurar os mocks iniciais.
- Salvamento local é temporário e por navegador.

## Pendências atuais

- P-009 — Implementar sanitização real do HTML — Pendente.
- P-010 — Implementar exportação PDF A4 real — Pendente.
- P-017 — Integrar frontend com API — Pendente.
- P-018 — Conectar o layout aos dados reais da API — Pendente.
- P-020 — Implementar salvamento real de páginas — Pendente.
- P-022 — Implementar controle funcional de fonte e tamanho — Pendente.
- P-024 — Definir estratégia de sincronização entre localStorage e backend — Pendente.

## Pendências resolvidas

- P-007 — Decidir formato do conteúdo da página — Concluído: HTML controlado.
- P-008 — Definir estratégia futura de PDF — Concluído: estratégia documentada no `docs/04-especificacao-editor-a4-e-pdf.md`.
- P-011 — Planejar frontend/editor A4 — Concluído: planejamento criado no `docs/05-planejamento-frontend-editor-a4.md`.
- P-012 — Escolher tecnologia do frontend — Concluído inicialmente: React, TypeScript e Vite.
- P-013 — Escolher ou prototipar editor rich text — Concluído inicialmente: Tiptap recomendado.
- P-014 — Criar estrutura inicial do frontend — Concluído: pasta `frontend/caderno-app-web` criada com Vite.
- P-015 — Criar layout visual base do frontend — Concluído: primeira tela visual criada com dados mockados, sem integração com API.
- P-016 — Prototipar editor A4 visual — Concluído: toolbar, navegação e área editável visual criadas com duas páginas mockadas.
- P-019 — Instalar e integrar Tiptap — Concluído: editor A4 usa Tiptap com edição local rich text.
- P-021 — Implementar troca funcional entre páginas do editor — Concluído: seleção, edição por página e criação local de página foram implementadas.
- P-023 — Persistir estado local em armazenamento temporário ou backend, conforme estratégia futura — Concluído: rascunho local temporário implementado com `localStorage`.

## Próxima tarefa

Iniciar integração com API para listagem de matérias.

A próxima tarefa deve incluir:

- Consumir a API de matérias no frontend.
- Substituir gradualmente mocks da sidebar por dados reais.
- Manter editor, salvamento real de páginas e sincronização para tarefas posteriores.
- Manter autenticação fora do escopo.
- Manter exportação PDF fora do escopo.

## Histórico de validações

- Etapa 0 aprovada.
- Etapa 1 aprovada.
- Etapa 2 aprovada.
- Etapa 3 aprovada.
- Etapa 4 aprovada.
- Etapa 5 aprovada.
- Etapa 6 aprovada.
- Etapa 7 aprovada.
- Etapa 8 aprovada.
- M1 aprovada.
- Etapa 9 aprovada.
- M2 exigiu correção documental.
- M2.1 exigiu correção documental.
- M2.2 acertou o conteúdo, mas falhou na formatação Markdown real.
- M2.3 ainda falhou no raw remoto.
- M2.4 aprovada.
- Etapa 10 aprovada.
- Etapa 11 aprovada.
- M3 aprovada — Commit 6b817b4.
- Etapa 12 aprovada — Commit de7dba3.
- Etapa 13 aprovada — Commit b1edd01.
- Etapa 14 aprovada — Commit 07f0c12.
- Etapa 15 aprovada — Commit dd739fa.
- Etapa 16 em validação: rascunho local temporário salvo no navegador com localStorage.

## Observações

- Este documento substitui o acompanhamento anterior por uma versão limpa e objetiva.
- O documento `docs/04-especificacao-editor-a4-e-pdf.md` permanece como fonte da especificação do editor A4 e da estratégia futura de PDF.
- O documento `docs/05-planejamento-frontend-editor-a4.md` registra o planejamento do frontend/editor A4.
- O CI do frontend foi introduzido no commit 716e248; a manutenção M3 foi aprovada no commit 6b817b4.
- O layout visual base da Etapa 12 foi aprovado no commit de7dba3.
- O editor da Etapa 14 ainda é um protótipo local: alterações não são salvas no backend.
- A Etapa 16 mantém alterações no navegador com `localStorage`, mas ainda não há sincronização com backend.
- Os status de salvamento exibidos são mockados e não representam persistência real.
- Ainda não há integração com API, Tailwind, rotas, chamadas HTTP, salvamento real no backend, paginação automática, exportação PDF ou autenticação.
