# Internationalization (i18n) System

This project uses **react-i18next** for comprehensive language translation support with English and Arabic languages, including RTL (Right-to-Left) layout support.

## 🌐 **Features**

- ✅ **Multi-language support**: English (en) and Arabic (ar)
- ✅ **RTL/LTR support**: Automatic layout direction switching
- ✅ **Language persistence**: User's language choice saved to localStorage
- ✅ **Auto-detection**: Browser language detection
- ✅ **Typed hooks**: TypeScript-safe translation hooks
- ✅ **Specialized hooks**: Section-specific translation hooks
- ✅ **Utility functions**: Date formatting, number formatting
- ✅ **CSS utilities**: RTL-aware styling classes

## 📁 **File Structure**

```
src/i18n/
├── index.ts                    # Main i18n configuration
├── LanguageContext.tsx         # Language context and provider
├── hooks/
│   └── useTranslations.ts      # Translation hooks and utilities
├── locales/
│   ├── en.json                 # English translations
│   └── ar.json                 # Arabic translations
└── README.md                   # This documentation
```

## 🚀 **Getting Started**

### 1. Use Translation Hooks in Components

```tsx
import { useAnomalyTranslations, useCommonTranslations } from '@/i18n/hooks/useTranslations';

const MyComponent = () => {
  const anomalyT = useAnomalyTranslations();
  const commonT = useCommonTranslations();

  return (
    <div>
      <h1>{anomalyT.title}</h1>
      <button>{commonT.save}</button>
    </div>
  );
};
```

### 2. Use the Language Switcher

```tsx
import { LanguageSwitcher } from '@/components/ui/language-switcher';

// Add to your header/navbar
<LanguageSwitcher />
```

### 3. Check Current Language and RTL State

```tsx
import { useTranslations } from '@/i18n/hooks/useTranslations';

const MyComponent = () => {
  const { language, isRTL, changeLanguage } = useTranslations();

  return (
    <div className={isRTL ? 'text-end' : 'text-start'}>
      Current language: {language}
      <button onClick={() => changeLanguage('ar')}>
        Switch to Arabic
      </button>
    </div>
  );
};
```

## 📚 **Available Translation Hooks**

### General Hooks
- `useTranslations()` - Main hook with language state
- `useCommonTranslations()` - Common UI elements
- `useNavigationTranslations()` - Navigation items
- `useValidationTranslations()` - Form validation messages

### Domain-Specific Hooks
- `useAnomalyTranslations()` - Anomaly-related terms
- `useAnomalyStatusTranslations()` - Anomaly status values
- `useMaintenanceTranslations()` - Maintenance-related terms
- `useCriticalityTranslations()` - Criticality levels
- `useTimeTranslations()` - Time-related terms
- `useAuthTranslations()` - Authentication terms

### Utility Functions
- `formatDate(date, language)` - Locale-aware date formatting
- `formatNumber(number, language)` - Locale-aware number formatting
- `translateStatus(status, t)` - Status translation helper

## 🎨 **RTL Styling**

### RTL-Aware CSS Classes

The project includes CSS utilities for proper RTL support:

```css
/* Margin utilities */
.ms-4  /* margin-inline-start: 1rem */
.me-4  /* margin-inline-end: 1rem */

/* Padding utilities */
.ps-4  /* padding-inline-start: 1rem */
.pe-4  /* padding-inline-end: 1rem */

/* Text alignment */
.text-start  /* text-align: start (left in LTR, right in RTL) */
.text-end    /* text-align: end (right in LTR, left in RTL) */

/* Position utilities */
.start-0  /* inset-inline-start: 0 */
.end-0    /* inset-inline-end: 0 */
```

### Icon Flipping for RTL

For icons that should flip in RTL (like arrows):

```tsx
<ArrowLeft className="h-4 w-4 flip-rtl" />
```

### RTL-Aware Animations

```css
.animate-slide-in-start  /* Slides from the start direction */
.animate-slide-in-end    /* Slides from the end direction */
```

## 📝 **Adding New Translations**

### 1. Add to Translation Files

**English (`src/i18n/locales/en.json`)**:
```json
{
  "mySection": {
    "newKey": "New English Text",
    "anotherKey": "Another English Text"
  }
}
```

**Arabic (`src/i18n/locales/ar.json`)**:
```json
{
  "mySection": {
    "newKey": "النص الجديد بالعربية",
    "anotherKey": "نص آخر بالعربية"
  }
}
```

### 2. Create/Update Hook

**Add to `src/i18n/hooks/useTranslations.ts`**:
```tsx
export const useMySection = () => {
  const { t } = useTranslation();
  
  return {
    newKey: t('mySection.newKey'),
    anotherKey: t('mySection.anotherKey'),
  };
};
```

### 3. Use in Components

```tsx
import { useMySection } from '@/i18n/hooks/useTranslations';

const MyComponent = () => {
  const mySectionT = useMySection();
  
  return <span>{mySectionT.newKey}</span>;
};
```

## 🔧 **Configuration**

### Language Detection Order

Languages are detected in this order:
1. `localStorage` (user's saved preference)
2. Browser language (`navigator.language`)
3. HTML `lang` attribute
4. Fallback to English

### Supported Languages

Currently supported languages:
- **English (en)** - Default/fallback language
- **Arabic (ar)** - RTL language

### Adding New Languages

1. Create new translation file: `src/i18n/locales/[language-code].json`
2. Add language to `availableLanguages` in `LanguageContext.tsx`
3. Add to RTL languages array if needed
4. Import and add to resources in `src/i18n/index.ts`

## 🎯 **Best Practices**

### 1. Use Semantic Keys
```json
// ✅ Good
{
  "anomaly": {
    "title": "Title",
    "status": "Status"
  }
}

// ❌ Bad
{
  "title": "Title",
  "status1": "Status"
}
```

### 2. Use Specialized Hooks
```tsx
// ✅ Good
const anomalyT = useAnomalyTranslations();
return <span>{anomalyT.title}</span>;

// ❌ Bad (but works)
const { t } = useTranslations();
return <span>{t('anomaly.title')}</span>;
```

### 3. Handle RTL Layouts
```tsx
// ✅ Good - Direction-aware
<div className="flex items-center gap-2">
  <span>{text}</span>
  <ArrowRight className="h-4 w-4 flip-rtl" />
</div>

// ❌ Bad - LTR only
<div className="flex items-center gap-2">
  <span>{text}</span>
  <ArrowRight className="h-4 w-4" />
</div>
```

### 4. Use Utility Functions
```tsx
// ✅ Good
const { language } = useTranslations();
const formattedDate = formatDate(anomaly.createdAt, language);

// ❌ Bad
const formattedDate = new Date(anomaly.createdAt).toLocaleDateString();
```

## 🐛 **Troubleshooting**

### Missing Translations
- Check if the key exists in both `en.json` and `ar.json`
- Verify the key path is correct
- Ensure the translation hook is importing the correct namespace

### RTL Layout Issues
- Use logical properties (`start`/`end` instead of `left`/`right`)
- Add `flip-rtl` class to directional icons
- Use RTL-aware CSS utilities

### Performance Issues
- Translation resources are loaded inline for better performance
- Avoid using the generic `t()` function in loops
- Use specialized hooks instead of generic translation calls

## 📈 **Migration Guide**

To migrate existing hardcoded strings:

1. **Identify the text**: Find hardcoded strings in components
2. **Categorize**: Determine which section the text belongs to
3. **Add to translations**: Add to both language files
4. **Update hooks**: Add to appropriate translation hook
5. **Replace in component**: Use the translation hook
6. **Test**: Verify in both languages

### Example Migration

**Before:**
```tsx
return <button>Save Changes</button>;
```

**After:**
```tsx
const commonT = useCommonTranslations();
return <button>{commonT.save}</button>;
```

## 🚀 **Next Steps**

To complete the i18n implementation:

1. **Update all components** to use translation hooks
2. **Add Language Switcher** to the header component
3. **Test RTL layout** in Arabic mode
4. **Add more languages** as needed
5. **Implement form validation** with translated messages

---

For questions or issues with the translation system, refer to the [react-i18next documentation](https://react.i18next.com/) or check the implementation examples in the codebase. 