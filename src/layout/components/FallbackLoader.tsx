import React, { PureComponent } from "react";
import "../styles/LoaderWithLayer.scss";

class FallbackLoader extends PureComponent<any, any> {
  render() {
    return (
      <React.Fragment>
        <div className="overlay animated fadeIn">
          <div className="overlay__inner">
            <div className="overlay__content">
              <span className="spinner"></span>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default FallbackLoader;
