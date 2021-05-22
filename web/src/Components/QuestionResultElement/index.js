import React from "react";
import {
  makeStyles,
  FormControl,
  Card,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import { Close, Check } from "@material-ui/icons";

const useStyle = makeStyles(() => ({
  formBody: {
    width: 500,
  },
  card: {
    position: "relative",
    padding: 40,
  },
  result: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 10,
    right: 10,
  },
}));

export default function QuestionResultElement({
  question,
  alternatives,
  correctAnswer,
  selectedAlternative,
}) {
  const { formBody, card, radioGroup, result } = useStyle();

  return (
    <FormControl component="fieldset" className={formBody}>
      <Card className={card}>
        {question}
        {selectedAlternative === correctAnswer ? (
          <span className={result}>
            <Check size={2} style={{ fill: "green" }} />
          </span>
        ) : (
          <span className={result}>
            <Close size={2} style={{ fill: "red" }} />
          </span>
        )}
      </Card>
      <RadioGroup
        aria-label="asked"
        name="asked1"
        value={selectedAlternative}
        className={radioGroup}
      >
        {alternatives.map((alternative) => {
          return selectedAlternative !== correctAnswer &&
            correctAnswer === alternative ? (
            <FormControlLabel
              disabled
              key={alternative}
              value={alternative}
              control={<Radio />}
              label={alternative + " ← Correct answer"}
            />
          ) : (
            <FormControlLabel
              disabled
              key={alternative}
              value={alternative}
              control={<Radio />}
              label={alternative}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}
