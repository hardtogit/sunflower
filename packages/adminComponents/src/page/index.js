import React, { Component } from 'react';
import classnames from 'classnames';
// import Loader from '../Loader';
import './Page.module.less';

export class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      className, children, loading = false, inner = false, out = true
    } = this.props;
    const loadingStyle = {
      height: 'calc(100vh - 185px)',
      overflow: 'hidden'
    };
    // console.log(this.props, styles);
    return (
      <div
        className={classnames(className, {
          contentInner: inner,
          containerOut: inner && out
        })}
        style={loading ? loadingStyle : null}
      >
        {/* {loading ? <Loader spinning /> : ''} */}
        {children}
      </div>
    );
  }
}
