import React from "react";

export default () => {
  return (
    <div className="mainWindow">
      <h3>
        Can't connect to controller, or to ofctl_rest API at port 8080.
        <br />
        (or in development - check proxy server is running)
      </h3>
    </div>
  );
};
