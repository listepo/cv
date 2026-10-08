import assert from "node:assert/strict";
import test from "node:test";

import { about, earlier, experience, facts, links, person, projects, site, statusLabel } from "../src/data/cv.ts";
import { GRAPH_CONFIG } from "../src/scripts/graph-config.ts";
import { SOUND_CONFIG } from "../src/scripts/sound-config.ts";
import { THEME_BG, THEME_KEY } from "../src/scripts/theme.ts";
import { createNetwork } from "../src/scripts/network-sim.ts";

const statuses = ["release", "active", "wip", "research"];

test("site url matches the pages domain", () => {
  assert.equal(site.domain, "listepo.github.io/cv");
  assert.equal(site.url, "https://listepo.github.io/cv/");
  assert.ok(site.title.includes(person.name));
  assert.ok(site.description.length > 0);
});

test("projects use a known status and a featured command", () => {
  const names = projects.map((project) => project.name);
  assert.equal(new Set(names).size, names.length);
  for (const project of projects) {
    assert.match(project.repo, /^[\w.-]+\/[\w.-]+$/);
    assert.ok(statuses.includes(project.status));
    assert.equal(statusLabel[project.status] !== undefined, true);
    assert.ok(project.summary.length > 0);
    if (project.featured) assert.ok(project.cmd);
  }
  for (const status of statuses) assert.ok(statusLabel[status]);
});

test("contact links and the bio are filled in", () => {
  assert.equal(person.handle, "listepo");
  assert.equal(person.devSince, 2009);
  assert.deepEqual(person.motto.length, 2);
  assert.ok(about.length >= 1);
  for (const link of links) {
    assert.ok(link.label);
    assert.ok(link.href.startsWith("mailto:") || link.href.startsWith("https://"));
  }
  assert.equal(facts.find((fact) => fact.key === "dev_since")?.value, "2009");
  assert.equal(facts.find((fact) => fact.key === "open_to_work")?.value, String(person.hireable));
});

test("experience entries have a period and at least one point", () => {
  for (const job of experience) {
    assert.ok(job.org);
    assert.ok(job.title);
    assert.ok(job.period);
    assert.ok(job.points.length >= 1);
  }
  for (const job of earlier) {
    assert.ok(job.org && job.title && job.period);
  }
});

test("graph and sound tuning stay inside the ranges the sim assumes", () => {
  assert.ok(GRAPH_CONFIG.nodeCount > GRAPH_CONFIG.nodeCountSmall);
  assert.ok(GRAPH_CONFIG.hubShare > 0 && GRAPH_CONFIG.hubShare < 1);
  assert.ok(GRAPH_CONFIG.layoutRadius > 0);
  assert.ok(GRAPH_CONFIG.falloff > 0);
  assert.ok(GRAPH_CONFIG.snapDistance > 0);
  assert.ok(SOUND_CONFIG.freqMin < SOUND_CONFIG.freqMax);
  assert.ok(SOUND_CONFIG.throttleMs > 0);
  assert.ok(SOUND_CONFIG.duration > SOUND_CONFIG.attack);
  assert.equal(THEME_KEY, "cv:theme");
  assert.match(THEME_BG.dark, /^#[0-9a-f]{6}$/);
  assert.match(THEME_BG.light, /^#[0-9a-f]{6}$/);
});

test("createNetwork builds a connected graph without drawing it", () => {
  const count = 8;
  const net = createNetwork(GRAPH_CONFIG, count);
  assert.equal(net.nodes.length, count);
  assert.ok(net.edges.length >= count - 1);
  assert.ok(net.nodes.some((node) => node.hub));
  for (const node of net.nodes) {
    assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y) && Number.isFinite(node.z));
    assert.equal(node.target, 1);
  }
  net.stepPull(null);
  assert.equal(net.sparks.length, 0);
  net.stepFades();
  net.mutate();
  assert.ok(net.nodes.length >= 1);
});
