import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import { useState } from "react";
import MainWindow from "../components/MainWindow";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(2),
      width: "40ch",
    },
    direction: "ltr",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  loginButton: { margin: theme.spacing(2) },
  linkDiv: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 50,
  },
  link: {
    "&:hover": {
      color: "#f00",
    },
  },
}));

export default ({
  ofctlRestUrl,
  setOfctlRestUrl,
}: {
  ofctlRestUrl: string;
  setOfctlRestUrl: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const history = useHistory();
  const classes = useStyles();

  const [url, setUrl] = useState(ofctlRestUrl);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOfctlRestUrl(url);
    history.push("/switches");
  };

  return (
    <MainWindow>
      <p>Please Provide controller REST API URL:</p>
      <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField label="controller REST API URL" variant="outlined" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Button className={classes.loginButton} variant="outlined" type="submit" color="primary">
          Connect
        </Button>
      </form>
      <div className={classes.linkDiv}></div>
    </MainWindow>
  );
};
