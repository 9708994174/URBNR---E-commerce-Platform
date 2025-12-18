# Tab Logo (Favicon) Location

## Where to Change the Tab Logo

The tab logo (favicon) is configured in the **`app/layout.tsx`** file.

### File Location:
```
app/layout.tsx
```

### Lines to Edit:
Lines **26-27** in `app/layout.tsx`:

```typescript
icons: {
  icon: "/placeholder-logo.svg",
  apple: "/apple-icon.png",
},
```

### How to Change:

1. **Replace the logo file** in the `public` folder:
   - Current icon: `public/placeholder-logo.svg`
   - Apple icon: `public/apple-icon.png`

2. **Update the paths** in `app/layout.tsx`:
   - Change `/placeholder-logo.svg` to your new logo path (e.g., `/my-logo.svg`)
   - Change `/apple-icon.png` to your new Apple icon path (e.g., `/my-apple-icon.png`)

3. **Recommended file formats:**
   - **Icon**: SVG (scalable) or PNG (16x16, 32x32, or 48x48 pixels)
   - **Apple Icon**: PNG (180x180 pixels for iOS)

4. **File locations:**
   - Place your logo files in the `public` folder
   - Reference them with paths starting with `/` (e.g., `/logo.svg`)

### Example:
If you have a logo file named `company-logo.svg` in the `public` folder:

```typescript
icons: {
  icon: "/company-logo.svg",
  apple: "/company-logo.svg", // or use a separate Apple icon
},
```

### Additional Notes:
- The favicon appears in browser tabs
- The Apple icon is used when users add your site to their iOS home screen
- Clear your browser cache if the new logo doesn't appear immediately
- Next.js will automatically optimize these images


