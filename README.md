# Receipts Microservice (NestJS + Encore + Prisma)

Microservicio para gestión de comprobantes de compra (receipts) con endpoints CRUD, exportación CSV y analítica AI, usando Encore API style, Prisma ORM y PostgreSQL.

---

## 🚀 Comandos principales

```bash
# Instalar dependencias
npm install

# Ejecutar migraciones Prisma
npx prisma migrate deploy

# Correr el seed (carga datos de prueba)
npm run seed

# Iniciar el microservicio Encore (modo desarrollo)
encore run
```

---

## 📦 Versiones principales usadas

- Node.js: **18+**
- Encore: **^1.48.4**
- NestJS: **^10.0.0**
- Prisma: **^6.10.1**
- PostgreSQL: **13+**
- OpenAI SDK: **^5.5.1**

---

## 📚 Endpoints disponibles

### 1. Registrar comprobante
- **POST** `/receipts`
- **Body JSON:**
```json
{
  "companyId": "string",
  "supplierRuc": "20123456789",
  "invoiceNumber": "F001-123",
  "amount": 100.5,
  "issueDate": "2025-06-10",
  "documentType": "FACTURA"
}
```
- **Respuesta:** Comprobante registrado con IGV y total calculados.

---

### 2. Listar comprobantes (con filtros, paginación y orden)
- **GET** `/receipts`
- **Query params opcionales:**
  - `page` (número de página)
  - `limit` (resultados por página)
  - `issueDate` (YYYY-MM-DD)
  - `documentType` (ej: FACTURA)
  - `status` (pending, validated, rejected, observed)
- **Ejemplo:**
```
GET /receipts?page=1&limit=10&status=validated
```
- **Respuesta:** Listado paginado de comprobantes.

---

### 3. Actualizar estado de comprobante
- **PATCH** `/receipts/:id/status`
- **Body JSON:**
```json
{
  "status": "validated" // o "rejected", "observed"
}
```
- **Respuesta:** Estado actualizado.

---

### 4. Exportar comprobantes a CSV
- **GET** `/receipts/export/csv`
- **Query params opcionales:** mismos que `/receipts`
- **Respuesta:** Archivo CSV (o string CSV en local).

---

### 5. Analítica AI sobre comprobantes
- **POST** `/ai/query`
- **Body JSON:**
```json
{
  "question": "¿Cuál es el total de comprobantes validados este mes?"
}
```
- **Respuesta:** Respuesta generada por OpenAI basada en los datos actuales.

---

## 🛠️ Requisitos previos
- Node.js 18+
- PostgreSQL
- Clave API de OpenAI (para endpoint AI)

---

## ⚙️ Variables de entorno
Crea un archivo `.env` con:
```
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/tu_db
OPENAI_API_KEY=sk-xxxxxx
```

---

## 🧪 Pruebas rápidas con cURL

Registrar comprobante:
```bash
curl -X POST http://localhost:4000/receipts \
  -H 'Content-Type: application/json' \
  -d '{"companyId":"1","supplierRuc":"20123456789","invoiceNumber":"F001-123","amount":100.5,"issueDate":"2025-06-10","documentType":"FACTURA"}'
```

Listar comprobantes:
```bash
curl 'http://localhost:4000/receipts?page=1&limit=5'
```

Actualizar estado:
```bash
curl -X PATCH http://localhost:4000/receipts/{id}/status \
  -H 'Content-Type: application/json' \
  -d '{"status":"validated"}'
```

Exportar CSV:
```bash
curl 'http://localhost:4000/receipts/export/csv'
```

Analítica AI:
```bash
curl -X POST http://localhost:4000/ai/query \
  -H 'Content-Type: application/json' \
  -d '{"question":"¿Cuánto es el total validado?"}'
```

---

## ✨ Notas
- Todos los endpoints siguen el estilo Encore (no controllers tradicionales de NestJS).
- El seed inserta comprobantes de prueba con todos los estados y fechas variadas.
- El endpoint AI requiere clave OpenAI válida.

---

¡Listo para usar y extender!
