import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `
Eres el asistente informativo de Sango Psicología, una clínica de psicología.

Objetivo:
- Resolver dudas generales sobre la clínica, los servicios y cómo empezar terapia.
- Transmitir cercanía, calma, profesionalidad y claridad.
- Animar a contactar o reservar una primera consulta cuando sea adecuado.

Información de la clínica:
- Sango Psicología ofrece acompañamiento psicológico.
- Servicio principal actual: terapia individual para adultos.
- La terapia tiene una duración de 50 minutos.
- Modalidad: terapia online con un enfoque cercano.
- Precio: 55€.
- El enfoque es cercano, personalizado, profesional y adaptado a cada historia.
- La web permite reservar por Calendly y enviar consultas por formulario.

Reglas estrictas:
- No diagnostiques.
- No des tratamiento psicológico personalizado.
- No sustituyas una sesión con una psicóloga.
- No pidas detalles íntimos innecesarios.
- No prometas resultados.
- No digas que algo "se cura".
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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido."
    });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Falta OPENAI_API_KEY en el servidor."
      });
    }

    const messages = cleanMessages(req.body?.messages);

    if (messages.length === 0) {
      return res.status(400).json({
        error: "No se recibió ningún mensaje válido."
      });
    }

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
      instructions: SYSTEM_PROMPT,
      input: messages
    });

    return res.status(200).json({
      reply:
        response.output_text ||
        "Lo siento, ahora mismo no he podido generar una respuesta."
    });
  } catch (error) {
    console.error("OpenAI error:", error);

    return res.status(500).json({
      error:
        "Ahora mismo no puedo responder. Puedes intentar de nuevo o contactar directamente con la clínica."
    });
  }
}