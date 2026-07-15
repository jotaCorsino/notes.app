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
- Etapa 23 — Refinamento da sincronização localStorage/backend — Aprovado — Commit aa78bb6
- M5 — Ignorar arquivos SQLite locais — Aprovado — Commit 4e917b1
- Etapa 24 — Indicador de alterações não salvas por página — Aprovado — Commit fc6fd2c
- Etapa 25 — Integração de tags e favoritos reais no frontend — Aprovado — Commit fe44af9
- Etapa 26 — Sincronização de páginas locais pendentes com backend — Aprovado — Commit be65a8b
- Etapa 27 — Criação rápida de matéria, módulo e anotação pelo frontend — Aprovado — Commit 8ecbf8b
- Etapa 28 — Polimento final do MVP e instruções de uso — Aprovado — Commit a2c2584
- Etapa 29 — Revisão final de entrega do MVP — Aprovado — Commit deste registro

## Decisões técnicas aprovadas

- Backend em C#.
- Target framework `net10.0`.
- Arquitetura separada em Api, Application, Domain e Infrastructure.
- Banco local SQLite com Entity Framework Core.
- Minimal APIs para camada HTTP.
- Organização do app como fichário digital: Matéria > Módulo > Anotação > Página A4.
- Módulos, tags e favoritos existem desde o MVP.
- Página A4 é entidade real.
- Conteúdo é salvo por página.
- `ContentFormat` padrão é `"html"`.
- HTML controlado é o formato inicial de conteúdo.
- Sanitização real de HTML ainda é pendente.
- Frontend é responsável pela paginação visual no MVP.
- Backend não fará quebra visual automática de página no MVP.
- Endpoint `GET /api/notes/{id}/printable` é base para exportação futura.
- PDF real ainda não foi implementado.
- Frontend foi planejado com React, TypeScript e Vite.
- Editor rich text recomendado e adotado inicialmente: Tiptap.
- Estrutura do frontend fica em `frontend/caderno-app-web`.
- CI separado em dois jobs: backend e frontend.
- Layout visual base usa sidebar, topbar, área central e página A4 simulada.
- Editor A4 inicial usa Tiptap para edição rich text local.
- PageNavigator permite selecionar páginas da anotação ativa.
- Conteúdo editado com Tiptap é mantido separadamente por página.
- Botão `+ Página` cria página local mockada quando não há anotação real da API.
- Frontend consome `GET /api/subjects` para listar matérias reais na sidebar.
- Vite usa proxy de desenvolvimento de `/api` para `http://localhost:5037`.
- Frontend consome `GET /api/subjects/{subjectId}/modules` para listar módulos da matéria selecionada.
- Frontend consome `GET /api/modules/{moduleId}/notes` para listar anotações do módulo selecionado.
- Frontend consome `GET /api/notes/{id}` para carregar detalhes da anotação selecionada.
- Páginas reais retornadas por `GET /api/notes/{id}` são carregadas no editor A4.
- Frontend consome `PUT /api/notes/{noteId}/pages/{pageId}/content` para salvar conteúdo de página real existente.
- Frontend consome `POST /api/notes/{noteId}/pages` para criar página real em anotação vinda da API.
- Apenas páginas com `source: "api"` podem usar o salvamento manual por PUT.
- O botão `+ Página` cria página real no backend para anotação real e página local para mock/fallback.
- A página criada no backend entra no editor com `source: "api"` e pode ser editada localmente.
- A página criada no backend pode ser salva depois pelo PUT de conteúdo já integrado.
- Páginas locais e fallback não são enviadas automaticamente ao backend.
- Se a anotação real não tem páginas, o editor usa uma página local inicial.
- Se o carregamento de detalhes falhar, o editor usa fallback local.
- A edição de conteúdo continua local com Tiptap.
- `localStorage` é separado por anotação com chaves no formato `caderno-app:note-draft:{noteId}`.
- O rascunho local armazena metadados simples: `schemaVersion`, `noteId`, `baseSource`, `savedAt`, `updatedAt` e referência de atualização da API.
- Para fluxo mockado/fallback, o rascunho usa a chave `caderno-app:note-draft:mock-active-note`.
- Ao abrir uma anotação, a prioridade é: rascunho local, páginas da API, fallback local.
- O botão de limpar rascunho remove apenas o rascunho da anotação ativa.
- A UI indica quando o editor usa API, rascunho local, fallback ou página local pendente.
- Há ação explícita para descartar rascunho local e recarregar a base da API ou fallback disponível.
- O rascunho local continua como camada de segurança por navegador após salvamento manual.
- Backend de desenvolvimento cria o schema SQLite com `EnsureCreated` em ambiente Development, sem migrations e sem seed obrigatório.
- Arquivos SQLite locais gerados em Development são ignorados pelo Git.
- PageNavigator mostra status por página: salva, alterada ou local.
- Workspace/editor mostra o status da página ativa perto das ações de salvamento.
- Páginas reais da API ficam marcadas como alteradas ao editar e voltam para salvas após PUT bem-sucedido.
- Falha no PUT mantém a página real marcada como alteração local.
- Páginas locais continuam indicadas como locais ou ainda não enviadas ao backend.
- Frontend usa `isFavorite` e `tags` retornados por `GET /api/notes/{id}` para a anotação real ativa.
- Favorito real usa `PUT /api/notes/{noteId}/favorite` e `DELETE /api/notes/{noteId}/favorite`.
- Tags reais usam `POST /api/notes/{noteId}/tags` e `DELETE /api/notes/{noteId}/tags/{tagName}`.
- Fallback/mock não chama endpoints reais de tags ou favorito.
- Páginas com `source: "local"` podem ser enviadas manualmente para o backend quando a anotação ativa é real.
- A sincronização manual usa `POST /api/notes/{noteId}/pages`.
- Páginas locais sincronizadas passam para `source: "api"` após retorno bem-sucedido da API.
- Páginas sincronizadas recebem o id real retornado pelo backend.
- A seleção da página ativa é preservada quando uma página local vira página real.
- A ordem visual atual é mantida no frontend durante a substituição das páginas sincronizadas.
- Se o backend retornar `pageNumber` ou dimensões A4, esses dados passam a ser refletidos no objeto local.
- Após sincronização total ou parcial, o rascunho em `localStorage` é atualizado.
- Falhas parciais preservam páginas ainda locais, conteúdo local e rascunho no navegador.
- A Etapa 26 não implementa autosave.
- A Etapa 26 não implementa merge automático.
- A Etapa 26 não implementa resolução de conflitos.
- A Etapa 26 não implementa reordenação complexa de páginas.
- A Etapa 26 não altera autenticação.
- A Etapa 26 não implementa PDF.
- O frontend consome `POST /api/subjects` para criar matérias reais pela sidebar.
- O frontend consome `POST /api/subjects/{subjectId}/modules` para criar módulos na matéria real selecionada.
- O frontend consome `POST /api/modules/{moduleId}/notes` para criar anotações no módulo real selecionado.
- Cada criação bem-sucedida refaz a listagem correspondente e preserva o id criado como seleção desejada.
- Uma instalação com banco vazio pode criar a sequência Matéria > Módulo > Anotação pela sidebar.
- Formulários de criação ficam indisponíveis em mock/fallback e informam que a API precisa estar ligada.
- A Etapa 27 não implementa edição, renomeação ou exclusão da estrutura do fichário.
- A Etapa 27 não altera editor, páginas, tags ou favoritos.
- A Etapa 27 não implementa autosave, autenticação ou PDF.
- Estados vazios orientam a criação sequencial de matéria, módulo, anotação e página.
- A sidebar apresenta o fluxo resumido: criar matéria, módulo, anotação e página, depois escrever e salvar.
- Quando a API está indisponível, o frontend informa que está em modo demonstração e mantém o fallback mockado.
- O workspace orienta a criação da primeira página real quando a anotação ainda não possui páginas da API.
- O `README.md` registra pré-requisitos, execução local, URLs esperadas, roteiro de teste e limitações do MVP.
- A Etapa 28 não adiciona regras de domínio nem altera contratos da API.
- O `POST /api/modules/{moduleId}/notes` retorna `ApiNoteSummary`; o frontend valida esse resumo antes de selecionar a anotação criada.

## Pendências atuais

- P-009 — Implementar sanitização real do HTML — Pendente.
- P-010 — Implementar exportação PDF A4 real — Pendente.
- P-017 — Integrar frontend com API — Parcialmente concluída: matérias, módulos, anotações, tags, favoritos, leitura, criação inicial da estrutura, salvamento e sincronização manual de páginas foram integrados; busca e fluxos avançados seguem pendentes.
- P-018 — Conectar o layout aos dados reais da API — Parcialmente concluída: sidebar lista e cria a estrutura real, e o editor lê, cria, salva e sincroniza páginas; ainda faltam busca e operações completas de manutenção.
- P-020 — Implementar salvamento real de páginas — Parcialmente concluída: páginas reais usam PUT e páginas locais podem virar páginas reais por POST manual; autosave e merge continuam fora do escopo.
- P-022 — Implementar controle funcional de fonte e tamanho — Pendente.
- P-028 — Integrar páginas reais da anotação com API — Parcialmente concluída: leitura, criação, salvamento e sincronização manual foram integrados; conflitos e reordenação complexa seguem pendentes.
- P-036 — Melhorar UX do formulário de tags — Pendente.
- P-037 — Implementar busca/filtro por tags no futuro — Pendente.
- P-038 — Melhorar ordenação/reordenação de páginas — Pendente.
- P-039 — Revisar fluxo de conflitos entre API e rascunho local — Pendente.
- P-040 — Editar ou renomear matéria, módulo e anotação — Pendente.
- P-041 — Excluir matéria, módulo e anotação com confirmação — Pendente.

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
- P-024 — Definir estratégia de sincronização entre localStorage e backend — Concluída inicial: rascunho tem metadados, status visual e opção de recarregar da API; merge automático segue fora do escopo.
- P-025 — Integrar módulos com API — Concluído: sidebar consome `GET /api/subjects/{subjectId}/modules` para a matéria real selecionada.
- P-026 — Integrar anotações com API — Concluído: sidebar consome `GET /api/modules/{moduleId}/notes` para o módulo real selecionado.
- P-029 — Integrar tags/favoritos reais no frontend — Concluído: anotação ativa usa tags e favorito reais da API com ações de adicionar/remover/favoritar.
- P-030 — Implementar salvamento real do conteúdo da página via API — Concluído: frontend consome `PUT /api/notes/{noteId}/pages/{pageId}/content` para páginas reais existentes.
- P-031 — Criar página real no backend pelo frontend — Concluído: botão `+ Página` consome `POST /api/notes/{noteId}/pages` quando a anotação ativa veio da API.
- P-032 — Implementar indicador completo de alterações não salvas por página — Concluído: PageNavigator e workspace mostram status por página.
- P-033 — Refinar estratégia de rascunho local versus dados da API — Concluído inicialmente: rascunho local ganhou metadados, status visual e ação de recarregar da API.
- P-034 — Implementar detecção mais precisa de alterações não salvas por página — Concluído: páginas reais comparam conteúdo atual com a última versão salva.
- P-035 — Implementar sincronização manual de páginas locais pendentes com backend — Concluído: páginas locais podem ser enviadas via POST e passam para `source: "api"` após sucesso.
- P-027 — Criar fluxo de criação de matéria/módulo pelo frontend — Concluído e ampliado: a sidebar cria matéria, módulo e anotação reais.

## Próxima tarefa

Preparar uma release local do MVP.

A próxima tarefa deve incluir:

- Definir uma versão candidata e um checklist curto de release local.
- Executar novamente build, testes e lint a partir de uma instalação limpa.
- Confirmar as instruções do `README.md` na versão candidata.
- Registrar os artefatos e limitações conhecidos sem configurar deploy.
- Planejar edição e exclusão básicas somente em uma etapa posterior.

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
- Etapa 23 aprovada — Commit aa78bb6.
- M5 aprovada — Commit 4e917b1.
- Etapa 24 aprovada — Commit fc6fd2c.
- Etapa 25 aprovada — Commit fe44af9.
- Etapa 26 aprovada — sincronização manual de páginas locais pendentes com backend.
- Etapa 27 aprovada — criação rápida de matéria, módulo e anotação reais pela sidebar.
- Etapa 28 aprovada — Commit a2c2584 — estados vazios guiados, modo demonstração claro e instruções locais no README.
- Etapa 29 aprovada — fluxo local revisado, contrato de criação de anotação corrigido e validações concluídas.

## Registro da Etapa 26

### Objetivo realizado

Permitir que páginas locais pendentes de uma anotação real sejam enviadas manualmente para o backend.

### Arquivos alterados

- `frontend/caderno-app-web/src/components/A4EditorWorkspace.tsx`.
- `frontend/caderno-app-web/src/App.css`.
- `docs/03-acompanhamento-do-projeto.md`.

### Comportamento implementado

- O workspace detecta páginas locais por `source` diferente de `"api"`, com foco no contrato atual `source: "local"`.
- O botão `Sincronizar páginas locais` fica disponível apenas para contexto de anotação real e quando há páginas locais pendentes.
- O clique no botão percorre páginas locais na ordem visual atual.
- Cada página local é enviada com `POST /api/notes/{noteId}/pages`.
- O conteúdo enviado é o HTML atual da página local.
- O `contentFormat` enviado usa o valor da página ou `"html"` como padrão.
- O retorno da API substitui a página local pelo id real.
- A página sincronizada passa para `source: "api"`.
- O estado `hasUnsavedChanges` passa para `false` na página sincronizada.
- `lastSavedContentHtml` passa a refletir o conteúdo retornado pela API ou o conteúdo local enviado.
- A página ativa continua selecionada quando possível.
- O rascunho local é atualizado depois da sincronização total ou parcial.
- Falha parcial preserva páginas ainda locais e conteúdo local.
- Erros são exibidos de forma discreta no workspace.

### Limitações mantidas

- Sem autosave.
- Sem merge automático.
- Sem resolução de conflitos.
- Sem reordenação complexa.
- Sem autenticação.
- Sem PDF.
- Sem alteração no fluxo de tags e favoritos.

## Registro da Etapa 27

### Objetivo realizado

Permitir que uma instalação com banco vazio crie a estrutura inicial Matéria > Módulo > Anotação diretamente pela sidebar.

### Arquivos alterados

- `frontend/caderno-app-web/src/App.tsx`.
- `frontend/caderno-app-web/src/App.css`.
- `frontend/caderno-app-web/src/components/Sidebar.tsx`.
- `frontend/caderno-app-web/src/services/subjectsApi.ts`.
- `frontend/caderno-app-web/src/services/modulesApi.ts`.
- `frontend/caderno-app-web/src/services/notesApi.ts`.
- `docs/03-acompanhamento-do-projeto.md`.

### Endpoints usados

- `POST /api/subjects`.
- `POST /api/subjects/{subjectId}/modules`.
- `POST /api/modules/{moduleId}/notes`.
- Os endpoints GET já integrados são refeitos após a criação correspondente.

### Comportamento implementado

- A sidebar oferece campos compactos para nova matéria, novo módulo e nova anotação.
- A criação de matéria fica disponível quando a listagem de matérias está conectada à API, inclusive quando o banco está vazio.
- A criação de módulo exige uma matéria real selecionada e listagem de módulos disponível.
- A criação de anotação exige um módulo real selecionado e listagem de anotações disponível.
- Após cada POST, o frontend guarda o id retornado, refaz o GET correspondente e seleciona o novo item quando ele aparece na listagem.
- Campos são limpos após sucesso.
- A interface informa estados de criação, sucesso, erro e indisponibilidade.
- Em mock/fallback, nenhuma criação real é chamada e a sidebar informa que a API precisa estar ligada.

### Limitações mantidas

- Sem editar ou renomear matéria, módulo ou anotação.
- Sem excluir matéria, módulo ou anotação.
- Sem autosave.
- Sem autenticação.
- Sem PDF.
- Sem alteração no editor, no fluxo de páginas, nas tags ou nos favoritos.

## Registro da Etapa 28

### Objetivo realizado

Polir a experiência inicial do MVP com orientação curta para banco vazio, feedback claro de API indisponível e instruções objetivas de execução local.

### Arquivos criados

- `README.md`.

### Arquivos alterados

- `frontend/caderno-app-web/src/App.tsx`.
- `frontend/caderno-app-web/src/App.css`.
- `frontend/caderno-app-web/src/components/Sidebar.tsx`.
- `frontend/caderno-app-web/src/components/A4EditorWorkspace.tsx`.
- `docs/03-acompanhamento-do-projeto.md`.

### Comportamento apresentado

- Banco sem matérias orienta: criar a primeira matéria.
- Matéria sem módulos orienta: criar um módulo.
- Módulo sem anotações orienta: criar uma anotação.
- Anotação sem páginas reais orienta: criar uma página para começar a escrever.
- A sidebar apresenta os cinco passos principais do MVP enquanto ainda falta matéria, módulo ou anotação.
- API indisponível mantém dados mockados e informa que o app está rodando em modo demonstração.
- Formulários indisponíveis informam que a criação real exige o backend ligado.
- O `README.md` documenta backend em `http://localhost:5037`, frontend na URL exibida pelo Vite e o fluxo de teste manual.

### Limitações mantidas

- Sem novas regras de domínio.
- Sem alterações no backend ou nos contratos da API.
- Sem edição ou exclusão de matéria, módulo e anotação.
- Sem autosave.
- Sem autenticação.
- Sem PDF.

## Registro da Etapa 29

### Objetivo realizado

Revisar a entrega local do MVP seguindo o `README.md`, percorrer o fluxo principal com o banco inicialmente vazio e validar o modo demonstração sem ampliar o escopo funcional.

### Arquivos alterados

- `frontend/caderno-app-web/src/services/notesApi.ts`.
- `docs/03-acompanhamento-do-projeto.md`.

O `README.md` foi conferido e não precisou de alteração.

### Execução pelo README

- O backend iniciou com `dotnet run --project src/CadernoApp.Api --launch-profile http` e respondeu em `http://localhost:5037`.
- O frontend iniciou com `npm run dev -- --host 127.0.0.1` e respondeu em `http://127.0.0.1:5173`.
- O proxy do Vite encaminhou `/api/subjects` para a API e retornou HTTP 200.

### Fluxo principal validado

- O banco começou sem matérias.
- Matéria e módulo foram criados e selecionados pela sidebar.
- A criação da anotação revelou uma incompatibilidade de validação no frontend; após a correção, uma nova anotação foi criada e selecionada automaticamente.
- Uma página real foi criada, editada e salva no backend.
- Após recarregar a aplicação, matéria, módulo, anotação, página e conteúdo continuaram disponíveis.
- Uma tag real foi adicionada e removida.
- A anotação foi favoritada e desfavoritada.

### Correção realizada

- `createNote` agora interpreta e valida o `ApiNoteSummary` realmente retornado pelo endpoint de criação.
- O endpoint, o payload enviado e o backend não foram alterados.
- Nenhuma feature nova foi adicionada.

### Modo demonstração validado

- O frontend continuou funcionando com o backend desligado.
- O aviso `API indisponível — rodando em modo demonstração` foi exibido.
- O fallback mockado permaneceu disponível.
- Os controles de criação real ficaram desabilitados.
- A interface permaneceu estável e sem overflow horizontal.

### Validações automatizadas

- `npm ci` concluído sem vulnerabilidades.
- `npm run build` concluído com sucesso.
- `npm run lint` concluído sem ocorrências.
- `dotnet restore` concluído com sucesso.
- `dotnet build` concluído com zero erros e zero avisos.
- `dotnet test` concluído com 87 testes aprovados.
- `dotnet format --no-restore` concluído sem alterações adicionais.

### Limitações finais

- Sem login.
- Sem PDF.
- Sem autosave no backend.
- Sem edição ou exclusão de matéria, módulo e anotação.
- SQLite local de desenvolvimento.
- Sem deploy configurado.

## Observações

- Este documento permanece como acompanhamento executivo do projeto.
- O documento `docs/04-especificacao-editor-a4-e-pdf.md` permanece como fonte da especificação do editor A4 e da estratégia futura de PDF.
- O documento `docs/05-planejamento-frontend-editor-a4.md` registra o planejamento do frontend/editor A4.
- O `README.md` é a referência curta para executar e conferir o MVP localmente.
- O proxy do Vite vale apenas para desenvolvimento local.
- A criação automática do schema SQLite ocorre apenas em `Development` e não cria dados falsos.
- O editor A4 continua local para edição e salva no backend somente por ação explícita.
- O rascunho em `localStorage` é temporário, por navegador, separado por anotação e mantido como segurança após criação, salvamento ou sincronização manual.
- Ainda não há sanitização real de HTML, autosave no backend, merge automático, resolução de conflito, busca global por tags, tela global de tags, autenticação, paginação automática, exportação PDF ou frontend em produção.
