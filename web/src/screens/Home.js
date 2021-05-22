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
    width: 500,
  },
}));

export default function Home() {
  // const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const { root, main, form } = useStyles();
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
            type={"number"}
            onChange={(event) =>
              event.target.value < 1
                ? (event.target.value = 1)
                : event.target.value > 100
                ? (event.target.value = 100)
                : event.target.value
            }
          ></Input>

          <Button type={"submit"}>Start</Button>
        </form>
      </main>
    </div>
  );
}
