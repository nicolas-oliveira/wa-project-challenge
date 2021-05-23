import React from "react";
// import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import flex from "../styles/flex";
import Header from "../Components/Header";

import { makeStyles, Button, Input } from "@material-ui/core";

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
  },
  input: {
    width: 500,
    marginTop: 10,
  },
  button: {
    width: 500,
    marginTop: 20,
  },
}));

export default function Home() {
  // const [historicQuizList, setHistoricQuizList] = useState(0);
  const { root, main, form, input, button } = useStyles();
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
                : event.target.value > 100
                ? (event.target.value = 100)
                : event.target.value
            }
            className={input}
          ></Input>

          <Button variant="outlined" type={"submit"} className={button}>
            Start
          </Button>
        </form>
      </main>
    </div>
  );
}
