import React from "react";
import { useEffect, useState } from "react";
import QuestionElement from "./Components/QuestionElement";
import ShuffleIcon from "@material-ui/icons/Shuffle";

// Convert all HTML entities and prevent XSS attack from HTML in api
import { decode } from "html-entities";
import { sanitize } from "dompurify";

import {
  makeStyles,
  Container,
  Toolbar,
  AppBar,
  Grid,
  Button,
} from "@material-ui/core";
import api from "./services/api";

const flex = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
};

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  header: {
    ...flex,
    height: "10vh",
  },
  infoBar: {
    zIndex: 1000,
    marginTop: "10vh",
  },
  title: {
    fontFamily: "'Lobster', cursive",
    fontSize: 30,
    alignSelf: "center",
  },
  questionBox: {
    ...flex,
    paddingTop: "22vh",
  },
  button: {
    width: 500,
  },
}));

function randomizeAlternatives(array) {
  let index = array.length - 1;

  for (; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const temp = array[index];
    array[index] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

export default function App() {
  const [questionList, setQuestionList] = useState([]);
  const [onSelectAlternative, setOnSelectAlternative] = useState("");
  const { root, header, title, questionBox, infoBar, button } = useStyles();

  useEffect(() => {
    async function fetchData() {
      await api.get("api.php?amount=10").then((response) => {
        setQuestionList(
          response.data.results.map((e, index) => {
            const question = decode(sanitize(e.question));
            const correctAnswer = decode(sanitize(e.correct_answer));
            const alternatives = randomizeAlternatives([
              ...e.incorrect_answers.map((incorrectAnswer) =>
                decode(sanitize(incorrectAnswer))
              ),
              correctAnswer,
            ]);

            return {
              index,
              question,
              correctAnswer,
              alternatives,
            };
          })
        );
      });
    }
    fetchData();
  }, []);

  return (
    <div>
      <header>
        <AppBar className={header}>
          <Toolbar className={title}>Asked.App</Toolbar>
        </AppBar>

        <AppBar color="secondary" className={infoBar}>
          <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="center"
          >
            <ShuffleIcon fontSize="large" />
            <Toolbar className={title}>Random</Toolbar>
            <span className={title}>59''</span>
          </Grid>
        </AppBar>
      </header>
      <Container className={root}>
        <Grid container className={questionBox}>
          {questionList[0] ? (
            <QuestionElement
              index={questionList[0].index}
              question={questionList[0].question}
              alternatives={questionList[0].alternatives}
              setOnSelectAlternative={setOnSelectAlternative}
            />
          ) : null}

          {onSelectAlternative === "" ? (
            <span style={{ cursor: "not-allowed" }}>
              <Button
                disabled
                variant="outlined"
                size="large"
                className={button}
              >
                next
              </Button>
            </span>
          ) : (
            <Button variant="outlined" size="large" className={button}>
              next
            </Button>
          )}
        </Grid>
      </Container>
    </div>
  );
}
