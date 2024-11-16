import styles from './FooterStyles.module.css';

function Footer() {
  return (
    <section id="footer" className={styles.container}>
      <hr />
      <p>
        &copy; {new Date().getFullYear()} kavinda pathum <br />
        All rights reserved.
      </p>
    </section>
  );
}

export default Footer;
