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
- Etapa 18 — Integração com API para módulos — Aprovado — Commit 7eefce7
- Etapa 19 — Integração com API para anotações — Aprovado — Commit bd741bd
- Etapa 20 — Integração inicial de páginas reais da anotação — Aprovado — Commit c8ec94a
- Etapa 21 — Salvamento de conteúdo de páginas existentes via API — Aprovado — Commit 9b098e9
- Etapa 22 — Criação de página real no backend pelo frontend — Aprovado — Commit 184fb14
- M4 — Normalização de line endings do frontend — Aprovado — Commit f312c1c
- Etapa 23 — Refinamento da sincronização localStorage/backend — Aprovado — Commit a preencher após este commit

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
- Estrutura inicial do frontend criada em `frontend/caderno-app-web`.
- CI separado em dois jobs: backend e frontend.
- Layout visual base criado com sidebar, topbar, área central e página A4 simulada.
- Editor A4 inicial integrado com Tiptap para edição rich text local.
- PageNavigator permite selecionar páginas da anotação ativa localmente.
- Conteúdo editado com Tiptap é mantido separadamente por página.
- Botão `+ Página` cria página local mockada com tamanho A4 e conteúdo HTML inicial simples.
- Frontend consome `GET /api/subjects` para listar matérias reais na sidebar.
- Vite usa proxy de desenvolvimento de `/api` para `http://localhost:5037`.
- Frontend consome `GET /api/subjects/{subjectId}/modules` para listar módulos da matéria real selecionada.
- Frontend consome `GET /api/modules/{moduleId}/notes` para listar anotações do módulo real selecionado.
- Frontend consome `GET /api/notes/{id}` para carregar detalhes da anotação selecionada.
- Páginas reais retornadas em `GET /api/notes/{id}` são carregadas no editor A4 quando existem.
- Frontend consome `PUT /api/notes/{noteId}/pages/{pageId}/content` para salvar conteúdo de página real existente.
- Frontend consome `POST /api/notes/{noteId}/pages` para criar página real quando a anotação veio da API.
- Apenas páginas vindas da API podem ser salvas no backend nesta etapa.
- O botão `+ Página` cria página real no backend para anotação real e página local para mock/fallback.
- A página criada no backend entra no editor com `source: "api"` e pode ser editada localmente.
- A página criada no backend pode ser salva depois pelo PUT de conteúdo já integrado.
- Páginas locais e fallback não são criadas no backend.
- Se a anotação real não tem páginas, o editor usa uma página local inicial.
- Se o carregamento de detalhes falhar, o editor usa fallback local.
- A edição de conteúdo continua local com Tiptap.
- Nova página criada no editor continua apenas local.
- `localStorage` passou a ser separado por anotação com chaves no formato `caderno-app:note-draft:{noteId}`.
- O rascunho local armazena metadados simples: `schemaVersion`, `noteId`, `baseSource`, `savedAt`, `updatedAt` e referência de atualização da API quando disponível.
- Para o fluxo mockado/fallback, o rascunho usa a chave `caderno-app:note-draft:mock-active-note`.
- Ao abrir uma anotação, a prioridade é: rascunho local da anotação, páginas da API, fallback local.
- O botão de limpar rascunho remove apenas o rascunho da anotação ativa.
- A UI indica quando o editor usa API, rascunho local, fallback ou página local pendente.
- Há opção explícita para descartar rascunho local e recarregar a base da API ou fallback disponível.
- O rascunho local continua como camada de segurança por navegador após salvamento manual.
- Tags reais, favoritos reais e sincronização completa entre rascunho local e backend ainda não foram integrados no frontend.
- Backend de desenvolvimento cria o schema SQLite com `EnsureCreated` em ambiente Development, sem migrations e sem seed obrigatório.

## Pendências atuais

- P-009 — Implementar sanitização real do HTML — Pendente.
- P-010 — Implementar exportação PDF A4 real — Pendente.
- P-017 — Integrar frontend com API — Parcialmente concluída: matérias, módulos, anotações, leitura, criação e salvamento de páginas foram integrados; tags/favoritos reais seguem pendentes.
- P-018 — Conectar o layout aos dados reais da API — Parcialmente concluída: sidebar usa matérias, módulos e anotações reais; editor lê, cria e salva conteúdo de páginas reais.
- P-020 — Implementar salvamento real de páginas — Parcialmente concluída: página real pode ser criada via POST e conteúdo de páginas existentes pode ser salvo via PUT; sincronização completa segue pendente.
- P-022 — Implementar controle funcional de fonte e tamanho — Pendente.
- P-024 — Definir estratégia de sincronização entre localStorage e backend — Concluída inicial: rascunho tem metadados, status visual e opção de recarregar da API; merge automático segue fora do escopo.
- P-027 — Criar fluxo de criação de matéria/módulo pelo frontend — Pendente.
- P-028 — Integrar páginas reais da anotação com API — Parcialmente concluída: leitura por GET, criação por POST e salvamento de conteúdo por PUT implementados; refinamento de sincronização pendente.
- P-029 — Integrar tags/favoritos reais no frontend — Pendente.
- P-032 — Implementar indicador completo de alterações não salvas por página — Pendente.
- P-034 — Implementar detecção mais precisa de alterações não salvas por página — Pendente.

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
- P-026 — Integrar anotações com API — Concluído: sidebar consome `GET /api/modules/{moduleId}/notes` para o módulo real selecionado.
- P-030 — Implementar salvamento real do conteúdo da página via API — Concluído: frontend consome `PUT /api/notes/{noteId}/pages/{pageId}/content` para páginas reais existentes.
- P-031 — Criar página real no backend pelo frontend — Concluído: botão `+ Página` consome `POST /api/notes/{noteId}/pages` quando a anotação ativa veio da API.
- P-033 — Refinar estratégia de rascunho local versus dados da API — Concluído inicialmente: rascunho local ganhou metadados, status visual e ação de recarregar da API.

## Próxima tarefa

Melhorar indicador de alterações não salvas por página.

A próxima tarefa deve incluir:

- Comparar conteúdo atual da página com a última versão salva no rascunho ou backend.
- Exibir indicação por página no navegador lateral.
- Evitar falso positivo ao apenas trocar de página.
- Preservar fallback local quando o backend estiver desligado.
- Manter tags e favoritos reais fora do escopo, salvo decisão explícita.
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
- Etapa 18 aprovada — Commit 7eefce7.
- Etapa 19 aprovada — Commit bd741bd.
- Etapa 20 aprovada — Commit c8ec94a.
- Etapa 21 aprovada — Commit 9b098e9.
- Etapa 22 aprovada — Commit 184fb14.
- M4 aprovada — Commit f312c1c.
- Etapa 23 aprovada — Commit a preencher após este commit.

## Observações

- Este documento substitui o acompanhamento anterior por uma versão limpa e objetiva.
- O documento `docs/04-especificacao-editor-a4-e-pdf.md` permanece como fonte da especificação do editor A4 e da estratégia futura de PDF.
- O documento `docs/05-planejamento-frontend-editor-a4.md` registra o planejamento do frontend/editor A4.
- O CI do frontend foi introduzido no commit 716e248; a manutenção M3 foi aprovada no commit 6b817b4.
- O layout visual base da Etapa 12 foi aprovado no commit de7dba3.
- A Etapa 17 integrou apenas a listagem de matérias.
- A Etapa 18 integrou apenas a listagem de módulos por matéria.
- A Etapa 19 integrou apenas a listagem e seleção básica de anotações por módulo.
- A Etapa 20 integrou leitura de páginas reais, mas não implementou escrita.
- A Etapa 21 integra escrita manual de conteúdo apenas para páginas reais já existentes.
- A Etapa 22 integra criação manual de página real para anotações vindas da API.
- A M4 normalizou line endings dos arquivos de frontend e acompanhamento.
- A Etapa 23 refina a experiência de rascunho local, mas não implementa merge automático.
- O proxy do Vite vale apenas para desenvolvimento local.
- A criação automática do schema SQLite ocorre apenas em `Development` e não cria dados falsos.
- O editor A4 continua local para edição e salva no backend somente por ação explícita em página real.
- O rascunho em `localStorage` é temporário, por navegador, separado por anotação e mantido como segurança após criação ou salvamento manual.
- Ainda não há autosave no backend, merge automático, resolução de conflito, tags/favoritos reais no frontend, autenticação, paginação automática, exportação PDF ou frontend em produção.
