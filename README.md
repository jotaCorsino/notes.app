# Caderno App

O Caderno App é um aplicativo de anotações para estudos organizado como um fichário digital: Matéria > Módulo > Anotação > Página A4.

O MVP permite criar essa estrutura, escrever em um editor rich text, salvar páginas no backend, sincronizar rascunhos locais, adicionar tags e favoritar anotações.

## Pré-requisitos

- .NET SDK 10 (`net10.0`).
- Node.js 24.x.
- npm 11.x.

As versões de Node.js e npm acima correspondem ao ambiente usado na validação atual do projeto.

## Executar o backend

Na raiz do repositório:

```powershell
dotnet restore
dotnet run --project src/CadernoApp.Api --launch-profile http
```

O backend deve ficar disponível em:

```text
http://localhost:5037
```

Em ambiente de desenvolvimento, a API cria e utiliza um banco SQLite local.

## Executar o frontend

Em outro terminal:

```powershell
cd frontend/caderno-app-web
npm ci
npm run dev -- --host 127.0.0.1
```

Abra a URL exibida pelo Vite, normalmente:

```text
http://127.0.0.1:5173
```

O proxy de desenvolvimento encaminha as chamadas de `/api` para `http://localhost:5037`.

## Fluxo de teste do MVP

1. Crie uma matéria.
2. Crie um módulo dentro da matéria.
3. Crie uma anotação dentro do módulo.
4. Crie uma página.
5. Escreva no editor A4.
6. Salve a página.
7. Adicione uma tag.
8. Favorite a anotação.

Com o backend desligado, o frontend permanece disponível em modo demonstração. A criação e o salvamento de dados reais exigem a API em execução.

## Limitações atuais

- Sem login ou autenticação.
- Sem exportação PDF.
- Sem autosave no backend.
- Sem edição ou exclusão de matéria, módulo e anotação.
- SQLite local voltado ao ambiente de desenvolvimento.
