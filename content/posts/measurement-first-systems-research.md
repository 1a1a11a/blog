---
title: Measurement-first systems research
date: 2026-04-08
category: Systems
excerpt: The most useful systems I have built started not with a design, but with a long, uncomfortable look at how the existing system actually behaved in production.
readTime: 6 min read
---

It is tempting to start a systems project with an architecture diagram. I have
learned to start somewhere less glamorous: traces, logs, and a question I
cannot yet answer about how the current system behaves.

## What the workload knows

Designs encode assumptions. Workloads encode reality. When the two disagree,
the workload wins — usually at 3 a.m., in production, at scale. Spending weeks
characterizing real request patterns before writing a line of the new system
has repeatedly saved me from elegant solutions to problems that did not exist.

Open, reproducible measurement is also how a field makes progress. A new
eviction policy or storage layout is only believable if others can run it
against the same workloads and see the same result. That conviction is why I
invest so heavily in tools like **libCacheSim** — shared infrastructure lets
the community argue about ideas instead of about benchmarks.

## A loop, not a line

The research I am proudest of looks like a loop:

1. Measure how the deployed system behaves under real load.
2. Find the gap between that behavior and what is theoretically possible.
3. Design the smallest mechanism that closes the gap.
4. Deploy it, measure again, and discover the next gap.

Each turn of the loop makes the next design less speculative. Over time the
system stops being something you imposed on the workload and becomes something
the workload taught you to build.
