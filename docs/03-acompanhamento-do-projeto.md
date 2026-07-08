# 03 — Acompanhamento do Projeto

## Objetivo deste documento

Este documento acompanha o estado atual do projeto Caderno App.

Ele deve registrar:

- Etapas concluídas.
- Manutenções realizadas.
- Pendências reais.
- Próxima tarefa recomendada.
- Histórico de validações.
- Restrições de escopo ainda vigentes.

Este arquivo deve ser atualizado ao final de cada etapa aprovada.

## Repositório

```text
https://github.com/jotaCorsino/notes.app.git
```

Branch principal:

```text
main
```

## Estado atual resumido

O backend inicial do Caderno App já possui:

- Documentação inicial.
- Solução C# criada.
- Entidades principais de domínio.
- Regras básicas de domínio.
- Persistência inicial com EF Core e SQLite.
- Serviços de aplicação.
- Endpoints iniciais com Minimal APIs.
- Testes de domínio, aplicação e API.
- Workflow inicial de CI.
- Estrutura preparada para exportação imprimível.
- Especificação técnica do editor A4 e da futura exportação PDF.

O projeto ainda não possui:

- Frontend.
- Editor rich text.
- Sanitização real de HTML.
- Exportação PDF real.
- Autenticação.
- Autorização.

## Acompanhamento por etapa

### Etapa 0 — Documentação inicial

- Status: Aprovado.
- Objetivo: criar os documentos iniciais do projeto.
- Resultado: documentação inicial validada, commitada e enviada para `origin/main`.
- Arquivos principais:
  - `docs/01-visao-geral-do-app.md`
  - `docs/02-planejamento-de-construcao.md`
  - `docs/03-acompanhamento-do-projeto.md`
- Commit: `docs: add initial project documentation`.

### Etapa 1 — Estrutura inicial do backend

- Status: Aprovado.
- Objetivo: criar a estrutura inicial da solução backend em C#.
- Resultado: solução `CadernoApp.sln` criada com projetos em `src` e `tests`.
- Validação: `dotnet restore`, `dotnet build` e `dotnet test`.
- Observação: usado target framework `net10.0`.
- Commit: `chore: add initial backend solution structure`.

### Etapa 2 — Entidades de domínio

- Status: Aprovado.
- Objetivo: criar as entidades principais do domínio.
- Resultado: criadas entidades para matérias, módulos, anotações, páginas A4 e tags.
- Favoritos: representados inicialmente em `Note`.
- Validação: `dotnet restore`, `dotnet build` e `dotnet test`.
- Commit: `feat: add core domain entities`.

### Etapa 3 — Regras de negócio do domínio

- Status: Aprovado.
- Objetivo: implementar regras básicas diretamente nas entidades de domínio.
- Resultado: adicionadas operações controladas para módulos, anotações, páginas, tags e favoritos.
- Validação: `dotnet restore`, `dotnet build`, `dotnet test` e `dotnet format`.
- Commit: `feat: add domain business rules`.

### Etapa 4 — Persistência inicial

- Status: Aprovado.
- Objetivo: configurar persistência inicial.
- Resultado: configurado EF Core com SQLite, `CadernoAppDbContext` e mapeamentos Fluent API.
- Testes: persistência validada com SQLite em memória.
- Validação: `dotnet restore`, `dotnet build`, `dotnet test` e `dotnet format`.
- Commit: `feat: add initial persistence layer`.

### Etapa 5 — Serviços de aplicação

- Status: Aprovado.
- Objetivo: criar casos de uso principais.
- Resultado: criados serviços de aplicação, DTOs, interfaces de persistência e repositórios.
- Testes: fluxos de aplicação validados com SQLite em memória.
- Validação: `dotnet restore`, `dotnet build`, `dotnet test` e `dotnet format`.
- Commit: `feat: add application services`.

### Etapa 6 — Camada de entrada/API

- Status: Aprovado.
- Objetivo: expor endpoints iniciais para consumo futuro pelo frontend.
- Resultado: criados endpoints Minimal APIs e contratos HTTP.
- Testes: integração validada com `WebApplicationFactory` e SQLite em memória.
- Validação: `dotnet restore`, `dotnet build`, `dotnet test` e `dotnet format`.
- Commit: `feat: add initial api endpoints`.

### Etapa 7 — Testes, validações e CI

- Status: Aprovado.
- Objetivo: ampliar testes e criar validação automatizada inicial.
- Resultado: cobertura ampliada em domínio, aplicação e API.
- CI: criado workflow inicial no GitHub Actions.
- Validação: `dotnet restore`, `dotnet build`, `dotnet test` e `dotnet format --no-restore`.
- Commit: `test: expand coverage and add ci workflow`.

### Etapa 8 — Preparação para exportação imprimível

- Status: Aprovado.
- Objetivo: preparar estrutura para retorno imprimível/exportável das anotações.
- Resultado: criados DTOs printable e serviço de exportação de anotações.
- Endpoint: `GET /api/notes/{id}/printable`.
- Importante: nenhum PDF real foi gerado nesta etapa.
- Validação: `dotnet restore`, `dotnet build`, `dotnet test` e `dotnet format --no-restore`.
- Commit: `feat: prepare printable note export`.

### M1 — Manutenção de estilo C#

- Status: Aprovado.
- Objetivo: padronizar formatação e regras básicas de estilo C#.
- Resultado: criado `.editorconfig` e executado `dotnet format --no-restore`.
- Escopo: sem alteração funcional.
- Validação: `dotnet restore`, `dotnet build`, `dotnet test` e `dotnet format --no-restore`.
- Commit: `style: normalize csharp formatting`.

### Etapa 9 — Especificação técnica do editor A4

- Status: Aprovado.
- Objetivo: documentar editor A4, contrato de conteúdo e estratégia futura de PDF.
- Resultado: criado `docs/04-especificacao-editor-a4-e-pdf.md`.
- Decisão: `ContentFormat` padrão `html`.
- Decisão: conteúdo salvo como HTML controlado.
- Decisão: exportação PDF real será etapa futura.
- Validação: `dotnet restore`, `dotnet build`, `dotnet test` e `dotnet format --no-restore`.
- Commit: `docs: define a4 editor and content contract`.

### M2 — Manutenção documental

- Status: Aprovado / corrigido parcialmente.
- Objetivo: normalizar Markdown e atualizar pendências resolvidas pela Etapa 9.
- Resultado: `docs/04-especificacao-editor-a4-e-pdf.md` foi corrigido e ficou legível.
- Limitação identificada: `docs/03-acompanhamento-do-projeto.md` ainda precisava de correção final.
- Commit inicial: `docs: normalize markdown documentation`.
- Commit de correção parcial: `docs: fix markdown line breaks`.

### M2.1 — Correção final do acompanhamento

- Status: Aprovado.
- Objetivo: corrigir exclusivamente `docs/03-acompanhamento-do-projeto.md`.
- Resultado: acompanhamento recriado em formato simples, legível e verificável.
- Escopo: apenas documentação.
- Arquivo alterado:
  - `docs/03-acompanhamento-do-projeto.md`
- Validação local:
  - `dotnet restore`: sucesso.
  - `dotnet build`: sucesso.
  - `dotnet test`: sucesso, 87 testes aprovados.
  - `dotnet format --no-restore`: sucesso.
- Commit: `docs: fix project tracking document`.

## Pendências

### P-007

- Descrição: decidir formato de armazenamento do conteúdo da página.
- Decisão inicial: `ContentFormat` padrão `html` com HTML controlado.
- Status: Concluído.
- Observação: decisão documentada na Etapa 9.

### P-008

- Descrição: definir estratégia futura de PDF A4.
- Decisão inicial: usar a estrutura printable como base para exportação futura.
- Status: Concluído.
- Observação: estratégia documentada na Etapa 9.

### P-009

- Descrição: implementar sanitização real do HTML controlado.
- Status: Pendente.
- Observação: a Etapa 9 documentou o contrato, mas não implementou sanitização.

### P-010

- Descrição: implementar exportação PDF A4 real.
- Status: Pendente.
- Observação: a Etapa 8 preparou dados imprimíveis, mas não gerou PDF.

### P-011

- Descrição: planejar frontend/editor A4.
- Status: Pendente.
- Observação: próxima pendência recomendada antes de implementar interface.

## Próxima Tarefa

Planejar o frontend/editor A4.

O planejamento deve incluir:

- Escolha da tecnologia do frontend.
- Escolha ou prototipação do editor rich text.
- Renderização visual da página A4.
- Paginação visual no frontend.
- Produção de HTML controlado compatível com o contrato documentado.
- Estratégia futura para sanitização real do HTML.
- Integração posterior com os endpoints já existentes.

Não iniciar implementação de frontend, PDF real, autenticação ou autorização sem etapa específica.

## Histórico de validações

### Etapa 8

- Data: 2026-07-08.
- Resultado: Aprovado.
- Resumo: estrutura printable/export ready criada para anotações A4.
- Testes: 87 aprovados.
- Commit: `feat: prepare printable note export`.

### M1

- Data: 2026-07-08.
- Resultado: Aprovado.
- Resumo: `.editorconfig` criado e formatação C# normalizada.
- Testes: 87 aprovados.
- Commit: `style: normalize csharp formatting`.

### Etapa 9

- Data: 2026-07-08.
- Resultado: Aprovado.
- Resumo: especificação técnica do editor A4 e estratégia futura de PDF documentadas.
- Testes: 87 aprovados.
- Commit: `docs: define a4 editor and content contract`.

### M2

- Data: 2026-07-08.
- Resultado: Aprovado / corrigido parcialmente.
- Resumo: Markdown documental ajustado, com correção adequada do documento 04.
- Observação: o acompanhamento ainda precisou de correção final posterior.
- Testes: 87 aprovados.
- Commits:
  - `docs: normalize markdown documentation`
  - `docs: fix markdown line breaks`

### M2.1

- Data: 2026-07-08.
- Resultado: Aprovado.
- Resumo: acompanhamento do projeto recriado e normalizado para refletir o estado real.
- Arquivo alterado:
  - `docs/03-acompanhamento-do-projeto.md`
- Testes: 87 aprovados.
- Commit: `docs: fix project tracking document`.

## Conferência de escopo

Esta correção não alterou:

- `docs/04-especificacao-editor-a4-e-pdf.md`.
- Código C#.
- Testes.
- CI.
- Pacotes.
- Backend.
- API.
- Target framework.
- Frontend.
- PDF.

## Observações gerais

O documento `docs/04-especificacao-editor-a4-e-pdf.md` permanece como fonte da especificação técnica
do editor A4 e da estratégia futura de PDF.

Este documento `docs/03-acompanhamento-do-projeto.md` passa a ser a fonte de acompanhamento
do estado atual aprovado do projeto.
