import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ProjectCard from '../../partials/project-card';

class ProjectList extends Component {
  render() {
    return (
      <div className="project-card-list">
        {this.props.projects.map(project =>
          <ProjectCard key={project.id} project={project} href={`/dashboard/project/${project.id}`} />
        )}
      </div>
    );
  }
}

ProjectList.propTypes = {
  projects: PropTypes.array.isRequired,
};

ProjectList.defaultProps = {
  projects: [],
};

export default ProjectList;
