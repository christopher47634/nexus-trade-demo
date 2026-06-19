# 交互 Token 说明

## CSS 交互 Token

### Hover Token
```css
--hover-scale: 1.02;
--hover-brightness: 1.05;
--hover-shadow: 0 8px 32px rgba(0,0,0,0.12);
--transition-fast: 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
--transition-normal: 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### Active/Press Token
```css
--press-scale: 0.98;
--press-brightness: 0.95;
```

### Focus Token
```css
--focus-ring: 0 0 0 2px var(--accent);
--focus-offset: 2px;
```

### Demo Highlight Token
```css
--demo-glow: 0 0 20px rgba(99, 102, 241, 0.4);
--demo-border: 2px solid var(--accent);
--demo-pulse: pulse 2s ease-in-out infinite;
```

## Framer Motion Token

### Card Enter
```ts
initial: { opacity: 0, y: 16 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
```

### Hover Lift
```ts
whileHover: { y: -2, scale: 1.01 }
```

### Table Row Stagger
```ts
transition: { delay: index * 0.05 }
```

生成时间: 2026-06-19T04:17:04.814Z
