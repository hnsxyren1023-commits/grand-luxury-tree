# 🎄 Grand Luxury Tree - Christmas Edition

> **A 3D Interactive Christmas Experience powered by WebGL & AI Hand Tracking.**
> 
> *Fusion of Luxury Aesthetics, Particle Systems, and Touchless Interaction.*

![Grand Luxury Tree Banner](./public/projects/project1/preview.jpg)

## ✨ Overview

**Grand Luxury Tree** is a high-end interactive web application that renders a procedural 3D Christmas tree composed of thousands of golden particles and ornaments. Beyond standard 3D visualization, it integrates **Google MediaPipe** for real-time AI hand tracking, allowing uses to rotate and interact with the scene using simple gestures—no touch required.

Designed with a "Black & Gold" luxury aesthetic, it features a cinematic experience complete with ambient snow, dynamic lighting, and a responsive UI.

## 🚀 Key Features

| Category | Feature Highlights |
|----------|-------------------|
| **💎 Visuals** | **Procedural Generation**: Tree constructed from dynamic particle voxels.<br>**Luxury Theme**: Custom shaders for gold, pearl, and velvet textures.<br>**Post-Processing**: UnrealBloom and cinematic tone mapping. |
| **🤖 AI Control** | **Touchless Navigation**: Wave your hand to rotate the tree.<br>**Gesture Recognition**: Pinch to focus or select items (powered by MediaPipe). |
| **👆 Interaction** | **Hybrid Input**: Supports both Mouse/Touch and AI Gestures.<br>**Photo Memories**: Upload and place personal photos on the tree nodes.<br>**Snow System**: Interactive snow particles that respond to wind and movement. |
| **📱 Responsive** | Optimized for both Desktop (4K ready) and Mobile devices with touch support. |

## 🛠️ Tech Stack

- **Core**: `Index.html` (Single-File Logic) / Vanilla JS (ES6+)
- **3D Engine**: [Three.js](https://threejs.org/) (r165)
- **Computer Vision**: [MediaPipe Tasks Vision](https://developers.google.com/mediapipe) (Hand Landmarker)
- **Styling**: CSS3 (Glassmorphism, Animations)
- **Build Tool**: Vite (recommended for dev)

## 📦 Installation & Setup

This project uses **Vite** for a fast development experience.

```bash
# 1. Clone the repository
git clone https://github.com/your-username/grand-luxury-tree.git

# 2. Enter directory
cd grand-luxury-tree

# 3. Install dependencies
npm install

# 4. Start Development Server
npm run dev
```

> **Note**: A specific backup version `index.html.bak.11.1` was restored to `index.html` to preserve the original curated behavior.

## 🎨 Project Structure

```text
├── index.html            # Main Entry (Restored Golden Master Version)
├── public/               # Static Assets
│   └── projects/         # Project Archives
├── src/                  # Source Configs
└── vite.config.ts        # Vite Configuration
```

## 📄 License

MIT License © 2025 Grand Luxury Tree Team
