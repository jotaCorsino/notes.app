# 03 — Acompanhamento do Projeto

## Objetivo deste documento

Este documento acompanha a execução do projeto Caderno App.

Ele deve ser usado para comparar:

- O que estava planejado.
- O que foi feito.
- Quais arquivos foram alterados.
- Qual é o status de cada etapa.
- Quais decisões técnicas já foram tomadas.
- Qual é a próxima tarefa.

Este arquivo deve ser atualizado ao final de cada etapa aprovada.

## Repositório remoto

```text
https://github.com/jotaCorsino/notes.app.git
```

## Status possíveis

```text
Pendente
Em andamento
Aguardando validação
Aprovado
Reprovado
Corrigir
```

## Tabela de acompanhamento

| Etapa | Objetivo planejado | O que foi feito | Status | Arquivos alterados | Critério de validação | Observações |
|---|---|---|---|---|---|---|
| 0 — Documentação e base do repositório | Criar documentação inicial do projeto e realizar primeiro commit/push | Documentação inicial validada, commitada e enviada para `origin/main` | Aprovado | `docs/01-visao-geral-do-app.md`, `docs/02-planejamento-de-construcao.md`, `docs/03-acompanhamento-do-projeto.md` | Confirmar que existem apenas os três documentos iniciais dentro de `docs` e que não há código criado | Concluída em 2026-07-08 |
| 1 — Criação da solução backend em C# | Criar estrutura inicial da solução backend | Criada solução `CadernoApp.sln`, projetos em `src` e `tests`, referências entre camadas e validação local | Aprovado | `.gitignore`, `CadernoApp.sln`, `src/CadernoApp.Api/`, `src/CadernoApp.Application/`, `src/CadernoApp.Domain/`, `src/CadernoApp.Infrastructure/`, `tests/CadernoApp.Tests/`, `docs/03-acompanhamento-do-projeto.md` | `dotnet restore`, `dotnet build` e `dotnet test` executados com sucesso | Usado .NET SDK `10.0.301` com target framework `net10.0`; sem entidades, serviços, banco, endpoints de negócio ou PDF |
| 2 — Entidades de domínio | Criar entidades principais do domínio | Pendente | Pendente | A definir | Entidades criadas em `Domain` e solução compilando | Deve incluir matéria, módulo, anotação, página e tag |
| 3 — Regras de negócio | Implementar regras básicas do domínio | Pendente | Pendente | A definir | Regras implementadas e testáveis | Incluir regras de página, tags e favoritos |
| 4 — Persistência | Configurar banco de dados e mapeamento das entidades | Pendente | Pendente | A definir | Banco configurado e entidades persistíveis | Persistência inicial recomendada: SQLite |
| 5 — Serviços de aplicação | Criar casos de uso principais | Pendente | Pendente | A definir | Serviços criados e solução compilando | Camada de aplicação deve evitar dependência direta da API |
| 6 — Camada de entrada/API | Expor endpoints para consumo futuro pelo frontend | Pendente | Pendente | A definir | Endpoints básicos funcionando | Incluir endpoints para matérias, módulos, anotações, páginas, tags e favoritos |
| 7 — Testes | Criar testes do domínio e dos fluxos principais | Pendente | Pendente | A definir | Testes executando com sucesso | Priorizar regras de página, tags e favoritos |
| 8 — Preparação para exportação PDF | Preparar contratos e estrutura para PDF A4 | Pendente | Pendente | A definir | Anotações retornando páginas em ordem e estrutura pronta para exportação | Não precisa gerar PDF final nesta etapa |
| 9 — Integração futura com frontend | Preparar backend para editor visual e app final | Pendente | Pendente | A definir | API pronta para consumo inicial | Frontend será planejado depois |

## Decisões Técnicas

### DT-001 — Backend em C#

Status: **Aprovada**

O backend será construído em C#.

Motivo:

- O projeto também servirá como prática de backend.
- C# é adequado para construção de APIs, serviços e organização de domínio.
- Permite evoluir para uma arquitetura profissional e testável.

### DT-002 — Organização como fichário digital

Status: **Aprovada**

A hierarquia principal será:

```text
Matéria > Módulo > Anotação > Página A4
```

Motivo:

- Facilita a organização dos estudos.
- Aproxima o app da lógica de um fichário físico.
- Ajuda a manter o conteúdo consultável.

### DT-003 — Módulos, tags e favoritos desde o MVP

Status: **Aprovada**

O MVP incluirá módulos, tags e favoritos.

Motivo:

- Esses recursos facilitam a consulta de conteúdo.
- Fazem parte do valor principal do app.
- Evitam que o app seja apenas um bloco de notas simples.

### DT-004 — Página A4 como entidade real

Status: **Aprovada**

A página A4 deve ser parte real do modelo do sistema.

Motivo:

- O app precisa exportar futuramente para PDF A4 imprimível.
- A anotação não deve ser tratada como texto infinito.
- A ordem das páginas precisa ser preservada.

### DT-005 — Exportação PDF será preparada, mas não implementada no primeiro momento

Status: **Aprovada**

A arquitetura deve nascer preparada para PDF, mas a geração final de PDF não será a primeira funcionalidade implementada.

Motivo:

- PDF depende de decisões de renderização.
- A prioridade inicial é construir o domínio e a persistência corretamente.
- A página A4 já será modelada desde o início para evitar retrabalho.

### DT-006 — Um comando por vez para o Codex

Status: **Aprovada**

O Codex deve receber tarefas pequenas e controladas.

Motivo:

- Reduz risco de alterações fora do escopo.
- Facilita validação por diff no GitHub.
- Mantém o projeto organizado.
- Permite corrigir o rumo antes de acumular problemas.

### DT-007 — Repositório remoto como fonte de validação

Status: **Aprovada**

O repositório remoto será usado como base para validar o estado real do projeto.

Motivo:

- O que está no GitHub é o estado oficial do projeto.
- O resumo do Codex deve ser comparado com o diff real.
- Evita avançar com base apenas em descrição textual.

## Pendências

| Item | Descrição | Prioridade | Status |
|---|---|---|---|
| P-001 | Criar pasta `docs` no repositório local | Alta | Concluído |
| P-002 | Adicionar os três documentos iniciais em `docs` | Alta | Concluído |
| P-003 | Pedir ao Codex para analisar, commitar e fazer push da documentação inicial | Alta | Concluído |
| P-004 | Validar o primeiro commit no GitHub | Alta | Concluído |
| P-005 | Definir versão do .NET usada no backend | Média | Concluído — `net10.0` |
| P-006 | Confirmar nome técnico da solução/projetos C# | Média | Concluído — `CadernoApp` |
| P-007 | Decidir formato de armazenamento do conteúdo da página: HTML sanitizado, JSON de editor ou outro formato | Alta | Pendente |
| P-008 | Definir estratégia futura de PDF A4 | Média | Pendente |

## Próxima Tarefa

### Tarefa atual

Etapa 1 concluída: criação da estrutura inicial do backend em C#.

### Próxima tarefa sugerida

Criar as entidades de domínio do Caderno App em `src/CadernoApp.Domain`.

Entidades previstas para a próxima etapa:

- Matéria.
- Módulo.
- Anotação.
- Página A4.
- Tag.
- Favorito.

Não configurar persistência, Entity Framework, migrations, endpoints ou PDF nessa próxima etapa.

## Registro da Etapa 1

### Objetivo realizado

Criada a estrutura inicial da solução backend em C#, organizada para evoluir com domínio, aplicação, infraestrutura, API, testes e futura exportação PDF A4.

### Arquivos criados

```text
.gitignore
CadernoApp.sln
src/CadernoApp.Api/CadernoApp.Api.csproj
src/CadernoApp.Api/Program.cs
src/CadernoApp.Api/appsettings.json
src/CadernoApp.Api/appsettings.Development.json
src/CadernoApp.Api/Properties/launchSettings.json
src/CadernoApp.Application/CadernoApp.Application.csproj
src/CadernoApp.Domain/CadernoApp.Domain.csproj
src/CadernoApp.Infrastructure/CadernoApp.Infrastructure.csproj
tests/CadernoApp.Tests/CadernoApp.Tests.csproj
```

### Versão do .NET usada

```text
SDK: 10.0.301
Target framework: net10.0
```

### Commit gerado

```text
chore: add initial backend solution structure
```

### Observações técnicas

- A solução foi criada em formato `.sln`, pois o SDK .NET 10 usa `.slnx` como padrão.
- A API foi criada com o template ASP.NET Core vazio.
- O endpoint de exemplo `MapGet("/")` foi removido para evitar endpoints prematuros.
- Os arquivos `Class1.cs` gerados pelos templates de biblioteca foram removidos.
- O teste placeholder `UnitTest1.cs` foi removido; o projeto xUnit permanece configurado.
- Nenhuma entidade de domínio, serviço de aplicação, banco de dados, migration, autenticação ou lógica de PDF foi criada.
- `dotnet restore` e `dotnet build` passaram sem erros.
- `dotnet test` passou, sem testes disponíveis nesta etapa.

## Histórico de Validações

| Data | Etapa | Resultado | Resumo | Observações |
|---|---|---|---|---|
| 2026-07-08 | Etapa 0 | Aprovado | Documentação inicial validada, commitada e enviada para `origin/main` | Commit `docs: add initial project documentation` |
| 2026-07-08 | Etapa 1 | Aprovado | Estrutura inicial backend em C# criada e validada com `dotnet restore`, `dotnet build` e `dotnet test` | Commit `chore: add initial backend solution structure`; `dotnet test` sem testes disponíveis |

## Checklist de validação da Etapa 0

Antes de aprovar a Etapa 0, confirmar:

- [x] Existe uma pasta `docs` na raiz do repositório.
- [x] Existe o arquivo `docs/01-visao-geral-do-app.md`.
- [x] Existe o arquivo `docs/02-planejamento-de-construcao.md`.
- [x] Existe o arquivo `docs/03-acompanhamento-do-projeto.md`.
- [x] Não existiam arquivos `.cs` no momento da validação da Etapa 0.
- [x] Não existia pasta `src` no momento da validação da Etapa 0.
- [x] Não existia pasta `tests` no momento da validação da Etapa 0.
- [x] Não existia solução `.sln` no momento da validação da Etapa 0.
- [x] O Codex fez commit com mensagem clara.
- [x] O Codex fez push para o repositório remoto.
- [x] O resumo do Codex corresponde ao que aparece no GitHub.

## Observações gerais

Este documento deve ser tratado como o painel de controle do projeto.

Sempre que uma etapa for concluída, atualizar:

- Status da etapa.
- O que foi feito.
- Arquivos alterados.
- Histórico de validações.
- Pendências.
- Próxima tarefa.

Nenhuma etapa nova deve começar enquanto a etapa anterior estiver com status pendente, reprovado ou aguardando correção.
