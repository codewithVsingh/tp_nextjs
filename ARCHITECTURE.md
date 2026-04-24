# Tutors Parliament: Architecture Manifesto & Developer Bible

## 1. Philosophy: The Intelligence Engine
Tutors Parliament is not a "Dashboard App"; it is an **Intelligence Engine**. 
- **Roles (Admin, Tutor, Institute)** are just *Consumers* of information.
- **Domains (Lead-Management, Identity, Network)** are the *Source of Truth*.

---

## 2. System Structure (DDA)

### **A. Domains (`src/domains/`)**
This is where the "Brain" of the platform lives.
- `/domain`: **Pure Logic**. Pure TS functions only. No React, No Supabase.
- `/use-cases`: **Application Actions**. Orchestrates domain logic + services. **(The Application Layer)**
- `/services`: **Data I/O**. Direct Supabase calls only.
- `/hooks`: **UI Orchestration**. Thin wrappers around use-cases.
- `/components`: **Shared Domain UI**. Specific to this domain (e.g., `TemperatureBadge`).
- `/constants`: **Domain Truths**. (e.g., `funnelStages.ts`).

### **B. Roles (`src/modules/`)**
Roles are thin "UI Skins." They should contain **ZERO** business logic and **ZERO** direct API calls.
- `/views`: The only place where page layouts are defined.
- **Constraint**: Roles must only import from `@/domains` or `@/design-system`.

---

## 3. Domain Communication Rules
To prevent technical debt, domains must follow these isolation rules:
- **Rule A**: Domains must not directly depend on other domains' internals.
- **Rule B**: Communication between domains must happen via **Shared Interfaces** or **Service Adapters**.
- **Rule C**: Circular dependencies are strictly forbidden and will be caught by the Guard.

---

## 4. The Shared Layer
**Location**: `src/shared/`
Contains only generic, domain-agnostic utilities.
- ❌ **Forbidden**: Business logic, Role-specific logic, Lead/Tutor logic.
- ✅ **Allowed**: Date formatters, math utilities, generic types, global constants.

---

## 5. The Authority Layer (Design System)
To ensure role-based visual consistency, usage of raw HTML tags or generic UI components in Module Views is **FORBIDDEN**.

- ✅ **Mandatory**: `TPButton`, `TPInput`, `TPDataTable`, `TPSkeleton`, `TPSelect`, `TPModal`.
- ❌ **Forbidden**: `<button>`, `<input>`, `<a>`, Shadcn `Button`, Shadcn `Input`.

---

## 6. The "Triple-Lock" Guardrails
The system is **Strongly Guarded** against architectural violations.

1.  **ESLint Boundaries**: Prevents cross-module imports and direct API leakage.
2.  **Architecture Guard (`npm run guard`)**: Scans for Design System leakage (raw tags) and API leakage in Views.
3.  **Domain Isolation**: Services are the only files allowed to import the Supabase client.

---

## 7. Testing & Observability Standards

### **Testing Strategy**
- **Domain Logic**: 100% Unit Test coverage required (Pure TS functions).
- **Use-Cases**: Must be testable independently of the UI.
- **Views**: Covered by Playwright E2E tests for critical paths.

### **Observability**
- **Zero Silent Failures**: All critical service failures must be caught and logged.
- **Intelligence Tracking**: Use `intelligenceTrackingEngine.ts` to log scoring events.
- **Error UI**: Every View must use `TPErrorBoundary` for graceful recovery.

---

## 8. Developer Onboarding (30-Minute Guide)

### **How to Add a New Feature**
1.  **Identify the Domain**: Does it fit in `lead-management`, `identity`, etc.?
2.  **Write the Use-Case**: Create `domains/{domain}/use-cases/{action}.ts`.
3.  **Define Domain Logic**: Build the "Brain" in `domains/{domain}/domain/`.
4.  **Create the Hook**: Wrap the use-case in a domain-level hook.
5.  **Build the View**: Create the page in `src/modules/{role}/{feature}/views/`.
6.  **Audit**: Run `npm run guard` to ensure compliance.

---

## 9. Naming Standards
- **Services**: `nameService.ts`
- **Use Cases**: `actionName.ts` (Verb-first, e.g., `fetchLeads.ts`)
- **Domain Engines**: `nameIntelligence.ts`
- **Views**: `NameView.tsx`
