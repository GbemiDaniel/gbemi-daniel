export type TextNode = { kind: string; type: "text"; body: string };
export type TogglesNode = {
  kind: string;
  type: "toggles";
  items: { label: string; on: boolean }[];
};
export type TagsNode = { kind: string; type: "tags"; items: string[] };
export type VersionsNode = {
  kind: string;
  type: "versions";
  items: { label: string; final: boolean }[];
};

export type NodeData = TextNode | TogglesNode | TagsNode | VersionsNode;

export const NODE_SETS: Record<3 | 4 | 6, NodeData[]> = {
  3: [
    {
      kind: "CONCEPT",
      type: "text",
      body: "Cursor-follow menus feel laggy when tied to scroll/mousemove. Give the follower its own loop instead.",
    },
    { kind: "STACK", type: "tags", items: ["@keyframes", "transform: rotate", "position: absolute"] },
    {
      kind: "DECISIONS",
      type: "toggles",
      items: [
        { label: "Decoupled from scroll", on: true },
        { label: "CSS-only, no JS tick", on: true },
      ],
    },
  ],
  4: [
    {
      kind: "CONCEPT",
      type: "text",
      body: "Cursor-follow menus feel laggy when tied to scroll/mousemove. Give the follower its own loop instead.",
    },
    {
      kind: "DECISIONS",
      type: "toggles",
      items: [
        { label: "Decoupled from scroll", on: true },
        { label: "CSS-only, no JS tick", on: true },
        { label: "Spring physics (skipped)", on: false },
      ],
    },
    { kind: "STACK", type: "tags", items: ["@keyframes", "transform: rotate", "position: absolute"] },
    {
      kind: "ITERATIONS",
      type: "versions",
      items: [
        { label: "v1", final: false },
        { label: "v2", final: false },
        { label: "final", final: true },
      ],
    },
  ],
  6: [
    {
      kind: "CONCEPT",
      type: "text",
      body: "Cursor-follow menus feel laggy when tied to scroll/mousemove. Give the follower its own loop instead.",
    },
    {
      kind: "CONSTRAINTS",
      type: "text",
      body: "Must run on the compositor thread only — no main-thread ticking, no layout thrash.",
    },
    {
      kind: "DECISIONS",
      type: "toggles",
      items: [
        { label: "Decoupled from scroll", on: true },
        { label: "CSS-only, no JS tick", on: true },
      ],
    },
    { kind: "DATA", type: "tags", items: ["radius: 35px", "duration: 3.2s", "easing: linear"] },
    { kind: "STACK", type: "tags", items: ["@keyframes", "transform: rotate", "position: absolute"] },
    {
      kind: "ITERATIONS",
      type: "versions",
      items: [
        { label: "v1", final: false },
        { label: "v2", final: false },
        { label: "v3", final: false },
        { label: "final", final: true },
      ],
    },
  ],
};
