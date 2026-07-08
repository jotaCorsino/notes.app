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
| 6 — Camada de entrada/API | Expor endpoints para consumo futuro pelo frontend | Criados endpoints Minimal APIs, contratos HTTP, registro de DI da Application/Infrastructure e testes de integração com SQLite em memória | Aprovado | `src/CadernoApp.Api/`, `tests/CadernoApp.Tests/Api/`, `tests/CadernoApp.Tests/CadernoApp.Tests.csproj`, `docs/03-acompanhamento-do-projeto.md` | `dotnet restore`, `dotnet build`, `dotnet test` e `dotnet format` executados com sucesso | Sem controllers, autenticação, frontend, PDF, migrations ou exposição direta de entidades de domínio |
| 7 — Testes | Criar testes do domínio e dos fluxos principais | Ampliada cobertura de domínio, aplicação e API; criado workflow inicial de CI no GitHub Actions | Aprovado | `.github/workflows/ci.yml`, `tests/CadernoApp.Tests/Domain/CoreDomainEntitiesTests.cs`, `tests/CadernoApp.Tests/Application/ApplicationServicesTests.cs`, `tests/CadernoApp.Tests/Api/ApiEndpointsTests.cs`, `docs/03-acompanhamento-do-projeto.md` | `dotnet restore`, `dotnet build`, `dotnet test` e `dotnet format --no-restore` executados com sucesso | Sem novas features de produto, frontend, autenticação, autorização, PDF, migrations ou controllers |
| 8 — Preparação para exportação PDF | Preparar contratos e estrutura para PDF A4 | Criados DTOs e serviço de aplicação para retornar anotações em formato imprimível/exportável; criado endpoint JSON `/api/notes/{id}/printable` | Aprovado | `src/CadernoApp.Application/DTOs/Export/`, `src/CadernoApp.Application/Services/NoteExportService.cs`, `src/CadernoApp.Application/DependencyInjection.cs`, `src/CadernoApp.Api/Endpoints/NoteEndpoints.cs`, `tests/CadernoApp.Tests/Application/ApplicationServicesTests.cs`, `tests/CadernoApp.Tests/Api/ApiEndpointsTests.cs`, `docs/03-acompanhamento-do-projeto.md` | `dotnet restore`, `dotnet build`, `dotnet test --no-restore`, `dotnet test --no-build` e `dotnet format --no-restore` executados com sucesso | Sem geração real de PDF, bibliotecas de PDF, arquivo `.pdf`, download, frontend, autenticação, autorização, migrations ou controllers |
| M1 — Manutenção de estilo C# | Padronizar formatação, legibilidade e configuração básica de estilo | Criado `.editorconfig`, executado `dotnet format --no-restore` e organizado `using` afetado pelo format | Aprovado | `.editorconfig`, `tests/CadernoApp.Tests/Application/ApplicationServicesTests.cs`, `docs/03-acompanhamento-do-projeto.md` | `dotnet restore`, `dotnet build`, `dotnet test` e `dotnet format --no-restore` executados com sucesso | Sem alteração de comportamento, novas features, pacotes, endpoints, migrations, PDF, frontend ou autenticação |
| 9 — Especificação técnica do editor A4 | Definir editor A4, contrato de conteúdo e estratégia futura de PDF | Criado documento técnico `docs/04-especificacao-editor-a4-e-pdf.md` com responsabilidades de frontend/backend, contrato HTML controlado, paginação A4, riscos e decisões | Aprovado | `docs/04-especificacao-editor-a4-e-pdf.md`, `docs/03-acompanhamento-do-projeto.md` | `dotnet restore`, `dotnet build`, `dotnet test` e `dotnet format --no-restore` executados com sucesso | Etapa apenas documental; sem frontend, PDF real, pacotes, entidades, serviços, endpoints ou testes novos |

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

Etapa 9 concluída: especificação técnica do editor A4 e contrato de conteúdo.

### Próxima tarefa sugerida

Planejar o frontend/editor A4 ou a implementação futura do PDF real.

Itens previstos para a próxima etapa:

- Escolher biblioteca ou abordagem de editor rich text.
- Criar protótipo visual da página A4.
- Validar sanitização do HTML controlado.
- Definir se a próxima entrega será frontend/editor ou PDF real.

Não criar autenticação, frontend ou implementação final de PDF sem uma etapa específica.

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

## Registro da Etapa 6

### Objetivo realizado

Criada a camada inicial de entrada/API no projeto `CadernoApp.Api` usando Minimal APIs. Os endpoints consomem os serviços de aplicação existentes, retornam DTOs da camada `CadernoApp.Application` e não expõem entidades de domínio diretamente.

### Endpoints criados

```text
POST /api/subjects
GET /api/subjects
GET /api/subjects/{id}
PUT /api/subjects/{id}
DELETE /api/subjects/{id}

POST /api/subjects/{subjectId}/modules
GET /api/subjects/{subjectId}/modules
GET /api/modules/{id}
DELETE /api/modules/{id}

POST /api/modules/{moduleId}/notes
GET /api/modules/{moduleId}/notes
GET /api/notes/{id}
POST /api/notes/{noteId}/pages
PUT /api/notes/{noteId}/pages/{pageId}/content
POST /api/notes/{noteId}/tags
DELETE /api/notes/{noteId}/tags/{tagName}
PUT /api/notes/{noteId}/favorite
DELETE /api/notes/{noteId}/favorite
GET /api/notes/favorites
GET /api/notes/search?query=texto
```

### Contracts criados

```text
CreateSubjectRequest
UpdateSubjectRequest
CreateStudyModuleRequest
CreateNoteRequest
AddNotePageRequest
UpdateNotePageContentRequest
AddTagToNoteRequest
ErrorResponse
```

### Arquivos criados

```text
src/CadernoApp.Api/Contracts/ErrorResponse.cs
src/CadernoApp.Api/Contracts/Subjects/CreateSubjectRequest.cs
src/CadernoApp.Api/Contracts/Subjects/UpdateSubjectRequest.cs
src/CadernoApp.Api/Contracts/StudyModules/CreateStudyModuleRequest.cs
src/CadernoApp.Api/Contracts/Notes/CreateNoteRequest.cs
src/CadernoApp.Api/Contracts/Notes/AddNotePageRequest.cs
src/CadernoApp.Api/Contracts/Notes/UpdateNotePageContentRequest.cs
src/CadernoApp.Api/Contracts/Notes/AddTagToNoteRequest.cs
src/CadernoApp.Api/Endpoints/EndpointResults.cs
src/CadernoApp.Api/Endpoints/SubjectEndpoints.cs
src/CadernoApp.Api/Endpoints/StudyModuleEndpoints.cs
src/CadernoApp.Api/Endpoints/NoteEndpoints.cs
tests/CadernoApp.Tests/Api/ApiEndpointsTests.cs
```

### Arquivos alterados

```text
src/CadernoApp.Api/Program.cs
src/CadernoApp.Api/appsettings.json
tests/CadernoApp.Tests/CadernoApp.Tests.csproj
docs/03-acompanhamento-do-projeto.md
```

### Pacote adicionado

```text
Microsoft.AspNetCore.Mvc.Testing 10.0.9
```

### Testes criados ou ajustados

```text
ApiEndpointsTests.PostSubject_CreatesSubject
ApiEndpointsTests.GetSubjects_ListsSubjects
ApiEndpointsTests.PostModule_CreatesStudyModuleInsideSubject
ApiEndpointsTests.PostNote_CreatesNoteInsideModule
ApiEndpointsTests.PostPage_AddsPageToNote
ApiEndpointsTests.PostTag_AddsTagToNote
ApiEndpointsTests.PutFavorite_MarksNoteAsFavorite
ApiEndpointsTests.GetFavorites_ReturnsFavoriteNotes
ApiEndpointsTests.GetSubject_ReturnsNotFound_WhenSubjectDoesNotExist
```

### Resultado de restore, build, test e format

```text
dotnet restore: sucesso
dotnet build: sucesso, 0 avisos, 0 erros
dotnet test: sucesso, 63 testes aprovados
dotnet format: sucesso
```

### Commit gerado

```text
feat: add initial api endpoints
```

### Observações técnicas

- `Program.cs` registra `AddApplication()` e `AddInfrastructure(connectionString)`.
- `appsettings.json` define `DefaultConnection` como `Data Source=cadernoapp.db`.
- `Program` recebeu declaração parcial pública para permitir testes com `WebApplicationFactory`.
- Os testes de integração substituem o `CadernoAppDbContext` por SQLite em memória e não usam o arquivo real `cadernoapp.db`.
- Erros esperados de domínio/aplicação são convertidos para `404` ou `400` sem expor stack trace.
- Não foram criados controllers, autenticação, frontend, PDF, migrations ou endpoints fora do escopo da etapa.

## Registro da Etapa 7

### Objetivo realizado

Consolidada a cobertura de testes do backend e criada a configuração inicial de integração contínua no GitHub Actions para executar restore, build e test em push e pull request para `main`.

### Arquivo de CI criado

```text
.github/workflows/ci.yml
```

O workflow usa `ubuntu-latest`, `actions/checkout@v4`, `actions/setup-dotnet@v4` com `dotnet-version: 10.0.x` e executa:

```text
dotnet restore
dotnet build --no-restore
dotnet test --no-build
```

### Testes adicionados ou ajustados

```text
CoreDomainEntitiesTests.Note_RemoveTag_WhenTagDoesNotExist_ReturnsFalseAndKeepsUpdatedAt
CoreDomainEntitiesTests.NotePage_WithNullContent_UsesEmptyContent
CoreDomainEntitiesTests.Tag_Update_UpdatesBasicData

ApplicationServicesTests.SubjectService_CreateSubject_WithInvalidName_ThrowsArgumentException
ApplicationServicesTests.StudyModuleService_CreateModule_WithMissingSubject_ThrowsKeyNotFoundException
ApplicationServicesTests.NoteService_CreateNote_WithMissingModule_ThrowsKeyNotFoundException
ApplicationServicesTests.NoteService_AddPage_WithMissingNote_ThrowsKeyNotFoundException
ApplicationServicesTests.NoteService_UpdatePageContent_WithMissingPage_ThrowsKeyNotFoundException
ApplicationServicesTests.NoteService_AddTag_WithDuplicateTag_ThrowsInvalidOperationException
ApplicationServicesTests.NoteService_SearchesByTitle
ApplicationServicesTests.NoteService_SearchesByTag

ApiEndpointsTests.PostSubject_WithEmptyName_ReturnsBadRequest
ApiEndpointsTests.PostModule_WithMissingSubject_ReturnsNotFound
ApiEndpointsTests.PostNote_WithMissingModule_ReturnsNotFound
ApiEndpointsTests.PostPage_WithMissingNote_ReturnsNotFound
ApiEndpointsTests.PostTag_WithDuplicateTag_ReturnsBadRequest
ApiEndpointsTests.DeleteFavorite_WithMissingNote_ReturnsNotFound
ApiEndpointsTests.GetSearch_ReturnsNotesMatchingTitleOrTag
```

Também foi ajustado o teste `ApiEndpointsTests.GetSubject_ReturnsNotFound_WhenSubjectDoesNotExist` para validar que a resposta de erro não expõe stack trace.

### Arquivos criados

```text
.github/workflows/ci.yml
```

### Arquivos alterados

```text
tests/CadernoApp.Tests/Domain/CoreDomainEntitiesTests.cs
tests/CadernoApp.Tests/Application/ApplicationServicesTests.cs
tests/CadernoApp.Tests/Api/ApiEndpointsTests.cs
docs/03-acompanhamento-do-projeto.md
```

### Resultado de restore, build, test e format

```text
dotnet restore: sucesso
dotnet build: sucesso, 0 avisos, 0 erros
dotnet test: sucesso, 80 testes aprovados
dotnet format --no-restore: sucesso
```

### Commit gerado

```text
test: expand coverage and add ci workflow
```

### Observações técnicas

- A API manteve o tratamento simples por endpoint com o helper `EndpointResults`.
- Os novos testes HTTP validam respostas `400` e `404` e verificam que erros esperados não expõem stack trace.
- O `WebApplicationFactory` usado nos testes limpa providers de logging para não depender do Windows EventLog durante execução local/sandbox.
- O comportamento atual de `NotePage` aceita conteúdo nulo como página em branco; isso foi documentado por teste, sem criar nova regra de produto.
- `dotnet test` completo precisou ser executado uma vez fora do sandbox por acesso ao `NuGet.Config`; a validação final foi feita com `dotnet test --no-build` dentro do sandbox.
- Não foram criados frontend, autenticação, autorização, PDF, migrations, controllers, MediatR, AutoMapper, FluentValidation ou novas entidades de produto.

## Registro da Etapa 8

### Objetivo realizado

Criada uma estrutura de aplicação para obter uma anotação em formato pronto para impressão/exportação futura. O retorno contém metadados da matéria, módulo e anotação, páginas A4 ordenadas, dimensões, conteúdo e formato do conteúdo.

### DTOs criados

```text
PrintableNoteDto
PrintableNoteMetadataDto
PrintableNotePageDto
```

### Serviço criado

```text
NoteExportService
```

O serviço busca a anotação por Id, carrega páginas, módulo e matéria por meio das abstrações existentes, ordena as páginas por `OrderIndex` e `PageNumber`, preserva conteúdo/dimensões/formato e lança `KeyNotFoundException` quando a anotação não existe.

### Endpoint criado

```text
GET /api/notes/{id}/printable
```

O endpoint retorna `PrintableNoteDto` em JSON e responde `404` quando a anotação não existe. Não retorna PDF, não usa `application/pdf` e não cria endpoint de download.

### Arquivos criados

```text
src/CadernoApp.Application/DTOs/Export/PrintableNoteDto.cs
src/CadernoApp.Application/DTOs/Export/PrintableNoteMetadataDto.cs
src/CadernoApp.Application/DTOs/Export/PrintableNotePageDto.cs
src/CadernoApp.Application/Services/NoteExportService.cs
```

### Arquivos alterados

```text
src/CadernoApp.Application/DependencyInjection.cs
src/CadernoApp.Api/Endpoints/NoteEndpoints.cs
tests/CadernoApp.Tests/Application/ApplicationServicesTests.cs
tests/CadernoApp.Tests/Api/ApiEndpointsTests.cs
docs/03-acompanhamento-do-projeto.md
```

### Testes criados ou ajustados

```text
ApplicationServicesTests.NoteExportService_ReturnsPrintableNoteWithMetadata
ApplicationServicesTests.NoteExportService_ReturnsPagesOrderedForPrinting
ApplicationServicesTests.NoteExportService_ReturnsPageCount
ApplicationServicesTests.NoteExportService_PreservesPageDimensionsContentAndFormat
ApplicationServicesTests.NoteExportService_WithMissingNote_ThrowsKeyNotFoundException

ApiEndpointsTests.GetPrintableNote_ReturnsPrintableNoteAsJson
ApiEndpointsTests.GetPrintableNote_WithMissingNote_ReturnsNotFound
```

### Resultado de restore, build, test e format

```text
dotnet restore: sucesso
dotnet build: sucesso, 0 avisos, 0 erros
dotnet test --no-restore: sucesso, 87 testes aprovados
dotnet test --no-build: sucesso, 87 testes aprovados
dotnet format --no-restore: sucesso
```

### Commit gerado

```text
feat: prepare printable note export
```

### Observações técnicas

- `CadernoApp.Application` continua sem depender de `CadernoApp.Infrastructure`.
- `CadernoApp.Domain` continua sem dependência de Application, Infrastructure ou EF Core.
- Não foi necessário alterar repositórios EF Core, pois as abstrações existentes já permitem carregar anotação, módulo e matéria.
- A resposta printable usa DTOs da Application e não expõe entidades de domínio diretamente pela API.
- Nenhum PDF real foi gerado.
- Nenhuma biblioteca de PDF foi instalada.
- Não foram criados arquivo `.pdf`, endpoint de download, endpoint `/pdf`, frontend, autenticação, autorização, migrations, controllers, MediatR, AutoMapper ou FluentValidation.

## Registro da Manutenção M1

### Objetivo realizado

Criada configuração básica de estilo C#/.NET na raiz do repositório e executada formatação local para manter legibilidade, organização de `using` e regras leves de estilo sem alterar comportamento do sistema.

### Arquivo criado

```text
.editorconfig
```

### Regras configuradas

```text
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 4 para C#/CSX
dotnet_sort_system_directives_first = true
dotnet_separate_import_directive_groups = false
csharp_style_namespace_declarations = file_scoped:suggestion
csharp_style_var_when_type_is_apparent = true:suggestion
csharp_style_var_for_built_in_types = false:suggestion
csharp_style_var_elsewhere = false:suggestion
csharp_prefer_braces = true:suggestion
```

### Arquivos C# reformatados

```text
tests/CadernoApp.Tests/Application/ApplicationServicesTests.cs
```

O `dotnet format --no-restore` reorganizou apenas a ordem de `using` nesse arquivo. Os demais arquivos C# permaneceram sem alteração textual após a configuração de EOL compatível com o repositório.

### Arquivos alterados

```text
tests/CadernoApp.Tests/Application/ApplicationServicesTests.cs
docs/03-acompanhamento-do-projeto.md
```

### Resultado de restore, build, test e format

```text
dotnet restore: sucesso
dotnet build: sucesso, 0 avisos, 0 erros
dotnet test: sucesso, 87 testes aprovados
dotnet format --no-restore: sucesso
```

### Commit gerado

```text
style: normalize csharp formatting
```

### Observações técnicas

- `dotnet test` precisou ser executado fora do sandbox para acessar o `NuGet.Config` do usuário.
- A configuração usa severidade `suggestion` para regras de estilo, evitando quebrar o build por preferência estética.
- Não foram criadas features, endpoints, pacotes, migrations, PDF, frontend, autenticação ou autorização.
- Nenhum contrato público da API ou comportamento de domínio foi alterado intencionalmente.

## Registro da Etapa 9

### Objetivo realizado

Criada a especificação técnica do editor A4, do contrato de conteúdo das páginas e da estratégia futura de exportação PDF.

### Documento criado

```text
docs/04-especificacao-editor-a4-e-pdf.md
```

### Decisões documentadas

```text
O conteúdo será salvo por página.
O formato inicial será HTML controlado.
ContentFormat padrão permanece "html".
O frontend será responsável pela paginação visual.
O backend não fará quebra automática de página no MVP.
O endpoint GET /api/notes/{id}/printable será a base para exportação futura.
A geração real de PDF será etapa futura.
Scripts, iframes, eventos inline e estilos arbitrários perigosos não fazem parte do contrato permitido.
```

### Conteúdos documentados

```text
Objetivo do editor A4.
Responsabilidades do frontend.
Responsabilidades do backend.
Contrato de conteúdo HTML controlado.
Subconjunto inicial de tags e estilos permitidos.
Modelo de página A4 com 210mm x 297mm.
Estratégia de paginação visual.
Estratégia futura de exportação PDF.
Riscos técnicos.
Próximas etapas recomendadas.
```

### Arquivos criados

```text
docs/04-especificacao-editor-a4-e-pdf.md
```

### Arquivos alterados

```text
docs/03-acompanhamento-do-projeto.md
```

### Resultado de restore, build, test e format

```text
dotnet restore: sucesso
dotnet build: sucesso, 0 avisos, 0 erros
dotnet test: sucesso, 87 testes aprovados
dotnet format --no-restore: sucesso
```

### Commit gerado

```text
docs: define a4 editor and content contract
```

### Observações técnicas

- Nenhuma feature nova foi criada.
- Nenhum código de frontend foi criado.
- Nenhum PDF real foi gerado.
- Nenhuma biblioteca de PDF foi instalada.
- Nenhuma entidade, serviço, endpoint, teste, migration, pacote ou target framework foi alterado.
- Os documentos `docs/01-visao-geral-do-app.md` e `docs/02-planejamento-de-construcao.md` não foram alterados.

## Histórico de Validações

| Data | Etapa | Resultado | Resumo | Observações |
|---|---|---|---|---|
| 2026-07-08 | Etapa 0 | Aprovado | Documentação inicial validada, commitada e enviada para `origin/main` | Commit `docs: add initial project documentation` |
| 2026-07-08 | Etapa 1 | Aprovado | Estrutura inicial backend em C# criada e validada com `dotnet restore`, `dotnet build` e `dotnet test` | Commit `chore: add initial backend solution structure`; `dotnet test` sem testes disponíveis |
| 2026-07-08 | Etapa 2 | Aprovado | Entidades principais do domínio criadas e validadas com testes unitários | Commit `feat: add core domain entities`; `dotnet test` com 9 testes aprovados |
| 2026-07-08 | Etapa 3 | Aprovado | Regras básicas de negócio do domínio implementadas e validadas com testes unitários | Commit `feat: add domain business rules`; `dotnet test` com 35 testes aprovados |
| 2026-07-08 | Etapa 4 | Aprovado | Persistência inicial com EF Core e SQLite configurada e validada com testes de persistência | Commit `feat: add initial persistence layer`; `dotnet test` com 40 testes aprovados |
| 2026-07-08 | Etapa 5 | Aprovado | Serviços de aplicação, DTOs, interfaces, repositórios e testes de fluxos criados | Commit `feat: add application services`; `dotnet test` com 54 testes aprovados |
| 2026-07-08 | Etapa 6 | Aprovado | Endpoints iniciais da API criados com Minimal APIs e validados com testes de integração | Commit `feat: add initial api endpoints`; `dotnet test` com 63 testes aprovados |
| 2026-07-08 | Etapa 7 | Aprovado | Cobertura de testes ampliada e CI inicial criado no GitHub Actions | Commit `test: expand coverage and add ci workflow`; `dotnet test` com 80 testes aprovados |
| 2026-07-08 | Etapa 8 | Aprovado | Estrutura printable/export ready criada para anotações A4, com endpoint JSON e testes | Commit `feat: prepare printable note export`; `dotnet test` com 87 testes aprovados |
| 2026-07-08 | Manutenção M1 | Aprovado | `.editorconfig` criado e formatação C# normalizada sem alteração funcional | Commit `style: normalize csharp formatting`; `dotnet test` com 87 testes aprovados |
| 2026-07-08 | Etapa 9 | Aprovado | Especificação técnica do editor A4, contrato HTML controlado e estratégia futura de PDF documentados | Commit `docs: define a4 editor and content contract`; `dotnet test` com 87 testes aprovados |

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
