import styles from './ProjectsStyles.module.css';
import snake from '../../assets/snake.png'
import shop from '../../assets/shop.png';
import youtube from '../../assets/youtube.png';
import Portfolio from '../../assets/Portfolio.png';
import ProjectCard from '../../common/ProjectCard';

function Projects() {
  return (
    <section id="projects" className={styles.container}>
      <h1 className="sectionTitle">Projects</h1>
      <div className={styles.projectsContainer}>
        <ProjectCard
          src={snake}
          link="https://github.com/Ade-mir/company-landing-page-2"
          h3="Snake-Identification"
          p="Machine Learning Project"
        />
        <ProjectCard
          src={shop}
          link="https://github.com/Ade-mir/company-landing-page-2"
          h3="Computer-Shop-Website"
          p="E-Commerce Website"
        />
        <ProjectCard
          src={youtube}
          link="https://github.com/Ade-mir/company-landing-page-2"
          h3="YouTube-frontend "
          p="Web Application"
        />
        <ProjectCard
          src={Portfolio}
          link="https://github.com/Ade-mir/company-landing-page-2"
          h3="Portfolio-Website"
          p="Web Application"
        />
      </div>
    </section>
  );
}

export default Projects;
