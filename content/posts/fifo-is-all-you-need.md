---
title: Why FIFO is (almost) all you need for cache eviction
date: 2026-05-20
category: Research
excerpt: A simple first-in-first-out queue, given one quick second chance, beats far more complex eviction policies on real workloads. Here is the intuition behind S3-FIFO and SIEVE.
readTime: 8 min read
---

For decades, cache eviction has been a contest of cleverness. LRU tracks
recency, LFU tracks frequency, and a long line of adaptive policies tries to
balance the two with auxiliary data structures, tunable parameters, and locks
on the hot path. The conventional wisdom held that better hit ratios required
more bookkeeping.

Working across hundreds of production cache clusters, we kept noticing the
opposite. Most objects in a web cache are requested once and never again. The
expensive machinery built to rank "warm" objects spends most of its energy
managing items that will never be reused.

## One queue, one second chance

The core idea behind **S3-FIFO** and **SIEVE** is almost embarrassingly small:
keep a plain FIFO queue, and give an object exactly one chance to prove it is
worth keeping. New objects enter at the head. When the cache is full, we scan
from the tail; an object that was requested since it was inserted survives and
moves on, while an object that was never reused is evicted immediately.

This quickly filters out the flood of one-hit objects without ever promoting
them, so the limited cache space is spent on the items that actually repeat.

> Simplicity is not a constraint we accepted reluctantly. On real workloads it
> turned out to be the source of the performance.

## Why it matters in production

A FIFO-based design is not just competitive on hit ratio. Because it avoids
per-request promotions and the locking they require, it is dramatically more
scalable on multi-core machines and far friendlier to flash, where every
rewrite costs endurance.

That combination — comparable or better hit ratios with a fraction of the
complexity — is why these algorithms have been adopted in production at
companies and open-source projects far beyond where they started.

The lesson I keep returning to: before adding a parameter, ask what the data
is actually asking for.
