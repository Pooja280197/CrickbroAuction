# Sidebar Toggle Button Implementation

## Overview
Successfully implemented a collapsible sidebar toggle button for the Auction Details page. The sidebar now smoothly collapses and expands on medium screens and above.

## Changes Made

### File: `src/pages/AuctionDetails.jsx`

#### 1. **Imports Added**
- Added `ChevronLeft` and `ChevronRight` icons from `lucide-react` for the toggle button

```jsx
import {
  Info,
  Gavel,
  Users,
  Shield,
  BarChart3,
  UserCircle,
  Trophy,
  UserCheck,
  FlaskConical,
  CalendarClock,
  Settings,
  Layers,
  ChevronLeft,      // New
  ChevronRight,     // New
} from "lucide-react";
```

#### 2. **State Management Added**
- Added a new state variable `sidebarCollapsed` to track the collapse/expand state

```jsx
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
```

#### 3. **Toggle Button Implementation**
- Added a button at the top of the sidebar that toggles collapse state
- Button only shows on medium screens and above (`hidden md:flex`)
- Displays different icons based on state:
  - **Expanded**: `ChevronLeft` icon with "Collapse" label
  - **Collapsed**: `ChevronRight` icon only
- Includes hover effects and smooth transitions

```jsx
<button
  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
  className="hidden md:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition mb-2"
  title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
>
  {sidebarCollapsed ? (
    <ChevronRight className="w-4 h-4" />
  ) : (
    <ChevronLeft className="w-4 h-4" />
  )}
  {!sidebarCollapsed && <span className="text-xs font-medium">Collapse</span>}
</button>
```

#### 4. **Sidebar Layout Changes**
- Dynamic column span that transitions between states:
  - **Expanded**: `md:col-span-3` (3 columns)
  - **Collapsed**: `md:col-span-1` (1 column)
- Smooth transition with `transition-all duration-300` for 0.3s animation

```jsx
<aside className={`col-span-12 transition-all duration-300 ${sidebarCollapsed ? "md:col-span-1" : "md:col-span-3"}`}>
```

#### 5. **Tab Buttons Responsive Layout**
- Tab buttons now use `justify-center md:justify-start` to center icons when collapsed
- Icon remains visible, labels hidden when collapsed
- Added `flex-shrink-0` to icons to prevent shrinking
- `title` attribute shows tab label as tooltip when collapsed

```jsx
<button
  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition justify-center md:justify-start
    ${isActive ? "bg-[var(--color-primary)] text-white shadow" : "text-white/70 hover:bg-white/10"}`}
  title={sidebarCollapsed ? tab.label : undefined}
>
  <Icon className="w-4 h-4 flex-shrink-0" />
  {!sidebarCollapsed && <span>{tab.label}</span>}
</button>
```

#### 6. **CTA Button Visibility**
- "Register/Enroll" button in sidebar only shows when sidebar is expanded
- Maintains clean appearance when sidebar is collapsed

```jsx
{!sidebarCollapsed && (
  <div className="rounded-xl bg-[#154947] p-4 text-white mt-3">
    {/* Register button content */}
  </div>
)}
```

#### 7. **Content Section Responsive Layout**
- Content section adjusts width based on sidebar state:
  - **Sidebar Expanded**: `md:col-span-9` (9 columns)
  - **Sidebar Collapsed**: `md:col-span-11` (11 columns)
- Smooth transition with `transition-all duration-300`

```jsx
<section className={`col-span-12 transition-all duration-300 ${sidebarCollapsed ? "md:col-span-11" : "md:col-span-9"}`}>
```

## Features

✅ **Smooth Animations** - All transitions use 0.3s ease timing
✅ **Responsive Design** - Works seamlessly on all screen sizes
✅ **Icon Feedback** - Visual icons change to indicate state
✅ **Tooltip Support** - Hover to see tab labels when collapsed
✅ **Mobile Friendly** - Toggle hidden on mobile, shows on medium+ screens
✅ **Maintains Functionality** - All tabs and buttons work when collapsed
✅ **Clean UI** - Uses existing color scheme and design patterns

## Technical Details

- **State**: Uses local component state via `useState`
- **Animation**: Tailwind CSS transitions for smooth collapse/expand
- **Icons**: Lucide React icons (ChevronLeft, ChevronRight)
- **Breakpoint**: Hidden on `sm` and `md` breakpoints, visible on `lg+`
- **Duration**: 300ms smooth transition

## Usage

The toggle button is automatically available on the Auction Details page. Simply click the button at the top of the sidebar to collapse or expand it. The state resets when you navigate away from the page.

## Browser Support

Works on all modern browsers that support:
- CSS Grid
- CSS Transitions
- React 17+
- Tailwind CSS v3+

## Future Enhancements

Optional improvements:
- Persist sidebar state to localStorage
- Add keyboard shortcut (e.g., Ctrl+B)
- Add animation to individual tab items
- Add settings to customize toggle behavior
