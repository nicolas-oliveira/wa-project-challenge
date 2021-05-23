import React from "react";
// import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import flex from "../styles/flex";
import Header from "../Components/Header";
import TableOfHistoricQuiz from "../Components/TableOfHistoricQuiz";

import { makeStyles, Button, Input, Grid } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    height: "100vh",
  },
  main: {
    ...flex,
    paddingTop: "12vh",
  },
  form: {
    ...flex,
    maxWidth: 500,
    width: "100%",
    padding: 20,
  },
  input: {
    width: "100%",
    marginTop: 10,
  },
  button: {
    width: "100%",
    marginTop: 20,
  },
  tableContainer: {
    ...flex,
    maxWidth: 500,
    width: "100%",
    padding: 20,
  },
}));

export default function Home() {
  // const [historicQuizList, setHistoricQuizList] = useState(0);
  const { root, main, form, input, button, tableContainer } = useStyles();
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    history.push(`/quiz/${e.target[0].value}`);
  }

  return (
    <div className={root}>
      <Header />
      <main className={main}>
        <form onSubmit={handleSubmit} className={form}>
          <h2>Choose the number of questions:</h2>

          <Input
            required
            type={"number"}
            onChange={(event) =>
              event.target.value < 1
                ? (event.target.value = 1)
                : event.target.value > 50
                ? (event.target.value = 50)
                : event.target.value
            }
            className={input}
          ></Input>

          <Button variant="outlined" type={"submit"} className={button}>
            Start
          </Button>
        </form>
        <Grid className={tableContainer}>
          <TableOfHistoricQuiz />
        </Grid>
      </main>
    </div>
  );
}
