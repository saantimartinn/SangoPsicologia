import React, { useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Hola, soy el asistente informativo de Sango Psicología. Puedo ayudarte con dudas generales sobre la clínica, los servicios o cómo empezar terapia."
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput || isLoading) return;

    const userMessage = {
      role: "user",
      content: trimmedInput
    };

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al responder.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply
        }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error.message ||
            "Ahora mismo no puedo responder. Puedes contactar directamente con la clínica."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="chat-widget">
      {isOpen && (
        <section className="chat-panel" aria-label="Chat informativo">
          <header className="chat-header">
            <div>
              <strong>¿Tienes alguna duda?</strong>
              <span>Asistente informativo</span>
            </div>

            <button
              type="button"
              className="chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chat"
            >
              <X size={18} />
            </button>
          </header>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chat-message ${
                  message.role === "user"
                    ? "chat-message-user"
                    : "chat-message-assistant"
                }`}
              >
                {message.content}
              </div>
            ))}

            {isLoading && (
              <div className="chat-message chat-message-assistant chat-loading">
                <Loader2 size={16} />
                Pensando...
              </div>
            )}
          </div>

          <form className="chat-form" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Escribe tu duda..."
              maxLength={500}
            />

            <button type="submit" disabled={isLoading || !input.trim()}>
              <Send size={17} />
            </button>
          </form>

          <p className="chat-disclaimer">
            Este chat no sustituye una consulta psicológica ni atiende
            emergencias.
          </p>
        </section>
      )}

      <button
        type="button"
        className="chat-toggle"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}