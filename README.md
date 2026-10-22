# Mi camino al gym 🎀

Una aplicación web tierna (estilo *kawaii*) creada con **React + TypeScript + Vite** para registrar el reto de **30 asistencias al gimnasio** entre el **miércoles 21 de octubre de 2026** y el **lunes 21 de diciembre de 2026**.

Hecha con amor por Cristhian 💗.

---

## ✨ Características

- **Calendario interactivo (Octubre – Diciembre 2026):** Semanas que inician en lunes, navegación con botones o deslizando el dedo (*swipe*) en celular.
- **Stickers animados:** Al tocar un día válido se marca con un tierno sticker animado (corazón, moño, estrella o gatito) y un mensaje motivacional aleatorio.
- **Soporte para tus propios stickers PNG:** Puedes agregar tus propias imágenes en `public/stickers/` y se usarán automáticamente.
- **Panel de progreso en tiempo real:**
  - Contador grande `X / 30 venidas` con efecto de brillo.
  - Barra de progreso rosada.
  - Días restantes hasta la meta (`21 de diciembre`).
  - Venidas que faltan y cálculo automático del ritmo semanal necesario (`~N veces por semana`).
- **Celebración con confeti:** Fiesta de confeti al alcanzar las 30 asistencias.
- **100% Estático y Persistente:** Guarda todo automáticamente en `localStorage` del navegador sin necesidad de servidor ni base de datos externa.

---

## 🖼️ Cómo agregar tus propios stickers PNG

La carpeta `public/stickers/` está lista para que coloques tus propios stickers en formato `.png` (preferiblemente con fondo transparente).

Solo guarda tus imágenes dentro de `public/stickers/` con alguno de estos nombres:

- `public/stickers/sticker1.png` (o `corazon.png`)
- `public/stickers/sticker2.png` (o `mono.png`)
- `public/stickers/sticker3.png` (o `estrella.png`)
- `public/stickers/sticker4.png` (o `gatito.png`)

Si los archivos existen, la app los mostrará en los días marcados; si no existen, usará automáticamente los stickers SVG originales dibujados a mano.

---

## 🚀 Cómo desplegar gratis en GitHub Pages

El proyecto ya incluye `base: './'` en `vite.config.ts` y el flujo de trabajo automático en `.github/workflows/deploy.yml`. Sigue estos 3 pasos:

### Paso 1: Crear el repositorio en GitHub
1. Entra a [github.com/new](https://github.com/new).
2. Escribe un nombre para el repositorio (por ejemplo, `mi-camino-al-gym`).
3. Elige **Public** (público) para poder usar GitHub Pages gratis.
4. Haz clic en **Create repository**.

### Paso 2: Subir el código desde tu computadora
Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
git init
git add .
git commit -m "Regalo: Mi camino al gym 🎀"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```
*(Reemplaza `TU_USUARIO` y `TU_REPOSITORIO` por los tuyos).*

### Paso 3: Activar GitHub Pages con GitHub Actions
1. En tu repositorio de GitHub, ve a la pestaña **Settings** (Configuración).
2. En el menú lateral izquierdo, haz clic en **Pages**.
3. En la sección **Build and deployment**, debajo de **Source**, cambia la opción a **GitHub Actions**.
4. ¡Listo! Ve a la pestaña **Actions** de tu repositorio: verás que el workflow **Deploy to GitHub Pages** se ejecuta automáticamente y, en aproximadamente 1 minuto, te dará el enlace público para compartir con tu novia 💕.

---

## 💻 Desarrollo local

Si deseas probar o editar el proyecto en tu computadora:

```bash
npm install
npm run dev
```
