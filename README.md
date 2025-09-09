# Aadhaar OCR – Server (Backend)

This is the **backend (server)** of the Aadhaar OCR system.  
It is built with **Node.js, Express.js** and provides RESTful APIs for Aadhaar card OCR processing.  

---

## 🚀 Features

- Handle **Aadhaar front & back image uploads**.  
- Process images using OCR (Tesseract.js).  
- Extract Aadhaar card details from uploaded images.  
- Store extracted data in **MongoDB**.  
- Provide secure APIs for frontend to consume.  

---

## 🖥️ Tech Stack

- **Node.js** (Runtime)  
- **Express.js** (Server Framework)  
- **MongoDB** (Database)  
- **Multer** (File Uploads)  
- **Tesseract.js** (OCR Engine)  
- Deployment → **Render / Railway / VPS**  

---
```
## 📂 Project Structure
Backend/
└── src/

C:.
│   index.ts
│   
├───config
│       env.ts
│
├───controllers
│       ocr.controller.ts
│
├───routes
│       ocr.routes.ts
│
├───services
│       ocr.service.ts
│
└───utils
        parsers.ts
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/AadhaarOCR-Server.git
```
⚙️ Environment Variables

Create a .env.example file in the backend/ folder:
```env.examlpe
PORT=5000
MONGO_URI=mongodb://localhost:27017/aadhaarOCR
CLOUDINARY_URL=your_cloudinary_url
```
## 🛠️ Setup Instructions

Navigate to the backend folder:
```
cd backend
```
Install dependencies:
```
npm install
```

Build and Run the development server:
```
npm run build
npm run dev
```

API Base URL:
``
example : http://localhost:5000
``
📄 License

This project is licensed under the JYOTHISH T M




