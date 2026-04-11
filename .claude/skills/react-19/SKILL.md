---
name: react-19
description: React 19 conventions and patterns for this codebase. Use when writing or modifying React components, hooks, forms, refs, context, or document metadata.
---

# React 19 Conventions

## Tech Stack
- React 19.2.5 with TypeScript
- React Router v7.14.0

## Conventions
- Use `ref` as a direct prop on function components — do NOT use `forwardRef`
- Use `use()` hook for reading promises and context
- Use Actions with `useTransition` and `useActionState` for async form handling
- Use `useOptimistic` for optimistic UI updates
- Use `<form action={...}>` with server/client actions — not `onSubmit` with manual state
- Prefer server components by default; use `'use client'` only when hooks or interactivity are needed
- Use `<Activity>` for pre-rendering and preserving hidden UI state (19.2+)
- No `useMemo`/`useCallback` for performance — rely on the React Compiler for auto-memoization
- Use native `<title>`, `<meta>`, `<link>` in components for document metadata
- Use `ref` cleanup functions (return a cleanup fn from ref callbacks)

## Do NOT
- Do not use `forwardRef` — ref is a regular prop in React 19
- Do not use legacy context (`contextType`, `getChildContext`)
- Do not use string refs
- Do not use `ReactDOM.render` — use `createRoot`
- Do not manually wrap async state updates in try/catch when Actions handle it
