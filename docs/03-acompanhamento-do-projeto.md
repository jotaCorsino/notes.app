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
- M2.3 — Correção forçada de quebras Markdown — Em validação

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

## Pendências atuais

- P-009 — Implementar sanitização real do HTML — Pendente.
- P-010 — Implementar exportação PDF A4 real — Pendente.
- P-011 — Planejar frontend/editor A4 — Pendente.
- P-012 — Escolher tecnologia do frontend — Pendente.
- P-013 — Escolher ou prototipar editor rich text — Pendente.

## Pendências resolvidas

- P-007 — Decidir formato do conteúdo da página — Concluído: HTML controlado.
- P-008 — Definir estratégia futura de PDF — Concluído: estratégia documentada no `docs/04-especificacao-editor-a4-e-pdf.md`.

## Próxima tarefa

Planejar o frontend/editor A4.

A próxima tarefa deve incluir:

- Escolha da tecnologia de frontend.
- Escolha ou prototipação do editor rich text.
- Renderização visual de página A4.
- Paginação visual no frontend.
- Geração de HTML controlado compatível com o contrato documentado.
- Integração futura com o backend já existente.

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
- Etapa 9 aprovada no conteúdo.
- M2 exigiu correção documental.
- M2.1 exigiu correção documental.
- M2.2 acertou o conteúdo, mas falhou na formatação Markdown real.
- M2.3 pendente de validação remota.

## Observações

- Este documento substitui o acompanhamento anterior por uma versão limpa e objetiva.
- Não há tabelas grandes neste arquivo.
- Cada título, lista e seção deve usar quebras de linha reais.
- O documento `docs/04-especificacao-editor-a4-e-pdf.md` permanece como fonte da especificação do editor A4 e da estratégia futura de PDF.
- Nenhuma funcionalidade nova foi criada nesta manutenção documental.
