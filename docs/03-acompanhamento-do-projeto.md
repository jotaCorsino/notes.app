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
| 2 — Entidades de domínio | Criar entidades principais do domínio | Criadas entidades principais em `CadernoApp.Domain` e testes unitários em `CadernoApp.Tests` | Aprovado | `src/CadernoApp.Domain/Entities/`, `tests/CadernoApp.Tests/Domain/`, `docs/03-acompanhamento-do-projeto.md` | `dotnet restore`, `dotnet build` e `dotnet test` executados com sucesso | Sem banco, EF, migrations, endpoints, controllers, serviços de aplicação, repositórios, DTOs ou PDF |
| 3 — Regras de negócio | Implementar regras básicas do domínio | Implementadas operações controladas para módulos, anotações, páginas, tags, favoritos e atualização de conteúdo | Aprovado | `src/CadernoApp.Domain/Entities/`, `tests/CadernoApp.Tests/Domain/CoreDomainEntitiesTests.cs`, `docs/03-acompanhamento-do-projeto.md` | `dotnet restore`, `dotnet build`, `dotnet test` e `dotnet format` executados com sucesso | Sem banco, EF, migrations, endpoints, controllers, serviços de aplicação, repositórios, DTOs ou PDF |
| 4 — Persistência | Configurar banco de dados e mapeamento das entidades | Configurado EF Core com SQLite, `CadernoAppDbContext`, mapeamentos Fluent API e testes com SQLite em memória | Aprovado | `src/CadernoApp.Infrastructure/`, `src/CadernoApp.Domain/Entities/`, `tests/CadernoApp.Tests/Infrastructure/`, `docs/03-acompanhamento-do-projeto.md` | `dotnet restore`, `dotnet build`, `dotnet test` e `dotnet format` executados com sucesso | Sem migrations, endpoints, controllers, serviços de aplicação, repositórios, DTOs, autenticação ou PDF |
| 5 — Serviços de aplicação | Criar casos de uso principais | Criados serviços de aplicação, DTOs, interfaces de persistência, repositórios EF Core e testes de fluxos com SQLite em memória | Aprovado | `src/CadernoApp.Application/`, `src/CadernoApp.Infrastructure/Persistence/Repositories/`, `src/CadernoApp.Domain/Entities/`, `tests/CadernoApp.Tests/Application/`, `docs/03-acompanhamento-do-projeto.md` | `dotnet restore`, `dotnet build`, `dotnet test` e `dotnet format` executados com sucesso | Sem endpoints, controllers, autenticação, frontend, PDF, MediatR, AutoMapper ou FluentValidation |
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

Etapa 5 concluída: criação dos serviços de aplicação e casos de uso iniciais.

### Próxima tarefa sugerida

Criar a camada de entrada/API.

Itens previstos para a próxima etapa:

- Registrar a composição necessária no `Program.cs`.
- Expor endpoints iniciais para matérias, módulos, anotações, páginas, tags e favoritos.
- Consumir os serviços de aplicação já criados.
- Manter entidades de domínio fora dos contratos HTTP.

Não criar autenticação, frontend ou PDF nessa próxima etapa.

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

## Registro da Etapa 2

### Objetivo realizado

Criadas as entidades principais do domínio do Caderno App, representando a estrutura central:

```text
Subject > StudyModule > Note > NotePage
```

Também foi incluída a entidade `Tag` e o comportamento inicial de favorito em `Note`.

### Entidades criadas

```text
Subject
StudyModule
Note
NotePage
Tag
```

### Testes criados

```text
CoreDomainEntitiesTests.Subject_WithValidName_IsCreated
CoreDomainEntitiesTests.Subject_WithEmptyName_ThrowsArgumentException
CoreDomainEntitiesTests.StudyModule_WithSubjectId_IsCreated
CoreDomainEntitiesTests.Note_WithStudyModuleId_IsCreatedNotFavorite
CoreDomainEntitiesTests.Note_CanBeMarkedAsFavoriteAndUnmarked
CoreDomainEntitiesTests.NotePage_UsesDefaultA4Size
CoreDomainEntitiesTests.Tag_WithValidName_IsCreated
```

### Arquivos criados

```text
src/CadernoApp.Domain/Entities/Subject.cs
src/CadernoApp.Domain/Entities/StudyModule.cs
src/CadernoApp.Domain/Entities/Note.cs
src/CadernoApp.Domain/Entities/NotePage.cs
src/CadernoApp.Domain/Entities/Tag.cs
tests/CadernoApp.Tests/Domain/CoreDomainEntitiesTests.cs
```

### Arquivos alterados

```text
docs/03-acompanhamento-do-projeto.md
```

### Resultado de build e test

```text
dotnet restore: sucesso
dotnet build: sucesso, 0 avisos, 0 erros
dotnet test: sucesso, 9 testes aprovados
```

### Commit gerado

```text
feat: add core domain entities
```

### Observações técnicas

- As entidades foram criadas somente no projeto `CadernoApp.Domain`.
- Os testes foram criados somente no projeto `CadernoApp.Tests`.
- `StudyModule` foi usado no lugar de `Module` para evitar conflito conceitual com `System.Reflection.Module`.
- `NotePage` usa A4 como padrão: `210mm x 297mm`.
- `ContentFormat` começa como `string`, com valor padrão `html`.
- As coleções foram inicializadas para evitar `null`.
- Foram usadas validações básicas para campos obrigatórios.
- Não foram criados banco de dados, Entity Framework, migrations, endpoints, controllers, serviços de aplicação, repositórios, DTOs ou lógica de PDF.

## Registro da Etapa 3

### Objetivo realizado

Implementadas regras básicas de negócio diretamente nas entidades de domínio, mantendo o escopo restrito ao projeto `CadernoApp.Domain` e aos testes unitários em `CadernoApp.Tests`.

### Regras implementadas

```text
Subject
- Adiciona módulos por método de domínio.
- Rejeita módulo com título duplicado dentro da mesma matéria, com comparação case-insensitive.
- Define OrderIndex automaticamente no final quando não informado.
- Atualiza UpdatedAt ao adicionar módulo.

StudyModule
- Adiciona anotações por método de domínio.
- Rejeita anotação com título duplicado dentro do mesmo módulo, com comparação case-insensitive.
- Atualiza UpdatedAt ao adicionar anotação.

Note
- Adiciona páginas por método de domínio.
- Define PageNumber sequencial automaticamente a partir de 1.
- Define OrderIndex acompanhando a ordem das páginas.
- Adiciona tags por método de domínio.
- Rejeita tag duplicada na mesma anotação, com comparação case-insensitive.
- Remove tag por nome ou por Id.
- Mantém MarkAsFavorite e UnmarkAsFavorite idempotentes.
- Atualiza UpdatedAt ao adicionar página, adicionar tag, remover tag ou alterar favorito.

NotePage
- Mantém A4 como tamanho padrão: 210mm x 297mm.
- Mantém ContentFormat padrão como html.
- Valida PageNumber, OrderIndex, WidthMm e HeightMm.
- Atualiza conteúdo por UpdateContent.
- Atualiza UpdatedAt ao alterar conteúdo.

Tag
- Mantém nome obrigatório e cor opcional.
- Permite atualizar nome e cor por método de domínio.
```

### Testes criados ou ajustados

```text
CoreDomainEntitiesTests
- Cobertura de criação das entidades principais.
- Cobertura de Subject.AddModule.
- Cobertura de duplicidade de módulos por título.
- Cobertura de UpdatedAt ao adicionar módulo.
- Cobertura de StudyModule.AddNote.
- Cobertura de duplicidade de anotações por título.
- Cobertura de UpdatedAt ao adicionar anotação.
- Cobertura de Note.AddPage com primeira página e múltiplas páginas sequenciais.
- Cobertura de UpdatedAt ao adicionar página.
- Cobertura de Note.AddTag.
- Cobertura de duplicidade de tags por nome.
- Cobertura de remoção de tag por nome e por Id.
- Cobertura de idempotência de favoritos.
- Cobertura de NotePage.UpdateContent.
- Cobertura das validações de PageNumber, OrderIndex, WidthMm e HeightMm.
```

### Arquivos criados

```text
Nenhum arquivo novo foi criado nesta etapa.
```

### Arquivos alterados

```text
src/CadernoApp.Domain/Entities/Subject.cs
src/CadernoApp.Domain/Entities/StudyModule.cs
src/CadernoApp.Domain/Entities/Note.cs
src/CadernoApp.Domain/Entities/NotePage.cs
src/CadernoApp.Domain/Entities/Tag.cs
tests/CadernoApp.Tests/Domain/CoreDomainEntitiesTests.cs
docs/03-acompanhamento-do-projeto.md
```

### Resultado de build, test e format

```text
dotnet restore: sucesso
dotnet build: sucesso, 0 avisos, 0 erros
dotnet test: sucesso, 35 testes aprovados
dotnet format: sucesso
```

### Commit gerado

```text
feat: add domain business rules
```

### Observações técnicas

- As regras foram implementadas somente nas entidades do projeto `CadernoApp.Domain`.
- Os testes foram ajustados somente no projeto `CadernoApp.Tests`.
- `UpdatedAt` usa atualização monotônica para evitar igualdade acidental quando operações acontecem no mesmo tick.
- `dotnet test` e `dotnet format` precisaram ser executados fora do sandbox por acesso ao `NuGet.Config` do usuário.
- Não foram criados banco de dados, Entity Framework, migrations, endpoints, controllers, serviços de aplicação, repositórios, DTOs, autenticação ou lógica de PDF.

## Registro da Etapa 4

### Objetivo realizado

Configurada a persistência inicial no projeto `CadernoApp.Infrastructure` usando SQLite e Entity Framework Core, com mapeamento das entidades principais do domínio e testes de persistência com SQLite em memória.

### Banco e ORM escolhidos

```text
Banco: SQLite
ORM: Entity Framework Core
```

### Pacotes instalados

```text
Microsoft.EntityFrameworkCore 10.0.9
Microsoft.EntityFrameworkCore.Sqlite 10.0.9
Microsoft.EntityFrameworkCore.Design 10.0.9
SQLitePCLRaw.lib.e_sqlite3 3.53.3
```

`SQLitePCLRaw.lib.e_sqlite3` foi fixado diretamente para substituir a dependência transitiva `2.1.11`, que gerava alerta `NU1903`.

### Arquivos criados

```text
src/CadernoApp.Infrastructure/Persistence/CadernoAppDbContext.cs
src/CadernoApp.Infrastructure/Persistence/Configurations/SubjectConfiguration.cs
src/CadernoApp.Infrastructure/Persistence/Configurations/StudyModuleConfiguration.cs
src/CadernoApp.Infrastructure/Persistence/Configurations/NoteConfiguration.cs
src/CadernoApp.Infrastructure/Persistence/Configurations/NotePageConfiguration.cs
src/CadernoApp.Infrastructure/Persistence/Configurations/TagConfiguration.cs
tests/CadernoApp.Tests/Infrastructure/CadernoAppDbContextTests.cs
```

### Arquivos alterados

```text
src/CadernoApp.Infrastructure/CadernoApp.Infrastructure.csproj
src/CadernoApp.Domain/Entities/Subject.cs
src/CadernoApp.Domain/Entities/StudyModule.cs
src/CadernoApp.Domain/Entities/Note.cs
src/CadernoApp.Domain/Entities/NotePage.cs
src/CadernoApp.Domain/Entities/Tag.cs
docs/03-acompanhamento-do-projeto.md
```

### Testes criados ou ajustados

```text
CadernoAppDbContextTests.CanPersistSubject
CadernoAppDbContextTests.CanPersistSubjectWithStudyModule
CadernoAppDbContextTests.CanPersistStudyModuleWithNote
CadernoAppDbContextTests.CanPersistNoteWithNotePage
CadernoAppDbContextTests.CanPersistNoteWithTag
```

### Resultado de restore, build, test e format

```text
dotnet restore: sucesso
dotnet build: sucesso, 0 avisos, 0 erros
dotnet test: sucesso, 40 testes aprovados
dotnet format: sucesso
```

### Commit gerado

```text
feat: add initial persistence layer
```

### Observações técnicas

- O `CadernoAppDbContext` expõe `DbSet` para `Subject`, `StudyModule`, `Note`, `NotePage` e `Tag`.
- Os mapeamentos foram criados por classe de configuração usando Fluent API.
- A relação `Note`/`Tag` foi mapeada como many-to-many com tabela de junção `NoteTags`, sem criar entidade de domínio `NoteTag`.
- As coleções encapsuladas do domínio foram mapeadas usando acesso por campo.
- As entidades de domínio receberam apenas ajustes técnicos mínimos para EF Core: construtores privados sem parâmetros e setters privados em propriedades que precisam ser materializadas.
- O projeto `CadernoApp.Domain` continua sem referência a Entity Framework.
- Nenhuma migration foi criada.
- `Program.cs` da API não foi alterado.
- Não foram criados endpoints, controllers, serviços de aplicação, repositórios, DTOs, autenticação ou PDF.

## Registro da Etapa 5

### Objetivo realizado

Criada a camada de aplicação com casos de uso iniciais para matérias, módulos, anotações, páginas, tags e favoritos. A aplicação depende apenas do domínio e de interfaces próprias; as implementações EF Core ficaram isoladas na infraestrutura.

### Interfaces criadas

```text
ISubjectRepository
IStudyModuleRepository
INoteRepository
ITagRepository
IUnitOfWork
```

### Serviços criados

```text
SubjectService
StudyModuleService
NoteService
```

### DTOs criados

```text
SubjectDto
StudyModuleDto
NoteDto
NoteSummaryDto
NotePageDto
TagDto
```

### Repositórios criados

```text
SubjectRepository
StudyModuleRepository
NoteRepository
TagRepository
UnitOfWork
```

### Arquivos criados

```text
src/CadernoApp.Application/Abstractions/ISubjectRepository.cs
src/CadernoApp.Application/Abstractions/IStudyModuleRepository.cs
src/CadernoApp.Application/Abstractions/INoteRepository.cs
src/CadernoApp.Application/Abstractions/ITagRepository.cs
src/CadernoApp.Application/Abstractions/IUnitOfWork.cs
src/CadernoApp.Application/DTOs/SubjectDto.cs
src/CadernoApp.Application/DTOs/StudyModuleDto.cs
src/CadernoApp.Application/DTOs/NoteDto.cs
src/CadernoApp.Application/DTOs/NoteSummaryDto.cs
src/CadernoApp.Application/DTOs/NotePageDto.cs
src/CadernoApp.Application/DTOs/TagDto.cs
src/CadernoApp.Application/Services/SubjectService.cs
src/CadernoApp.Application/Services/StudyModuleService.cs
src/CadernoApp.Application/Services/NoteService.cs
src/CadernoApp.Application/DependencyInjection.cs
src/CadernoApp.Infrastructure/DependencyInjection.cs
src/CadernoApp.Infrastructure/Persistence/Repositories/SubjectRepository.cs
src/CadernoApp.Infrastructure/Persistence/Repositories/StudyModuleRepository.cs
src/CadernoApp.Infrastructure/Persistence/Repositories/NoteRepository.cs
src/CadernoApp.Infrastructure/Persistence/Repositories/TagRepository.cs
src/CadernoApp.Infrastructure/Persistence/Repositories/UnitOfWork.cs
tests/CadernoApp.Tests/Application/ApplicationServicesTests.cs
```

### Arquivos alterados

```text
src/CadernoApp.Application/CadernoApp.Application.csproj
src/CadernoApp.Domain/Entities/Subject.cs
src/CadernoApp.Domain/Entities/Note.cs
tests/CadernoApp.Tests/Domain/CoreDomainEntitiesTests.cs
docs/03-acompanhamento-do-projeto.md
```

### Ajustes no domínio

```text
Subject.Update
Note.AddTag(Tag tag)
```

Esses métodos foram adicionados para suportar casos de uso de aplicação sem expor setters públicos nem remover regras de domínio.

### Testes criados ou ajustados

```text
ApplicationServicesTests.SubjectService_CreatesSubject
ApplicationServicesTests.SubjectService_ListsSubjects
ApplicationServicesTests.SubjectService_UpdatesSubject
ApplicationServicesTests.StudyModuleService_CreatesModuleInsideSubject
ApplicationServicesTests.NoteService_CreatesNoteInsideModule
ApplicationServicesTests.NoteService_AddsPage
ApplicationServicesTests.NoteService_UpdatesPageContent
ApplicationServicesTests.NoteService_AddsTag
ApplicationServicesTests.NoteService_RemovesTag
ApplicationServicesTests.NoteService_MarksAndUnmarksFavorite
ApplicationServicesTests.NoteService_ListsFavorites
ApplicationServicesTests.NoteService_SearchesByTitleAndTag
CoreDomainEntitiesTests.Subject_Update_UpdatesBasicData
CoreDomainEntitiesTests.Note_AddTag_WithExistingTag_AddsTagToNote
```

### Resultado de restore, build, test e format

```text
dotnet restore: sucesso
dotnet build: sucesso, 0 avisos, 0 erros
dotnet test: sucesso, 54 testes aprovados
dotnet format: sucesso
```

### Commit gerado

```text
feat: add application services
```

### Observações técnicas

- `CadernoApp.Application` continua sem depender de `CadernoApp.Infrastructure`.
- `CadernoApp.Domain` continua sem dependência de EF Core.
- `CadernoApp.Infrastructure` implementa as interfaces definidas em `CadernoApp.Application`.
- Foi adicionado apenas o pacote oficial `Microsoft.Extensions.DependencyInjection.Abstractions` ao projeto `CadernoApp.Application` para registrar serviços via DI.
- Os testes de aplicação usam SQLite em memória com repositórios reais, sem passar pela API.
- Ao criar filhos de agregados já rastreados, os repositórios marcam explicitamente as novas entidades como `Added` para o EF Core persistir corretamente coleções encapsuladas.
- `Program.cs` da API não foi alterado.
- Não foram criados endpoints, controllers, autenticação, frontend ou PDF.
- Não foram adicionados MediatR, AutoMapper ou FluentValidation.

## Histórico de Validações

| Data | Etapa | Resultado | Resumo | Observações |
|---|---|---|---|---|
| 2026-07-08 | Etapa 0 | Aprovado | Documentação inicial validada, commitada e enviada para `origin/main` | Commit `docs: add initial project documentation` |
| 2026-07-08 | Etapa 1 | Aprovado | Estrutura inicial backend em C# criada e validada com `dotnet restore`, `dotnet build` e `dotnet test` | Commit `chore: add initial backend solution structure`; `dotnet test` sem testes disponíveis |
| 2026-07-08 | Etapa 2 | Aprovado | Entidades principais do domínio criadas e validadas com testes unitários | Commit `feat: add core domain entities`; `dotnet test` com 9 testes aprovados |
| 2026-07-08 | Etapa 3 | Aprovado | Regras básicas de negócio do domínio implementadas e validadas com testes unitários | Commit `feat: add domain business rules`; `dotnet test` com 35 testes aprovados |
| 2026-07-08 | Etapa 4 | Aprovado | Persistência inicial com EF Core e SQLite configurada e validada com testes de persistência | Commit `feat: add initial persistence layer`; `dotnet test` com 40 testes aprovados |
| 2026-07-08 | Etapa 5 | Aprovado | Serviços de aplicação, DTOs, interfaces, repositórios e testes de fluxos criados | Commit `feat: add application services`; `dotnet test` com 54 testes aprovados |

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
