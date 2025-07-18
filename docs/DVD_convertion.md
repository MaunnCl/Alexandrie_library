# 🔓 Method to "open" and convert `.dxr` files using legacy tools

## 1️⃣ Context
- `.dxr` files are **protected Director files**: read-only and cannot be opened directly in Adobe Director for editing or inspecting Lingo scripts.
- Goal: **convert a `.dxr` back into a `.dir` editable format** so we can access embedded scripts (e.g., `vide2` frame lists) and metadata.

---

## 2️⃣ Tools required
### 🛠️ Recommended legacy tools:
- **Adobe Director MX 2004**: last usable version before it became obsolete.
- **DirOpener**:
  - A small utility designed to bypass `.dxr` read-only protection.
  - Hard to find nowadays (old warez tool).
- **JsPlus / JS+ Plugin**:
  - Another legacy plugin or patch that allows Director to open protected `.dxr` files.
  - Typically used as a patched Xtra or DLL injected into Director.

---

## 3️⃣ Method overview
🔹 This is a "hacky" workflow intended for archival / recovery purposes only.

### 📦 Step 1: Install Adobe Director MX 2004
- Ensure Director MX 2004 is installed on a Windows XP virtual machine (recommended for compatibility).

### 📦 Step 2: Install or patch with DirOpener
- Copy the **`DirOpener` executable or DLL** into the Director installation directory or plugins/Xtras folder.
- Some versions require running `DirOpener` as a launcher:
  ```bash
  DirOpener.exe Director.exe
