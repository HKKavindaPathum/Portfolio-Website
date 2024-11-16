import styles from './ContactStyles.module.css';
import mailLight from '../../assets/mail-light.svg';
import mailDark from '../../assets/mail-dark.svg';
import githubLight from '../../assets/github-light.svg';
import githubDark from '../../assets/github-dark.svg';
import linkedinLight from '../../assets/linkedin-light.svg';
import linkedinDark from '../../assets/linkedin-dark.svg';
import { useTheme } from '../../common/ThemeContext';

function Contact() {
  const { theme } = useTheme();

  const mailIcon = theme === 'light' ? mailLight : mailDark;
  const githubIcon = theme === 'light' ? githubLight : githubDark;
  const linkedinIcon = theme === 'light' ? linkedinLight : linkedinDark;

  return (
    <section id="contact" className={styles.container}>
      <h1 className="sectionTitle">Contact</h1>
      <span>
        <a href="mailto:Kavindapathum98@gmail.com?subject=Contact&body=Hi Kavinda," target="_blank" rel="noopener noreferrer">
          <img src={mailIcon} alt="Mail icon" /><h2>Email</h2>
        </a>
        <a href="https://github.com/HKKavindaPathum" target="_blank" rel="noopener noreferrer">
          <img src={githubIcon} alt="Github icon" /><h2>Github</h2>
        </a>
        <a href="https://www.linkedin.com/in/kavindapathum/" target="_blank" rel="noopener noreferrer">
          <img src={linkedinIcon} alt="Linkedin icon" /><h2>Linkein</h2>
        </a>
      </span>
    </section>
  );
}

export default Contact;
