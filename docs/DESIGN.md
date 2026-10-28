# Design system

Direção editorial: títulos grandes, espaço em branco, fotos reais e pequenos elementos gráficos que conectam a formação ao trabalho prático. Sem porcentagens fictícias de domínio técnico.

## Paleta

| Papel            | Claro     | Escuro    |
| ---------------- | --------- | --------- |
| Azul principal   | `#234bce` | `#acc1ff` |
| Verde            | `#35513c` | `#c4dfa9` |
| Lima de destaque | `#d6ec88` | `#d6ec88` |
| Fundo neutro     | `#f7f8f3` | `#111a19` |
| Texto            | `#172221` | `#f3f6ef` |
| Texto secundário | `#53625e` | `#b4c2b9` |

As cores auxiliares das capas são variações do verde. Tokens semânticos são definidos em `:root`, com substituições em `[data-theme=dark]`.

## Tipografia e geometria

- Títulos: Manrope variável, peso 600–800, espaçamento ligeiramente fechado.
- Corpo: DM Sans variável, entrelinha 1,65.
- Escala de espaçamento: 8, 16, 24, 32, 48, 80 e 112 px em `--space-1` a `--space-7`.
- Raios: 8, 18 e 28 px em `--radius-sm`, `--radius` e `--radius-lg`.
- Sombra: `--shadow`; transições de controles: `--duration` (220 ms).
- Conteúdo com largura máxima de 1304 px e margens fluidas.

## Comportamento

Navegação fixa com seção ativa; menu móvel com Escape; filtros combinados por categoria, texto e trimestre; detalhes em páginas indexáveis; carregamento de vídeos por ação; troca manual de tema persistida e preferência inicial do sistema.

Cards sobem suavemente no hover. Entradas ao rolar usam IntersectionObserver. Transições entre páginas são progressivas via CSS. Em movimento reduzido, animações, transições e rolagem suave são removidas. Conteúdo é visível por padrão, inclusive sem JavaScript.

## Responsividade

Base móvel com uma coluna. Em 640 px entram grids de duas colunas; em 1100 px aparecem navegação completa e três colunas de projetos. Testes nos tamanhos solicitados: 360, 768, 1280 e 1920 px. Consulte `VALIDACAO.md` para resultados medidos.

## Atualização das fotos e do perfil

Foto nova em WebP no Início, carregada prioritariamente; foto anterior preservada no Sobre com lazy loading. Ambas mantêm proporção com object-fit, sem esticar a imagem. Ícones de GitHub, LinkedIn e Instagram no rodapé têm nome acessível, foco visível e abertura em nova aba. A seção de contato foi removida. Formação e habilidades usam o PDF oficial e os projetos existentes como fontes.
