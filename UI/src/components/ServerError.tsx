import React from "react";

export default ({ fetchFailed }: { fetchFailed: null | Error }) => {
  return (
    <div>
      <h2> Fetch Request Failed </h2>
      <h3>
        {/* {fetchFailed.message + "(" + fetchFailed.name + ")"} */}
        {fetchFailed.stack}
        {/* Can't connect to controller, or to ofctl_rest API.
        <br />
        (or in development - check proxy server is running) */}
      </h3>
    </div>
  );
};
