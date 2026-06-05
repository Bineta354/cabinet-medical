# Guide d'Optimisation Responsive - Cabinet Médical

## Vue d'ensemble

Ce guide fournit des recommandations pour optimiser l'utilisation de l'espace écran et créer une interface responsive efficace pour toutes les tailles d'appareils.

---

## 1. BREAKPOINTS TAILWIND CSS

L'application utilise les breakpoints suivants :

```
xs:  360px  (très petits téléphones)
sm:  640px  (téléphones standards)
md:  768px  (tablettes)
lg:  1024px (laptops)
xl:  1280px (desktops)
2xl: 1536px (très grands écrans)
```

---

## 2. ESPACEMENT RESPONSIVE - MEILLEURES PRATIQUES

### ❌ À ÉVITER
```jsx
// Espacement fixe sans responsivité
<div className="p-6 gap-6">
```

### ✅ À FAIRE
```jsx
// Espacement responsive
<div className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
```

### Tableau d'espacement recommandé

| Élément | Mobile (xs) | Tablette (md) | Desktop (lg) |
|---------|-----------|-------------|-----------|
| Padding global | `p-2` | `p-4` | `p-6` |
| Gap grille | `gap-2` | `gap-4` | `gap-6` |
| Marge boutons | `m-1` | `m-2` | `m-3` |
| Padding cartes | `p-3` | `p-4` | `p-6` |

---

## 3. CARTES ET CONTENEURS

### Cartes Responsive
```jsx
// ✅ Correct - Avec padding responsive
<div className="card p-3 xs:p-4 sm:p-4 md:p-5 lg:p-6 rounded-2xl md:rounded-3xl">
  {/* Contenu */}
</div>
```

### Grilles de Statistiques
```jsx
// ✅ Correct - Nombre de colonnes responsive
<div className="grid-stats grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
  {items.map(item => <div key={item.id} className="card-stats">{item}</div>)}
</div>
```

---

## 4. FORMULAIRES ET INPUTS

### Inputs Responsifs
```jsx
// ✅ Correct - Padding et taille police responsive
<input 
  className="input px-2 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2.5 md:px-4 md:py-3 text-xs xs:text-sm sm:text-base md:text-base"
/>
```

### Labels et Formulaires
```jsx
// ✅ Correct - Layout responsive
<div className="flex flex-col md:flex-row gap-2 xs:gap-3 sm:gap-4 md:gap-6">
  <label className="text-xs xs:text-sm sm:text-base md:text-base font-medium">Email</label>
  <input className="input flex-1" />
</div>
```

---

## 5. TABLEAUX RESPONSIFS

### Tableaux sur Mobile
```jsx
// ✅ Correct - Tableaux responsive
<div className="overflow-x-auto">
  <table className="min-w-full">
    <thead>
      <tr>
        <th className="text-xs xs:text-xs sm:text-sm md:text-base px-1 xs:px-2 sm:px-3 py-1.5 xs:py-2 sm:py-3">Nom</th>
        <th className="text-xs xs:text-xs sm:text-sm md:text-base px-1 xs:px-2 sm:px-3 py-1.5 xs:py-2 sm:py-3">Statut</th>
      </tr>
    </thead>
  </table>
</div>
```

**Conseil :** Réduire le padding des cellules sur mobile :
- Mobile : `px-1 py-1.5` (4px × 6px)
- Tablet : `px-2 py-2` (8px × 8px)
- Desktop : `px-3 py-3` (12px × 12px)

---

## 6. BOUTONS RESPONSIFS

### Boutons Adaptés
```jsx
// ✅ Correct - Boutons responsifs
<button className="btn px-3 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 text-xs xs:text-xs sm:text-sm md:text-base">
  Action
</button>

// ✅ Boutons d'icônes (plus compacts)
<button className="btn-icon p-1.5 xs:p-2 sm:p-2.5 md:p-3">
  <Icon />
</button>
```

---

## 7. TYPOGRAPHIE RESPONSIVE

### Tailles de Texte
```jsx
// ❌ À ÉVITER - Taille fixe
<h1 className="text-2xl">Titre</h1>

// ✅ À FAIRE - Taille responsive
<h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold">Titre</h1>
<p className="text-xs xs:text-sm sm:text-base md:text-base">Paragraphe</p>
```

### Tableau de Typographie Recommandée

| Élément | XS | SM | MD | LG |
|---------|----|----|----|----|
| H1 | `text-lg` | `text-xl` | `text-2xl` | `text-3xl` |
| H2 | `text-base` | `text-lg` | `text-xl` | `text-2xl` |
| H3 | `text-sm` | `text-base` | `text-lg` | `text-xl` |
| Body | `text-xs` | `text-sm` | `text-base` | `text-base` |
| Small | `text-xs` | `text-xs` | `text-xs` | `text-sm` |

---

## 8. UTILISER LE HOOK `useResponsive`

```jsx
import { useResponsive } from '../hooks/useResponsive';

function MonComposant() {
  const { isMobile, isTablet, isDesktop, width, getGridColumns, getPadding } = useResponsive();

  return (
    <div className={`p-${getPadding()}`}>
      {isMobile && <p>Vue Mobile</p>}
      {isTablet && <p>Vue Tablet</p>}
      {isDesktop && <p>Vue Desktop</p>}
      
      <div style={{ gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)` }}>
        {/* Contenu */}
      </div>
    </div>
  );
}
```

---

## 9. NAVIGATION ET SIDEBAR

### Sidebar Responsive
```jsx
// ✅ Correct - Sidebar qui s'adapte
<div className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
  {/* Navigation */}
</div>

// Items du sidebar
<a className="flex items-center px-2 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-3 text-xs xs:text-xs sm:text-sm">
  <Icon className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 mr-2 xs:mr-2 sm:mr-3" />
  <span className={isCollapsed ? 'hidden' : ''}>Label</span>
</a>
```

---

## 10. MODALES ET POPUPS

### Modales Responsives
```jsx
// ✅ Correct - Modale responsive
<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 xs:p-3 sm:p-4 md:p-8">
  <div className="bg-white rounded-2xl p-3 xs:p-4 sm:p-6 md:p-8 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto">
    {/* Contenu */}
  </div>
</div>
```

---

## 11. OPTIMISATIONS PERFORMANCE

### Images Responsive
```jsx
// ✅ Utiliser srcset pour les images
<img 
  src="image-small.jpg"
  srcSet="image-320.jpg 320w, image-640.jpg 640w, image-1024.jpg 1024w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1000px"
  alt="Description"
  className="w-full h-auto"
/>

// ✅ Lazy loading
<img loading="lazy" src="..." alt="..." />
```

### Réduction des Rendus
```jsx
// Utiliser React.memo pour les composants qui ne changent pas souvent
export const CartePatient = React.memo(({ patient }) => {
  return <div className="card p-3 xs:p-4 sm:p-5">{patient.nom}</div>;
});
```

---

## 12. DÉBORDEMENTS À ÉVITER

### ❌ Éviter les débordements horizontaux
```jsx
// Mauvais - Crée un débordement horizontal
<div className="w-full overflow-hidden">
  <table>
    <tr>
      <td className="w-200">Colonne très large</td>
    </tr>
  </table>
</div>
```

### ✅ Utiliser le scroll horizontal
```jsx
// Bon - Scroll horizontal sur mobile si nécessaire
<div className="overflow-x-auto max-w-full">
  <table className="min-w-full">
    {/* Contenu */}
  </table>
</div>
```

---

## 13. TEMPLATE RESPONSIVE COMPLET

```jsx
import { useResponsive } from '../hooks/useResponsive';

function Dashboard() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <div className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6">
      {/* Header */}
      <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mb-2 xs:mb-3 sm:mb-4 md:mb-6">
        Tableau de Bord
      </h1>

      {/* Grille Stats */}
      <div className="grid-stats grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-4 xs:mb-5 sm:mb-6 md:mb-8">
        {stats.map(stat => (
          <div key={stat.id} className="card-stats p-3 xs:p-4 sm:p-4 md:p-5 lg:p-6">
            <h3 className="text-xs xs:text-sm sm:text-base font-semibold">{stat.label}</h3>
            <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mt-1 xs:mt-1.5 sm:mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Contenu Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <div className="md:col-span-2 card p-3 xs:p-4 sm:p-4 md:p-5 lg:p-6">
          {/* Contenu 2/3 */}
        </div>
        <div className="card p-3 xs:p-4 sm:p-4 md:p-5 lg:p-6">
          {/* Sidebar 1/3 */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
```

---

## 14. CHECKLIST D'OPTIMISATION

Avant de publier, vérifiez :

- [ ] Tous les espacements utilisent les breakpoints (`xs:`, `sm:`, `md:`, `lg:`)
- [ ] Les grilles s'adaptent correctement (1 col mobile, 2+ col desktop)
- [ ] Les tableaux ne créent pas de débordement horizontal
- [ ] Les images sont responsives avec srcset
- [ ] Les boutons/inputs ont une taille suffisante sur mobile (min 44px de hauteur)
- [ ] Le texte est lisible sur tous les écrans
- [ ] Pas de texte qui déborde de son conteneur
- [ ] Les modales/popovers sont responsive
- [ ] Testé sur : iPhone (375px), Tablet (768px), Desktop (1280px)

---

## 15. RESSOURCES SUPPLÉMENTAIRES

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Mobile First Approach](https://www.mobileapproach.com/)
- [Testing Responsive Design](https://responsively.app/)

---

## Questions Fréquentes

### Q: Dois-je toujours utiliser tous les breakpoints ?
**R:** Non, utilisez seulement ceux pertinents. Exemple : `p-2 sm:p-4 md:p-6` est souvent suffisant.

### Q: Comment gérer les images larges ?
**R:** Utilisez `max-w-full overflow-x-auto` pour les conteneurs larges, et responsive images pour les medias.

### Q: Le design doit-il être identique sur tous les écrans ?
**R:** Non, c'est acceptable de réorganiser l'UI sur mobile (ex: colonnes → lignes).

### Q: Quand utiliser le hook `useResponsive` vs les classes Tailwind ?
**R:** Tailwind pour le styling CSS, `useResponsive` pour la logique conditionnelle complexe.

---

## Support et Améliorations

Pour des questions ou des améliorations à ce guide, veuillez contacter l'équipe de développement.

**Dernière mise à jour:** Juin 2026
