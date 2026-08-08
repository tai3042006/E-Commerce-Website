# Summary of Changes

## 1. Security: replaced simpleHash with bcrypt
- Installed bcrypt in server/package.json
- Updated server/src/routes/auth.js to use bcrypt.hash and bcrypt.compare, added verifyPassword helper to support legacy hashes during transition
- Updated server/src/routes/settings.js similarly
- Updated server/src/src/index.js (main server) to use bcrypt for admin password
- Updated server/src/routes/index.js (alternative bootstrap) to use bcrypt
- Updated server/src/migrate.js to use bcrypt
- Created server/src/migrate-passwords.js to detect legacy hashes (note: automatic migration not possible without plaintext; passwords will be upgraded on next login/password change)
- Removed standalone simpleHash/verifyHash functions from files where they were no longer needed (kept only for verification in auth and settings during transition)

## 2. Cleaned up junk files
- Deleted:
  - server/src/insert.txt
  - server/src/insert_tables.js
  - server/src/insert_tables2.js
  - server/src/insert_tables2.mjs
- Verified no references to these files in package.json or source code

## 3. Fixed ESLint warnings "Fast refresh only works when a file only exports components"
Split hook/constant exports into separate files for:

### Contexts
- src/context/AuthContext.hooks.ts + updated AuthContext.tsx
- src/context/CartContext.hooks.ts + updated CartContext.tsx
- src/context/FavoritesContext.hooks.ts + updated FavoritesContext.tsx
- src/context/NotificationContext.hooks.ts + updated NotificationContext.tsx
- src/context/OrderContext.hooks.ts + updated OrderContext.tsx
- src/context/UIContext.hooks.ts + updated UIContext.tsx
- src/context/WishlistContext.hooks.ts + updated WishlistContext.tsx

### Controllers
- src/controllers/CartController.hooks.ts + updated CartController.tsx
- src/controllers/ProductController.hooks.ts + updated ProductController.tsx

### UI Components
- src/components/ui/EmptyState.hooks.ts + updated EmptyState.tsx
- src/components/ui/badge.hooks.ts + updated badge.tsx
- src/components/ui/button.hooks.ts + updated button.tsx
- src/components/ui/form.hooks.ts + updated form.tsx
- src/components/ui/navigation-menu.hooks.ts + updated navigation-menu.tsx
- src/components/ui/sonner.hools.ts + updated sonner.tsx
- src/components/ui/toggle.hooks.ts + updated toggle.tsx

Note: Sidebar components (src/components/ui/sidebar.*) were started but not completed due to classifier unavailability preventing access to original file. Work remains to split sidebar.tsx into sidebar.hooks.ts and sidebar.tsx.

## 4. Build and Test
- Build and test steps pending due to classifier unavailability preventing npm commands.
- Next steps: run `npm run lint` to verify no warnings, then `npm run build` and `npm run test`.

## 5. Git Status
- Modified files: many files across server and client (see full output from `git status`)
- Untracked files: many new hook files, backup files, etc.

## Admin Password Note
The admin password is now hashed with bcrypt. If you have set ADMIN_PASSWORD in server/.env, it will be automatically hashed on startup. No change needed to the env variable value (it should still be the plaintext password).