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
- Etapa 11 — Estrutura inicial do frontend — Aprovado — Commit a preencher após este commit

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
- ProseMirror reconhecido como base interna do Tiptap.
- CSS modularizado recomendado inicialmente.
- Tailwind CSS mantido como possibilidade futura, sem decisão obrigatória nesta etapa.
- Estrutura inicial do frontend criada em `frontend/caderno-app-web`.
- Frontend inicial criado com React, TypeScript e Vite.
- Tiptap ainda não foi instalado.
- Nenhuma integração com API foi feita no frontend.
- Nenhum editor A4 foi implementado no frontend.

## Pendências atuais

- P-009 — Implementar sanitização real do HTML — Pendente.
- P-010 — Implementar exportação PDF A4 real — Pendente.
- P-015 — Criar layout visual base do frontend — Pendente.
- P-016 — Prototipar editor A4 visual — Pendente.
- P-017 — Integrar frontend com API — Pendente.

## Pendências resolvidas

- P-007 — Decidir formato do conteúdo da página — Concluído: HTML controlado.
- P-008 — Definir estratégia futura de PDF — Concluído: estratégia documentada no `docs/04-especificacao-editor-a4-e-pdf.md`.
- P-011 — Planejar frontend/editor A4 — Concluído: planejamento criado no `docs/05-planejamento-frontend-editor-a4.md`.
- P-012 — Escolher tecnologia do frontend — Concluído inicialmente: React, TypeScript e Vite.
- P-013 — Escolher ou prototipar editor rich text — Concluído inicialmente: Tiptap recomendado.
- P-014 — Criar estrutura inicial do frontend — Concluído: pasta `frontend/caderno-app-web` criada com Vite.

## Próxima tarefa

Criar layout visual base do frontend.

A próxima tarefa deve incluir:

- Criar base visual do layout principal.
- Preparar área para sidebar, topbar e espaço central.
- Manter sem editor A4 completo.
- Manter sem integração com API.
- Manter sem Tiptap até a etapa de protótipo do editor.

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
- M2.3 ainda falhou no raw remoto.
- M2.4 aprovada.
- Etapa 10 aprovada: planejamento do frontend/editor A4 documentado.
- Etapa 11 aprovada: estrutura inicial do frontend criada com React, TypeScript e Vite.

## Observações

- Este documento substitui o acompanhamento anterior por uma versão limpa e objetiva.
- Não há tabelas grandes neste arquivo.
- Cada título, lista e seção deve usar quebras de linha reais LF.
- O documento `docs/04-especificacao-editor-a4-e-pdf.md` permanece como fonte da especificação do editor A4 e da estratégia futura de PDF.
- O documento `docs/05-planejamento-frontend-editor-a4.md` registra o planejamento do frontend/editor A4.
- A Etapa 11 criou apenas a estrutura inicial do frontend.
- Nenhum Tiptap, Tailwind, rota, chamada HTTP, editor A4, PDF ou autenticação foi implementado.
