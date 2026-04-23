# 🤖 Chat IASDK - Agentic Assistant Framework

Una implementación avanzada de asistentes de IA utilizando **Vercel AI SDK**, **Next.js 15**, y una arquitectura modular de **Skills** y **Tools (MCP)**. Este proyecto está diseñado para ser altamente adaptable, permitiendo calificar leads, enviar correos y extender las capacidades del agente de forma sencilla.

---

## 🚀 Tecnologías Core

- **Framework:** Next.js (App Router)
- **AI Engine:** Vercel AI SDK (`ai`)
- **Modelos:** OpenAI (GPT-4o / GPT-4o-mini)
- **Base de Datos:** Supabase
- **Correos:** Resend
- **UI/UX:** Framer Motion, Lucide React, Tailwind CSS

---

## 🛠️ Configuración Inicial

1. **Clonar y instalar dependencias:**
   ```bash
   npm install
   ```

2. **Variables de Entorno:**
   Crea un archivo `.env.local` con las siguientes claves:
   ```env
   OPENAI_API_KEY=tu_clave_aqui
   RESEND_API_KEY=tu_clave_aqui
   MAILPRIMERO=email_receptor_pruebas
   SUPABASE_SERVICE_ROLE_KEY=tu_clave_supabase
   NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
   CRON_SECRET=secreto_para_crons
   ```

3. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

---

## 🧠 Sistema de Skills (Habilidades)

Las **Skills** son fragmentos de comportamiento, personalidad o conocimiento especializado que se inyectan en el prompt del sistema del agente. Esto permite modularizar el comportamiento del bot sin saturar un solo archivo de configuración.

### Cómo crear una Skill
Crea un archivo en `lib/skills/[nombre].ts`:
```typescript
// lib/skills/expert.ts
export const expertSkill = `
Eres un experto en [Tema].
- Siempre respondes de forma concisa.
- Usas terminología técnica precisa.
`;
```

### Cómo registrar una Skill
En `app/api/chat/route.ts`, importa e inyecta la skill en el `system` prompt:
```typescript
import { expertSkill } from '@/lib/skills/expert';

const result = streamText({
  model: openai('gpt-4o-mini'),
  system: `${expertSkill}\n\nOtras instrucciones...`,
  // ...
});
```

---

## 🔧 MCP & Tools (Capacidades Funcionales)

El proyecto utiliza un enfoque inspirado en **MCP (Model Context Protocol)** para exponer funciones locales al modelo de lenguaje. Esto permite que el agente realice acciones como guardar leads en la base de datos o disparar flujos de trabajo de email.

### Estructura de una Tool
Las herramientas se definen en `lib/tools/` y utilizan `zod` para la validación de esquemas.

Ejemplo de `captureLead`:
1. **Definición:** En `lib/tools/leadTool.ts`, se define la lógica de negocio y el esquema de entrada.
2. **Integración:** El agente decide cuándo llamar a la tool basándose en la descripción proporcionada.

```typescript
export const captureLead = tool({
  description: "Llama SOLO cuando tengas nombre, email, presupuesto e interés.",
  inputSchema: leadSchema,
  execute: async (lead) => {
    // Lógica: Guardar en DB + Enviar Email (MCP Workflow)
    const saved = await saveLead(lead);
    await triggerEmailWorkflow({ leadId: saved.id });
    return { status: 'success' };
  }
});
```

### Flujos MCP (Model Context Protocol)
Ubicados en `lib/mcp/`, estos módulos manejan integraciones externas complejas. Por ejemplo, `lib/mcp/resend.ts` actúa como un conector para flujos de automatización de correo.

---

## 💬 Frontend: ChatWidget

El componente `ChatWidget` es un componente de cliente que puedes colocar en cualquier parte de tu aplicación para habilitar el chat emergente.

- **Ubicación:** `components/ChatWidget.tsx`
- **Características:** 
  - Estado de streaming (animaciones de carga).
  - Persistencia de mensajes en UI.
  - Diseño premium con `framer-motion`.

---

## 📂 Estructura del Proyecto

```text
├── app/
│   └── api/chat/route.ts      # Endpoint principal del agente
├── components/
│   ├── chat-message.tsx       # Renderizado de mensajes
│   └── ChatWidget.tsx         # Widget de chat flotante
├── lib/
│   ├── mcp/                   # Integraciones de servicios (Resend, etc)
│   ├── skills/                # Prompts de comportamiento modular
│   ├── tools/                 # Herramientas funcionales (Vercel AI tools)
│   └── db/                    # Lógica de base de datos (Supabase)
└── package.json
```

---

## 🔗 Recursos Adicionales
- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [Agent Skills Inspiration](https://skills.sh/)
- [Next.js Documentation](https://nextjs.org/docs)