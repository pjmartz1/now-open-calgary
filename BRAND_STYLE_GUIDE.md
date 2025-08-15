# Now Open Calgary - Brand Style Guide

## Logo Concept

The "Now Open Calgary" logo represents a modern, geometric interpretation of opportunity and discovery. Inspired by 21st.dev's clean design philosophy, the logo combines:

- **Opening Door**: Central metaphor for "now open" businesses
- **Calgary Mountains**: Subtle silhouette representing the city's iconic landscape
- **Location Discovery**: Small pin dot suggesting finding new businesses
- **Professional Gradient**: Sophisticated color progression from indigo to pink

## Logo Files

- `/logo.svg` - Primary logo (40x40px)
- `/logo-horizontal.svg` - Horizontal layout (160x40px)
- `/logo-stacked.svg` - Stacked version for mobile (80x100px)
- `/logo-dark.svg` - Dark mode variant
- `/favicon.svg` - Simplified favicon version (32x32px)

## Color Palette

### Primary Colors (21st.dev Inspired)
- **Indigo**: `#4f46e5` - Primary brand color
- **Purple**: `#7c3aed` - Bridge/accent color  
- **Pink**: `#db2777` - Secondary brand color
- **Slate**: `#0f172a` - Rich dark text
- **Gray**: `#64748b` - Medium gray text

### Gradients
```css
/* Primary Brand Gradient */
background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #db2777 100%);

/* Text Gradient */
background: linear-gradient(to right, #4f46e5, #7c3aed, #db2777);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

## Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallbacks**: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Features**: OpenType features enabled for improved readability

### Typography Scale
```css
/* Logo Text */
.logo-primary {
  font-weight: 800; /* Extra Bold */
  font-size: 1.125rem; /* 18px */
  letter-spacing: -0.025em; /* Tight */
}

.logo-secondary {
  font-weight: 600; /* Semi Bold */
  font-size: 0.875rem; /* 14px */
  letter-spacing: 0.05em; /* Wide */
}
```

## Component Implementation

### Header Logo (Current)
```jsx
<Link href="/" className="flex items-center space-x-3 group">
  <div className="relative w-10 h-10 transition-all duration-300 group-hover:scale-105 group-hover:rotate-1">
    <Image
      src="/logo.svg"
      alt="Now Open Calgary Logo"
      fill
      className="object-contain"
      priority
    />
  </div>
  <div className="hidden sm:block">
    <div className="text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
      Now Open
    </div>
    <div className="text-sm font-semibold text-slate-600 tracking-wide">
      Calgary
    </div>
  </div>
</Link>
```

### Responsive Variations

#### Mobile Logo (Stacked)
```jsx
<div className="sm:hidden">
  <Image src="/logo-stacked.svg" alt="Now Open Calgary" width={80} height={100} />
</div>
```

#### Horizontal Logo (Footer/Marketing)
```jsx
<Image src="/logo-horizontal.svg" alt="Now Open Calgary" width={160} height={40} />
```

## Micro-Interactions

### Logo Hover States
- **Scale**: 105% scale on hover
- **Rotation**: 1 degree rotation
- **Duration**: 300ms smooth transition
- **Easing**: CSS `ease-out`

### Button Gradients
```css
.gradient-button {
  background: linear-gradient(to right, #4f46e5, #7c3aed, #db2777);
  transition: all 300ms ease;
}

.gradient-button:hover {
  background: linear-gradient(to right, #4338ca, #6d28d9, #be185d);
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
}
```

## Design Principles (21st.dev Inspired)

### 1. Minimal Sophistication
- Clean lines and geometric shapes
- Purposeful use of gradients
- Generous white space

### 2. Professional Approachability
- Warm color palette balances professionalism
- Friendly micro-interactions
- Clear hierarchy and readability

### 3. Technical Precision
- Pixel-perfect alignment
- Consistent spacing (4px grid)
- Optimized SVG code

### 4. Scalable Design
- Works from 16px favicon to large marketing materials
- Maintains clarity at all sizes
- Responsive typography

## Usage Guidelines

### ✅ Do
- Use on white or very light backgrounds
- Maintain minimum clear space of 8px around logo
- Use provided color values exactly
- Scale proportionally

### ❌ Don't
- Distort or stretch the logo
- Use on busy or dark backgrounds (use dark variant instead)
- Separate logo elements
- Use outdated color values
- Add effects like drop shadows or outlines

## Accessibility

- **Contrast Ratio**: Meets WCAG AA standards (4.5:1 minimum)
- **Alt Text**: Descriptive alternative text provided
- **Focus States**: Clear focus indicators for keyboard navigation
- **Screen Readers**: Semantic HTML structure

## Performance

- **SVG Format**: Scalable, small file size
- **Optimized Code**: Clean, minimal SVG markup
- **Font Loading**: Inter font loaded efficiently with display: swap
- **Critical Path**: Logo marked as priority for fast loading

---

*This brand style guide ensures consistent implementation of the "Now Open Calgary" visual identity across all platforms and materials.*