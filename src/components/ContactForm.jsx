import React, { useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  message: ""
};

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({
    type: "idle",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setStatus({
      type: "idle",
      message: ""
    });

    if (!accessKey) {
      setStatus({
        type: "error",
        message:
          "Falta configurar VITE_WEB3FORMS_ACCESS_KEY en el archivo .env."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        access_key: accessKey,
        subject: `Nueva consulta desde la web - ${form.name}`,
        from_name: "Sango Psicología",
        name: form.name,
        email: form.email,
        phone: form.phone || "No indicado",
        message: form.message
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "No se ha podido enviar el mensaje."
        );
      }

      setForm(initialForm);

      setStatus({
        type: "success",
        message:
          "Mensaje enviado correctamente. Nos pondremos en contacto contigo lo antes posible."
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message ||
          "No se ha podido enviar el mensaje. Inténtalo de nuevo más tarde."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form-grid">
        <label>
          <span>Nombre *</span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Tu nombre"
            required
          />
        </label>

        <label>
          <span>Correo electrónico *</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="tuemail@ejemplo.com"
            required
          />
        </label>
      </div>

      <label>
        <span>Teléfono</span>
        <input
          type="tel"
          value={form.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder="Opcional"
        />
      </label>

      <label>
        <span>Mensaje *</span>
        <textarea
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Cuéntanos brevemente en qué podemos ayudarte."
          rows={5}
          required
        />
      </label>

      <p className="contact-form-warning">
        Este formulario es solo para consultas generales. No incluyas
        información urgente ni datos clínicos sensibles. Si estás en una
        situación de urgencia o riesgo inmediato, contacta con emergencias o
        acude al servicio de urgencias más cercano.
      </p>

      {status.message && (
        <div className={`contact-form-status contact-form-status-${status.type}`}>
          {status.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{status.message}</span>
        </div>
      )}

      <button
        className="btn btn-primary contact-form-submit"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="contact-form-spinner" />
            Enviando...
          </>
        ) : (
          <>
            Enviar mensaje
            <Send size={18} />
          </>
        )}
      </button>
    </form>
  );
}