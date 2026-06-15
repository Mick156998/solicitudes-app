# 📌 Gestor de Solicitudes (solicitudes-app)

Aplicación web para la gestión de solicitudes, desarrollada con Next.js y React. Permite crear, visualizar y administrar solicitudes mediante una interfaz moderna, consumiendo datos simulados a través de JSON Server.
---

## 📖 Descripción de la solución

El proyecto **Gestor de Solicitudes** es una aplicación que permite:

- Crear y gestionar solicitudes
- Listar solicitudes existentes
- Visualizar detalle de cada solicitud
- Simular un backend mediante JSON Server
- Ejecutar pruebas unitarias y end-to-end

La aplicación está construida con **Next.js App Router**, consumiendo datos mediante `fetch` desde una API simulada.

---

## Diseño Figma
https://www.figma.com/design/oPAYuAQdAJNihRobQzKeMA/Sin-t%C3%ADtulo?node-id=0-1&p=f

## 🧠 Decisiones técnicas

### 🔧 Frontend
- **Next.js (App Router)**: arquitectura moderna basada en Server Components y routing simplificado.
- **React + TypeScript**: tipado estático para mayor robustez y mantenibilidad.
- **Tailwind CSS**: utilidades para estilos rápidos y consistentes.
- **Lucide-react**: librería de iconos ligera y moderna.

### 🌐 Consumo de datos
- **fetch API**: utilizada para comunicación con backend simulado.
- **JSON Server**: simula una API REST real para desarrollo y testing.

### 🧪 Testing
- **Jest**: pruebas unitarias y de integración.
- **Playwright (E2E)**: pruebas end-to-end.
- **Concurrently + wait-on**: ejecución coordinada de entorno para pruebas E2E.

### 🐳 Infraestructura
- **Docker**: contenedorización de la aplicación para ejecución consistente en distintos entornos.

---
## 📦 Dependencias principales

- next
- react
- react-dom
- typescript
- tailwindcss
- lucide-react
- jest
- playwright
- json-server
- concurrently
- wait-on

---

## ⚙️ Requisitos del entorno

- Node.js **v22.22.3**
- npm o yarn
- Docker
---

## Agregar archivos env
- **.env:** NEXT_PUBLIC_API_URL=http://json-server:3001
- **.env.local:** NEXT_PUBLIC_API_URL=http://localhost:3001
- **.env.test:** NEXT_PUBLIC_API_URL=http://localhost:3002

## 🚀 Comandos disponibles

### 🔹 Desarrollo
```bash
npm install

## 🧪 Levantar backend simulado (JSON Server)
npm run mock-api
## 🧪 Levantar la aplicación en desarrollo
npm run dev
