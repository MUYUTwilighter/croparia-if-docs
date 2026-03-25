---
title: Content Inheritance Model
outline: deep
---

# Content Inheritance Model

This is the key mechanism prepared for long-term multi-version maintenance.

## Rules

- every release starts from the shared `base` pages
- release-specific files then override matching paths
- future releases can also declare inheritance chains in version metadata

## Current Convention

- shared pages live in `content/versioned/base/<locale>/`
- current release pages live in `content/versioned/releases/1.1.0a/<locale>/`
- archived release pages will live in `content/versioned/releases/<version>/<locale>/`

## Maintenance Guidance

- keep only truly cross-version content in `base`
- create override files only when behavior or wording really changes
- if a page keeps splitting, extract smaller shared partials or components
