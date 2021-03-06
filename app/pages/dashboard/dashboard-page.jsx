import PropTypes from 'prop-types';
import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import { Helmet } from 'react-helmet';
import { Link, IndexLink } from 'react-router';

class DashboardPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current:"/dashboard"
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.logClick = !!nextContext &&
        !!nextContext.geordi &&
        !!nextContext.geordi.makeHandler &&
        nextContext.geordi.makeHandler('about-menu');
        this.setState({
            current : nextProps.location.pathname
        })
    }

    render() {
        const liStyle = {
            visibility: this.state.current == '/dashboard' || this.state.current == '/dashboard/users' ? 'hidden' : 'visible'
        };

        // TODO : changer les className et ajouter notre propre style
        // TODO : regler bug de la barre
        return (
          <div className="secondary-page get-involved-page">
            <Helmet title="Dashboard" />
            <section className="hero">
              <div className="hero-container">
                <h1>Dashboard</h1>
                <nav className="hero-nav">
                  <ul>
                    <li>
                      <IndexLink
                        to="/dashboard"
                        activeClassName="active"
                      >
                        General
                      </IndexLink>
                    </li>
                    <li style={liStyle}>
                      <Link
                        to={this.state.current}
                        activeClassName="active"
                        onClick={this.logClick ? this.logClick.bind(this, 'projects') : null}
                      >
                        Project
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </section>
            <section className="get-involved-page-content content-container">
              {this.props.children}
            </section>
          </div>
        );
    }
}

DashboardPage.contextTypes = {
    geordi: PropTypes.object
};

DashboardPage.propTypes = {
    children: PropTypes.node
};

DashboardPage.defaultProps = {
    children: null
};

export default DashboardPage;
