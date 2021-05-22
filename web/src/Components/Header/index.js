import React from "react";
import flex from "../../styles/flex";

import { makeStyles, Toolbar, AppBar } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  header: {
    ...flex,
    height: "10vh",
  },
  title: {
    fontFamily: "'Lobster', cursive",
    fontSize: 30,
    alignSelf: "center",
  },
}));

export default function Home() {
  const { header, title } = useStyles();

  return (
    <AppBar className={header}>
      <Toolbar className={title}>Asked.App</Toolbar>
    </AppBar>
  );
}
