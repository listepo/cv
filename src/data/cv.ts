// All facts below come from Ivan's own materials (see DESIGN.md → "Content sources").
// Anything not found there is marked with `TODO:` and must be filled in by Ivan.

export const site = {
  domain: 'listepo.dev',
  url: 'https://listepo.dev',
  title: 'Ivan Tuhai — инженер · listepo.dev',
  description:
    'Ivan Tuhai (listepo) — инженер. Инструменты для разработчиков на Rust, Dart и TypeScript: ketch, rtok, runa, cox, stator, slint_dart, bindsmith.',
};

export const person = {
  // English spelling confirmed by Ivan: "Tuhai".
  name: 'Ivan Tuhai',
  handle: 'listepo',
  role: 'engineer', // listepo/listepo profile README: "· engineer"
  githubSince: 2012, // gh api users/listepo → created_at 2012-10-08
  hireable: true, // gh api users/listepo → hireable: true
  // Motto from the listepo/listepo profile README, translated to Russian.
  motto: [
    'Я не просто вайб-кодер.',
    'Я инженер, который с помощью AI выпускает настоящий, полезный софт.',
  ],
  location: 'TODO: город / часовой пояс (только город, без адреса)',
};

export const links = [
  { id: 'github', label: 'GitHub', value: 'github.com/listepo', href: 'https://github.com/listepo' },
  { id: 'org', label: 'Pyrlyn', value: 'github.com/pyrlyn', href: 'https://github.com/pyrlyn' },
  { id: 'x', label: 'X', value: 'x.com/listepo', href: 'https://x.com/listepo' },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'Ivan Tuhai',
    href: 'https://www.linkedin.com/in/ivan-tugay-68101474/',
  },
] as const;

export const contactTodos = [
  { id: 'email', label: 'Email', value: 'TODO: публичный email' },
  { id: 'telegram', label: 'Telegram', value: 'TODO: ник, если нужен' },
] as const;

export const about = [
  'Делаю инструменты для разработчиков: установку CLI-программ из релизов GitHub, локальный запуск языковых моделей и утилиты для AI-агентов, которые пишут код.',
  'Основной язык — Rust. Рядом — Dart/Flutter (интеграция Slint, генерация нативных биндингов) и TypeScript (AOT-компилятор в нативные бинарники).',
  'Продукты собраны в организации Pyrlyn — инструменты для разработчиков, начиная с AI.',
];

export const facts = [
  { key: 'handle', value: 'listepo' },
  { key: 'org', value: 'pyrlyn' },
  { key: 'github_since', value: '2012' },
  { key: 'public_repos', value: '11' },
  { key: 'open_to_work', value: 'true' },
];

export const stack = [
  { group: 'languages', items: ['Rust', 'Dart', 'TypeScript', 'C'] },
  { group: 'ui', items: ['Flutter', 'Slint', 'Astro'] },
  { group: 'ai', items: ['llama.cpp / GGUF', 'MCP', 'ACP', 'OpenAI / Anthropic API'] },
  { group: 'tooling', items: ['Cargo', 'mise', 'GitHub Actions', 'SonarCloud'] },
];

export type Project = {
  name: string;
  repo: string;
  lang: 'Rust' | 'Dart' | 'TypeScript' | 'C' | 'CSS' | 'Ruby' | '—';
  summary: string;
  status: 'release' | 'active' | 'wip' | 'research';
  featured?: boolean;
  cmd?: string;
};

export const projects: Project[] = [
  {
    name: 'ketch',
    repo: 'pyrlyn/ketch',
    lang: 'Rust',
    status: 'release',
    featured: true,
    cmd: 'ketch install <tool>',
    summary:
      'Пакетный менеджер в одном бинарнике: ставит CLI-инструменты и приложения прямо из релизов GitHub на macOS, Linux и Windows — без формул и тапов, с проверкой контрольной суммы.',
  },
  {
    name: 'rtok',
    repo: 'pyrlyn/rtok',
    lang: 'Rust',
    status: 'release',
    featured: true,
    cmd: 'rtok',
    summary:
      'Сокращает контекст AI-агентов для программирования: хуки Claude Code, MCP-сервер и API-прокси в одном бинарнике. Каждое сокращение измеряется и восстанавливается по id.',
  },
  {
    name: 'runa',
    repo: 'pyrlyn/runa',
    lang: 'Rust',
    status: 'active',
    featured: true,
    cmd: 'runa fit',
    summary:
      'Local-first AI-раннер: до скачивания проверяет, потянет ли машина GGUF-модель, запускает её через llama.cpp или обращается к OpenAI и Anthropic. OpenAI-совместимый serve.',
  },
  {
    name: 'cox',
    repo: 'pyrlyn/cox',
    lang: 'Rust',
    status: 'active',
    featured: true,
    cmd: 'cox run -p "…"',
    summary:
      'Модульный агент для программирования в терминале с безопасным событийным ядром: TUI, headless-режим, интеграция с редакторами через ACP и MCP.',
  },
  {
    name: 'stator',
    repo: 'listepo/stator',
    lang: 'TypeScript',
    status: 'research',
    summary: 'AOT-компилятор TypeScript и JavaScript в нативные бинарники. Исследовательский компилятор.',
  },
  {
    name: 'slint_dart',
    repo: 'listepo/slint_dart',
    lang: 'Dart',
    status: 'active',
    summary: 'Slint для Flutter: типизированный Dart-кодген из .slint, интерпретатор и AOT поверх Rust FFI, headless- и Patrol-тесты.',
  },
  {
    name: 'bindsmith',
    repo: 'listepo/bindsmith',
    lang: 'Dart',
    status: 'wip',
    summary: 'Один bindsmith.yaml — Dart-биндинги к нативным API на всех шести платформах Flutter.',
  },
  {
    name: 'ketch-registry',
    repo: 'pyrlyn/ketch-registry',
    lang: '—',
    status: 'active',
    summary: 'Реестр пакетов ketch по умолчанию: одна папка на пакет.',
  },
  {
    name: 'brand',
    repo: 'pyrlyn/brand',
    lang: 'CSS',
    status: 'active',
    summary: 'Бренд-система: дизайн-токены, CSS, компоненты, логотипы и иконки.',
  },
  {
    name: 'cross-code',
    repo: 'listepo/cross-code',
    lang: 'C',
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

export type Job = { period: string; title: string; org: string; note: string; todo?: boolean };

export const experience: Job[] = [
  {
    period: 'TODO: годы',
    title: 'TODO: роль',
    org: 'Pyrlyn',
    note: 'Инструменты для разработчиков на Rust: ketch, rtok, runa, cox.',
    todo: true,
  },
  {
    period: 'TODO: годы',
    title: 'TODO: должность',
    org: 'TODO: компания',
    note: 'TODO: 1–2 строки о зоне ответственности и результате.',
    todo: true,
  },
  {
    period: 'TODO: годы',
    title: 'TODO: должность',
    org: 'TODO: компания',
    note: 'TODO: 1–2 строки о зоне ответственности и результате.',
    todo: true,
  },
];
