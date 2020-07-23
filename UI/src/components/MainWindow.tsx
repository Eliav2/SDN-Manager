import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fade } from "@material-ui/core";
import ServerError from "./ServerError";
import Loading from "./Loading";

const useStyles = makeStyles(() => ({
  mainWindow: {
    display: "flex",
    flexDirection: "column",
    width: "var(--canvasWidthVw)",
    minHeight: "var(--canvasHeightVh)",
    background: "white",
    color: "black",
    borderRadius: "100px",
    justifyContent: "center",
    alignItems: "center",
    padding: "50px",
    margin: "30px 0",
  },
  innerContent: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "wrap",
  },
}));

export default ({
  children,
  fetchFailed,
  isLoading,
}: {
  children?: React.ReactNode;
  fetchFailed?: null | Error;
  isLoading?: boolean;
}) => {
  const classes = useStyles();

  let comp = children;
  if (fetchFailed) comp = <ServerError {...{ fetchFailed }} />;
  else if (isLoading && isLoading === true) comp = <Loading />;

  return (
    <div className={classes.mainWindow}>
      <Fade in={true} timeout={600} mountOnEnter unmountOnExit>
        <div className={classes.innerContent}>{comp}</div>
      </Fade>
      <div style={{ marginTop: 30 }}></div>
    </div>
  );
};
