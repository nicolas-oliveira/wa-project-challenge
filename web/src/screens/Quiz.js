import React from "react";
import { useEffect, useState } from "react";
import QuestionElement from "../Components/QuestionElement";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import { useParams } from "react-router-dom";

import flex from "../styles/flex";
import Header from "../Components/Header";
import QuestionResultElement from "../Components/QuestionResultElement";

// Convert all HTML entities and prevent XSS attack from HTML in api
import { decode } from "html-entities";
import { sanitize } from "dompurify";

import {
  makeStyles,
  Container,
  CircularProgress,
  Backdrop,
  Toolbar,
  Button,
  AppBar,
  Grid,
  Card,
} from "@material-ui/core";

import api from "../services/api";

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
const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    height: "100vh",
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
  cardResult: {
    ...flex,
    width: 500,
    padding: 10,
    marginBottom: 30,
    background: "#00a152",
    color: "white",
  },
}));

export default function Quiz() {
  const params = useParams();

  const [onSelectAlternative, setOnSelectAlternative] = useState("");
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quizList, setQuizList] = useState([]);
  const [hits, setHits] = useState(0);

  const { root, infoBar, questionBox, button, cardResult, title } = useStyles();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      let numberOfQuestions = params.numberOfQuestions;
      if (numberOfQuestions < 1) {
        numberOfQuestions = 1;
      }
      if (numberOfQuestions > 100) {
        numberOfQuestions = 100;
      }
      await api.get(`api.php?amount=${numberOfQuestions}`).then((response) => {
        setQuizList(
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
              selectedAlternative: "",
            };
          })
        );
        setLoading(false);
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (indexQuestion < quizList.length) {
      quizList[indexQuestion].selectedAlternative = onSelectAlternative;
    }
  }, [onSelectAlternative]);

  return (
    <Container className={root}>
      <Header />
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

      <Grid container className={questionBox}>
        {quizList[indexQuestion] ? (
          <QuestionElement
            index={quizList[indexQuestion].index}
            question={quizList[indexQuestion].question}
            alternatives={quizList[indexQuestion].alternatives}
            setOnSelectAlternative={setOnSelectAlternative}
          />
        ) : null}

        {quizList && !loading ? (
          indexQuestion === quizList.length ? (
            <>
              <Card className={cardResult}>
                <h1>You hit {hits} questions!</h1>
              </Card>
              {quizList.map((e) => (
                <QuestionResultElement
                  hits={hits}
                  question={e.question}
                  alternatives={e.alternatives}
                  correctAnswer={e.correctAnswer}
                  selectedAlternative={e.selectedAlternative}
                />
              ))}
            </>
          ) : (
            console.log({
              hits,
              quizList,
              selectedAlternative: onSelectAlternative,
            })
          )
        ) : null}

        {onSelectAlternative === "" ? (
          <span style={{ cursor: "not-allowed" }}>
            <Button disabled variant="outlined" size="large" className={button}>
              next
            </Button>
          </span>
        ) : (
          <Button
            variant="outlined"
            size="large"
            className={button}
            onClick={() => {
              if (
                onSelectAlternative === quizList[indexQuestion].correctAnswer
              ) {
                setHits(hits + 1);
              }
              setIndexQuestion(indexQuestion + 1);
              setOnSelectAlternative("");
            }}
          >
            next
          </Button>
        )}
      </Grid>
    </Container>
  );
}
