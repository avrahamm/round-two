import React from 'react';

const App = () => (
  <React.Fragment>
    <input placeholder="filter" type="text"/>

    <div className="node">
      <input type="checkbox" checked/>
      <span>North America</span>

      <div className="children">
        <div className="node">
          <input type="checkbox" checked/>
          <span>Canada</span>

          <div className="children">
            <div className="node">
              <input type="checkbox" checked/>
              <span>Montreal</span>
            </div>

            <div className="node">
              <input type="checkbox"/>
              <span>Toronto</span>
            </div>

            <div className="node">
              <input type="checkbox" checked/>
              <span>Ottawa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
);

export default App;
