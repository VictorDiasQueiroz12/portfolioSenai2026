# Victor Dias Queiroz · Portfólio

Portfólio de um estudante de Desenvolvimento de Sistemas do SESI SENAI, em Florianópolis. Reúne projetos técnicos, experiências interdisciplinares e trajetória escolar em uma interface responsiva, acessível e estática.

**29 registros preservados, 26 trabalhos distintos e 26 imagens originais.** Os relatos do Grand Prix e do Gateway continuam separados por disciplina. Consulte o [inventário completo](docs/INVENTARIO.md) e o [checklist de preservação](docs/PRESERVACAO.md).

## Stack em três linhas

1. **Astro + TypeScript:** páginas pré-renderizadas, componentes reutilizáveis e pouco JavaScript no navegador.
2. **CSS com tokens:** design consistente e manutenção direta, sem uma biblioteca de animações pesada.
3. **JSON + Netlify:** um arquivo alimenta o catálogo e as páginas; hospedagem estática para um portfólio escolar, sem recebimento de mensagens.

## Executar localmente

Use Node.js **22.23.4 ou superior** e npm. A versão 22 é configurada no Netlify.

```sh
npm ci
npm run build
npm run dev
```

Abra o endereço exibido pelo comando de desenvolvimento. O primeiro build gera as imagens WebP e a imagem social. O PDF oficial já está em `public/assets/`, sem regeneração. Depois dele, `npm run dev` basta para editar o conteúdo. Para conferir o resultado de produção:

```sh
npm run build
npm run preview
```

**A entrada da aplicação é `src/pages/index.astro`.** Execute com npm e publique a pasta `dist/`. As páginas da raiz da versão antiga foram substituídas pelas rotas Astro. As atividades e as imagens em uso permanecem no catálogo e em `public/fotos/`.

## Organização

```text
src/
  components/ProjectCard.astro  # Card reutilizável
  components/SocialLinks.astro  # Ícones de redes sociais
  data/projects.json           # Catálogo completo
  data/profile.ts              # Dados do PDF e habilidades com fontes
  layouts/Layout.astro         # Metadados, navegação e rodapé
  lib/paths.ts                 # URLs compatíveis com base configurável
  pages/
    index.astro                # Seções principais
    projetos/[id].astro        # Detalhes gerados para cada registro
    [subject].html.astro        # Compatibilidade com disciplinas antigas
    cv.html.astro              # Currículo acessível e imprimível
    404.astro                  # Página de erro
    sitemap.xml.ts
    robots.txt.ts
  scripts/main.ts              # Tema, menu, filtros e vídeos sob demanda
  styles/global.css           # Tokens e estilos responsivos
public/
  assets/                     # PDF oficial e foto nova em img/
  fotos/                      # Originais em resolução completa
  optimized/                  # WebP gerados pelo build, não versionados
scripts/
  assets.mjs                  # Imagens e social card
  compat.mjs                  # URLs .html em hospedagem estática
  verify.mjs                  # Integridade da migração
  browser-qa.mjs               # Playwright + axe
  lighthouse.mjs              # Auditoria mobile e desktop
  review.mjs                  # Todas as páginas e links
  test-server.mjs             # Servidor efêmero para testes
tests/fixtures/preservation.json # Referência de integridade das 29 atividades
docs/
  INVENTARIO.md
  PRESERVACAO.md
  DESIGN.md
  VALIDACAO.md
netlify.toml                  # Build e cabeçalhos
```

## Adicionar um projeto

Edite **apenas `src/data/projects.json`** para inserir o registro. Categorias, filtros e página de detalhes são gerados automaticamente. Imagens são opcionais: sem imagem, o card recebe uma capa tipográfica. Para uma imagem nova, coloque o arquivo em `public/fotos/` e referencie `fotos/nome-do-arquivo.png`.

```json
{
  "id": "meu-novo-projeto",
  "title": "Meu novo projeto",
  "category": "Desenvolvimento",
  "trimester": 3,
  "source": "desenvolvimento.html",
  "tags": ["HTML", "CSS", "JavaScript"],
  "description": "Uma descrição objetiva do problema que o projeto resolve.",
  "subtitle": "Desenvolvimento web / projeto pessoal",
  "fields": [
    { "label": "Objetivo", "text": "O que eu queria construir." },
    { "label": "Desenvolvimento", "text": "Como implementei a solução." },
    { "label": "Aprendizados", "text": "O que aprendi com a experiência." }
  ],
  "images": [],
  "links": [{ "label": "Abrir projeto ↗", "url": "https://exemplo.com" }],
  "videos": [],
  "code": []
}
```

Use um `id` único com letras minúsculas, números e hífens. `source` identifica a disciplina e o registro histórico; para um novo trabalho, escolha uma disciplina existente. Não substitua os IDs originais. Vídeos usam URLs de incorporação do YouTube. Links GitHub recebem botão de código; materiais externos recebem botão de demo/material. Não são inventados links de código para trabalhos que não têm repositório.

## Design e acessibilidade

Manrope nos títulos e DM Sans no corpo, servidas localmente em WOFF2 variável com `font-display: swap`. Paleta azul, verde e lima sobre neutros; tokens em `src/styles/global.css`. Tema respeita o sistema e guarda a escolha manual. Animações e transições respeitam `prefers-reduced-motion`.

HTML semântico, link para pular navegação, foco visível, menu controlável por teclado, rótulos nos filtros, filtros com estado anunciado e imagens com texto alternativo. O conteúdo permanece disponível sem JavaScript. Os vídeos só carregam após uma ação do visitante.

Leia o [design system](docs/DESIGN.md) e os [resultados e limites da validação](docs/VALIDACAO.md). Testes automatizados ajudam a encontrar problemas, mas não equivalem a uma certificação completa de WCAG.

## Testar

```sh
npm run check
npm run build
npm test
npm audit
```

Para testes reais no navegador, tenha Google Chrome instalado. Os verificadores iniciam e encerram seu próprio servidor com porta dinâmica:

```sh
npm run qa
npm run review
node scripts/lighthouse.mjs
```

`BROWSER_CHANNEL=msedge` permite usar Edge. `QA_URL` define outro endereço de teste. Em PowerShell, use `$env:BROWSER_CHANNEL="msedge"`. Relatórios e capturas ficam em `artifacts/`, fora do Git. O teste de preservação compara os registros, os textos renderizados, URLs, código e hashes das imagens com a referência de preservação.

## Publicar no Netlify

1. Envie esta versão para seu repositório GitHub.
2. No Netlify, crie um projeto importando esse repositório.
3. Selecione a branch desejada. O `netlify.toml` define **Build command: `npm run build`** e **Publish directory: `dist`**.
4. Após receber a URL do site, defina `SITE_URL=https://nome-do-site.netlify.app` nas variáveis de ambiente. O build também usa automaticamente a variável `URL` fornecida pelo Netlify quando `SITE_URL` não estiver definida.
5. Confira o download do PDF, os projetos e os links das redes no site publicado.

O site não possui formulário nem integração de envio de mensagens.

## Conectar domínio próprio

1. Em **Domain management**, adicione o domínio que você já possui.
2. No provedor do domínio, configure os registros DNS indicados pelo Netlify para seu domínio; ou delegue os nameservers ao Netlify DNS.
3. Espere a propagação e confira o certificado HTTPS no painel.
4. Defina o domínio primário e o redirecionamento entre `www` e a versão sem `www`.
5. Atualize `SITE_URL=https://seu-dominio.com` e faça novo deploy para atualizar canonical, Open Graph, robots e sitemap.

Guia oficial: [usar domínio próprio no Netlify](https://docs.netlify.com/manage/domains/configure-domains/bring-a-domain-to-netlify/).

## O que mudou

- Navegação fixa e menu móvel substituem o menu inadequado para telas pequenas.
- A apresentação destaca perfil, propósito, currículo e redes sociais.
- Um catálogo central substitui a manutenção de cards repetidos em oito arquivos.
- Páginas individuais preservam objetivos, descrições, opiniões, imagens, vídeos, apresentações e códigos Arduino.
- As imagens WebP reduzem transferência; os arquivos originais continuam disponíveis para consulta.
- A formação aparece em linha do tempo. Certificados não foram inventados.
- Metadados sociais, sitemap, robots, favicon e currículo PDF são gerados ou incluídos no build.
- Foto nova no Início, foto anterior no Sobre e redes sociais em ícones no rodapé.

## Cinco melhorias futuras

1. Publicar demos próprias dos projetos técnicos que ainda têm somente código ou documentação.
2. Adicionar estudos de caso com decisões técnicas, dificuldades e resultados observados.
3. Incluir certificados verificáveis conforme forem concluídos.
4. Criar uma versão em inglês do portfólio e do currículo.
5. Automatizar auditorias de acessibilidade e desempenho a cada pull request.

## Autoria

Victor Dias Queiroz. Projetos e materiais acadêmicos mantêm suas autorias e contextos originais. Fontes distribuídas sob as licenças incluídas nos respectivos pacotes. Este repositório não concede uma licença geral de redistribuição dos materiais de terceiros.

## Currículo e habilidades

O arquivo `public/assets/curriculo-victor-queiroz.pdf` é uma cópia integral do PDF oficial recebido. `src/data/profile.ts` centraliza sua transcrição e a procedência das habilidades. O documento informa formação e três projetos acadêmicos, mas não lista cursos complementares, certificados ou empregos. Nenhum deles foi inventado. Não há trechos ilegíveis nem itens que exijam confirmação na transcrição.

A nova foto é `public/assets/img/foto-inicio.webp`; a antiga permanece no Sobre. A referência em `tests/fixtures/preservation.json` mantém os registros e hashes das imagens para os testes de integridade.

## Arquivos da atualização solicitada

| Arquivo                                                                                  | Alteração                                                                                               |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [src/pages/index.astro](src/pages/index.astro)                                           | Contato e CTA removidos; foto nova no Início; foto antiga no Sobre; formação e habilidades atualizadas. |
| [src/layouts/Layout.astro](src/layouts/Layout.astro)                                     | Navegação sem Contato; ícones sociais no rodapé.                                                        |
| [src/components/SocialLinks.astro](src/components/SocialLinks.astro)                     | Novo componente de redes sociais, com nomes acessíveis e abertura em outra aba.                         |
| [src/data/profile.ts](src/data/profile.ts)                                               | Transcrição do PDF e fontes das habilidades.                                                            |
| [src/pages/cv.html.astro](src/pages/cv.html.astro)                                       | Currículo oficial em HTML e botão de download.                                                          |
| [public/assets/curriculo-victor-queiroz.pdf](public/assets/curriculo-victor-queiroz.pdf) | PDF oficial, preservado byte a byte.                                                                    |
| [public/assets/img/foto-inicio.webp](public/assets/img/foto-inicio.webp)                 | Nova foto otimizada.                                                                                    |
| [src/pages/projetos/[id].astro](src/pages/projetos/[id].astro)                           | Retirado o link para a página histórica; materiais das atividades preservados.                          |
| src/pages/obrigado.astro                                                                 | Excluído: era usado apenas pelo formulário.                                                             |
| [src/pages/sitemap.xml.ts](src/pages/sitemap.xml.ts)                                     | Página excluída retirada do sitemap.                                                                    |
| [src/styles/global.css](src/styles/global.css)                                           | Estilos exclusivos de contato retirados; ícones sociais ajustados.                                      |
| [scripts/assets.mjs](scripts/assets.mjs)                                                 | Removida a geração do currículo antigo; imagens continuam sendo otimizadas.                             |
| public/curriculo-victor-queiroz.pdf                                                      | Excluído: PDF gerado antigo substituído pelo anexo oficial em assets.                                   |
| [package.json](package.json) e [package-lock.json](package-lock.json)                    | Dependência pdfkit removida.                                                                            |
| [.gitignore](.gitignore)                                                                 | Retirada regra do PDF antigo que não é mais gerado.                                                     |
| [scripts/verify.mjs](scripts/verify.mjs)                                                 | Integridade das atividades, ausência de formulário, fotos e hash do PDF.                                |
| [scripts/browser-qa.mjs](scripts/browser-qa.mjs)                                         | Verificações de fotos distintas, redes sociais, PDF e ausência de formulário.                           |
| [README.md](README.md)                                                                   | Instruções atuais, origem do currículo e relação de arquivos alterados.                                 |
| [docs/DESIGN.md](docs/DESIGN.md)                                                         | Uso das duas fotos e redes sociais.                                                                     |
| [docs/PRESERVACAO.md](docs/PRESERVACAO.md)                                               | Checklist atualizado, mantendo as 29 atividades.                                                        |
| [docs/VALIDACAO.md](docs/VALIDACAO.md)                                                   | Resultados medidos nesta atualização e limites da verificação.                                          |

O catálogo src/data/projects.json, as imagens anteriores, os arquivos de atividades, o JavaScript de navegação/filtros e as configurações de hospedagem não precisaram de alterações.

## Revisão final

Consulte [o relatório da revisão](docs/REVISAO-FINAL.md), [a auditoria de links](docs/LINKS.md) e [a lista de exclusões justificadas](docs/LIMPEZA.md). Os testes não enviam formulários nem alteram serviços externos. O proprietário autorizou a criação dos commits após revisar os relatórios. A disponibilidade pública das novas rotas deve ser conferida após o deploy.
