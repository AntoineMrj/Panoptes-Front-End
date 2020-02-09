import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ProjectCard from '../../partials/project-card';

export default function ProjectList(props) {
    return (
        <div className="project-card-list">
        {props.projects.map(project =>
            <ProjectCard key={project.id} project={project} href={`/dashboard/project/${project.id}`} />
        )}
        </div>
    );
}

ProjectList.propTypes = {
    projects: PropTypes.array.isRequired,
};

ProjectList.defaultProps = {
    projects: [],
};
