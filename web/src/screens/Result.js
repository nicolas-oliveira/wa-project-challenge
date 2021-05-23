import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import flex from "../styles/flex";
import Header from "../Components/Header";

import {
  CircularProgress,
  makeStyles,
  Card,
  Grid,
  Button,
} from "@material-ui/core";

import { ArrowBackIos } from "@material-ui/icons";

import QuestionResultElement from "../Components/QuestionResultElement";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    height: "100vh",
  },
  main: {
    ...flex,
    paddingTop: "12vh",
  },
  back: {
    display: "flex",
    justifyContent: "left",
    flexDirection: "row",
    width: 500,
    paddingBottom: 10,
  },
  link: {
    all: "unset",
  },
  form: {
    ...flex,
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
  loadingStyle: {
    ...flex,
    width: 500,
    padding: 10,
    marginBottom: 30,
  },
}));

export default function Result() {
  const param = useParams();

  // Number of hits from user in actual quiz
  const [hits, setHits] = useState(0);
  const [quizList, setQuizList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getHistoricQuizList() {
      setLoading(true);
      setHits(0);
      try {
        const historicQuizList = await JSON.parse(
          localStorage.getItem("historic_quizList")
        );

        if (historicQuizList)
          setQuizList(historicQuizList[param.indexOfHistoricQuizList]);
      } catch (error) {
        console.error(error);
        console.log("Não foi possível obter o resultado solicitado");
      }
      setLoading(false);
    }
    getHistoricQuizList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param.indexOfHistoricQuizList]);

  useEffect(() => {
    if (!loading && quizList.length > 0) {
      let count = 0;
      quizList.forEach((e) => {
        console.log(e);
        if (e.selectedAlternative === e.correctAnswer) count++;
      });
      setHits(count);
    }
  }, [quizList, hits, loading]);

  const { root, main, cardResult, back, link, button, loadingStyle } =
    useStyles();

  return (
    <div className={root}>
      <Header />
      <main className={main}>
        <Grid className={back}>
          <Link to="/" className={link}>
            <Button className={button}>
              <ArrowBackIos />
              <span>Back</span>
            </Button>
          </Link>
        </Grid>

        {loading ? (
          <Grid className={loadingStyle}>
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <Card className={cardResult}>
              <h1>You hit {hits} questions!</h1>
            </Card>
            {quizList.map((e, index) => (
              <QuestionResultElement
                key={index}
                question={e.question}
                alternatives={e.alternatives}
                correctAnswer={e.correctAnswer}
                selectedAlternative={e.selectedAlternative}
              />
            ))}
          </>
        )}
      </main>
    </div>
  );
}
