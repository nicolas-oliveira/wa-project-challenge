import React from "react";
import { useEffect, useState } from "react";
import QuestionElement from "../Components/QuestionElement";
import { Shuffle } from "@material-ui/icons";

import { useParams, useHistory } from "react-router-dom";

import Header from "../Components/Header";
import ModalConfirm from "../Components/ModalConfirm";

// Convert all HTML entities and prevent XSS attack from HTML in api
import { decode } from "html-entities";
import { sanitize } from "dompurify";

import {
  CircularProgress,
  makeStyles,
  Container,
  Toolbar,
  Button,
  AppBar,
  Grid,
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
  cancelButton: {
    marginBottom: 10,
  },
  title: {
    fontFamily: "'Lobster', cursive",
    fontSize: 30,
  },
  questionBox: {
    justifyContent: "center",
    paddingTop: "22vh",
  },
  button: {
    width: 200,
  },
  loadingContainer: {
    height: "100vh",
  },
}));

export default function Quiz() {
  const params = useParams();
  const history = useHistory();

  // State from choice after click in alternatives
  const [onSelectAlternative, setOnSelectAlternative] = useState("");

  // Array of actual Quiz not finished yet by user
  const [quizList, setQuizList] = useState([]);

  // Index for the list inside quizList
  const [indexQuestion, setIndexQuestion] = useState(0);

  // Booleans to control the app
  const [loading, setLoading] = useState(false);
  const [cancel, setCancel] = useState(false);

  const [counter, setCounter] = useState(60);

  const {
    root,
    infoBar,
    loadingContainer,
    questionBox,
    button,
    title,
    cancelButton,
  } = useStyles();

  async function fetchData() {
    console.log("effect1");
    setLoading(true);
    try {
      let numberOfQuestions = params.numberOfQuestions;

      // Prevent to get invalid numbers from URL
      if (numberOfQuestions < 1) {
        numberOfQuestions = 1;
      } else if (numberOfQuestions > 50) {
        numberOfQuestions = 50;
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
    } catch (error) {
      console.error(error);
      console.log("Não foi possível realizar a requisição");
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      loading === false &&
      quizList.length !== 0 &&
      indexQuestion < quizList.length
    ) {
      console.log("effect2");
      quizList[indexQuestion].selectedAlternative = onSelectAlternative;
    }
  }, [quizList, onSelectAlternative, indexQuestion, loading]);

  useEffect(() => {
    async function finishQuiz() {
      if (
        loading === false &&
        quizList.length !== 0 &&
        indexQuestion === quizList.length
      ) {
        console.log("effect3");
        try {
          let temp = await JSON.parse(
            localStorage.getItem("historic_quizList")
          );

          if (!temp) temp = [];

          temp.push(quizList);

          await localStorage.setItem("historic_quizList", JSON.stringify(temp));

          history.push(`/result/${temp.length - 1}`);
        } catch (error) {
          console.error(error);
          console.log("Não foi possível resgatar e salvar o Quiz atual");
        }
      }
    }
    finishQuiz();
  }, [indexQuestion, quizList, history, loading]);

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  async function submit() {
    setIndexQuestion(indexQuestion + 1);
    setOnSelectAlternative("");
    setCounter(60);
  }

  return (
    <Container className={root}>
      <Header />
      {cancel ? <ModalConfirm setCancel={setCancel} /> : null}
      {loading ? (
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          className={loadingContainer}
        >
          <CircularProgress />
        </Grid>
      ) : (
        <>
          <AppBar color="secondary" className={infoBar}>
            <Grid
              container
              direction="row"
              justify="space-evenly"
              alignItems="center"
            >
              <Shuffle fontSize="large" />
              <Toolbar className={title}>Random</Toolbar>
              <span className={title}>{counter}''</span>
            </Grid>
          </AppBar>

          <Grid container className={questionBox}>
            <Grid
              container
              item
              direction="column"
              justify="column"
              alignItems="center"
              style={{ maxWidth: 500 }}
            >
              {quizList[indexQuestion] ? (
                counter > 0 ? (
                  <QuestionElement
                    disabled={false}
                    index={quizList[indexQuestion].index}
                    question={quizList[indexQuestion].question}
                    alternatives={quizList[indexQuestion].alternatives}
                    setOnSelectAlternative={setOnSelectAlternative}
                  />
                ) : (
                  <QuestionElement
                    disabled={true}
                    index={quizList[indexQuestion].index}
                    question={quizList[indexQuestion].question}
                    alternatives={quizList[indexQuestion].alternatives}
                    setOnSelectAlternative={setOnSelectAlternative}
                  />
                )
              ) : null}

              <Grid
                container
                item
                direction="row"
                justify="space-between"
                alignItems="center"
                className={cancelButton}
              >
                <Button
                  color="secondary"
                  variant="outlined"
                  className={button}
                  size="large"
                  onClick={() => setCancel(true)}
                >
                  Cancel
                </Button>
                <Grid>
                  {onSelectAlternative === "" && counter > 0 ? (
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
                    <Button
                      variant="outlined"
                      size="large"
                      className={button}
                      onClick={() => submit()}
                    >
                      next
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}
