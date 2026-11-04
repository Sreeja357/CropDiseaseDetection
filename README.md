# 🌾 Smart Crop Detector — Smart Farming Through Smart Detection

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-DenseNet--121-EE4C2C.svg)](https://pytorch.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-Academic%20Project-green.svg)](#)

> **Final Year Engineering Project**: An AI-powered full-stack agro-diagnostic web application that identifies crop pests and diseases from leaf photos using **DenseNet-121**, provides actionable chemical/organic pesticide treatments, maintains cloud scan histories, and exports printable diagnostic lab reports.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Supported Crops & Diseases (22 Classes)](#-supported-crops--diseases-22-classes)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Installation & Setup Guide](#-installation--setup-guide)
  - [Prerequisites](#prerequisites)
  - [Backend Setup (Flask + PyTorch)](#1-backend-setup-flask--pytorch)
  - [Frontend Setup (React + Vite)](#2-frontend-setup-react--vite)
- [API Documentation](#-api-documentation)
- [Authentication Workflow](#-authentication-workflow)
- [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 📖 Overview

Crop diseases and pest infestations result in an estimated 20–40% loss of global agricultural yield annually. Traditional diagnosis requires specialized agricultural extension officers and often takes days, leading to delayed treatments.

**Smart Crop Detector** bridges this gap by enabling farmers, agricultural researchers, and students to:
1. Capture or upload a leaf photo using any phone, tablet, or laptop.
2. Receive an **instant AI diagnosis** (powered by DenseNet-121) with a confidence score and severity level.
3. Access **exact pesticide names, dosages, and application methods** (chemical and bio-pesticides).
4. Download a professional **PDF diagnostic report** with the analyzed leaf photo embedded.
5. Track diagnostic history automatically in **Firebase Cloud Firestore**.

---

## 🏗️ System Architecture

```text
  [ User Device / Browser ]
             │
             ▼
  ┌──────────────────────────────────────────────┐
  │         Frontend (React + Vite + TS)         │
  │  - Camera capture & File upload              │
  │  - Quick Demo Sample Images (1-click test)   │
  │  - Firebase Auth & Firestore Client SDK      │
  │  - Interactive Results & jsPDF Generator     │
  └──────────────────────┬───────────────────────┘
                         │ HTTP POST /predict (Multipart Image)
                         ▼
  ┌──────────────────────────────────────────────┐
  │          Backend (Flask REST API)            │
  │  - CORS & 10 MB Content-Length Guard         │
  │  - PIL Image Verification (corrupt image check)│
  │  - PyTorch Tensor Preprocessing (224x224)    │
  │  - DenseNet-121 Inference (torch.inference_mode)│
  │  - Disease Knowledgebase & Dosage Database   │
  └──────────────────────┬───────────────────────┘
                         │
                         ▼
  ┌──────────────────────────────────────────────┐
  │     best_densenet_model.pth Checkpoint       │
  │      (22 Plant Disease & Healthy Classes)    │
  └──────────────────────────────────────────────┘
```

---

## ✨ Key Features

- **📸 Multi-Modal Image Input:** Live webcam/mobile camera capture, file upload with drag-and-drop, and 10 MB client/server size protection.
- **⚡ 1-Click Viva Demo Samples:** Pre-loaded with healthy, spotted, and mosaic leaf sample cards for instant demonstration without searching for images.
- **🧠 Deep Learning Inference:** DenseNet-121 architecture fine-tuned across 22 crop condition classes with ImageNet normalization.
- **🛡️ Low-Confidence Guard:** Flags low-confidence predictions (< 50%) to alert users about blurry images or non-crop photos.
- **💊 Detailed Treatment Database:** Curated symptoms, severity levels, and specific pesticide recommendations (dosage, frequency, and chemical classification).
- **📄 Lab Report Export:** Generates downloadable PDF reports with crop diagnosis, severity badges, prevention tips, and the **scanned leaf photo embedded**.
- **🔐 Cloud Authentication:** Role-based registration with email/password authentication via Firebase Auth.
- **☁️ Real-Time Scan History:** Cloud Firestore synchronization storing user scans (`users/{uid}/scans`) with date, disease, and confidence level.

---

## 🌿 Supported Crops & Diseases (22 Classes)

The fine-tuned model identifies diseases and healthy leaves across 4 major crops:

| Crop | Classes & Detected Conditions |
| :--- | :--- |
| **🌽 Maize (Corn)** | Healthy, Grasshopper damage, Leaf Beetle, Fall Armyworm, Leaf Blight, Leaf Spot, Streak Virus |
| **🥔 Cassava** | Healthy, Mosaic Disease, Bacterial Blight, Green Mite damage, Brown Leaf Spot |
| **🍅 Tomato** | Healthy, Septoria Leaf Spot, Leaf Blight, Leaf Curl Virus, Verticillium Wilt |
| **🥜 Cashew** | Healthy, Leaf Miner, Red Rust (algal), Anthracnose, Gummosis |

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + Radix UI (shadcn/ui primitives)
- **Icons:** Lucide React
- **State & Routing:** React Router v6
- **Backend as a Service:** Firebase Authentication & Cloud Firestore
- **Document Generation:** jsPDF

### Backend
- **Framework:** Python Flask + Flask-CORS
- **Deep Learning:** PyTorch, Torchvision (DenseNet-121)
- **Image Processing:** Pillow (PIL)
- **WSGI / Server:** Werkzeug / Gunicorn ready

---

## 📁 Project Directory Structure

```text
FinalYearProject Code/
├── .gitignore                   # Root gitignore (ignores pycache, env, node_modules)
├── README.md                    # Project documentation (this file)
│
├── Backend/                     # Flask inference API & PyTorch model
│   ├── app.py                   # REST API routes (/, /health, /predict) & disease DB
│   ├── best_densenet_model.pth  # Trained DenseNet-121 weights (22 classes)
│   └── requirements.txt         # Python dependencies
│
└── Frontend/                    # React + TypeScript single-page application
    ├── .env                     # API base URL & Firebase configuration
    ├── package.json             # Node dependencies and scripts
    ├── vite.config.ts           # Vite bundler configuration
    ├── src/
    │   ├── App.tsx              # App routes & ProtectedRoute setup
    │   ├── context/
    │   │   └── AuthContext.tsx  # Firebase auth session provider
    │   ├── lib/
    │   │   └── firebase.ts      # Firebase Auth & Firestore initialization
    │   ├── components/
    │   │   ├── Navbar.tsx       # Navigation bar with active state & auth pill
    │   │   ├── Footer.tsx       # SPA router links and dynamic copyright
    │   │   └── ui/              # shadcn UI components (buttons, cards, toasts)
    │   ├── pages/
    │   │   ├── Index.tsx        # Landing hero page & feature walkthrough
    │   │   ├── Login.tsx        # Authentication login page
    │   │   ├── Register.tsx     # User registration with role selection
    │   │   ├── CameraUpload.tsx # Camera stream, file uploader & demo samples
    │   │   ├── Results.tsx      # Diagnosis view, history & PDF exporter
    │   │   └── NotFound.tsx     # 404 page
    │   └── assets/              # Demo leaf photos and hero graphics
```

---

## 🚀 Installation & Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **Python**: v3.9 to v3.12 ([Download Python](https://www.python.org/))
- **Git**: Installed on your system

---

### 1. Backend Setup (Flask + PyTorch)

1. Open a terminal and navigate to the `Backend` directory:
   ```powershell
   cd Backend
   ```

2. *(Recommended)* Create and activate a virtual environment:
   ```powershell
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Linux/macOS:
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```powershell
   pip install -r requirements.txt
   ```

4. Verify that `best_densenet_model.pth` is present in the `Backend` directory.

5. Start the Flask server:
   ```powershell
   python app.py
   ```
   *The server will start on `http://127.0.0.1:5000`.*

6. **Verify the server is running:**
   - Open your browser at [http://127.0.0.1:5000](http://127.0.0.1:5000) (Returns status 200 message).
   - Check [http://127.0.0.1:5000/health](http://127.0.0.1:5000/health) (Returns model diagnostics and class list).

---

### 2. Frontend Setup (React + Vite)

1. Open a **new** terminal and navigate to the `Frontend` directory:
   ```powershell
   cd Frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Ensure `Frontend/.env` exists with your backend address and Firebase credentials:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:5000

   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   *The frontend will run at `http://localhost:5173`.*

---

## 📡 API Documentation

### `GET /`
Returns backend API service status and endpoint directory.
```json
{
  "message": "Smart Crop Detector Backend API is running!",
  "endpoints": {
    "health": "/health",
    "predict": "/predict (POST with 'file')"
  }
}
```

### `GET /health`
Comprehensive system health check. Confirms model load state, class count, and output layer integrity.
```json
{
  "status": "ok",
  "service": "smart-crop-detector-backend",
  "model_loaded": true,
  "classes": 22,
  "class_mapping_valid": true,
  "class_names": ["Maize grasshoper", "Cassava mosaic", ...]
}
```

### `POST /predict`
Inference endpoint accepting multipart form-data.
- **Request Body:** `multipart/form-data` with key `file` (image binary, max 10 MB).
- **Response Format:**
```json
{
  "prediction": "Tomato septoria leaf spot",
  "confidence": 94.6,
  "low_confidence": false,
  "severity": "Moderate",
  "description": "Septoria leaf spot is caused by the fungus Septoria lycopersici...",
  "symptoms": [
    "Small circular water-soaked spots on lower leaves",
    "Spots develop grey centers with dark brown borders",
    "Tiny black pycnidia visible within spot centers",
    "Progressive leaf yellowing from bottom upwards"
  ],
  "pesticides": [
    {
      "name": "Chlorothalonil 75% WP",
      "dosage": "2 grams per liter of water",
      "application": "Foliar spray at 7-10 day intervals",
      "type": "Protectant Fungicide"
    }
  ]
}
```

---

## 🔐 Authentication Workflow

To ensure a structured demonstration for academic evaluation:
1. **Registration (`/register`):** User submits name, email, password, and role.
2. **Auto-Signout:** The app saves the profile to Firestore and calls `signOut(auth)` immediately so the session does not bypass the login screen.
3. **Redirect to Login (`/login`):** User is routed to the login page with a success toast.
4. **Pre-Filled Email:** The email used during registration is pre-populated automatically into the input field.
5. **Smart Return URL:** Once logged in, the user is navigated directly to `/camera-upload` (or whichever protected page they originally attempted to visit).

---

## ❓ Troubleshooting & FAQs

#### 1. Why does `http://127.0.0.1:5000` return "Not Found"?
> Flask routes are explicit. Visiting the base address now returns a welcome index. For diagnostics, always visit `/health`.

#### 2. What happens if I upload an image that is not a crop leaf?
> If the image is unrelated or blurry, the model's confidence will typically drop. When confidence is below 50%, an **amber advisory banner** alerts the user to upload a clear photo of an actual crop leaf.

#### 3. How do I change the backend URL for deployment?
> Change `VITE_API_BASE_URL` in `Frontend/.env` to your production backend URL (e.g. Render, Railway, or AWS EC2) and rebuild with `npm run build`.

---

## 👨‍💻 Project Information

- **Project Title:** Smart Crop Detector — Smart Farming Through Smart Detection
- **Domain:** Artificial Intelligence / Computer Vision / Precision Agriculture
- **Architecture:** DenseNet-121 (Densely Connected Convolutional Networks)
