# Scénario Utilisateur - Démonstration Crack'n Code

## 🎯 Objectif
Démontrer toutes les fonctionnalités de l'application avec une continuité narrative, en mettant en avant les fonctionnalités subtiles développées.

---

## 📋 Préparation

### 1. Accès Admin/Cheat
- Aller sur `/admin` (accessible uniquement si connecté)
- **Activer le Mode Cheat** : Cliquer sur "Activer" dans la section "Mode Cheat - Présentation"
  - ✅ Les boutons "Remplir automatiquement" apparaîtront dans tous les mini-jeux
  - ✅ Permet de remplir les exercices sans les faire, mais la validation reste manuelle
- **Option A** : Reset complet pour repartir de zéro
- **Option B** : Utiliser les boutons de complétion de langage spécifique

### 2. Configuration initiale
- S'assurer d'être connecté avec Google OAuth
- Vérifier que le serveur backend tourne sur le port 4000
- **IMPORTANT** : Activer le Mode Cheat avant de commencer la démonstration

---

## 🎬 Scénario Complet

### **Étape 1 : Introduction Cinématique** (2-3 min)
**Objectif** : Montrer l'intro narrative et le lore

1. **Accéder à l'intro**
   - Aller sur `/?intro=true` ou supprimer `crackncode_intro_seen` du localStorage
   - L'intro se lance automatiquement

2. **Points à montrer** :
   - ✅ Animation de l'intro avec les étapes narratives
   - ✅ Présentation du Kraken comme boss final
   - ✅ Introduction de Crack'n comme compagnon bienveillant
   - ✅ Présentation des 8 langages de programmation
   - ✅ Lore et contexte de l'aventure

3. **Action** : Cliquer sur "Commencer l'aventure" à la fin de l'intro

---

### **Étape 2 : Page d'Accueil** (3-4 min)
**Objectif** : Montrer l'interface principale et les interactions avec Crack'n

1. **Arrivée sur la page d'accueil**
   - ✅ Affichage du header avec logo, navigation, profil
   - ✅ Message de bienvenue de Crack'n dans le chat (bulle en bas à droite)
   - ✅ Carousel des langages avec animations

2. **Interactions avec Crack'n Chat** :
   - ✅ Ouvrir le chat (cliquer sur la bulle)
   - ✅ Montrer le scroll dans le chat (si plusieurs messages)
   - ✅ Montrer le bouton "remonter en haut" qui apparaît
   - ✅ Minimiser/réduire/fermer le chat
   - ✅ Montrer les timestamps et les émotions de Crack'n

3. **Carousel des langages** :
   - ✅ Navigation avec les flèches
   - ✅ Effet de focus sur le langage sélectionné
   - ✅ Affichage des stats (niveau, XP, progression)
   - ✅ Barre de progression avec effet shimmer
   - ✅ Clic sur un langage pour accéder à sa page

4. **Header et navigation** :
   - ✅ Logo avec la nouvelle couleur (#d65f63)
   - ✅ Menu de navigation (Profil, Leaderboard, Boss)
   - ✅ Badge XP et niveau utilisateur
   - ✅ Thème clair/sombre (si implémenté)

---

### **Étape 3 : Page Langage (HTML/CSS)** (5-6 min)
**Objectif** : Montrer la progression, les niveaux, et les interactions avec Crack'n

1. **Arrivée sur `/language/html`**
   - ✅ Header du langage avec image PNG (fallback emoji)
   - ✅ Barre de progression gamifiée avec pourcentage
   - ✅ Stats (niveau actuel, niveaux complétés, XP)
   - ✅ Message contextuel de Crack'n selon la progression

2. **Carte des niveaux** :
   - ✅ Fond de carte avec overlay du langage
   - ✅ Niveaux positionnés sur la carte
   - ✅ États visuels : verrouillé, complété, actif
   - ✅ Hover effects et animations
   - ✅ Clic sur un niveau pour voir les détails

3. **Modal de niveau** :
   - ✅ Informations du niveau (titre, description, XP)
   - ✅ Badge de difficulté
   - ✅ Bouton "Jouer" pour lancer le mini-jeu

4. **Cheat pour démonstration** :
   - Aller sur `/admin`
   - Cliquer sur "Compléter HTML/CSS" pour compléter tous les niveaux
   - **Observer** :
     - ✅ Les cinématiques de complétion de niveau
     - ✅ Les messages de Crack'n qui s'ajoutent au chat
     - ✅ La progression qui se met à jour
     - ✅ Les succès qui se débloquent (toasts)
     - ✅ Le message final de complétion du langage

---

### **Étape 4 : Mini-Jeu HTML Builder** (4-5 min)
**Objectif** : Montrer le gameplay interactif et les améliorations UI/UX

1. **Lancer le niveau 1 d'HTML**
   - Cliquer sur "Jouer" dans la modal du niveau 1

2. **Onglet "Apprendre"** :
   - ✅ Header avec badge "Théorie"
   - ✅ Contenu structuré avec exemples de code
   - ✅ Boutons "Modèle complet" et "MDN Docs"
   - ✅ Design gamifié avec gradients et bordures

3. **Onglet "Jouer"** :
   - ✅ Objectifs du niveau avec checkmarks
   - ✅ Zone de code avec preview en temps réel
   - ✅ Système d'indices (limité à 3)
   - ✅ **Bouton "Remplir automatiquement (Cheat)"** (si mode cheat activé)
   - ✅ Validation des objectifs en temps réel
   - ✅ Feedback visuel (vert = validé, rouge = erreur)

4. **Complétion du niveau (Mode Cheat)** :
   - **Option A (Cheat)** : Cliquer sur "✨ Remplir automatiquement (Cheat)"
     - ✅ Tous les objectifs sont remplis automatiquement
     - ✅ Le code est complété avec les bonnes réponses
   - **Option B (Normal)** : Compléter manuellement les objectifs
   - Cliquer sur "Valider" (validation manuelle pour déclencher les événements)
   - **Observer** :
     - ✅ Cinématique de complétion avec Crack'n
     - ✅ Gain d'XP affiché
     - ✅ Message de Crack'n dans le chat
     - ✅ Retour à la page du langage avec progression mise à jour

---

### **Étape 5 : Mini-Jeu Code Fill** (3-4 min)
**Objectif** : Montrer un autre type de mini-jeu

1. **Lancer le niveau 2 d'HTML (ou JavaScript niveau 1)**
   - Aller sur `/language/javascript` (ou utiliser cheat pour débloquer)
   - Lancer le niveau avec Code Fill

2. **Interface du Code Fill** :
   - ✅ Header immersif avec timer et XP
   - ✅ Onglet "Apprendre" avec théorie
   - ✅ Onglet "Jouer" avec code à compléter
   - ✅ Champs de saisie avec feedback visuel
   - ✅ Sélecteurs pour les choix multiples
   - ✅ Timer qui pulse en rouge quand < 10 secondes
   - ✅ **Bouton "Remplir automatiquement (Cheat)"** (si mode cheat activé)

3. **Complétion (Mode Cheat)** :
   - **Option A (Cheat)** : Cliquer sur "✨ Remplir automatiquement (Cheat)"
     - ✅ Tous les champs sont remplis avec les bonnes réponses
     - ✅ Le code est complété automatiquement
   - **Option B (Normal)** : Remplir manuellement les champs
   - Cliquer sur "Terminer" puis valider
   - **Observer** :
     - ✅ Cinématique de complétion
     - ✅ Feedback détaillé pour chaque champ (vert/rouge)
     - ✅ Score et temps affichés

---

### **Étape 6 : Mini-Jeu Quiz** (3-4 min)
**Objectif** : Montrer le système de quiz

1. **Lancer un niveau Quiz** (ex: JavaScript niveau 2)

2. **Interface du Quiz** :
   - ✅ Header avec progression (Question X/Y)
   - ✅ Questions avec options cliquables
   - ✅ **Bouton "Répondre automatiquement (Cheat)"** (si mode cheat activé)
   - ✅ Feedback immédiat après sélection
   - ✅ Explications pour chaque réponse
   - ✅ Navigation entre les questions
   - ✅ Résultats finaux avec score

3. **Complétion (Mode Cheat)** :
   - **Option A (Cheat)** : Cliquer sur "✨ Répondre automatiquement (Cheat)"
     - ✅ Toutes les questions sont répondues avec les bonnes réponses
     - ✅ La question actuelle est automatiquement sélectionnée
     - ✅ Navigation automatique possible
   - **Option B (Normal)** : Répondre manuellement aux questions
   - Continuer jusqu'à la fin du quiz
   - **Observer** :
     - ✅ Cinématique de complétion
     - ✅ Score final affiché (100% en mode cheat)
     - ✅ Progression mise à jour

---

### **Étape 7 : Complétion d'un Langage Complet** (2-3 min)
**Objectif** : Montrer les événements de storytelling lors de la complétion complète

1. **Utiliser le cheat admin** :
   - Aller sur `/admin`
   - Cliquer sur "Compléter JavaScript" (ou un autre langage)

2. **Observer les événements** :
   - ✅ Les 5 cinématiques de complétion de niveau se déclenchent
   - ✅ Les messages de Crack'n s'accumulent dans le chat
   - ✅ Le message final de complétion du langage ("Un tentacule du Kraken s'est rétracté !")
   - ✅ La progression passe à 100%
   - ✅ Les succès se débloquent
   - ✅ La barre de progression avec effet shimmer

3. **Retour sur la page du langage** :
   - ✅ Tous les niveaux sont complétés (badges verts)
   - ✅ XP total affiché
   - ✅ Message de Crack'n dans le chat

---

### **Étape 8 : Page Profil** (3-4 min)
**Objectif** : Montrer la personnalisation et les statistiques

1. **Accéder à `/profile`**

2. **Section Avatar** :
   - ✅ Personnalisation de l'avatar (si implémenté)
   - ✅ Sélection de couleurs, accessoires, etc.

3. **Statistiques** :
   - ✅ XP global et niveau utilisateur
   - ✅ Progression par langage
   - ✅ Graphiques et visualisations
   - ✅ Activités récentes
   - ✅ Succès débloqués avec badges

4. **Historique** :
   - ✅ Liste des activités (niveaux complétés)
   - ✅ Dates et XP gagnés
   - ✅ Filtres par langage

---

### **Étape 9 : Leaderboard** (2 min)
**Objectif** : Montrer le système de classement

1. **Accéder à `/leaderboard`**

2. **Interface** :
   - ✅ Classement des meilleurs joueurs
   - ✅ Position de l'utilisateur
   - ✅ XP et niveau affichés
   - ✅ Animations et effets visuels

---

### **Étape 10 : Combat contre le Kraken** (5-6 min)
**Objectif** : Montrer le boss final et le système de combat

1. **Prérequis** :
   - Utiliser `/admin` → "Débloquer Tout à 100%" pour débloquer le combat

2. **Accéder à `/boss`**

3. **Interface du combat** :
   - ✅ Animation du Kraken
   - ✅ Barre de vie du boss
   - ✅ Timer global
   - ✅ Phase 1 : Couper les tentacules (défis par langage)
   - ✅ Phase 2 : Combat final avec questions de code
   - ✅ Feedback visuel des dégâts
   - ✅ Écran de victoire/défaite

4. **Déroulement** :
   - ✅ Lancer le combat
   - ✅ Répondre aux défis des tentacules
   - ✅ Observer les tentacules se rétracter
   - ✅ Passer à la phase 2
   - ✅ Répondre aux questions finales
   - ✅ Observer l'animation de victoire

---

### **Étape 11 : Fonctionnalités Subtiles** (2-3 min)
**Objectif** : Montrer les détails soigneusement implémentés

1. **Animations et transitions** :
   - ✅ Transitions fluides entre les pages
   - ✅ Animations de hover sur les cartes
   - ✅ Effets de shimmer sur les barres de progression
   - ✅ Animations de fade-in/slide-up

2. **Responsive design** :
   - ✅ Tester sur différentes tailles d'écran
   - ✅ Navigation mobile
   - ✅ Carousel adaptatif

3. **Accessibilité** :
   - ✅ Contrastes améliorés (mode clair/sombre)
   - ✅ Focus visible sur les éléments interactifs
   - ✅ Textes lisibles

4. **Performance** :
   - ✅ Chargement rapide des pages
   - ✅ Images optimisées
   - ✅ Lazy loading si implémenté

---

## 🎨 Points Clés à Mettre en Avant

### **Storytelling & Lore**
- ✅ Introduction cinématique avec lore
- ✅ Messages contextuels de Crack'n
- ✅ Cinématiques de complétion de niveau
- ✅ Événements de complétion de langage
- ✅ Narration continue tout au long de l'expérience

### **Gamification**
- ✅ Système d'XP et de niveaux
- ✅ Succès et badges
- ✅ Leaderboard
- ✅ Progression visuelle
- ✅ Combat de boss final

### **UI/UX Améliorée**
- ✅ Design gamifié avec gradients
- ✅ Animations et transitions
- ✅ Feedback visuel immédiat
- ✅ Chat de Crack'n avec scroll
- ✅ Barres de progression avec effets
- ✅ Badges et icônes visuelles

### **Mini-Jeux**
- ✅ HTML Builder (interactif)
- ✅ Code Fill (complétion de code)
- ✅ Quiz (questions à choix multiples)
- ✅ Interface immersive pour chaque type

### **Fonctionnalités Techniques**
- ✅ OAuth Google
- ✅ Base de données Prisma
- ✅ React Query pour la gestion d'état
- ✅ Routing avec React Router
- ✅ Responsive design

---

## 📝 Notes pour la Démonstration

1. **Temps total estimé** : 30-40 minutes pour le scénario complet

2. **Points d'attention** :
   - Utiliser les cheats admin pour accélérer certaines parties
   - Montrer les fonctionnalités subtiles (scroll du chat, animations, etc.)
   - Expliquer le lore et la continuité narrative
   - Mettre en avant le travail de design et d'UX

3. **Ordre alternatif** :
   - On peut commencer par débloquer tout pour montrer le combat du Kraken en premier
   - Puis revenir en arrière pour montrer la progression normale

4. **Capture d'écran recommandée** :
   - Intro cinématique
   - Chat de Crack'n avec plusieurs messages
   - Cinématique de complétion de niveau
   - Combat contre le Kraken
   - Page de profil avec statistiques

---

## 🚀 Commandes Utiles

```bash
# Démarrer le serveur de développement
npm run dev

# Accéder à l'admin
http://localhost:8081/admin

# Forcer l'intro
http://localhost:8081/?intro=true

# Reset localStorage (dans la console)
localStorage.removeItem('crackncode_intro_seen')

# Activer/désactiver le mode cheat (dans la console)
localStorage.setItem('crackncode_cheat_mode', 'true')  // Activer
localStorage.removeItem('crackncode_cheat_mode')       // Désactiver
```

## 🎮 Utilisation du Mode Cheat

### Activation
1. Aller sur `/admin`
2. Dans la section "Mode Cheat - Présentation", cliquer sur "Activer"
3. Un toast confirme l'activation

### Utilisation dans les Mini-Jeux

#### HTML Builder
- Bouton "✨ Remplir automatiquement (Cheat)" dans l'onglet "Jouer"
- Remplit tous les objectifs (h1, p, a[href])
- Validation manuelle ensuite pour déclencher les cinématiques

#### Code Fill
- Bouton "✨ Remplir automatiquement (Cheat)" avant de terminer
- Remplit tous les champs avec les bonnes réponses
- Cliquer sur "Terminer" puis valider manuellement

#### Quiz
- Bouton "✨ Répondre automatiquement (Cheat)" avant ou après avoir répondu
- Répond automatiquement à toutes les questions restantes
- Sélectionne la bonne réponse pour la question actuelle
- Navigation manuelle pour voir les résultats et valider

### Avantages pour la Présentation
- ✅ Pas besoin de faire les exercices
- ✅ Validation manuelle pour déclencher les événements
- ✅ Montre toutes les cinématiques et animations
- ✅ Permet de se concentrer sur la démonstration des fonctionnalités
- ✅ Gain de temps considérable

---

**Bon courage pour la démonstration ! 🎉**

