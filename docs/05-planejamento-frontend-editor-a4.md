# 05 — Planejamento do Frontend e Editor A4

## 1. Objetivo do documento

Este documento planeja o frontend e o editor A4 do Caderno App.

Ele serve como guia técnico antes da criação do app frontend real, definindo tecnologia recomendada, estrutura visual, componentes principais, fluxo de integração com a API e estratégia inicial de paginação visual.

Esta etapa é apenas documental.

Nenhum frontend, pacote, projeto, build JavaScript ou código de interface é criado neste momento.

## 2. Papel do frontend no Caderno App

O frontend será responsável por entregar a experiência de uso do fichário digital.

As responsabilidades principais são:

- Apresentar uma interface moderna, limpa e focada em estudo.
- Permitir navegação por matérias, módulos e anotações.
- Renderizar visualmente páginas no formato A4.
- Oferecer uma experiência de escrita confortável.
- Exibir toolbar de formatação.
- Controlar paginação visual.
- Gerar HTML controlado para persistência.
- Integrar com a API do backend.

## 3. Tecnologia recomendada

A recomendação inicial para o frontend é:

- React.
- TypeScript.
- Vite.
- Tiptap como editor rich text.
- ProseMirror como base interna do Tiptap.
- CSS modularizado inicialmente.
- Tailwind CSS como possibilidade futura, sem decisão obrigatória nesta etapa.

Essa stack é adequada porque:

- React facilita a construção da interface por componentes.
- TypeScript reduz erros de contrato entre UI, estado local e API.
- Vite oferece criação e build rápidos para aplicações frontend modernas.
- Tiptap permite controlar extensões, comandos e saída HTML.
- ProseMirror fornece uma base sólida para edição rich text estruturada.
- CSS modularizado permite começar com escopo simples e previsível.
- Tailwind CSS pode ser avaliado depois, quando houver identidade visual mais clara.

Componentes como `Sidebar`, `EditorToolbar`, `A4Workspace`, `A4Page` e `RichTextEditor` se encaixam bem no modelo de componentes do React.

## 4. Alternativas consideradas

### Blazor

- Prós: mantém C# também no frontend e reduz troca de linguagem.
- Contras: menos flexível para integrar editores rich text JavaScript avançados e para controlar detalhes finos do DOM do editor.

### React

- Prós: ecossistema amplo, bom suporte a componentes, boa integração com editores rich text e flexibilidade visual.
- Contras: exige stack JavaScript/TypeScript separada do backend C#.

### Vue

- Prós: boa ergonomia, curva de aprendizado amigável e componentização clara.
- Contras: menor alinhamento com a recomendação inicial e menos comum em alguns ecossistemas de editores avançados.

### Editor nativo simples com contenteditable

- Prós: simples para protótipos pequenos.
- Contras: difícil controlar HTML, histórico, seleção, comandos de formatação e consistência entre navegadores.

### Tiptap

- Prós: extensível, baseado em ProseMirror, com bom controle de comandos, schema e HTML gerado.
- Contras: paginação visual A4 ainda exigirá lógica própria no frontend.

### Quill

- Prós: maduro e relativamente simples para edição rich text.
- Contras: modelo de conteúdo menos alinhado ao controle fino de schema e extensões desejado para o editor A4.

### Lexical

- Prós: moderno, performático e flexível.
- Contras: exigiria avaliação mais cuidadosa do ecossistema e da estratégia de serialização HTML para este projeto.

## 5. Decisão inicial

A primeira implementação do frontend deve ser planejada com:

- React.
- TypeScript.
- Vite.
- Tiptap.

O editor rich text recomendado é o Tiptap.

Esta decisão é uma decisão inicial de planejamento, não uma implementação.

A criação do frontend real será feita em etapa futura.

## 6. Estrutura visual esperada

A tela principal deve ser organizada como uma área de trabalho de estudos.

### Sidebar esquerda

A sidebar deve permitir navegação por:

- Matérias.
- Módulos.
- Anotações.

### Topbar

A topbar deve exibir:

- Nome da anotação.
- Status de salvamento.
- Ações principais.

### Toolbar

A toolbar deve oferecer controles básicos:

- Fonte.
- Tamanho.
- Negrito.
- Itálico.
- Sublinhado.
- Alinhamento.
- Lista com marcadores.
- Lista numerada.
- Marca-texto.

### Área central

A área central deve conter:

- Fundo cinza claro.
- Página A4 branca.
- Sombra leve.
- Paginação visual.

## 7. Componentes planejados

Componentes possíveis para a primeira arquitetura do frontend:

- `AppLayout`
- `Sidebar`
- `SubjectList`
- `ModuleList`
- `NoteList`
- `EditorTopbar`
- `EditorToolbar`
- `A4Workspace`
- `A4Page`
- `RichTextEditor`
- `PageNavigator`
- `TagSelector`
- `FavoriteButton`
- `SaveStatusIndicator`

Esses componentes devem separar navegação, edição, estado visual e integração com API.

## 8. Fluxo de uso

Fluxo esperado para o usuário:

- Usuário abre o app.
- Frontend lista matérias.
- Usuário escolhe uma matéria.
- Usuário escolhe um módulo.
- Usuário escolhe uma anotação.
- Editor carrega páginas da anotação.
- Usuário edita uma página.
- Frontend detecta overflow visual.
- Frontend cria nova página quando necessário.
- Frontend salva conteúdo por página no backend.
- Backend preserva `PageNumber`, `OrderIndex`, `Content` e `ContentFormat`.

## 9. Estratégia de página A4

A página visual deve respeitar a proporção A4.

Dimensão base:

```text
210mm x 297mm
```

Regras iniciais:

- Margens visuais serão definidas no frontend.
- Cada página do frontend corresponde a uma `NotePage` no backend.
- O frontend não deve enviar uma anotação como texto único.
- O frontend deve enviar conteúdo separado por página.
- A ordem visual deve ser compatível com `PageNumber` e `OrderIndex`.

## 10. Estratégia de paginação visual

O MVP pode começar com criação manual de nova página.

Depois, a experiência pode evoluir para detecção automática de overflow.

Estratégia inicial:

- Medir a altura útil da página no DOM.
- Detectar quando o conteúdo ultrapassa essa altura.
- Criar nova página visual quando houver overflow.
- Evitar refluxo automático complexo na primeira versão.
- Evitar imagens, tabelas complexas e conteúdo externo colado sem limpeza.

O refluxo automático de conteúdo entre páginas deve ficar para etapa futura.

## 11. Contrato de conteúdo

O contrato de conteúdo segue a especificação do documento `docs/04-especificacao-editor-a4-e-pdf.md`.

Regras principais:

- `ContentFormat` padrão: `html`.
- `Content` deve conter HTML controlado.
- O editor deve limitar tags e estilos.
- O editor não deve permitir `script`.
- O editor não deve permitir `iframe`.
- O editor não deve permitir eventos inline.
- O editor não deve permitir HTML perigoso.
- Sanitização real será implementada em etapa futura.

## 12. Integração com API

Endpoints já disponíveis para consumo pelo frontend:

- `GET /api/subjects`
- `POST /api/subjects`
- `GET /api/subjects/{id}`
- `POST /api/subjects/{subjectId}/modules`
- `GET /api/subjects/{subjectId}/modules`
- `POST /api/modules/{moduleId}/notes`
- `GET /api/modules/{moduleId}/notes`
- `GET /api/notes/{id}`
- `POST /api/notes/{noteId}/pages`
- `PUT /api/notes/{noteId}/pages/{pageId}/content`
- `POST /api/notes/{noteId}/tags`
- `DELETE /api/notes/{noteId}/tags/{tagName}`
- `PUT /api/notes/{noteId}/favorite`
- `DELETE /api/notes/{noteId}/favorite`
- `GET /api/notes/favorites`
- `GET /api/notes/search?query=texto`
- `GET /api/notes/{id}/printable`

O frontend deve consumir DTOs da API e não depender diretamente das entidades de domínio.

## 13. MVP visual do frontend

O primeiro MVP visual do frontend deve permitir:

- Listar matérias.
- Criar matéria.
- Listar módulos.
- Criar módulo.
- Listar anotações.
- Criar anotação.
- Abrir editor A4.
- Exibir uma página A4.
- Editar texto com formatação básica.
- Salvar conteúdo da página.
- Adicionar página manualmente.
- Marcar anotação como favorita.
- Adicionar tags simples.

## 14. O que não fazer no primeiro frontend

Não incluir no primeiro frontend:

- Login.
- Sincronização em nuvem.
- Colaboração em tempo real.
- PDF real.
- Escrita manual/caneta.
- OCR.
- Imagens.
- Tabelas complexas.
- Modo offline avançado.
- Paginação automática perfeita.

## 15. Riscos técnicos

Riscos a acompanhar:

- Diferença entre visual do editor e PDF futuro.
- Complexidade da quebra automática de página.
- HTML colado de fontes externas.
- Sanitização de conteúdo.
- Performance em anotações grandes.
- Compatibilidade de fontes.
- Dificuldade de mover conteúdo automaticamente entre páginas.

## 16. Próximas etapas recomendadas

Sugestão de sequência:

- Etapa 11: criar estrutura inicial do frontend.
- Etapa 12: criar layout visual base.
- Etapa 13: integrar listagem de matérias, módulos e anotações.
- Etapa 14: prototipar editor A4 com Tiptap.
- Etapa 15: salvar conteúdo de página via API.
