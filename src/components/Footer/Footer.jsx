import { useTranslation } from "react-i18next";
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>
          &copy; {currentYear} João Galimberti. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
