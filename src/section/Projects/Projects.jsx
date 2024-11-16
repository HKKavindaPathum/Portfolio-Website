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
          link="https://www.linkedin.com/posts/kavindapathum_machinelearning-tensorflow-reactjs-activity-7263037497369141248-ewYo?utm_source=share&utm_medium=member_desktop"
          h3="Snake-Identification"
          p="Machine Learning Project"
        />
        <ProjectCard
          src={shop}
          link="https://github.com/HKKavindaPathum/Computer-Shop-Website.git"
          h3="Computer-Shop-Website"
          p="E-Commerce Website"
        />
        <ProjectCard
          src={youtube}
          link="https://github.com/HKKavindaPathum/YouTube-frontend.git"
          h3="YouTube-frontend "
          p="Web Application"
        />
        <ProjectCard
          src={Portfolio}
          link="https://github.com/HKKavindaPathum/Portfolio-Website.git"
          h3="Portfolio-Website"
          p="Web Application"
        />
      </div>
    </section>
  );
}

export default Projects;
