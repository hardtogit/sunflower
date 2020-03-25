import React from 'react';
import styles from './Page.module.less';

export default (props) => {
  return (
    <div className={props.className} style={props.searchStyle}>
      <div className="listPage-searchBar">
        {props.searchBar}
      </div>
      <div className="listPage-table" style={props.tableStyle}>
        {props.table}
      </div>
      {props.children}
    </div>
  );
};
