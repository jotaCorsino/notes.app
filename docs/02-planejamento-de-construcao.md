# 02 — Planejamento de Construção

## Objetivo deste documento

Este documento define como o Caderno App será construído em etapas pequenas, controladas e validadas.

O objetivo é evitar que o projeto cresça de forma desorganizada. Cada etapa deve ter um propósito claro, arquivos esperados, critérios de aceite e validação antes de seguir para a próxima tarefa.

## Estratégia geral

O projeto será conduzido com a seguinte divisão de responsabilidades:

```text
ChatGPT
- Define visão do produto.
- Cria e mantém a documentação.
- Planeja as etapas.
- Escreve comandos para o Codex.
- Analisa o resumo gerado pelo Codex.
- Compara o que foi feito com o planejamento.
- Ajuda a decidir se a etapa foi aprovada ou precisa de ajuste.

Codex
- Atua como engenheiro de software.
- Analisa o repositório.
- Implementa tarefas pequenas.
- Mantém o repositório limpo.
- Realiza commits.
- Realiza push para o repositório remoto.
- Entrega resumo técnico do que foi feito.

Usuário
- Executa ou autoriza as ações necessárias.
- Valida visualmente o GitHub/diff.
- Informa o resumo do Codex para conferência.
- Aprova ou reprova cada etapa.
```

## Fluxo de trabalho

O fluxo padrão será:

```text
1. ChatGPT cria ou atualiza o planejamento.
2. ChatGPT gera um comando objetivo para o Codex.
3. Codex analisa o estado atual do repositório.
4. Codex executa somente a tarefa solicitada.
5. Codex faz commit com mensagem clara.
6. Codex faz push para o repositório remoto.
7. Codex entrega um resumo do que foi alterado.
8. ChatGPT consulta/analisa o repositório remoto.
9. ChatGPT compara o resumo do Codex com o planejamento.
10. Usuário aprova ou pede correção.
11. Somente após aprovação a próxima tarefa é criada.
```

## Regra principal

O projeto deve ser construído com **um comando por vez**.

Cada comando deve:

- Ter escopo pequeno.
- Dizer exatamente o que deve ser feito.
- Dizer o que não deve ser feito.
- Ter critérios de aceite.
- Evitar alterações fora do escopo.
- Gerar um commit claro.
- Manter o repositório remoto atualizado.

## Repositório remoto

Repositório base:

```text
https://github.com/jotaCorsino/notes.app.git
```

O repositório remoto será a fonte de validação do projeto.

Sempre que uma etapa for concluída, o estado do repositório deve refletir exatamente o que foi aprovado.

## Estratégia de arquitetura

O backend será construído em C#.

A arquitetura deverá seguir uma separação simples, inspirada em Clean Architecture, mas sem complexidade desnecessária.

Estrutura conceitual prevista:

```text
src/
 ├── NotesApp.Api/
 ├── NotesApp.Domain/
 ├── NotesApp.Application/
 └── NotesApp.Infrastructure/

tests/
 └── NotesApp.Tests/

docs/
 ├── 01-visao-geral-do-app.md
 ├── 02-planejamento-de-construcao.md
 └── 03-acompanhamento-do-projeto.md
```

Essa estrutura pode ser ajustada se houver justificativa técnica, mas qualquer mudança precisa ser documentada.

## Camadas previstas

### Domain

Responsável pelas entidades e regras centrais do negócio.

Exemplos:

- Subject
- Module
- Note
- Page
- Tag

### Application

Responsável pelos casos de uso.

Exemplos:

- Criar matéria.
- Criar módulo.
- Criar anotação.
- Criar página.
- Atualizar conteúdo de página.
- Adicionar tag à anotação.
- Marcar anotação como favorita.
- Consultar anotações.

### Infrastructure

Responsável por banco de dados e integrações técnicas.

Exemplos:

- DbContext.
- Repositórios.
- Migrations.
- Configurações de persistência.

### Api

Responsável pela entrada HTTP da aplicação.

Exemplos:

- Endpoints de matérias.
- Endpoints de módulos.
- Endpoints de anotações.
- Endpoints de páginas.
- Endpoints de tags.
- Endpoints de favoritos.

## Decisões iniciais

### Backend

O backend será escrito em C#.

### Persistência

A persistência inicial deve ser simples, local e fácil de configurar.

A escolha recomendada para o MVP é SQLite com Entity Framework Core, salvo se houver motivo técnico para alterar.

### Fonte de verdade das páginas

A anotação deve ser salva como uma lista ordenada de páginas.

A página é parte real do modelo, não apenas um efeito visual.

### Conteúdo da página

O conteúdo da página deve ser armazenado de forma compatível com formatação básica de texto.

A decisão final entre HTML sanitizado, JSON de editor ou outro formato será tomada antes da implementação da persistência do conteúdo. Até essa decisão, o backend pode modelar o campo como conteúdo serializado.

### PDF

A exportação PDF não será implementada no início, mas a estrutura de páginas deve estar preparada para isso.

## Etapas de construção

## Etapa 0 — Documentação e base do repositório

### Objetivo

Criar a documentação inicial do projeto e preparar o primeiro commit do repositório.

### Escopo

- Criar pasta `docs`.
- Adicionar os três documentos iniciais.
- Fazer o primeiro commit.
- Fazer push para o repositório remoto.

### Arquivos esperados

```text
docs/01-visao-geral-do-app.md
docs/02-planejamento-de-construcao.md
docs/03-acompanhamento-do-projeto.md
```

### Não fazer nesta etapa

- Não criar solução C#.
- Não criar projetos backend.
- Não criar entidades.
- Não criar banco de dados.
- Não criar API.
- Não criar testes.

### Critério de aceite

A etapa será aprovada se:

- A pasta `docs` existir.
- Os três arquivos `.md` existirem.
- Nenhum arquivo de código tiver sido criado.
- O commit estiver no repositório remoto.
- O resumo do Codex for compatível com o diff do GitHub.

## Etapa 1 — Criação da solução backend em C#

### Objetivo

Criar a estrutura inicial da solução backend em C#.

### Escopo previsto

- Criar a solução `.sln`.
- Criar projetos principais.
- Organizar pastas `src` e `tests`.
- Adicionar referências entre projetos.
- Garantir que a solução compile.

### Estrutura prevista

```text
src/
 ├── NotesApp.Api/
 ├── NotesApp.Domain/
 ├── NotesApp.Application/
 └── NotesApp.Infrastructure/

tests/
 └── NotesApp.Tests/
```

### Não fazer nesta etapa

- Não criar entidades completas.
- Não criar banco de dados.
- Não criar controllers/endpoints definitivos.
- Não implementar regras de negócio.

### Critério de aceite

- A solução deve compilar.
- A estrutura deve estar organizada.
- Os projetos devem ter nomes consistentes.
- O commit deve conter apenas estrutura inicial.
- O documento de acompanhamento deve ser atualizado.

## Etapa 2 — Entidades de domínio

### Objetivo

Criar as entidades principais do domínio.

### Entidades previstas

- Subject
- Module
- Note
- Page
- Tag

### Relacionamentos previstos

```text
Subject 1:N Module
Module 1:N Note
Note 1:N Page
Note N:N Tag
Note possui favorito
```

### Regras iniciais

- Matéria deve ter nome.
- Módulo deve pertencer a uma matéria.
- Anotação deve pertencer a um módulo.
- Página deve pertencer a uma anotação.
- Página deve ter número/ordem.
- Tag deve ter nome único.
- Uma anotação pode ser favorita.

### Não fazer nesta etapa

- Não implementar banco de dados.
- Não criar API.
- Não criar frontend.
- Não implementar exportação PDF.

### Critério de aceite

- Entidades criadas no projeto Domain.
- Propriedades principais definidas.
- Construtores ou métodos respeitando regras básicas.
- Solução compilando.
- Acompanhamento atualizado.

## Etapa 3 — Regras de negócio

### Objetivo

Implementar regras básicas do domínio.

### Regras previstas

- Não permitir matéria sem nome.
- Não permitir módulo sem nome.
- Não permitir anotação sem título.
- Não permitir página sem anotação.
- Não permitir páginas duplicadas na mesma anotação.
- Permitir reordenação de páginas.
- Permitir favoritar/desfavoritar anotação.
- Permitir adicionar/remover tags.
- Evitar tags duplicadas na mesma anotação.

### Critério de aceite

- Regras implementadas no domínio ou aplicação.
- Testes básicos criados quando fizer sentido.
- Solução compilando.
- Acompanhamento atualizado.

## Etapa 4 — Persistência

### Objetivo

Adicionar persistência dos dados.

### Escopo previsto

- Configurar Entity Framework Core.
- Configurar SQLite.
- Criar DbContext.
- Mapear entidades.
- Criar migrations.
- Criar repositórios ou abstrações de persistência, se necessário.

### Critério de aceite

- Banco configurado.
- Entidades mapeadas.
- Migrations geradas.
- Operações básicas possíveis.
- Solução compilando.
- Acompanhamento atualizado.

## Etapa 5 — Serviços de aplicação

### Objetivo

Criar os casos de uso principais.

### Serviços previstos

- SubjectService
- ModuleService
- NoteService
- PageService
- TagService

### Casos de uso previstos

- Criar matéria.
- Editar matéria.
- Excluir matéria.
- Criar módulo.
- Editar módulo.
- Excluir módulo.
- Criar anotação.
- Editar anotação.
- Excluir anotação.
- Criar página.
- Atualizar página.
- Reordenar páginas.
- Criar tag.
- Associar tag à anotação.
- Remover tag da anotação.
- Marcar/desmarcar favorito.
- Consultar anotações por filtro.

### Critério de aceite

- Serviços criados na camada Application.
- Código sem dependência direta desnecessária da API.
- Solução compilando.
- Acompanhamento atualizado.

## Etapa 6 — Camada de entrada/API

### Objetivo

Expor os casos de uso por meio de endpoints.

### Endpoints previstos

- Subjects
- Modules
- Notes
- Pages
- Tags

### Exemplos de rotas

```text
GET    /api/subjects
POST   /api/subjects
PUT    /api/subjects/{id}
DELETE /api/subjects/{id}

GET    /api/subjects/{subjectId}/modules
POST   /api/subjects/{subjectId}/modules

GET    /api/modules/{moduleId}/notes
POST   /api/modules/{moduleId}/notes

GET    /api/notes/{noteId}
PUT    /api/notes/{noteId}
POST   /api/notes/{noteId}/pages
PUT    /api/pages/{pageId}
POST   /api/notes/{noteId}/tags
POST   /api/notes/{noteId}/favorite
DELETE /api/notes/{noteId}/favorite
```

### Critério de aceite

- Endpoints criados.
- DTOs básicos criados.
- Fluxo principal testável por HTTP.
- Solução compilando.
- Acompanhamento atualizado.

## Etapa 7 — Testes

### Objetivo

Garantir confiança mínima no backend.

### Testes previstos

- Criar matéria.
- Criar módulo vinculado à matéria.
- Criar anotação vinculada ao módulo.
- Criar páginas ordenadas.
- Impedir página duplicada.
- Reordenar páginas.
- Marcar anotação como favorita.
- Associar tags.
- Consultar anotações por tag/favorito.

### Critério de aceite

- Testes relevantes implementados.
- Testes executando com sucesso.
- Solução compilando.
- Acompanhamento atualizado.

## Etapa 8 — Preparação para exportação PDF

### Objetivo

Preparar a estrutura backend para exportação futura de PDF A4.

### Escopo previsto

- Criar modelos/DTOs para exportação.
- Criar serviço conceitual de exportação.
- Definir contrato de saída das páginas.
- Garantir que uma anotação possa ser consultada com páginas ordenadas.
- Documentar decisão sobre motor de PDF futuro.

### Não fazer nesta etapa

- Não precisa gerar PDF final se isso ainda não for prioridade.
- Não precisa escolher ferramenta definitiva sem validação.

### Critério de aceite

- Estrutura pronta para gerar PDF no futuro.
- Páginas retornadas em ordem correta.
- Acompanhamento atualizado.

## Etapa 9 — Integração futura com frontend

### Objetivo

Preparar o backend para ser consumido por uma interface moderna.

### Pontos previstos

- Contratos de API consistentes.
- DTOs claros.
- Respostas previsíveis.
- Endpoints adequados para editor paginado.
- Busca e filtros funcionais.
- Suporte para salvamento frequente de páginas.

### Critério de aceite

- Backend pronto para integração inicial.
- Endpoints documentados.
- Acompanhamento atualizado.

## Controle de escopo

Qualquer nova ideia deve ser classificada como:

```text
MVP
Pós-MVP
Futuro distante
Fora de escopo
```

Isso evita que o projeto fique complexo demais antes de ter uma base funcional.

## Critérios gerais de qualidade

Cada etapa deve respeitar:

- Código simples.
- Nomes claros.
- Baixo acoplamento.
- Sem overengineering.
- Sem criar arquivos desnecessários.
- Sem implementar funcionalidades fora do pedido.
- Atualização do documento de acompanhamento.
- Commit claro.
- Push para o repositório remoto.

## Padrão de mensagem de commit

Sugestão de padrão:

```text
docs: add initial project documentation
chore: create backend solution structure
feat: add core domain entities
feat: add page ordering rules
feat: configure persistence
test: add domain tests
```

## Validação antes da próxima etapa

Antes de criar o próximo comando para o Codex, deve ser verificado:

- O que foi planejado.
- O que o Codex informou que fez.
- O que realmente aparece no repositório.
- Se houve arquivos fora do escopo.
- Se o documento de acompanhamento foi atualizado.
- Se a solução compila, quando houver código.
- Se há necessidade de correção antes de avançar.

## Primeiro comando previsto para o Codex

Depois que os três documentos iniciais forem colocados na pasta `docs`, o primeiro comando para o Codex será:

```text
Analise o estado atual do repositório notes.app.

O projeto é o Caderno App, um app de anotações para estudos. Neste momento, a única tarefa é validar a documentação inicial, garantir que a pasta docs contém os três documentos esperados, realizar o primeiro commit e fazer push para o repositório remoto.

Regras:
- Não crie código ainda.
- Não crie solução C# ainda.
- Não crie projetos, entidades, banco de dados, API ou testes.
- Não altere o conteúdo dos documentos, exceto se encontrar erro evidente de formatação Markdown.
- Mantenha o repositório limpo.
- Faça commit apenas dos arquivos existentes em docs.
- Use uma mensagem de commit clara, como: docs: add initial project documentation
- Faça push para o repositório remoto.
- Ao final, entregue um resumo objetivo com:
  1. Arquivos encontrados.
  2. Arquivos alterados.
  3. Mensagem do commit.
  4. Branch utilizada.
  5. Confirmação do push.
  6. Observações, se houver.
```
