# 04 — Especificação do Editor A4 e Exportação PDF

## 1. Objetivo do Documento

Este documento define a especificação técnica inicial do editor A4 do Caderno App.

Ele orienta as decisões de frontend, backend e futura exportação para PDF.

O objetivo é garantir que as anotações sejam estruturadas como páginas reais e possam evoluir para impressão A4 sem retrabalho conceitual.

Esta especificação não implementa frontend, não define uma biblioteca final de editor rich text e não implementa geração real de PDF.

## 2. Conceito do Editor A4

Cada anotação possui uma ou mais páginas A4.

Cada página é representada no domínio por uma `NotePage` e possui dimensões próprias:

```text
WidthMm = 210
HeightMm = 297
```

O usuário deve escrever dentro de uma área visual que simula uma folha de papel A4. O conteúdo não deve ser tratado como um texto infinito, mas como blocos salvos por página.

Quando o conteúdo ultrapassar a área útil da página atual, o editor deve criar uma nova página visualmente. Cada página será enviada ao backend separadamente, preservando ordem, conteúdo e formato.

## 3. Responsabilidade do Frontend

O frontend/editor será responsável por:

- Renderizar a página A4 visualmente.
- Controlar a experiência de escrita.
- Detectar quando o conteúdo ultrapassa a altura útil da página.
- Criar uma nova página visualmente quando necessário.
- Enviar o conteúdo de cada página para o backend.
- Manter a ordem das páginas.
- Evitar salvar conteúdo inválido ou fora do subconjunto permitido.
- Permitir formatações básicas: fonte, tamanho, negrito, itálico, sublinhado, alinhamento, listas e marca-texto.

O frontend também deve limpar ou rejeitar conteúdo colado de fontes externas quando esse conteúdo não obedecer ao contrato definido neste documento.

## 4. Responsabilidade do Backend

### Responsabilidades Assumidas

O backend será responsável por:

- Persistir matérias, módulos, anotações, páginas, tags e favoritos.
- Salvar o conteúdo de cada `NotePage`.
- Preservar `PageNumber`, `OrderIndex`, `WidthMm`, `HeightMm`, `Content` e `ContentFormat`.
- Retornar anotações em formato imprimível pelo endpoint existente `GET /api/notes/{id}/printable`.
- Validar dados obrigatórios.

### Fora do Escopo do Backend no MVP

No MVP, o backend não será responsável por:

- Calcular visualmente quebra de página.
- Renderizar o editor.
- Interpretar layout complexo.
- Quebrar HTML automaticamente em múltiplas páginas.
- Gerar PDF real.

## 5. Contrato de Conteúdo

### Estratégia Inicial

A estratégia inicial de conteúdo será:

```text
ContentFormat = html
```

O campo `Content` deve armazenar HTML controlado produzido pelo editor.

Esse HTML deve ser simples, previsível e seguro para futura renderização. O conteúdo salvo não deve depender de scripts, eventos inline ou estilos arbitrários difíceis de reproduzir na exportação PDF.

### Conteúdo Não Permitido

O contrato inicial não deve aceitar:

- `script`.
- `iframe`.
- Estilos arbitrários perigosos.
- Eventos inline como `onclick`, `onload`, `onerror` e equivalentes.
- HTML colado de Word, Google Docs ou páginas externas sem limpeza prévia.

## 6. Subconjunto HTML Permitido

### Tags Permitidas

Proposta inicial de tags permitidas:

- `p`
- `br`
- `strong`
- `b`
- `em`
- `i`
- `u`
- `mark`
- `h1`
- `h2`
- `h3`
- `ul`
- `ol`
- `li`
- `blockquote`
- `span` com estilos limitados
- `div` apenas quando necessário

### Estilos Permitidos

Estilos permitidos inicialmente:

- `font-family`
- `font-size`
- `font-weight`
- `text-align`
- `background-color` para marca-texto
- `color`, se for decidido permitir cor no futuro

Qualquer expansão desse subconjunto deve considerar segurança, compatibilidade com o editor e fidelidade de exportação PDF.

## 7. Modelo de Página A4

O modelo base de página é:

```text
WidthMm = 210
HeightMm = 297
```

As margens internas serão responsabilidade inicial do frontend/editor. O backend preserva as dimensões da página e retorna esses valores nas estruturas de leitura e exportação.

A futura exportação PDF deve respeitar as dimensões salvas em cada `PrintableNotePageDto`, criando páginas compatíveis com A4.

## 8. Paginação

A paginação visual será feita pelo frontend.

O backend recebe páginas já separadas, com `PageNumber` e `OrderIndex` definidos ou preservados conforme as regras atuais do domínio.

Nesta fase, o backend não deve tentar quebrar HTML em múltiplas páginas. Essa decisão reduz complexidade e evita inconsistência entre a forma como o usuário vê o conteúdo no editor e a forma como o PDF será gerado no futuro.

Futuramente, pode existir uma camada mais avançada de validação ou um motor de paginação, mas isso deve ser decidido em etapa própria.

## 9. Exportação PDF Futura

### Estrutura Base

O endpoint atual:

```text
GET /api/notes/{id}/printable
```

já retorna a estrutura base para exportação futura.

A geração real de PDF deve usar `PrintableNoteDto` como entrada. Cada `PrintableNotePageDto` deve virar uma página A4 no PDF.

### Diretrizes de Renderização

O conteúdo HTML de cada página deve ser renderizado dentro da área útil da página, respeitando:

- Ordem das páginas.
- Dimensões A4.
- Conteúdo salvo.
- `ContentFormat`.
- Subconjunto HTML permitido.

A geração real de PDF não será implementada nesta etapa. A biblioteca ou abordagem de PDF será escolhida futuramente.

## 10. Riscos Técnicos

Riscos conhecidos:

- Diferença entre renderização no editor e renderização no PDF.
- HTML colado de fontes externas com marcação excessiva ou insegura.
- Paginação automática complexa.
- Conteúdo que ultrapassa a área útil da página.
- Fontes indisponíveis no ambiente de exportação.
- Segurança ao aceitar HTML.
- Performance com anotações muito grandes.
- Divergência entre unidades visuais do navegador e medidas físicas do PDF.

Esses riscos devem ser revisitados antes da implementação real do editor visual e da geração de PDF.

## 11. Decisões Desta Etapa

Decisões registradas:

- O conteúdo será salvo por página.
- O formato inicial será HTML controlado.
- O frontend será responsável pela paginação visual.
- O backend não fará quebra automática de página no MVP.
- O backend já fornece estrutura imprimível, mas não PDF real.
- A geração real de PDF será etapa futura.
- O contrato de conteúdo deve evitar scripts, iframes, eventos inline e estilos arbitrários perigosos.

## 12. Próximas Etapas Recomendadas

Próximas etapas recomendadas:

- Definir a estratégia de frontend/editor.
- Escolher a biblioteca ou abordagem de editor rich text.
- Criar um protótipo visual da página A4.
- Validar o subconjunto HTML permitido com o editor escolhido.
- Definir estratégia de sanitização do HTML.
- Depois, implementar a exportação PDF real em etapa própria.
