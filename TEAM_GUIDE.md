# ORBIT — Team Collaboration & Account Switching Guide

## 👥 Team Setup & Working Context
- **Team Size:** 5 Students
- **Hardware:** 1 Shared Computer
- **Environment:** Sequential access across different user accounts on the same machine.
- **Single Source of Truth:** The local project folder `c:\Users\HP\Downloads\Orbit`.

---

## 🔑 Crucial Account Switching Protocols
Because teammates will log into this workstation under different user accounts or Antigravity sessions, **AI assistant contexts do not carry over between sessions**. Therefore:
1. **Never delete or regenerate the project from scratch.** The repository in `c:\Users\HP\Downloads\Orbit` is permanent.
2. **Always consult `PROGRESS.md` upon starting.** It tracks completed phases and remaining objectives.
3. **Always review Git status** before writing any new code:
   ```bash
   git status
   git log -n 3
   ```
4. **Never commit passwords, personal keys, or private tokens.**
5. **Commit incremental work with clear messages** before logging out:
   ```bash
   git add .
   git commit -m "feat(module): description of completed work"
   ```

---

## 🎯 Member Responsibilities & Focus Areas

| Member | Primary Focus | Key Files & Modules |
| :--- | :--- | :--- |
| **Member 1 (Lead & Architect)** | Toolchain, Git, Store & Global Integration | `src/store/useMissionStore.ts`, `src/App.tsx`, `package.json` |
| **Member 2 (Design & Landing)** | UI/UX, Design Tokens, Landing & Setup | `src/components/landing/`, `src/components/setup/`, `src/index.css` |
| **Member 3 (3D Graphics)** | 3D Planetary Explorer & 3D Outpost Builder | `src/components/explorer3d/`, `src/components/builder3d/` |
| **Member 4 (Simulation Lead)** | Life Support & Power Math Engines | `src/simulation/lifeSupportEngine.ts`, `src/simulation/powerEngine.ts` |
| **Member 5 (QA & Anomaly Lead)** | Events Engine, Failure Detective & Evaluation | `src/simulation/eventEngine.ts`, `src/components/events/`, `src/components/evaluation/` |

---

## 🛠️ Quick Command Cheatsheet

### Running the App
```bash
# In c:\Users\HP\Downloads\Orbit
npm run dev
```

### Checking for Build Errors
```bash
npm run build
```

### Checking Changes
```bash
git status
git diff
```

### Documenting Progress
Whenever you finish a task, check the corresponding item in `PROGRESS.md` and add a brief bullet point under "Recent Changes".
