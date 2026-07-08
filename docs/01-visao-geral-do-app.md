# 01 — Visão Geral do App

## Nome provisório

**Caderno App**

O nome provisório do projeto será **Caderno App**, porque o produto nasce com a proposta de funcionar como um caderno/fichário digital de estudos, organizado por matérias, módulos, anotações e páginas A4.

O repositório remoto do projeto é:

```text
https://github.com/jotaCorsino/notes.app.git
```

## Objetivo do app

O objetivo do Caderno App é permitir que estudantes criem, organizem, consultem e exportem anotações de estudo em um formato próximo a um caderno físico, mas com a praticidade de um sistema digital.

O app deve permitir que o usuário:

- Crie matérias.
- Organize cada matéria em módulos.
- Crie anotações dentro dos módulos.
- Escreva em páginas que simulam folhas A4 reais.
- Use recursos básicos de formatação de texto.
- Marque anotações como favoritas.
- Adicione tags para facilitar consulta futura.
- Exporte futuramente anotações ou cadernos em PDF A4 imprimível.

O produto deve ser simples de usar, visualmente limpo e focado em estudo.

## Público-alvo

O público-alvo inicial são estudantes que precisam organizar conteúdo de aulas, cursos, treinamentos e estudos autodidatas.

Exemplos de uso:

- Anotações de aulas da faculdade.
- Anotações de cursos técnicos.
- Organização de trilhas de estudo.
- Registro de resumos por matéria.
- Revisão de conteúdos por tags.
- Impressão de anotações em formato A4.

## Problema que o app resolve

Muitos estudantes fazem anotações em locais espalhados: arquivos soltos, blocos de notas, documentos avulsos, cadernos físicos, aplicativos genéricos ou mensagens pessoais.

O Caderno App resolve esse problema criando uma estrutura única e previsível:

```text
Matéria > Módulo > Anotação > Página A4
```

A proposta é evitar bagunça e facilitar a consulta posterior.

O app deve ajudar o usuário a responder rapidamente perguntas como:

- Onde estão minhas anotações de uma matéria?
- Quais aulas fazem parte de determinado módulo?
- Quais anotações marquei como importantes?
- Quais conteúdos têm determinada tag?
- Consigo imprimir esse conteúdo em A4?

## Conceito de fichário digital

O app deve ser pensado como um fichário de estudos digital.

A analogia principal é:

```text
Fichário físico       Caderno App
-----------------------------------------
Matéria              Matéria
Divisória            Módulo
Folha de anotação    Anotação
Página física        Página A4 digital
Etiqueta             Tag
Marcador importante  Favorito
```

Esse conceito ajuda a manter o app organizado sem transformar o produto em um editor complexo demais.

## Hierarquia principal

A estrutura principal do app será:

```text
Matéria
 └── Módulo
      └── Anotação
           └── Página A4
```

Exemplo:

```text
Redes de Computadores
 └── Fundamentos de Redes
      └── Aula 01 - Modelo OSI
           ├── Página 1
           ├── Página 2
           └── Página 3
```

Outro exemplo:

```text
Cisco Networking
 └── IPv4
      └── Sub-redes
           ├── Página 1
           └── Página 2
```

## Entidades conceituais

### Matéria

Representa uma área de estudo.

Exemplos:

- Redes de Computadores
- Banco de Dados
- Programação
- Sistemas Operacionais
- Cisco Networking

A matéria deve conter módulos.

### Módulo

Representa uma divisão interna da matéria.

Exemplos dentro de Redes de Computadores:

- Fundamentos de Redes
- Modelo OSI
- TCP/IP
- Endereçamento IPv4
- Roteamento
- Switching

O módulo deve conter anotações.

### Anotação

Representa uma aula, resumo, tópico ou registro de estudo.

Exemplos:

- Aula 01 - Introdução a Redes
- Resumo - Modelo OSI
- Exercícios - Sub-redes
- Revisão - DHCP e DNS

A anotação deve conter uma ou mais páginas A4.

### Página A4

Representa uma página individual da anotação.

Cada página deve possuir:

- Número/ordem.
- Conteúdo próprio.
- Configuração compatível com formato A4.
- Capacidade de ser exportada futuramente para PDF A4.

A página não deve ser tratada apenas como uma divisão visual. Ela precisa existir como parte importante do modelo do app, porque o objetivo é gerar PDF imprimível.

### Tag

Representa uma etiqueta de organização.

Exemplos:

- prova
- revisão
- importante
- exercício
- redes
- cisco
- dúvida
- laboratório

Uma anotação pode ter várias tags.

Uma tag pode estar associada a várias anotações.

### Favorito

Uma anotação poderá ser marcada como favorita para facilitar consulta.

No MVP, o favorito será aplicado principalmente à anotação. No futuro, o app poderá permitir favoritos também em matérias, módulos ou páginas específicas.

## Funcionalidades principais

### Organização

O app deve permitir:

- Criar matéria.
- Editar matéria.
- Excluir matéria.
- Listar matérias.
- Criar módulo dentro de uma matéria.
- Editar módulo.
- Excluir módulo.
- Listar módulos de uma matéria.
- Criar anotação dentro de um módulo.
- Editar anotação.
- Excluir anotação.
- Listar anotações de um módulo.
- Criar páginas dentro da anotação.
- Ordenar páginas da anotação.
- Consultar anotações por título, matéria, módulo, tags e favoritos.

### Editor de texto

O editor deve oferecer recursos básicos de escrita e formatação, sem tentar ser uma cópia completa de editores como Word ou Google Docs.

Recursos previstos:

- Seleção de fonte.
- Tamanho da fonte.
- Negrito.
- Itálico.
- Sublinhado.
- Alinhamento à esquerda.
- Alinhamento centralizado.
- Alinhamento à direita.
- Lista com marcadores.
- Lista numerada.
- Destaque/marca-texto.
- Títulos e subtítulos.
- Desfazer/refazer no frontend.
- Salvamento automático no fluxo final do produto.

### Página A4 real

O app deve trabalhar com a ideia de página A4 real.

Isso significa:

- A anotação não deve ser apenas um texto infinito.
- Cada página deve ter uma ordem.
- Quando uma página estiver cheia, uma nova página deve ser criada.
- O conteúdo deve ser salvo respeitando a divisão por páginas.
- A estrutura deve permitir exportação futura para PDF A4 imprimível.

A regra geral será:

```text
Uma anotação possui uma lista ordenada de páginas A4.
Cada página possui seu próprio conteúdo.
O PDF será gerado a partir das páginas, na ordem correta.
```

## Requisitos da página A4

A página A4 deve ser tratada como uma unidade lógica do sistema.

Requisitos:

- Cada página pertence a uma única anotação.
- Cada página possui uma posição numérica dentro da anotação.
- A ordem das páginas deve ser preservada.
- Não deve existir duas páginas com o mesmo número dentro da mesma anotação.
- O backend deve permitir criar, atualizar, remover e reordenar páginas.
- O frontend, futuramente, será responsável por detectar o limite visual da página durante a escrita.
- O backend deve armazenar a divisão em páginas e fornecer os dados para exportação futura.

## Observação técnica sobre paginação

A detecção exata de quando uma página ficou cheia depende da renderização visual do editor no frontend, porque altura de texto, fonte, espaçamento, listas e margens afetam o resultado.

Por isso, a decisão inicial será:

- O backend guarda a estrutura real das páginas.
- O frontend controla a experiência visual de escrita e criação automática de nova página.
- A exportação PDF deve usar o mesmo padrão visual da página A4 para reduzir diferenças entre editor e PDF.

Essa decisão evita que o backend tente calcular altura visual de texto sem um motor de renderização.

## Requisitos de PDF A4 imprimível

A exportação para PDF não precisa fazer parte da primeira entrega funcional, mas a arquitetura deve nascer preparada para isso.

Requisitos futuros:

- Exportar uma anotação como PDF A4.
- Exportar todas as anotações de um módulo como PDF A4.
- Exportar toda uma matéria como PDF A4.
- Preservar a ordem das páginas.
- Preservar formatação básica.
- Respeitar dimensões de página A4.
- Permitir impressão sem depender de ajustes manuais do usuário.

## Busca e consulta

A consulta de conteúdo é uma parte importante do produto.

Recursos previstos:

- Buscar anotação por título.
- Filtrar por matéria.
- Filtrar por módulo.
- Filtrar por tag.
- Filtrar favoritos.
- Ordenar por atualização recente.
- Ordenar por criação.
- Listar últimas anotações abertas futuramente.

No MVP backend, a busca pode começar simples. O importante é o modelo já permitir evoluir sem reescrever a base.

## Princípios de experiência do usuário

A interface futura deve seguir estes princípios:

- Limpa.
- Moderna.
- Intuitiva.
- Poucos cliques para escrever.
- Organização visual clara.
- Foco na anotação.
- Sem excesso de botões.
- Visual de página A4 centralizado.
- Menu lateral para navegação.
- Barra de ferramentas simples para edição.

O app deve ser agradável para uso diário em estudos.

## O que faz parte do MVP

O MVP deve incluir:

- Backend em C#.
- Estrutura de matérias.
- Estrutura de módulos.
- Estrutura de anotações.
- Estrutura de páginas A4.
- Tags.
- Favoritos.
- Persistência dos dados.
- Serviços básicos de criação, edição, exclusão e consulta.
- Preparação para integração com frontend.
- Preparação arquitetural para exportação PDF.

## O que não faz parte do MVP

Não faz parte do MVP inicial:

- Login de usuários.
- Sincronização em nuvem.
- Colaboração em tempo real.
- Aplicativo mobile.
- Escrita manual com caneta.
- OCR.
- IA dentro do editor.
- Compartilhamento público de cadernos.
- Marketplace de templates.
- Sistema avançado de permissões.
- Editor completo estilo Word.
- Exportação PDF finalizada na primeira etapa, embora a arquitetura já deva estar preparada para ela.

## Direção técnica inicial

O backend será desenvolvido em C#.

A arquitetura deve priorizar:

- Organização.
- Código limpo.
- Separação de responsabilidades.
- Testabilidade.
- Evolução gradual.
- Facilidade para o Codex implementar uma tarefa por vez.

A estrutura esperada para o backend será definida no documento de planejamento de construção.

## Definição curta do produto

O Caderno App é um aplicativo de anotações para estudos, organizado como um fichário digital. O usuário cria matérias, módulos e anotações, escreve em páginas A4 digitais, utiliza tags e favoritos para consulta rápida e, futuramente, poderá exportar seus cadernos em PDF A4 imprimível.
