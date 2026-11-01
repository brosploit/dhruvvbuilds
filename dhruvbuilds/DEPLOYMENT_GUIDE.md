# 🚀 How to Deploy DhruvBuilds 3D Portfolio to InfinityFree

Your portfolio is 100% static, client-side, and lightweight. It requires **zero Node server dependencies** and is pre-configured with relative paths and an `.htaccess` performance file designed specifically for **InfinityFree**.

---

## Quick 2-Minute Deployment Steps

### Method 1: Via InfinityFree Online File Manager (Easiest & Fastest)
1. Log in to your **[InfinityFree Client Area](https://app.infinityfree.net/)**.
2. Click on your active account (or create a free account with your chosen subdomain, e.g. `dhruvbuilds.infinityfreeapp.com` or `dhruvbuilds.epizy.com`).
3. Click the **"File Manager"** button.
4. Double-click to open the **`htdocs`** folder (⚠️ **Important:** All files must go inside `htdocs`).
5. If there is a default `index2.html` or placeholder file inside `htdocs`, delete it.
6. Upload all files and folders from this project into `htdocs`:
   - `index.html`
   - `.htaccess`
   - `css/` (including `style.css`)
   - `js/` (including `script.js` and `three-scene.js`)
   - `assets/` (including `Dhruv_Resume.pdf`, `logo.svg`, `favicon.svg`)
7. Open your website domain in your browser — your 3D portfolio is immediately live!

---

### Method 2: Via FTP (FileZilla)
1. In your InfinityFree dashboard, find your **FTP Details**:
   - **FTP Hostname:** (e.g. `ftpupload.net`)
   - **FTP Username:** (e.g. `epiz_12345678`)
   - **FTP Password:** (found under Account Details)
   - **Port:** `21`
2. Open **FileZilla**, enter your credentials, and click **Quickconnect**.
3. In the remote server pane, open the **`htdocs`** folder.
4. Drag and drop all files and folders from this project folder into `htdocs`.
5. Once the upload queue finishes, visit your site!

---

## 🛠️ Personalizing Your Social Links & Contact Info

All your links are consolidated at the top of `js/script.js` and in `index.html`. You can easily customize them:

```javascript
const USER_CONFIG = {
  name: "Dhruv",
  brand: "DhruvBuilds",
  title: "Creative Technologist & 3D Web Architect",
  email: "dhruvbuilds@gmail.com",
  github: "https://github.com/dhruvbuilds",
  linkedin: "https://linkedin.com/in/dhruvbuilds",
  instagram: "https://instagram.com/dhruvbuilds",
  youtube: "https://youtube.com/@dhruvbuilds",
  resumePath: "./assets/Dhruv_Resume.pdf"
};
```

---

## ✨ Features Included Out of the Box:
- 🌌 **3D Interactive WebGL Holographic Core (Three.js)** with 4 switchable geometries (Quantum Core, Torus Portal, Cyber Matrix, Neural Stars) + fallback HTML5 Canvas engine.
- 🎛️ **Interactive Cyber Terminal** (supports commands: `help`, `about`, `skills`, `projects`, `resume`, `socials`, `clear`, `matrix`, `theme`).
- 📄 **1-Click Resume Download Button & In-Browser Interactive Resume Viewer** with print support.
- 🛡️ **Custom 3D Vector Logo & Favicon**.
- 🔊 **Web Audio Cyber SFX** (synthesized futuristic UI blips, zero external mp3s needed, mute/unmute toggle).
- 🎨 **Dynamic Theme Switcher** (Cyber Neon, Emerald Matrix, Solar Flare, Cosmic Blue).
- 📱 **100% Mobile & Tablet Responsive** with touch drag 3D rotation and gesture support.
- ⚡ **Zero Freelancing References** — built as an impressive creative technologist & software engineering showcase.

