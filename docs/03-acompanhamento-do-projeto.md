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
| 0 — Documentação e base do repositório | Criar documentação inicial do projeto e realizar primeiro commit/push | Pendente | Pendente | `docs/01-visao-geral-do-app.md`, `docs/02-planejamento-de-construcao.md`, `docs/03-acompanhamento-do-projeto.md` | Confirmar que existem apenas os três documentos iniciais dentro de `docs` e que não há código criado | Esta é a primeira etapa do projeto |
| 1 — Criação da solução backend em C# | Criar estrutura inicial da solução backend | Pendente | Pendente | A definir | Solução criada, organizada e compilando | Só iniciar após aprovação da Etapa 0 |
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
| P-001 | Criar pasta `docs` no repositório local | Alta | Pendente |
| P-002 | Adicionar os três documentos iniciais em `docs` | Alta | Pendente |
| P-003 | Pedir ao Codex para analisar, commitar e fazer push da documentação inicial | Alta | Pendente |
| P-004 | Validar o primeiro commit no GitHub | Alta | Pendente |
| P-005 | Definir versão do .NET usada no backend | Média | Pendente |
| P-006 | Confirmar nome técnico da solução/projetos C# | Média | Pendente |
| P-007 | Decidir formato de armazenamento do conteúdo da página: HTML sanitizado, JSON de editor ou outro formato | Alta | Pendente |
| P-008 | Definir estratégia futura de PDF A4 | Média | Pendente |

## Próxima Tarefa

### Tarefa atual

Criar a pasta `docs` na raiz do repositório e adicionar os três documentos iniciais:

```text
docs/01-visao-geral-do-app.md
docs/02-planejamento-de-construcao.md
docs/03-acompanhamento-do-projeto.md
```

### Próximo comando para o Codex

Depois que os arquivos estiverem no repositório local, solicitar ao Codex:

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

## Histórico de Validações

| Data | Etapa | Resultado | Resumo | Observações |
|---|---|---|---|---|
| 2026-07-08 | Etapa 0 | Pendente | Documentação inicial ainda não validada no repositório remoto | Aguardando criação da pasta `docs`, inclusão dos arquivos e primeiro commit/push |

## Checklist de validação da Etapa 0

Antes de aprovar a Etapa 0, confirmar:

- [ ] Existe uma pasta `docs` na raiz do repositório.
- [ ] Existe o arquivo `docs/01-visao-geral-do-app.md`.
- [ ] Existe o arquivo `docs/02-planejamento-de-construcao.md`.
- [ ] Existe o arquivo `docs/03-acompanhamento-do-projeto.md`.
- [ ] Não existem arquivos `.cs`.
- [ ] Não existe pasta `src`.
- [ ] Não existe pasta `tests`.
- [ ] Não existe solução `.sln`.
- [ ] O Codex fez commit com mensagem clara.
- [ ] O Codex fez push para o repositório remoto.
- [ ] O resumo do Codex corresponde ao que aparece no GitHub.

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
