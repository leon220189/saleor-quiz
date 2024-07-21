import React, { FC } from 'react';
import { Box, Typography } from "@material-ui/core";

interface RightAnswerProps {
  correctAnswers: string[];
  choices: string[];
}

const RightAnswer: FC<RightAnswerProps> = ({ correctAnswers, choices }) => {
  return (
    <Typography
      component="p"
      // sx={{
      //   fontSize: 18,
      //   fontWeight: 400,
      //   color: 'text.secondary',
      //   mt: 2,
      //   lineHeight: 1.2,
      // }}
    >
      {`Right ${correctAnswers.length < 2 ? 'Answer' : 'Answers'}: `}
      {correctAnswers.map((item: string, index: number) => {
        const label = String.fromCharCode(65 + choices.indexOf(item));

        return (
          <Typography
            component="span"
            key={index}
            // sx={{
            //   fontWeight: 500,
            //   color: 'primary.main',
            //   mx: 0.5,
            // }}
          >
            {`${label} (${item})${index !== correctAnswers.length - 1 ? ', ' : ''}`}
          </Typography>
        );
      })}
    </Typography>
  );
};

export default RightAnswer;
