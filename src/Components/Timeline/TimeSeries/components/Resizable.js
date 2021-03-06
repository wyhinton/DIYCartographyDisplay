/* eslint-disable */
/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";

/**
 * This takes a single child and inserts a prop 'width' on it that is the
 * current width of the this container. This is handy if you want to surround
 * a chart or other svg diagram and have this drive the chart width.
 */
export default class Resizable extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { width: 500 };
    console.log(this.props.width);
    // console.log(this.props.parent.width);
    // console.log(this.props.parent);
    // console.log(this.props.parent.innerWidth);
    this.state = { width: this.props.width };
    // this.state = { width: "100%" };
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    // console.log("got resize mount");
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
  //TEMPORARY SOLUTION FOR GETTING RESIZE TO WORK
  handleResize() {
    // console.log(this.container)
    // console.log(this.container.width);
    console.log(this.props.width);
    if (this.container) {
      // console.log(this.props.parent.width);
      this.setState({
        // width: this.container.width,
        // width: this.container.offsetWidth,
        // width: this.props.width,
        width: 0.8 * window.innerWidth,
        // width: 0.8 * window.innerWidth,
      });
    }
  }

  render() {
    const child = React.Children.only(this.props.children);
    const childElement = this.state.width
      ? React.cloneElement(child, { width: this.state.width })
      : null;
    return (
      <div
        ref={(c) => {
          this.container = c;
        }}
        {...this.props}
      >
        {childElement}
      </div>
    );
  }
}

Resizable.propTypes = {
  children: PropTypes.node,
  // parent: PropTypes.any,
  width: PropTypes.number,
};
