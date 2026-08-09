# Task List: Clofit Project Improvement

## Phase 3: API/interface review

### Task 3.1: Analyze API authentication endpoints
**Description:** Examine auth.js backend routes and AuthContext frontend usage
**Acceptance criteria:**
- [x] Check login/register/logout flows for consistency
- [x] Verify token handling and storage
- [x] Confirm error responses match frontend expectations
**Verification:**
- [x] Manual testing of auth flow
- [x] Check for console errors during auth
**Dependencies:** None
**Files likely touched:**
- Website/server/src/routes/auth.js
- Website/src/context/AuthContext.*
- Website/src/context/AuthContext.hooks.ts
**Estimated scope:** Small

### Task 3.2: Review product API endpoints
**Description:** Examine products backend routes and frontend usage
**Acceptance criteria:**
- [x] Check CRUD operations consistency
- [x] Verify pagination and filtering implementation
- [x] Confirm error handling matches frontend expectations
**Verification:**
- [x] Test product listing and details pages
- [x] Check API responses in network tab
**Dependencies:** None
**Files likely touched:**
- Website/server/src/routes/products.js
- Website/src/controllers/ProductController.*
- Website/src/pages/AllProducts.tsx
- Website/src/pages/Product.tsx
**Estimated scope:** Medium

### Task 3.3: Check cart and order API contracts
**Description:** Examine cart and order endpoints
**Acceptance criteria:**
- [x] Verify cart operations (add, remove, update)
- [x] Check order creation flow
- [x] Confirm payment method handling
**Verification:**
- [x] Test cart functionality end-to-end
- [x] Test checkout process (without actual payment)
**Dependencies:** None
**Files likely touched:**
- Website/server/src/routes/orders.js
- Website/server/src/routes/paymentMethods.js
- Website/src/controllers/CartController.*
- Website/src/context/OrderContext.*
- Website/src/pages/Cart.tsx
- Website/src/pages/Checkout.tsx
- Website/src/pages/Account.tsx
**Estimated scope:** Medium

## Phase 4: Frontend review

### Task 4.1: Audit component library usage
**Description:** Check consistent use of shadcn/ui components
**Acceptance criteria:**
- [ ] Verify consistent button, input, modal usage
- [ ] Check for custom components that should use library
- [ ] Ensure proper theme integration
**Verification:**
- [ ] Visual inspection of UI consistency
- [ ] Check for console warnings
**Dependencies:** None
**Files likely touched:**
- Website/src/components/**/*.tsx
- Website/src/pages/**/*.tsx
**Estimated scope:** Medium

### Task 4.2: Review state management patterns
**Description:** Examine Context and hooks usage
**Acceptance criteria:**
- [ ] Check for proper separation of concerns
- [ ] Identify over-fetching or stale data issues
- [ ] Verify proper loading and error states
**Verification:**
- [ ] Test app navigation and state persistence
- [ ] Check React DevTools for unnecessary re-renders
**Dependencies:** None
**Files likely touched:**
- Website/src/context/**/*.ts*
- Website/src/hooks/**/*.ts*
- Website/src/controllers/**/*.ts*
**Estimated scope:** Medium

### Task 4.3: Evaluate responsive design and accessibility
**Description:** Check responsiveness and a11y compliance
**Acceptance criteria:**
- [ ] Test at multiple screen sizes
- [ ] Check for proper semantic HTML
- [ ] Verify ARIA labels and keyboard navigation
**Verification:**
- [ ] Manual testing on different viewport sizes
- [ ] Use axe or similar tool for a11y check
**Dependencies:** None
**Files likely touched:**
- Website/src/components/**/*.tsx
- Website/src/pages/**/*.tsx
- Website/src/App.tsx
**Estimated scope:** Small

## Phase 5: Code quality

### Task 5.1: Identify and fix code duplication
**Description:** Find duplicated logic and extract to utils
**Acceptance criteria:**
- [ ] Remove duplicate validation logic
- [ ] Extract repeated API call patterns
- [ ] Consolidate utility functions
**Verification:**
- [ ] Run complexity analysis tool
- [ ] Manual review of common functions
**Dependencies:** None
**Files likely touched:**
- Website/src/lib/**/*.ts*
- Website/src/utils/**/*.ts*
- Various component files
**Estimated scope:** Medium

### Task 5.2: Simplify complex components
**Description:** Refactor overly complex components
**Acceptance criteria:**
- [ ] Break down components with >200 lines
- [ ] Extract complex logic to custom hooks
- [ ] Reduce prop drilling where possible
**Verification:**
- [ ] Component line count reduction
- [ ] Improved readability (subjective)
**Dependencies:** None
**Files likely touched:**
- Website/src/pages/**/*.tsx (large ones)
- Website/src/components/**/*.tsx (large ones)
**Estimated scope:** Medium

## Phase 6: Debugging

### Task 6.1: Fix TypeScript errors
**Description:** Resolve all TS compilation errors
**Acceptance criteria:**
- [ ] Achieve clean tsc build with noErrors
- [ ] Fix any any types where possible
- [ ] Improve type definitions where needed
**Verification:**
- [ ] Run npm run typecheck (if exists) or tsc --noEmit
- [ ] Check for TS errors in IDE
**Dependencies:** None
**Files likely touched:**
- Throughout Website/src/**/*.ts*
**Estimated scope:** Medium

### Task 6.2: Fix ESLint warnings
**Description:** Address all linting issues
**Acceptance criteria:**
- [ ] Achieve clean eslint run
- [ ] Fix consistent styling issues
- [ ] Address potential bugs flagged by eslint
**Verification:**
- [ ] Run npm run lint and see zero warnings
**Dependencies:** Task 6.1 (TS fixes may affect ling)
**Files likely touched:**
- Throughout Website/src/**/*.ts*
**Estimated scope:** Medium

### Task 6.3: Fix runtime errors
**Description:** Identify and fix console errors and runtime bugs
**Acceptance criteria:**
- [ ] Eliminate console errors during normal use
- [ ] Fix any broken UI interactions
- [ ] Resolve any API call failures
**Verification:**
- [ ] Manual testing with clean console
- [ ] Test critical user flows
**Dependencies:** None
**Files likely touched:**
- Throughout Website/src/**/*.ts*
**Estimated scope:** Medium

## Phase 7: Security

### Task 7.1: Audit authentication security
**Description:** Check auth implementation for vulnerabilities
**Acceptance criteria:**
- [ ] Verify password hashing (bcrypt) is used
- [ ] Check for proper token expiration
- [ ] Verify route protection for authenticated endpoints
**Verification:**
- [ ] Review backend auth.js
- [ ] Test unauthorized access attempts
**Dependencies:** None
**Files likely touched:**
- Website/server/src/routes/auth.js
- Website/src/context/AuthContext.*
**Estimated scope:** Small

### Task 7.2: Check input validation
**Description:** Validate all API inputs
**Acceptance criteria:**
- [ ] Validate validation on all POST/PUT endpoints
- [ ] Check for SQL injection protection
- [ ] Ensure proper sanitization of user inputs
**Verification:**
- [ ] Review validation logic in routes
- [ ] Test with malicious inputs
**Dependencies:** None
**Files likely touched:
- Website/server/src/routes/*.js
**Estimated scope:** Medium

### Task 7.3: Review CORS and API protection
**Description:** Check API security settings
**Acceptance criteria:**
- [ ] Verify CORS is properly configured
- [ ] Check for rate limiting on auth endpoints
- [ ] Ensure sensitive endpoints are protected
**Verification:**
- [ ] Review server.js/middleware
- [ ] Test cross-origin requests
**Dependencies:** None
**Files likely touched:
- Website/server/src/index.js
- Website/server/src/routes/*.js
**Estimated scope:** Small

## Phase 8: Testing

### Task 8.1: Set up testing environment
**Description:** Ensure tests can run successfully
**Acceptance criteria:**
- [ ] Vitest configuration is correct
- [ ] Testing library setup is proper
- [ ] Tests can run in watch mode
**Verification:**
- [ ] Run npm test and see results
**Dependencies:** None
**Files likely touched:
- Website/vitest.config.ts
- Website/src/test/**/*
**Estimated scope:** Small

### Task 8.2: Write tests for auth context
**Description:** Test authentication flows
**Acceptance criteria:**
- [ ] Test login, logout, register flows
- [ ] Test token persistence and clearing
- [ ] Test protected route access
**Verification:**
- [ ] Test file passes
- [ ] Coverage increase for auth context
**Dependencies:** Task 8.1
**Files likely touched:
- Website/src/test/authContext.test.tsx (may exist)
- Website/src/test/auth.test.tsx (create if needed)
**Estimated scope:** Medium

### Task 8.3: Write tests for product API
**Description:** Test product listing and details
**Acceptance criteria:**
- [ ] Test product fetching and filtering
- [ ] Test error states and loading states
- [ ] Test product creation/update/deletion (if applicable)
**Verification:**
- [ ] Test file passes
- [ ] Mock API calls properly
**Dependencies:** Task 8.1
**Files likely touched:
- Website/src/test/product.test.tsx (create)
**Estimated scope:** Medium

## Phase 9: Performance

### Task 9.1: Analyze bundle size
**Description:** Check frontend bundle composition
**Acceptance criteria:**
- [ ] Identify large dependencies
- [ ] Check for code splitting effectiveness
- [ ] Verify lazy loading is working
**Verification:**
- [ ] Run vite build and analyze output
- [ ] Use source-map-explorer if available
**Dependencies:** None
**Files likely touched:
- Website/vitest.config.ts
**Estimated scope:** Small

### Task 9.2: Optimize re-renders
**Description:** Reduce unnecessary component re-renders
**Acceptance criteria:
- [ ] Use React.memo where appropriate
- [ ] Fix useEffect dependencies
- [ ] Optimize context value equality
**Verification:**
- [ ] Test with React DevTools profiler
- [ ] Manual interaction testing
**Dependencies:** None
**Files likely touched:
- Website/src/components/**/*.tsx
- Website/src/pages/**/*.tsx
**Estimated scope:** Medium

### Task 9.3: Optimize images and assets
**Description:** Improve asset loading performance
**Acceptance criteria:**
- [ ] Verify images are properly sized
- [ ] Check for lazy loading of below-fold images
- [ ] Ensure proper image formats (WebP where possible)
**Verification:**
- [ ] Network tab analysis
- [ ] Lighthouse performance audit
**Dependencies:** None
**Files likely touched:
- Website/public/**/*
- Website/src/assets/**/*
- Component files using images
**Estimated scope:** Small

## Phase 10: Git/workflow

### Task 10.1: Review current git state
**Description:** Examine repository status and history
**Acceptance criteria:**
- [ ] Identify unnecessary files in .gitignore
- [ ] Check for large files that should be LFS
- [ ] Review recent commits for clarity
**Verification:**
- [ ] Run git status and git log
- [ ] Check .gitignore contents
**Dependencies:** None
**Files likely touched:
- .gitignore
- Various temporary files
**Estimated scope:** Small

### Task 10.2: Establish commit conventions
**Description:** Define and document commit practices
**Acceptance criteria:**
- [ ] Agree on commit message format
- [ ] Define when to create branches
- [ ] Establish PR review process
**Verification:**
- [ ] Documented in CONTRIBUTING.md or similar
**Dependencies:** None
**Files likely touched:
- Website/CONTRIBUTING.md (create if needed)
**Estimated scope:** Small

## Phase 11: Documentation

### Task 11.1: Update README if needed
**Description:** Ensure README reflects current state
**Acceptance criteria:**
- [ ] Correct setup instructions
- [ ] Accurate technology stack description
- [ ] Clear project overview
**Verification:**
- [ ] Read README and verify accuracy
**Dependencies:** None
**Files likely touched:
- Website/README.md
**Estimated scope:** Small

### Task 11.2: Create/update ADRs
**Description:** Document architectural decisions
**Acceptance criteria:**
- [ ] Create ADR for significant decisions made
- [ ] Follow existing ADR template if any
- [ ] Store in docs/adr/ directory
**Verification:**
- [ ] ADR files exist and are readable
**Dependencies:** None
**Files likely touched:
- Website/docs/adr/**/*.md (create)
**Estimated scope:** Small

## Phase 12: Final verification

### Task 12.1: Run lint and fix
**Description:** Execute eslint and fix all issues
**Acceptance criteria:**
- [ ] npm run lint exits with code 0
- [ ] No eslint warnings or errors
**Verification:**
- [ ] Run the lint command
**Dependencies:** Tasks 5.1, 5.2, 6.2
**Files likely touched:
- Throughout Website/src/**/*.ts*
**Estimated scope:** Medium

### Task 12.2: Run build and verify
**Description:** Ensure production build succeeds
**Acceptance criteria:**
- [ ] npm run build exits with code 0
- [ ] Build output is valid
- [ ] No runtime errors in built app
**Verification:**
- [ ] Run the build command
- [ ] Serve built app and test basic functionality
**Dependencies:** Task 12.1
**Files likely touched:
- Build output in Website/dist/
**Estimated scope:** Medium

### Task 12.3: Run test suite
**Description:** Execute all tests and verify pass
**Acceptance criteria:**
- [ ] npm test exits with code 0
- [ ] All test suites pass
- [ ] Test coverage meets minimum threshold
**Verification:**
- [ ] Run the test command
**Dependencies:** Tasks 8.1, 8.2, 8.3
**Files likely touched:
- Website/src/test/**/*
**Estimated scope:** Medium

### Task 12.4: Test key API endpoints
**Description:** Manually verify critical API functionality
**Acceptance criteria:**
- [ ] Auth endpoints work correctly
- [ ] Product CRUD operations work
- [ ] Cart and order flows complete
**Verification:**
- [ ] Manual testing via frontend or API client
- [ ] Check database state after operations
**Dependencies:** None
**Files likely touched:
- None (testing only)
**Estimated scope:** Medium

### Task 12.5: Verify main user flows
**Description:** Test critical user journeys
**Acceptance criteria:**
- [ ] User can register, login, browse products
- [ ] User can add to cart and checkout
- [ ] Admin can access admin panel (if applicable)
**Verification:**
- [ ] End-to-end testing of key flows
**Dependencies:** None
**Files likely touched:
- None (testing only)
**Estimated scope:** Medium