import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import nodemailer from "nodemailer";
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
  })
);

app.use(express.json({ limit: "25kb" }));
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getMailTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

app.post("/api/contact", rateLimit, async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim();
    const phone = String(req.body.phone || "").trim();
    const message = String(req.body.message || "").trim();

    if (!name || name.length < 2) {
      return res.status(400).json({
        error: "Introduce tu nombre."
      });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        error: "Introduce un correo electrónico válido."
      });
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({
        error: "Faltan datos SMTP en el servidor."
      });
    }

    const transporter = getMailTransporter();

    const toEmail = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;
    const fromName = process.env.CONTACT_FROM_NAME || "Formulario web";

    await transporter.sendMail({
      from: `"${fromName}" <${process.env.SMTP_USER}>`,
      to: toEmail,
      replyTo: email,
      subject: `Nueva consulta desde la web - ${name}`,
      text: `
Nueva consulta desde la web de Sango Psicología

Nombre: ${name}
Email: ${email}
Teléfono: ${phone || "No indicado"}

Mensaje:
${message}
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Nueva consulta desde la web</h2>

          <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Teléfono:</strong> ${phone ? escapeHtml(phone) : "No indicado"}</p>

          <hr />

          <p><strong>Mensaje:</strong></p>
          <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
        </div>
      `
    });

    res.json({
      ok: true,
      message: "Mensaje enviado correctamente."
    });
  } catch (error) {
    console.error("Contact form error:", error);

    res.status(500).json({
      error:
        "No se ha podido enviar el mensaje. Inténtalo de nuevo más tarde o escribe directamente por email."
    });
  }
});

const requestLog = new Map();

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || "unknown";
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 25;

  const current = requestLog.get(ip) || [];
  const recent = current.filter((timestamp) => now - timestamp < windowMs);

  if (recent.length >= maxRequests) {
    return res.status(429).json({
      error: "Demasiadas preguntas seguidas. Inténtalo de nuevo más tarde."
    });
  }

  recent.push(now);
  requestLog.set(ip, recent);
  next();
}

const SYSTEM_PROMPT = `
Eres el asistente informativo de Sango Psicología, una clínica de psicología.

Objetivo:
- Resolver dudas generales sobre la clínica, los servicios y cómo empezar terapia.
- Transmitir cercanía, calma, profesionalidad y claridad.
- Animar a pedir una primera consulta cuando sea adecuado.

Información de la clínica:
- Sango Psicología ofrece acompañamiento psicológico.
- Servicios principales: terapia individual, terapia de pareja, terapia sexual e intervención en crisis.
- El enfoque es cercano, personalizado, profesional y adaptado a cada historia.
- La web tiene una sección de contacto y una integración con Calendly para reservar una primera consulta.

Reglas estrictas:
- No diagnostiques.
- No des tratamiento psicológico personalizado.
- No sustituyas una sesión con una psicóloga.
- No pidas detalles íntimos innecesarios.
- No prometas resultados.
- No digas que algo "se cura" o que la terapia garantiza resultados.
- No respondas como si fueras una psicóloga humana.
- No gestiones emergencias.

Si la persona menciona autolesión, suicidio, violencia, abuso, riesgo inmediato o crisis grave:
- Responde con calma.
- Recomienda contactar inmediatamente con emergencias.
- En España, menciona 112.
- Recomienda acudir a urgencias o contactar con una persona de confianza.
- No continúes haciendo preguntas clínicas.

Estilo:
- Español de España.
- Cercano pero sobrio.
- Frases cortas.
- Sin tono comercial agresivo.
- Sin emojis salvo que el usuario use un tono muy informal.
- Máximo 120 palabras salvo que el usuario pida más detalle.

Cuando no sepas algo concreto:
- Sé honesto.
- Recomienda contactar con la clínica.
`;

function cleanMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((message) => {
      return (
        message &&
        ["user", "assistant"].includes(message.role) &&
        typeof message.content === "string"
      );
    })
    .slice(-8)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, 1200)
    }));
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/chat", rateLimit, async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Falta OPENAI_API_KEY en el servidor."
      });
    }

    const messages = cleanMessages(req.body.messages);

    if (messages.length === 0) {
      return res.status(400).json({
        error: "No se recibió ningún mensaje válido."
      });
    }

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions: SYSTEM_PROMPT,
      input: messages
    });

    res.json({
      reply:
        response.output_text ||
        "Lo siento, ahora mismo no he podido generar una respuesta."
    });
  } catch (error) {
    console.error("OpenAI error:", error);

    res.status(500).json({
      error:
        "Ahora mismo no puedo responder. Puedes intentar de nuevo o contactar directamente con la clínica."
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});