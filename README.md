# Vue 3.5 + TypeScript Starter Kit

Deze Vue.js applicatie is volledig omgezet naar TypeScript met Vue 3.5 en de Composition API. Het project demonstreert moderne Vue.js ontwikkeling met type-safe code.

## ✨ Kenmerken

- **Vue 3.5** met Composition API
- **TypeScript** voor volledige type safety
- **Pinia** voor state management met types
- **Vite** voor snelle development
- **TailwindCSS** voor styling
- **Custom Composables** met TypeScript
- **Type-safe Components** met defineProps en defineEmits

## 🏗️ Project Structuur

```
src/
├── main.ts                     # Entry point met TypeScript
├── App.vue                     # Hoofd component met <script setup lang="ts">
├── components/
├── composables/
│   └── useApi.ts               # API composable met generics
├── stores/
│   └── sample.ts               # Pinia store met TypeScript
└── types/
    └── index.ts                # Gedeelde type definities
```

## 🚀 Scripts

```bash
# Development server starten
npm run dev

# TypeScript type checking
npm run type-check

# Build voor productie
npm run build

# Preview build
npm run preview
```

## 💡 TypeScript Kenmerken

### 1. Composition API met Types

```typescript
// Reactive refs met expliciete typing
const count = ref<number>(0)
const message = ref<string>('Hello TypeScript!')

// Computed properties met type inference
const doubleCount = computed(() => count.value * 2)

// Methods met expliciete return types
const increment = (): void => {
  count.value++
}
```

### 2. Type-safe Component Props

```typescript
interface Props {
  title: string
  count?: number
  isVisible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  isVisible: true
})
```

### 3. Event Emits met Types

```typescript
interface Emits {
  (e: 'increment'): void
  (e: 'update:count', value: number): void
  (e: 'click', event: MouseEvent): void
}

const emit = defineEmits<Emits>()
```

### 4. Pinia Store met TypeScript

```typescript
interface SampleData {
  sampleName: string
}

export const useSampleStore = defineStore('sample', () => {
  const sampleName = ref<string>('Sample Name')
  
  function exportSample(): SampleData {
    return { sampleName: sampleName.value }
  }
  
  return { sampleName, exportSample }
})
```

### 5. Custom Composables

Custom composables can be created with full TypeScript support for reusable logic across your application.

## 🔧 TypeScript Configuratie

- **tsconfig.json**: Strict TypeScript configuratie
- **Type checking**: Ingebouwd in build proces
- **Vue SFC support**: Volledige TypeScript support in .vue bestanden
- **Path mapping**: @/ alias voor src/ directory
- **IDE support**: IntelliSense en type checking in VS Code

## 📚 Vue 3.5 + TypeScript Best Practices

1. **Gebruik expliciete types** voor reactive refs
2. **Definieer interfaces** voor props en emits
3. **Type je stores** met TypeScript
4. **Maak herbruikbare composables** met generics
5. **Gebruik strict TypeScript** configuratie
6. **Documenteer types** in aparte bestanden

## 🔗 Nuttige Links

- [Vue 3 TypeScript Guide](https://vuejs.org/guide/typescript/composition-api.html)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia TypeScript](https://pinia.vuejs.org/cookbook/composables.html)
- [Vite TypeScript](https://vitejs.dev/guide/features.html#typescript)
