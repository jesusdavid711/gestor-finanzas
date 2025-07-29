# Gestor de Finanzas - Jesús Castro 💼📊

Una aplicación web de gestión financiera para pequeñas tiendas o negocios. Permite controlar ingresos y egresos mediante un sistema de movimientos de compras y ventas, clasificados por categorías. También ofrece un módulo de reportes con análisis visual del comportamiento mensual y por producto o categoría.

---

## 🚀 Funcionalidades

- ✅ Crear, editar y eliminar movimientos financieros (compras/ventas)
- ✅ Clasificar movimientos por categorías
- ✅ Filtrar movimientos por tipo, categoría y rango de fechas
- ✅ Visualizar reportes dinámicos:
  - Categoría más vendida y más comprada
  - Producto más vendido y más comprado
  - Mes con más ventas y con más compras
  - Totales agrupados por categoría y por mes

---

## 🛠️ Tecnologías utilizadas

- HTML5 + CSS3
- JavaScript (ES6+)
- [`json-server`](https://github.com/typicode/json-server) (como API REST local)

---

## 📁 Estructura del Proyecto

gestor-finanzas/
├── db.json # Base de datos local (JSON)
├── index.html # Página de inicio (Dashboard)
├── movimientos.html # Página de gestión de movimientos
├── reportes.html # Página de reportes
├── js/
│ ├── guardian.js # Protección de rutas con sesión
│ ├── movimientos.js # CRUD + filtros de movimientos
│ └── reportes.js # Generación de reportes dinámicos
├── styles/
│ ├── movimientos.css
│ └── reportes.css
└── README.md



---

## 🧑‍💻 Instalación y ejecución

### 1. Clona el repositorio
```bash
git clone https://github.com/jesusdavid711?tab=repositories
cd gestor-finanzas

