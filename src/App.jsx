import React, { useState } from "react";
import ContactForm from "./components/ContactForm";
import ChatWidget from "./components/ChatWidget";
import CalendlyEmbed from "./components/CalendlyEmbed";
import {
  navLinks,
  adultTherapyService,
  values,
  steps,
  team,
  faqs,
  icons
} from "./data";

const {
  CalendarDays,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Quote,
  Sparkles
} = icons;

function Header({ activePage, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleNavigate(page) {
    onNavigate(page);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <button
          type="button"
          className="brand brand-button"
          aria-label="Sango Psicología"
          onClick={() => handleNavigate("inicio")}
        >
          <img
            src="/images/logo-sango.png"
            alt="Sango Psicología"
            className="brand-logo"
          />
        </button>

        <nav className={`nav ${isOpen ? "nav-open" : ""}`}>
          {navLinks.map((link) => (
            <button
              key={link.page}
              type="button"
              className={`nav-link ${
                activePage === link.page ? "nav-link-active" : ""
              }`}
              onClick={() => handleNavigate(link.page)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="header-cta header-cta-outline"
            onClick={() => handleNavigate("contacto")}
          >
            Contáctanos
          </button>

          <button
            type="button"
            className="header-cta"
            onClick={() => handleNavigate("contacto")}
          >
            Primera consulta
          </button>
        </div>

        <button
          className="menu-button"
          type="button"
          aria-label="Abrir menú"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

function Hero({ onNavigate }) {
  return (
    <section id="inicio" className="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <h1>
            Un espacio profesional, cercano y seguro para cuidar de tu salud mental.
          </h1>

          <p className="hero-lead">
            En Sango Psicología acompañamos procesos personales, emocionales y
            relacionales desde una mirada humana, rigurosa y adaptada a cada
            historia.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onNavigate("contacto")}
            >
              Empezar ahora
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNavigate("servicios")}
            >
              Ver servicios
            </button>
          </div>

          <div className="hero-trust">
            <div>
              <strong>Atención personalizada</strong>
              <span>Cada proceso se adapta a ti, no al revés.</span>
            </div>
            <div>
              <strong>Rigor y calidez</strong>
              <span>Un acompañamiento profesional sin perder cercanía.</span>
            </div>
          </div>
        </div>

        <div className="hero-image-card">
          <img
            src="/images/psicologas-sango.jpg"
            alt="Equipo de Sango Psicología"
            className="hero-team-image"
          />

          <div className="hero-floating-card">
            <Quote size={20} />
            <p>
              “La terapia es un espacio para entender lo que te ocurre y empezar
              a relacionarte contigo de otra manera.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionIntro({ eyebrow, title, text }) {
  return (
    <div className="section-intro">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function Approach() {
  return (
    <section id="enfoque" className="section approach">
      <div className="container">
        <SectionIntro
          eyebrow="Nuestro enfoque"
          title="Entendemos la terapia como un espacio para parar, entender qué te está pasando y empezar a construir cambios que tengan sentido para ti."
        />

        <div className="values-grid">
          {values.map((value) => (
            <article className="value-card" key={value.title}>
              <div className="value-dot" />
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </div>

        <div className="approach-banner">
          <div>
            <span>Sango significa cambio</span>
            <h3>En Sango creemos que el cambio siempre es posible.</h3>
          </div>
          <p>
            Incluso cuando parece difícil, incluso cuando no sabes por dónde
            empezar. Sango significa cambio, pero para nosotras también es
            acompañamiento. Un espacio donde ese cambio es posible, respetado y
            cuidado.
          </p>
        </div>
      </div>
    </section>
  );
}

function Services({ onNavigate }) {
  const service = adultTherapyService;

  return (
    <section id="servicios" className="section services service-detail-section">
      <div className="container">
        <div className="service-detail-hero">
          <div className="service-detail-copy">
            <span className="services-kicker">Servicios</span>

            <h2>{service.title}</h2>

            <h3>{service.introTitle}</h3>

            <div className="service-paragraphs">
              {service.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="service-booking-card">
            <span>{service.detailsTitle}</span>

            <div className="service-detail-list">
              {service.details.map((detail) => (
                <div className="service-detail-item" key={detail.label}>
                  <strong>{detail.label}</strong>
                  <p>{detail.value}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-primary service-booking-btn"
              onClick={() => onNavigate("contacto")}
            >
              Reservar una sesión
              <ArrowRight size={18} />
            </button>
          </aside>
        </div>

        <div className="difficulties-block">
          <div className="difficulties-header">
            <span>Dificultades que tratamos</span>
            <h3>{service.difficultiesTitle}</h3>
          </div>

          <div className="difficulties-grid">
            {service.difficulties.map((difficulty) => (
              <div className="difficulty-pill" key={difficulty}>
                <CheckCircle2 size={17} />
                {difficulty}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section id="nosotras" className="section team-section team-section-redesign">
      <div className="container">
        <div className="team-redesign-header">
          <div>
            <span className="team-kicker">Nosotras</span>
            <h2>¿Quiénes somos?</h2>
          </div>

          <p>
            En Sango entendemos la terapia como un espacio seguro, profesional y
            sin juicio. Nuestro trabajo parte de una mirada cálida, pero también
            estructurada, para acompañarte en tu propio proceso de cambio.
          </p>
        </div>

        <div className="team-redesign-grid">
          {team.map((person) => (
            <article className="team-profile-card" key={person.name}>
              <div className="team-profile-image-wrapper">
                <img
                  src={person.image}
                  alt={person.name}
                  className="team-profile-image"
                />
              </div>

              <div className="team-profile-content">
                <span className="team-profile-role">{person.role}</span>
                <h3>{person.name}</h3>

                <p className="team-profile-license">{person.license}</p>

                <div className="team-profile-text">
                  {person.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="team-specialties">
                  {person.specialties.map((specialty) => (
                    <span key={specialty}>{specialty}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="proceso" className="section process">
      <div className="container">
        <SectionIntro
          eyebrow="Proceso"
          title="No hay un único camino para cambiar, juntos construimos el tuyo."
        />

        <div className="steps-grid">
          {steps.map((step) => (
            <article className="step-card" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ({ onNavigate }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="section faq faq-redesign">
      <div className="container">
        <div className="faq-header">
          <SectionIntro
            eyebrow="Preguntas frecuentes"
            title="Antes de empezar, es normal tener dudas."
            text="Hemos reunido algunas de las preguntas más habituales antes de iniciar un proceso terapéutico. Si tienes cualquier otra duda, puedes contactarnos y estaremos encantadas de ayudarte."
          />
        </div>

        <div className="faq-content-grid">
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <article
                className={`faq-item ${openIndex === index ? "faq-item-open" : ""}`}
                key={faq.question}
              >
                <button type="button" onClick={() => setOpenIndex(index)}>
                  <span>{faq.question}</span>
                  <strong>{openIndex === index ? "−" : "+"}</strong>
                </button>

                {openIndex === index && <p>{faq.answer}</p>}
              </article>
            ))}
          </div>

          <aside className="faq-contact-card">
            <span>¿Sigues teniendo dudas?</span>

            <h3>Escríbenos y te orientamos.</h3>

            <p>
              Si no encuentras la respuesta que buscas o quieres saber si
              podemos ayudarte en tu caso, puedes contactar con nosotras antes
              de reservar una sesión.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onNavigate("contacto")}
            >
              Contactar
              <ArrowRight size={18} />
            </button>

          </aside>
        </div>
      </div>
    </section>
  );
}

function ContactPreview() {
  return (
    <section id="contacto" className="section contact-preview contact-section-redesign">
      <div className="container">
        <div className="contact-section-header">
          <span className="contact-kicker">Contacto</span>

          <h2>Reserva una sesión o escríbenos si tienes dudas.</h2>

          <p>
            Puedes reservar directamente una primera sesión o enviarnos una
            consulta breve. Si necesitas aclarar algo antes de empezar, estaremos
            encantadas de orientarte.
          </p>
        </div>

        <div className="contact-options-grid">
          <div className="contact-form-card" id="contacto-formulario">
            <div className="contact-card-intro">
              <span>Escríbenos</span>
              <h3>Cuéntanos en qué podemos ayudarte.</h3>
              <p>
                Déjanos tu nombre, correo electrónico y, si quieres, tu número
                de teléfono. Te responderemos lo antes posible.
              </p>
            </div>

            <ContactForm />
          </div>

          <div className="contact-calendly-card">
            <div className="contact-card-intro">
              <span>Reserva online</span>
              <h3>Elige día y hora para tu sesión.</h3>
              <p>
                Si ya tienes claro que quieres empezar, puedes reservar
                directamente una sesión desde el calendario.
              </p>
            </div>

            <CalendlyEmbed />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <button
            type="button"
            className="brand footer-brand brand-button"
            onClick={() => onNavigate("inicio")}
          >
            <img
              src="/images/logo-sango.png"
              alt="Sango Psicología"
              className="footer-logo"
            />
          </button>

          <p>
            Clínica de psicología con un enfoque cercano, profesional y adaptado
            a cada persona.
          </p>
        </div>

        <div>
          <h4>Secciones</h4>

          {navLinks.map((link) => (
            <button
              key={link.page}
              type="button"
              className="footer-link-button"
              onClick={() => onNavigate(link.page)}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div>
          <h4>Legal</h4>
          <button type="button" className="footer-link-button">
            Aviso legal
          </button>
          <button type="button" className="footer-link-button">
            Política de privacidad
          </button>
          <button type="button" className="footer-link-button">
            Política de cookies
          </button>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Sango Psicología</span>
        <span>Clínica de psicología</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("inicio");

  function navigate(page) {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <Header activePage={activePage} onNavigate={navigate} />

      <main className="page-main">
        {activePage === "inicio" && (
          <>
            <Hero onNavigate={navigate} />
            <Approach />
          </>
        )}

        {activePage === "servicios" && (
          <Services onNavigate={navigate} />
        )}

        {activePage === "nosotras" && <Team />}

        {activePage === "proceso" && <Process />}

        {activePage === "faq" && <FAQ onNavigate={navigate} />}

        {activePage === "contacto" && <ContactPreview />}
      </main>

      <Footer onNavigate={navigate} />

      <ChatWidget />
    </>
  );
}
