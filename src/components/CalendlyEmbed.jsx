import React, { useEffect, useRef, useState } from "react";

const DEFAULT_CALENDLY_URL =
  "https://calendly.com/info-sangopsicologia/primera-sesion";
  

function loadCalendlyScript() {
  return new Promise((resolve, reject) => {
    if (window.Calendly) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () => reject());
      return;
    }

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();

    document.body.appendChild(script);
  });
}

export default function CalendlyEmbed() {
  const calendlyRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  const calendlyUrl =
    import.meta.env.VITE_CALENDLY_URL || DEFAULT_CALENDLY_URL;

  useEffect(() => {
    let cancelled = false;

    async function initializeCalendly() {
      try {
        setHasError(false);

        await loadCalendlyScript();

        if (cancelled || !calendlyRef.current || !window.Calendly) return;

        calendlyRef.current.innerHTML = "";

        window.Calendly.initInlineWidget({
          url: calendlyUrl,
          parentElement: calendlyRef.current,
          resize: true
        });
      } catch (error) {
        console.error("Calendly embed error:", error);
        setHasError(true);
      }
    }

    initializeCalendly();

    return () => {
      cancelled = true;
    };
  }, [calendlyUrl]);

  if (hasError) {
    return (
      <div className="calendly-error">
        No se ha podido cargar el calendario. Revisa que el enlace de Calendly
        sea correcto y que el evento esté activo.
      </div>
    );
  }

  return (
    <div className="calendly-shell">
      <div ref={calendlyRef} className="calendly-embed" />
    </div>
  );
}