# 📚 BiblioManager — AI-Powered Library Management System

A full-stack library management system enhanced with a Generative AI chatbot powered by RAG (Retrieval-Augmented Generation). The assistant understands natural language questions about the book catalog, remembers conversation context, and retrieves semantically relevant books using vector embeddings from a live MySQL database.

Built entirely in Java using LangChain4j — works with Google Gemini and OpenAI, switchable with zero code changes.

---

## 🛠️ Tech Stack
React · TypeScript · Spring Boot · Java · LangChain4j · Google Gemini API · RAG · Vector Embeddings · MySQL · REST APIs

---

## 🚀 How To Run Locally

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- A free [Google Gemini API Key](https://aistudio.google.com/apikey)

### Backend
```bash
cd 01-backend/spring-boot-library
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Fill in your DB credentials and Gemini API key in application.properties
./mvnw spring-boot:run
```
Runs on **http://localhost:9090**

### Frontend
```bash
cd 02-front-end/react-library
npm install
npm start
```
Runs on **http://localhost:3000**

---

## 👨‍💻 Author
**Mohamed Aghnaou** — aghnaoumohamed@gmail.com
