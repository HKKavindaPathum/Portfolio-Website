import styles from './HomeStyles.module.css';
import heroImg from '../../assets/ProfilePic.png';
import sun from '../../assets/sun.svg';
import moon from '../../assets/moon.svg';
import CV from '../../assets/cv.pdf';
import { useTheme } from '../../common/ThemeContext';

function Hero() {
  const { theme, toggleTheme } = useTheme();

  const themeIcon = theme === 'light' ? sun : moon;

  return (
    <section className={styles.container}>

      <div className={styles.colorModeContainer}>
        <img src={heroImg} className={styles.hero} alt="Profile picture" />
        <img className={styles.colorMode} src={themeIcon} alt="Color mode icon" onClick={toggleTheme} />
      </div>

      <div className={styles.info}>
        <h1>
          Hi, I'm <br /> Kavinda
        </h1>
        <h2>Web Developer & Software Engineer</h2>
        <h3>About Me</h3>
        <p className={styles.description}>
          Hi, I'm a Computer Science undergraduate at Trincomalee Campus,
          Eastern University of Sri Lanka. I'm passionate about web development
          and love building creative, responsive websites and applications.
        </p>
        <a href={CV} download>
          <button className="hover">Resume</button>
        </a>
      </div>
    </section>
  );
}

export default Hero;
