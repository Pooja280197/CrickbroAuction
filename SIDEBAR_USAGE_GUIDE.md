# Quick Start Guide - Sidebar Toggle

## How to Use

1. **Navigate to Auction Details Page**
   - Go to any auction and click on it to see the details page
   - You'll see the sidebar on the left with all the tabs

2. **Click the Toggle Button**
   - Look for the button at the top of the sidebar with a left-pointing arrow icon
   - Click it to collapse the sidebar
   - The button changes to a right-pointing arrow when collapsed

3. **Expand Again**
   - Click the arrow button again to expand the sidebar
   - The sidebar smoothly slides back to show all tab labels

## Visual Behavior

### Expanded State
```
┌─────────────────┬─────────────────────────┐
│                 │                         │
│  Toggle ← ▼     │    Content Area         │
│  Tournament Info│  (9 columns)            │
│  Auction        │                         │
│  Players        │                         │
│  Manage Teams   │                         │
│  ... (labels)   │                         │
│                 │                         │
│ Register Button │                         │
│                 │                         │
│  (3 columns)    │                         │
└─────────────────┴─────────────────────────┘
```

### Collapsed State
```
┌──┬──────────────────────────────────┐
│  │                                  │
│→ │    Content Area                  │
│  │  (11 columns - expanded)         │
│ⓘ │                                  │
│  │  When you hover over icons,      │
│ℹ │  tooltips show the label         │
│  │                                  │
│⊕ │                                  │
│  │                                  │
│  │                                  │
│  │                                  │
│  │                                  │
│  │                                  │
│  │ (1 column icons only)            │
└──┴──────────────────────────────────┘
```

## Features You'll Notice

✅ **Smooth Animation**
   - The transition takes 300ms for a smooth effect
   - The content area grows/shrinks smoothly

✅ **Icon Hints**
   - When collapsed, hover over tab icons to see what they are
   - A tooltip appears showing the tab name

✅ **Mobile First**
   - On small screens, the toggle doesn't show
   - Full layout is responsive and works on all devices

✅ **Persistent During Session**
   - Your collapse preference lasts while you're on the page
   - Resets to expanded when you navigate back

## Device Support

| Device | Toggle Visible | Behavior |
|--------|---|---|
| Mobile (< 640px) | ❌ No | Full-width sidebar |
| Tablet (640px - 1024px) | ❌ No | Full-width sidebar |
| Desktop (> 1024px) | ✅ Yes | Toggle enabled |

## Keyboard & Accessibility

- Button is fully keyboard accessible (Tab key)
- Can be clicked with Enter or Space
- Hover tooltips on icons show labels
- ARIA-friendly design

## Tips

1. **Save Screen Space**
   - Collapse the sidebar on smaller monitors to see more content

2. **Quick Navigation**
   - Icons are arranged top-to-bottom for quick scanning
   - Color changes when tab is active

3. **Responsive Content**
   - Content doesn't overflow when you collapse
   - All text remains readable

## Troubleshooting

**Toggle button not showing?**
- Make sure you're on a desktop (>1024px width)
- The button is hidden on mobile/tablet

**Sidebar not collapsing?**
- Try refreshing the page
- Check browser console for errors

**Icons look strange?**
- Make sure lucide-react is properly installed
- Check if Tailwind CSS is working

## Code Location

The implementation is in:
```
src/pages/AuctionDetails.jsx
```

Key additions:
- Line 1-20: ChevronLeft, ChevronRight imports
- Line 101: `sidebarCollapsed` state variable
- Lines 285-296: Toggle button JSX
- Lines 331-344: Tab button responsive logic
- Lines 348-354: CTA button visibility logic
- Line 353: Content section responsive classes
