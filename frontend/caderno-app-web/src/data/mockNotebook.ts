import type { Notebook, NotebookNote } from '../types/notebook'

const placeholderPage: NotebookNote['page'] = {
  eyebrow: 'Resumo de aula',
  title: 'Conteúdo em construção',
  subtitle: 'Caderno de estudos',
  introduction: 'Esta anotação está pronta para receber um novo resumo de estudos.',
  highlight: 'Organize os conceitos principais e registre as dúvidas para revisar depois.',
  sectionTitle: 'Pontos principais',
  sectionBody: 'Use esta página para reunir definições, exemplos e conexões importantes.',
  layers: [],
  takeawayTitle: 'Para lembrar',
  takeawayBody: 'Revisar o conteúdo após a próxima aula.',
  nextStudy: 'Adicionar exercícios e referências.',
}

export const mockNotebook: Notebook = {
  ownerName: 'João Corsino',
  workspaceName: 'Meu fichário',
  selectedSubjectId: 'redes',
  selectedModuleId: 'modelo-osi',
  selectedNoteId: 'aula-02-modelo-osi',
  subjects: [
    {
      id: 'redes',
      title: 'Redes de Computadores',
      shortLabel: 'RC',
      color: 'sage',
      modules: [
        {
          id: 'fundamentos-redes',
          title: 'Fundamentos de Redes',
          notes: [
            {
              id: 'aula-01-introducao',
              title: 'Aula 01 — Introdução',
              tags: ['redes', 'fundamentos'],
              isFavorite: false,
              saveStatus: 'Salvo ontem',
              page: placeholderPage,
            },
          ],
        },
        {
          id: 'modelo-osi',
          title: 'Modelo OSI',
          notes: [
            {
              id: 'aula-02-modelo-osi',
              title: 'Aula 02 — Modelo OSI',
              tags: ['redes', 'osi', 'estudo'],
              isFavorite: true,
              saveStatus: 'Salvo agora',
              page: {
                eyebrow: 'Redes de Computadores',
                title: 'Modelo OSI',
                subtitle: 'Aula 02 · Fundamentos de Redes',
                introduction:
                  'O modelo OSI é uma referência que organiza a comunicação em rede em sete camadas. Cada uma possui responsabilidades próprias e oferece serviços para a camada seguinte.',
                highlight:
                  'Pense nas camadas como etapas de uma conversa: cada nível prepara os dados para que a mensagem chegue ao destino de forma compreensível.',
                sectionTitle: 'Como as camadas trabalham',
                sectionBody:
                  'Na origem, os dados percorrem as camadas de cima para baixo. No destino, o processo é invertido até que a aplicação receba a informação.',
                layers: [
                  { number: 7, name: 'Aplicação', description: 'Serviços de rede usados pelas aplicações.' },
                  { number: 6, name: 'Apresentação', description: 'Formatação, compressão e criptografia.' },
                  { number: 5, name: 'Sessão', description: 'Abertura e controle das conversas.' },
                  { number: 4, name: 'Transporte', description: 'Entrega, segmentação e confiabilidade.' },
                  { number: 3, name: 'Rede', description: 'Endereçamento lógico e roteamento.' },
                  { number: 2, name: 'Enlace', description: 'Quadros e acesso ao meio físico.' },
                  { number: 1, name: 'Física', description: 'Sinais, cabos e transmissão de bits.' },
                ],
                takeawayTitle: 'Para lembrar',
                takeawayBody:
                  'O modelo OSI é conceitual: ele ajuda a localizar falhas e entender protocolos, mesmo quando a implementação real segue o modelo TCP/IP.',
                nextStudy: 'Próximo estudo: comparar as camadas OSI e TCP/IP.',
              },
            },
          ],
        },
        {
          id: 'enderecamento-ip',
          title: 'Endereçamento IP',
          notes: [
            {
              id: 'aula-03-ipv4',
              title: 'Aula 03 — IPv4',
              tags: ['redes', 'ipv4'],
              isFavorite: false,
              saveStatus: 'Salvo há 2 dias',
              page: placeholderPage,
            },
          ],
        },
      ],
    },
    {
      id: 'programacao',
      title: 'Programação',
      shortLabel: 'PR',
      color: 'coral',
      modules: [
        {
          id: 'typescript',
          title: 'TypeScript',
          notes: [
            {
              id: 'tipos-e-interfaces',
              title: 'Tipos e interfaces',
              tags: ['typescript'],
              isFavorite: true,
              saveStatus: 'Salvo na terça',
              page: placeholderPage,
            },
          ],
        },
      ],
    },
    {
      id: 'banco-dados',
      title: 'Banco de Dados',
      shortLabel: 'BD',
      color: 'blue',
      modules: [
        {
          id: 'modelo-relacional',
          title: 'Modelo Relacional',
          notes: [
            {
              id: 'normalizacao',
              title: 'Normalização',
              tags: ['sql', 'modelagem'],
              isFavorite: false,
              saveStatus: 'Salvo na segunda',
              page: placeholderPage,
            },
          ],
        },
      ],
    },
  ],
}
