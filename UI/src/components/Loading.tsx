import React from "react";
import BounceLoader from "react-spinners/BounceLoader";

export default () => {
  return (
    <div>
      <h3>Loading...</h3>
      <BounceLoader size={150} color={"#123abc"} loading={true} />
    </div>
  );
};
