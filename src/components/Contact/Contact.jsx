import { useTranslation } from "react-i18next";
import "./Contact.css";

export default function Contact() {
  const { t } = useTranslation();

  const contactItems = [
    {
      label: t("contact.email"),
      value: "joaogalimberti@gmail.com",
      link: "mailto:joaogalimberti@gmail.com",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg"
    },
    {
      label: t("contact.whatsapp"),
      value: "+55 (27) 99505-9130",
      link: "https://wa.me/5527995059130",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg"
    },
    {
      label: t("contact.github"),
      value: "github.com/joaogalimberti",
      link: "https://github.com/joaogalimberti",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg"
    },
    {
      label: t("contact.linkedin"),
      value: "linkedin.com/in/joaogalimberti",
      link: "https://www.linkedin.com/in/joaogalimberti",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg"
    }
  ];

  return (
    <section id="contact">
      <div className="container reveal">
        <div className="section-header">
          <div className="section-number">{t("contact.number")}</div>
          <h2 className="section-title">{t("contact.title")}</h2>
        </div>

        <div className="contact-grid">
          {contactItems.map((item, index) => (
            <div className="contact-item" key={index}>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <div className="contact-icon-wrapper">
                  <img src={item.icon} alt={item.label} className="contact-icon" />
                </div>
                <div className="contact-info">
                  <span className="contact-label">{item.label}</span>
                  <p className="contact-value">{item.value}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}