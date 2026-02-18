import "./Contact.css";

export default function Contact() {
  return (
    <section id="contact">
      <div className="container reveal">
        <div className="section-header">
          <div className="section-number">05 | CONTATO</div>
          <h2 className="section-title">Vamos trabalhar juntos</h2>
        </div>

        <div className="contact-grid">
          {/* Email */}
          <div className="contact-item">
            <a href="mailto:joaogalimberti@gmail.com">
              <div className="contact-icon-wrapper">
                <img
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/gmail.svg"
                  alt="Email"
                  className="contact-icon"
                />
              </div>
              <div className="contact-label">Email</div>
              <div className="contact-value">joaogalimberti@gmail.com</div>
            </a>
          </div>

          {/* WhatsApp */}
          <div className="contact-item">
            <a
              href="https://wa.me/5527995059130?text=Ol%C3%A1%20Jo%C3%A3o!%20Vim%20do%20seu%20site%20e%20gostaria%20de%20conversar."
              target="_blank"
              rel="noreferrer"
            >
              <div className="contact-icon-wrapper">
                <img
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg"
                  alt="WhatsApp"
                  className="contact-icon"
                />
              </div>
              <div className="contact-label">WhatsApp</div>
              <div className="contact-value">+55 (27) 99505-9130</div>
            </a>
          </div>

          {/* GitHub */}
          <div className="contact-item">
            <a
              href="https://github.com/joaogalimberti"
              target="_blank"
              rel="noreferrer"
            >
              <div className="contact-icon-wrapper">
                <img
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg"
                  alt="GitHub"
                  className="contact-icon"
                />
              </div>
              <div className="contact-label">GitHub</div>
              <div className="contact-value">@joaogalimberti</div>
            </a>
          </div>

          {/* LinkedIn */}
          <div className="contact-item">
            <a
              href="https://linkedin.com/in/joaogalimberti"
              target="_blank"
              rel="noreferrer"
            >
              <div className="contact-icon-wrapper">
                <img
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg"
                  alt="LinkedIn"
                  className="contact-icon"
                />
              </div>
              <div className="contact-label">LinkedIn</div>
              <div className="contact-value">@joaogalimberti</div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}