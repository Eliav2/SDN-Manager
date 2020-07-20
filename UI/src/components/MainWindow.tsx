import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fade } from "@material-ui/core";

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

export default ({ children }: { children: React.ReactNode }) => {
  const classes = useStyles();
  return (
    <div className={classes.mainWindow}>
      <Fade in={true} timeout={600} mountOnEnter unmountOnExit>
        <div className={classes.innerContent}>{children}</div>
      </Fade>
      <div style={{ marginTop: 30 }}></div>
    </div>
  );
};
