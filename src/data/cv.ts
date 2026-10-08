// Facts come from Ivan's resume PDF (LinkedIn export, Oct 2026), his GitHub profile and product READMEs.
// See DESIGN.md → "Content sources". Missing data is marked with `TODO:`; nothing here is invented.

import { siteBase, siteUrl } from '../../site.config.mjs';

const url = `${siteUrl}${siteBase}`;

export const site = {
  // Canonical URL: GitHub Pages by default, or SITE_URL + SITE_BASE for a custom-domain build.
  domain: url.replace(/^https?:\/\//, '').replace(/\/$/, ''),
  url,
  title: 'Ivan Tuhai — Founder & CTO of Pyrlyn',
  description:
    'Ivan Tuhai (listepo) — engineer building software since 2009. Founder & CTO of Pyrlyn, Senior Frontend Developer at KSF Technologies AG. Projects: ketch, rtok, runa, cox.',
};

export const person = {
  // English spelling confirmed by Ivan: "Tuhai".
  name: 'Ivan Tuhai',
  handle: 'listepo',
  role: 'founder & CTO of Pyrlyn', // resume: CTO ("Технический директор") and founder ("Учредитель") of Pyrlyn
  devSince: 2009, // resume: Freelance Web Development, Nov 2009
  hireable: true, // gh api users/listepo → hireable: true
  // Motto from the listepo/listepo profile README (original English).
  motto: [
    "I'm not just a vibe coder.",
    "I'm an engineer who uses AI to ship real, useful software.",
  ],
  location: 'Ukraine', // resume header; country only, no address
};

export const links = [
  { id: 'email', label: 'Email', value: 'listepo@gmail.com', href: 'mailto:listepo@gmail.com' },
  { id: 'linkedin', label: 'LinkedIn', value: 'in/listepo', href: 'https://www.linkedin.com/in/listepo' },
  { id: 'github', label: 'GitHub', value: 'github.com/listepo', href: 'https://github.com/listepo' },
  { id: 'x', label: 'X', value: 'x.com/listepo', href: 'https://x.com/listepo' },
] as const;

export const about = [
  'Engineer building software since 2009: went from full-stack developer to frontend tech lead, and now I build my own products.',
  'Led frontend twice as Technical Lead: redesigned project architecture, launched new projects and mentored the team.',
  'Senior Frontend Developer at KSF Technologies AG since 2022. Since September 2026, founder & CTO of Pyrlyn: tools for developers, starting with AI.',
];

export const facts = [
  { key: 'role', value: 'CTO, Pyrlyn' },
  { key: 'location', value: 'Ukraine' },
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
      'A single-binary package manager: installs CLI tools and apps straight from GitHub releases on macOS, Linux and Windows — no formulae or taps, checked against the published checksum.',
  },
  {
    name: 'rtok',
    repo: 'pyrlyn/rtok',
    status: 'release',
    featured: true,
    cmd: 'rtok',
    summary:
      'Reduces the context AI coding agents carry: Claude Code hooks, an MCP server and an API proxy in one binary. Every reduction is measured and retrievable by id.',
  },
  {
    name: 'runa',
    repo: 'pyrlyn/runa',
    status: 'active',
    featured: true,
    cmd: 'runa fit',
    summary:
      'A local-first AI runner: checks whether a GGUF model fits your machine before you download it, runs it via llama.cpp or calls OpenAI and Anthropic. OpenAI-compatible serve.',
  },
  {
    name: 'cox',
    repo: 'pyrlyn/cox',
    status: 'active',
    featured: true,
    cmd: 'cox run -p "…"',
    summary:
      'A modular terminal coding agent with a safe, event-driven core: TUI, headless mode, editor integration via ACP and MCP.',
  },
  {
    name: 'stator',
    repo: 'listepo/stator',
    status: 'research',
    summary: 'An ahead-of-time compiler from TypeScript and JavaScript to native binaries. A research compiler.',
  },
  {
    name: 'slint_dart',
    repo: 'listepo/slint_dart',
    status: 'active',
    summary: 'Slint for Flutter: typed Dart codegen from .slint files, interpreter and AOT backends over Rust FFI, headless and Patrol testing.',
  },
  {
    name: 'bindsmith',
    repo: 'listepo/bindsmith',
    status: 'wip',
    summary: 'One bindsmith.yaml — Dart bindings for native APIs on all six Flutter platforms.',
  },
  {
    name: 'ketch-registry',
    repo: 'pyrlyn/ketch-registry',
    status: 'active',
    summary: 'The default package registry for ketch: one folder per package.',
  },
  {
    name: 'brand',
    repo: 'pyrlyn/brand',
    status: 'active',
    summary: 'Brand system: design tokens, CSS, components, logos and icons.',
  },
  {
    name: 'cross-code',
    repo: 'listepo/cross-code',
    status: 'active',
    summary: 'Code and utilities for cross-platform development: NativeScript, React Native, Ionic and more.',
  },
];

export const statusLabel: Record<Project['status'], string> = {
  release: 'released',
  active: 'active',
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
    title: 'Founder & CTO',
    period: 'Sep 2026 — present',
    place: 'Europe',
    url: 'https://github.com/pyrlyn',
    points: [
      'Founded a developer-tools company; own its technology and technical strategy.',
      'Shipped ketch, which installs CLI tools from GitHub releases with checksum verification, and rtok, which measurably cuts the context AI agents carry.',
      'Leading development of runa (a local-first AI runner) and cox (a terminal coding agent).',
    ],
  },
  {
    org: 'KSF Technologies AG',
    title: 'Senior Frontend Developer',
    period: 'Feb 2022 — present',
    place: 'Kyiv',
    points: [
      'Took projects from first mockups to production and supported them after release.',
      'Owned the visual layer and UX of the interfaces, from prototype to final polish.',
      'Worked closely with product and design, from problem framing to launch.',
    ],
  },
  {
    org: 'Rocket',
    title: 'Front-End Developer',
    period: 'Nov 2020 — Jan 2022',
    points: [
      'Shipped features to production as part of a product team.',
      'Turned design mockups into working interfaces, down to the details.',
    ],
  },
  {
    org: 'KITCODE',
    title: 'Front-End Technical Lead',
    period: 'Apr 2019 — Nov 2020',
    points: [
      'Designed frontend architecture for new and existing projects.',
      'Ran projects through the full cycle, from launch to maintenance.',
      'Mentored the team’s developers.',
    ],
  },
  {
    org: 'PrivateDev',
    title: 'Senior Frontend Developer → Front-End Technical Lead',
    period: 'Aug 2017 — Apr 2019',
    points: [
      'Grew from senior developer to tech lead within a year.',
      'Redesigned the main project’s architecture and mentored colleagues.',
    ],
  },
  {
    org: 'Logic IT Solutions (LITS)',
    title: 'Senior JavaScript Developer',
    period: 'May 2016 — Aug 2017',
    place: 'Kyiv',
    points: ['Built the frontend for several client projects.'],
  },
  {
    org: 'Mush',
    title: 'Senior JavaScript Developer',
    period: 'May 2016 — Apr 2017',
    points: ['Built a hybrid mobile app.'],
  },
  {
    org: '111PIX UA',
    title: 'Full-stack Developer',
    period: 'Nov 2015 — May 2016',
    place: 'Kyiv',
    points: ['Developed and maintained Battlecam (battlecam.com).'],
  },
];

/** Earlier roles, shown compactly. */
export const earlier = [
  { org: 'Silença Tech', title: 'Middle PHP Developer', period: '2015' },
  { org: 'SuperDeal.ua / Pokupon.ua', title: 'Middle PHP Developer', period: '2015' },
  { org: 'N1 Financial Company', title: 'Software Engineer', period: '2014 — 2015' },
  { org: 'Skiliks', title: 'PHP/JS Developer', period: '2012 — 2014' },
  { org: 'TizerClick', title: 'PHP Developer', period: '2011 — 2012' },
  { org: 'Freelance', title: 'Full Stack Engineer', period: '2009 — 2011' },
];
