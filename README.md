# Participant Facing Interface

A Vue 3 project with Storybook set up, featuring a simple Button component.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run Storybook:
```bash
npm run storybook
```

Storybook will open at `http://localhost:6006`

## Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run storybook` - Start Storybook dev server
- `npm run build-storybook` - Build Storybook for static deployment

## Components

### Button

A simple, customizable button component with multiple variants and sizes.

**Props:**
- `label` (String): Button text
- `variant` (String): One of 'primary', 'secondary', 'danger', 'success'
- `size` (String): One of 'small', 'medium', 'large'
- `disabled` (Boolean): Whether the button is disabled

**Events:**
- `click`: Emitted when button is clicked

## Storybook

The Button component has multiple stories showcasing different variants, sizes, and states. Open Storybook to see all the examples and interact with the component.

