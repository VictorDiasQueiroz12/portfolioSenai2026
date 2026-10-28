// Fonte oficial: public/assets/curriculo-victor-queiroz.pdf (CV (2).pdf, duas páginas).
// Não inferir cursos, certificados, vínculos profissionais ou datas ausentes.
export const profile = {
  name: 'Victor Dias Queiroz',
  location: 'Ingleses — Florianópolis, SC',
  email: 'victordiasq12@gmail.com',
  phone: '+55 (48) 99827-2158',
  portfolio: 'https://victordiasportfolio.netlify.app/',
  resume: 'assets/curriculo-victor-queiroz.pdf',
  summary:
    'Estudante do Ensino Médio Técnico em Desenvolvimento de Sistemas, com habilidades em comunicação de backend com frontend e banco de dados, além de conhecimentos sobre experiência de usuários em aplicação web. Possuo interesse em ingressar no mercado de trabalho por meio de oportunidades como estagiário ou jovem aprendiz, na área de Desenvolvimento de Sistemas, Programação ou Tecnologia, com foco em aprendizado prático e crescimento profissional.',
  education: [
    {
      title: 'Ensino Médio Técnico em Desenvolvimento de Sistemas',
      institution: 'SESI SENAI — Florianópolis, SC',
      date: 'Conclusão: dezembro de 2026',
    },
    {
      title: 'Ensino Fundamental',
      institution: 'Colégio Santa Terezinha — Florianópolis, SC',
      date: 'Concluído: dezembro de 2023',
    },
  ],
  experiences: [
    {
      title: 'Rinha FullStack SENAI 2026',
      text: 'Participação em competição de programação com desenvolvimento de um gateway de pagamento simulado, envolvendo backend em Node.js, frontend em React/Vite e banco de dados SQLite com Prisma. O projeto trabalhou regras de negócio, idempotência, estornos, concorrência e testes de performance.',
    },
    {
      title: 'Grand Prix SENAI 2026',
      text: 'Participação em competição nacional de inovação aplicada, desenvolvendo em equipe uma solução para um desafio real da indústria. A experiência envolveu criatividade, empreendedorismo, Design Thinking, prototipação, Lean Canvas e apresentação de pitch, com foco na criação e validação de uma solução inovadora.',
    },
    {
      title: 'Creative and Tech Challenge — SENAI Florianópolis',
      text: 'Desenvolvimento de um sistema web responsivo para solucionar um problema real, envolvendo front-end, back-end, banco de dados, UX/UI e regras de negócio. Projeto desenvolvido em equipe, com integração das tecnologias e apresentação da solução em formato de pitch.',
    },
  ],
  technical: [
    'Desenvolvimento de páginas Web (HTML, CSS, JavaScript, Node.js, React/Vite e Prisma ORM)',
    'Conhecimentos iniciais em lógica de programação',
    'Versionamento e organização de código com GitHub',
    'Organização de conteúdo digital e documentação técnica',
  ],
  behavioral: [
    'Motivação',
    'Facilidade de aprendizagem',
    'Responsabilidade',
    'Trabalho em equipe',
  ],
};
// URLs sociais preservadas do portfólio existente.
export const socials = [
  { name: 'GitHub', url: 'https://github.com/VictorDiasQueiroz12' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/victordiasqueiroz' },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/v.diasz_?igsh=eDkzOWd1aWUwbzds',
  },
];
export const skills = [
  {
    n: '01',
    title: 'Técnicas',
    text: 'Conhecimentos do currículo aplicados aos projetos.',
    items: [
      'HTML',
      'CSS',
      'JavaScript',
      'Node.js',
      'React / Vite',
      'SQLite',
      'Prisma ORM',
      'Lógica de programação — inicial',
      'UX/UI',
      'Documentação técnica',
    ],
    source: 'PDF: resumo, projetos acadêmicos e competências técnicas.',
  },
  {
    n: '02',
    title: 'Ferramentas',
    text: 'Recursos utilizados nas experiências acadêmicas.',
    items: [
      'GitHub',
      'Arduino',
      'Canva',
      'Google Docs',
      'Wordwall',
      'Design Thinking',
      'Lean Canvas',
      'Prototipação',
    ],
    source:
      'PDF: GitHub, Design Thinking, Lean Canvas e prototipação. Atividades: iot-2 a iot-4 (Arduino), humanas-1 (Canva), linguagens-3 (Google Docs), linguagens-2 (Wordwall).',
  },
  {
    n: '03',
    title: 'Comportamentais',
    text: 'Atitudes registradas no currículo.',
    items: profile.behavioral,
    source: 'PDF: competências comportamentais.',
  },
];
