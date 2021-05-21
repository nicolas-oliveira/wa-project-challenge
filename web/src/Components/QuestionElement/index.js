import React from "react";
import { useState } from "react";
import {
  makeStyles,
  FormControl,
  Card,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";

const useStyle = makeStyles(() => ({
  formBody: {
    width: 500,
  },
  card: {
    padding: 40,
  },
}));

export default function QuestionElement({
  question,
  alternatives,
  setOnSelectAlternative,
}) {
  const { formBody, card, radioGroup } = useStyle();

  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
    setOnSelectAlternative(event.target.value);
  };

  return (
    <FormControl component="fieldset" className={formBody}>
      <Card className={card}>{question}</Card>
      <RadioGroup
        aria-label="asked"
        name="asked1"
        value={value}
        onChange={handleChange}
        className={radioGroup}
      >
        {alternatives.map((alternative) => {
          return (
            <FormControlLabel
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
