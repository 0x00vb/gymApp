### Workout App Technical Specifications

## Color Palette

### Primary Colors

- **Primary Blue**: `hsl(217, 91%, 60%)` / `#3b82f6`
- **Background**: `hsl(222.2, 84%, 4.9%)` / Dark blue-black
- **Foreground (Text)**: `hsl(210, 40%, 98%)` / Off-white

### Dark Theme Tiers

- **Dark (Default)**: `hsl(222.2, 84%, 4.9%)`
- **Dark-100**: `hsl(223, 84%, 3%)`
- **Dark-200**: `hsl(223, 84%, 2%)`
- **Dark-300**: `hsl(223, 84%, 1%)`

### UI Elements

- **Card Background**: `#0c1424` (bg-card-dark)
- **Card Darker**: `#080e1a` (bg-card-darker)
- **Gradient Background**: Linear gradient from `#0f172a` to `#0c1424`
- **Primary Button Hover**: Primary color with 20% opacity
- **Secondary/Muted**: `hsl(217.2, 32.6%, 17.5%)`
- **Destructive**: `hsl(0, 62.8%, 30.6%)`
- **Border**: `hsl(217.2, 32.6%, 17.5%)`

### Accent Colors

- **Success/Positive**: Green (`bg-green-500/20`, `text-green-400`)
- **Error/Negative**: Red (`bg-red-500/20`, `text-red-400`)

## Typography

- **Base Font**: System font stack (Tailwind default)
- **Headings**:
- Page Title: `text-3xl font-bold tracking-tight`
- Card Title: `text-xl font-bold`
- Section Title: `text-lg font-medium`
- **Body Text**: `text-sm` (default)
- **Small Text**: `text-xs` (metadata, labels)

## Technical Implementation

### Framework & Libraries

- **Framework**: Next.js (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Charts**: Recharts (for statistics)

### Component Structure

- **Layout**: Flex and Grid-based layouts
- **Navigation**: Tab-based navigation with fixed bottom bar
- **Modals**: Dialog components for forms and detailed views
- **Cards**: Card components for content containers
- **Tables**: Custom table components for data display

### Responsive Design

- **Container**: Max width of `md` (768px)
- **Mobile-First**: All components designed for mobile first
- **Breakpoints**: Standard Tailwind breakpoints (sm, md, lg, xl, 2xl)

### Special UI Elements

- **Gradient Background**: `bg-dark-gradient` utility class
- **Card Styles**: Two-tier card system (dark and darker)
- **Progress Indicators**: Percentage change with directional indicators
- **Scrollable Areas**: `ScrollArea` component for content overflow

### Animations & Transitions

- **Hover Effects**: Subtle background color changes
- **Transitions**: `transition-all` for smooth state changes
- **Card Hover**: `hover:shadow-lg` for subtle elevation

### Accessibility

- **Color Contrast**: High contrast between text and backgrounds
- **Focus States**: Visible focus indicators
- **Screen Reader**: `sr-only` text for icon-only buttons
- **Semantic HTML**: Proper heading hierarchy and ARIA attributes

This color palette and design system creates a sleek, dark-themed workout tracking app with blue accent colors, providing strong visual hierarchy and readability while maintaining a modern, minimalist aesthetic.
