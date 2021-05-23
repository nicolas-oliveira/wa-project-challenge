import React from "react";
import { useEffect, useState } from "react";
import {
  CircularProgress,
  TableContainer,
  makeStyles,
  TableBody,
  TableCell,
  TableRow,
  Table,
  Paper,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  table: {},
  linkStyle: {
    all: "unset",
    cursor: "pointer",
    width: "100%",
  },
});

export default function TableOfHistoricQuiz() {
  const [historicQuizList, setHistoricQuizList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { table, linkStyle } = useStyles();
  useEffect(() => {
    async function getHistoricQuizList() {
      setLoading(true);
      console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
      try {
        const response = await JSON.parse(
          localStorage.getItem("historic_quizList")
        );
        if (response) setHistoricQuizList(response);
      } catch (error) {
        console.error(error);
        console.log("Não foi possível obter o resultado solicitado");
      }
    }
    getHistoricQuizList();
    setLoading(false);
  }, []);

  return (
    <>
      {console.log(historicQuizList.length)}
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table className={table} size="large" aria-label="a dense table">
              <TableBody>
                {historicQuizList.map((e, index) => {
                  const link = `/result/${index}`;
                  return (
                    <Link to={link} className={linkStyle}>
                      <TableRow hover key="1">
                        <TableCell component="th" scope="row">
                          Quiz #{index}
                        </TableCell>
                      </TableRow>
                    </Link>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
}
