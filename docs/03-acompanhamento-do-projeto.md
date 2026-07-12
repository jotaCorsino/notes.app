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
- Etapa 16 — Salvamento local temporário com localStorage — Aprovado — Commit f63fc78
- Etapa 17 — Integração inicial com API para matérias — Aprovado — Commit df82188
- Etapa 18 — Integração com API para módulos — Em validação

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
- Protótipo visual do editor A4 criado com toolbar de formatação, navegação de páginas e área que simula edição.
- Anotação selecionada evoluída para duas páginas mockadas com numeração, dimensões A4 e `ContentFormat` controlado.
- Editor A4 inicial integrado com Tiptap para edição rich text local.
- Pacotes Tiptap instalados: `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-underline`, `@tiptap/extension-highlight` e `@tiptap/extension-text-align`.
- Toolbar executa comandos iniciais de negrito, itálico, sublinhado, lista com marcadores, lista numerada, marca-texto e alinhamento à esquerda, centralizado e à direita.
- Seletores de fonte e tamanho permanecem visuais/desabilitados nesta etapa.
- PageNavigator permite selecionar páginas da anotação ativa localmente.
- Conteúdo editado com Tiptap é mantido separadamente por página.
- Botão `+ Página` cria página local mockada com tamanho A4 e conteúdo HTML inicial simples.
- Rascunho temporário do editor salvo no `localStorage` com a chave `caderno-app:active-note-pages`.
- Páginas editadas persistem no navegador após recarregar a tela.
- Páginas criadas localmente persistem no navegador após recarregar a tela.
- Há opção para limpar o rascunho local e restaurar os mocks iniciais.
- Salvamento local é temporário e por navegador.
- Frontend consome `GET /api/subjects` para listar matérias reais na sidebar.
- Vite usa proxy de desenvolvimento de `/api` para `http://localhost:5037`.
- Sidebar exibe estado discreto de matérias: carregando, API conectada ou API indisponível.
- Quando `GET /api/subjects` falha, a sidebar mantém fallback com dados mockados.
- Quando `GET /api/subjects` retorna lista vazia, a sidebar informa que não há matérias cadastradas.
- Frontend consome `GET /api/subjects/{subjectId}/modules` para listar módulos da matéria real selecionada.
- A primeira matéria real é selecionada por padrão quando a API de matérias retorna lista não vazia.
- A seleção de matéria real controla a busca de módulos reais.
- A seleção de módulo real fica local na sidebar e não dispara busca de anotações nesta etapa.
- Sidebar exibe estado discreto de módulos: aguardando matéria, carregando, API conectada ou API indisponível.
- Quando `GET /api/subjects/{subjectId}/modules` retorna lista vazia, a sidebar informa que não há módulos cadastrados.
- Anotações, páginas e editor continuam mockados/locais no frontend.
- Editor A4 e rascunho em `localStorage` continuam locais.
- Backend de desenvolvimento cria o schema SQLite com `EnsureCreated` em ambiente Development, sem migrations e sem seed obrigatório.

## Pendências atuais

- P-009 — Implementar sanitização real do HTML — Pendente.
- P-010 — Implementar exportação PDF A4 real — Pendente.
- P-017 — Integrar frontend com API — Parcialmente concluída: matérias e módulos foram integrados; anotações e páginas seguem pendentes.
- P-018 — Conectar o layout aos dados reais da API — Parcialmente concluída: sidebar usa matérias e módulos reais quando a API responde; anotações e páginas seguem mockadas.
- P-020 — Implementar salvamento real de páginas — Pendente.
- P-022 — Implementar controle funcional de fonte e tamanho — Pendente.
- P-024 — Definir estratégia de sincronização entre localStorage e backend — Pendente.
- P-026 — Integrar anotações com API — Pendente.
- P-027 — Criar fluxo de criação de matéria/módulo pelo frontend — Pendente.

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
- P-025 — Integrar módulos com API — Concluído: sidebar consome `GET /api/subjects/{subjectId}/modules` para a matéria real selecionada.

## Próxima tarefa

Integrar anotações com API.

A próxima tarefa deve incluir:

- Consumir a API de anotações no frontend.
- Exibir anotações reais do módulo selecionado.
- Definir como a seleção de módulo real afeta a área central do app.
- Manter páginas e editor A4 fora do escopo, salvo decisão explícita.
- Manter salvamento real de páginas para tarefa posterior.
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
- Etapa 16 aprovada — Commit f63fc78.
- Etapa 17 aprovada — Commit df82188.
- Etapa 18 em validação: frontend passou a consumir `GET /api/subjects/{subjectId}/modules`, com seleção real de matéria controlando a busca de módulos.

## Observações

- Este documento substitui o acompanhamento anterior por uma versão limpa e objetiva.
- O documento `docs/04-especificacao-editor-a4-e-pdf.md` permanece como fonte da especificação do editor A4 e da estratégia futura de PDF.
- O documento `docs/05-planejamento-frontend-editor-a4.md` registra o planejamento do frontend/editor A4.
- O CI do frontend foi introduzido no commit 716e248; a manutenção M3 foi aprovada no commit 6b817b4.
- O layout visual base da Etapa 12 foi aprovado no commit de7dba3.
- A Etapa 17 integrou apenas a listagem de matérias.
- A Etapa 18 integra apenas a listagem de módulos por matéria.
- O proxy do Vite vale apenas para desenvolvimento local.
- A criação automática do schema SQLite ocorre apenas em `Development` e não cria dados falsos.
- Anotações e páginas continuam mockadas no frontend.
- O editor A4 continua local e não salva no backend.
- O rascunho em `localStorage` não tem sincronização com backend.
- Os status de salvamento exibidos continuam locais/mockados.
- Ainda não há integração de anotações, integração de páginas, salvamento real de páginas, autenticação, paginação automática, exportação PDF ou frontend em produção.