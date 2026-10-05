// Facts come from Ivan's resume PDF (LinkedIn export, Oct 2026), his GitHub profile and product READMEs.
// See DESIGN.md → "Content sources". Missing data is marked with `TODO:`; nothing here is invented.

export const site = {
  domain: 'listepo.dev',
  url: 'https://listepo.dev',
  title: 'Ivan Tuhai — основатель и технический директор Pyrlyn · listepo.dev',
  description:
    'Ivan Tuhai (listepo) — инженер, в разработке с 2009 года. Основатель и технический директор Pyrlyn, Senior Frontend Developer в KSF Technologies AG. Проекты: ketch, rtok, runa, cox.',
};

export const person = {
  // English spelling confirmed by Ivan: "Tuhai".
  name: 'Ivan Tuhai',
  handle: 'listepo',
  role: 'основатель и технический директор Pyrlyn', // resume: "Технический директор в компании Pyrlyn", "Учредитель"
  devSince: 2009, // resume: Freelance Web Development, Nov 2009
  hireable: true, // gh api users/listepo → hireable: true
  // Motto from the listepo/listepo profile README, translated to Russian.
  motto: [
    'Я не просто вайб-кодер.',
    'Я инженер, который с помощью AI выпускает настоящий, полезный софт.',
  ],
  location: 'Украина', // resume header; country only, no address
};

export const links = [
  { id: 'email', label: 'Email', value: 'listepo@gmail.com', href: 'mailto:listepo@gmail.com' },
  { id: 'linkedin', label: 'LinkedIn', value: 'in/listepo', href: 'https://www.linkedin.com/in/listepo' },
  { id: 'github', label: 'GitHub', value: 'github.com/listepo', href: 'https://github.com/listepo' },
  { id: 'x', label: 'X', value: 'x.com/listepo', href: 'https://x.com/listepo' },
] as const;

export const about = [
  'Инженер, в разработке с 2009 года: прошёл путь от full-stack-разработчика до техлида фронтенда, сейчас строю собственные продукты.',
  'Дважды руководил фронтендом как Technical Lead: перепроектировал архитектуру проектов, запускал новые и менторил команду.',
  'С 2022 года — Senior Frontend Developer в KSF Technologies AG. С сентября 2026 — основатель и технический директор Pyrlyn: инструменты для разработчиков, начиная с AI.',
];

export const facts = [
  { key: 'role', value: 'CTO, Pyrlyn' },
  { key: 'location', value: 'Украина' },
  { key: 'dev_since', value: '2009' },
  { key: 'handle', value: 'listepo' },
  { key: 'open_to_work', value: 'true' },
];

export type Project = {
  name: string;
  repo: string;
  summary: string;
  status: 'release' | 'active' | 'wip' | 'research';
  featured?: boolean;
  cmd?: string;
};

export const projects: Project[] = [
  {
    name: 'ketch',
    repo: 'pyrlyn/ketch',
    status: 'release',
    featured: true,
    cmd: 'ketch install <tool>',
    summary:
      'Пакетный менеджер в одном бинарнике: ставит CLI-инструменты и приложения прямо из релизов GitHub на macOS, Linux и Windows — без формул и тапов, с проверкой контрольной суммы.',
  },
  {
    name: 'rtok',
    repo: 'pyrlyn/rtok',
    status: 'release',
    featured: true,
    cmd: 'rtok',
    summary:
      'Сокращает контекст AI-агентов для программирования: хуки Claude Code, MCP-сервер и API-прокси в одном бинарнике. Каждое сокращение измеряется и восстанавливается по id.',
  },
  {
    name: 'runa',
    repo: 'pyrlyn/runa',
    status: 'active',
    featured: true,
    cmd: 'runa fit',
    summary:
      'Local-first AI-раннер: до скачивания проверяет, потянет ли машина GGUF-модель, запускает её через llama.cpp или обращается к OpenAI и Anthropic. OpenAI-совместимый serve.',
  },
  {
    name: 'cox',
    repo: 'pyrlyn/cox',
    status: 'active',
    featured: true,
    cmd: 'cox run -p "…"',
    summary:
      'Модульный агент для программирования в терминале с безопасным событийным ядром: TUI, headless-режим, интеграция с редакторами через ACP и MCP.',
  },
  {
    name: 'stator',
    repo: 'listepo/stator',
    status: 'research',
    summary: 'AOT-компилятор TypeScript и JavaScript в нативные бинарники. Исследовательский компилятор.',
  },
  {
    name: 'slint_dart',
    repo: 'listepo/slint_dart',
    status: 'active',
    summary: 'Slint для Flutter: типизированный Dart-кодген из .slint, интерпретатор и AOT поверх Rust FFI, headless- и Patrol-тесты.',
  },
  {
    name: 'bindsmith',
    repo: 'listepo/bindsmith',
    status: 'wip',
    summary: 'Один bindsmith.yaml — Dart-биндинги к нативным API на всех шести платформах Flutter.',
  },
  {
    name: 'ketch-registry',
    repo: 'pyrlyn/ketch-registry',
    status: 'active',
    summary: 'Реестр пакетов ketch по умолчанию: одна папка на пакет.',
  },
  {
    name: 'brand',
    repo: 'pyrlyn/brand',
    status: 'active',
    summary: 'Бренд-система: дизайн-токены, CSS, компоненты, логотипы и иконки.',
  },
  {
    name: 'cross-code',
    repo: 'listepo/cross-code',
    status: 'active',
    summary: 'Код и утилиты для кросс-платформенной разработки: NativeScript, React Native, Ionic и др.',
  },
];

export const statusLabel: Record<Project['status'], string> = {
  release: 'релиз',
  active: 'в работе',
  wip: 'wip',
  research: 'research',
};

export type Job = {
  org: string;
  title: string;
  period: string;
  place?: string;
  url?: string;
  points: string[];
  todo?: string;
};

export const experience: Job[] = [
  {
    org: 'Pyrlyn',
    title: 'Основатель и технический директор',
    period: 'сен 2026 — н. в.',
    place: 'Европа',
    url: 'https://github.com/pyrlyn',
    points: [
      'Основал компанию инструментов для разработчиков; отвечаю за технологии и техническую стратегию.',
      'Выпустил ketch — установку CLI-инструментов из релизов GitHub с проверкой контрольной суммы — и rtok, который измеримо сокращает контекст AI-агентов.',
      'Веду разработку runa (local-first AI-раннер) и cox (терминальный агент для программирования).',
    ],
  },
  {
    org: 'KSF Technologies AG',
    title: 'Senior Frontend Developer',
    period: 'фев 2022 — н. в.',
    place: 'Киев',
    points: [
      'Took projects from first mockups to production and supported them after release.',
      'Owned the visual layer and UX of the interfaces, from prototype to final polish.',
      'Worked closely with product and design, from problem framing to launch.',
    ],
  },
  {
    org: 'Rocket',
    title: 'Front-End Developer',
    period: 'ноя 2020 — янв 2022',
    points: [
      'Shipped features to production as part of a product team.',
      'Turned design mockups into working interfaces, down to the details.',
    ],
  },
  {
    org: 'KITCODE',
    title: 'Front-End Technical Lead',
    period: 'апр 2019 — ноя 2020',
    points: [
      'Проектировал архитектуру фронтенда для новых и действующих проектов.',
      'Вёл проекты на всём цикле — от запуска до поддержки.',
      'Менторил разработчиков команды.',
    ],
  },
  {
    org: 'PrivateDev',
    title: 'Senior Frontend Developer → Front-End Technical Lead',
    period: 'авг 2017 — апр 2019',
    points: [
      'Через год вырос из Senior-разработчика до техлида.',
      'Перепроектировал архитектуру основного проекта и менторил коллег.',
    ],
  },
  {
    org: 'Logic IT Solutions (LITS)',
    title: 'Senior JavaScript Developer',
    period: 'май 2016 — авг 2017',
    place: 'Киев',
    points: ['Разрабатывал фронтенд нескольких клиентских проектов.'],
  },
  {
    org: 'Mush',
    title: 'Senior JavaScript Developer',
    period: 'май 2016 — апр 2017',
    points: ['Разрабатывал гибридное мобильное приложение.'],
  },
  {
    org: '111PIX UA',
    title: 'Full-stack Developer',
    period: 'ноя 2015 — май 2016',
    place: 'Киев',
    points: ['Развивал и поддерживал Battlecam (battlecam.com).'],
  },
];

/** Earlier roles, shown compactly. */
export const earlier = [
  { org: 'Silença Tech', title: 'Middle PHP Developer', period: '2015' },
  { org: 'SuperDeal.ua / Pokupon.ua', title: 'Middle PHP Developer', period: '2015' },
  { org: 'N1 Financial Company', title: 'Software Engineer', period: '2014 — 2015' },
  { org: 'Skiliks', title: 'PHP/JS Developer', period: '2012 — 2014' },
  { org: 'TizerClick', title: 'PHP Developer', period: '2011 — 2012' },
  { org: 'Фриланс', title: 'Full Stack Engineer', period: '2009 — 2011' },
];
