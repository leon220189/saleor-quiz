import React, { FC } from 'react';
import { Box, Typography } from "@material-ui/core";
import { device } from '../../../styles/BreakPoints';
import CodeSnippet from '../../ui/CodeSnippet';
import Answer from '../Answer';
import QuizImage from '../../ui/QuizImage';

interface QuestionTypes {
  question: string;
  code?: string;
  image?: string;
  type: string;
  choices: string[];
  selectedAnswer: string[];
  handleAnswerSelection: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
}

const Question: FC<QuestionTypes> = ({
  question,
  code,
  image,
  type,
  choices,
  selectedAnswer,
  handleAnswerSelection,
}) => {
  return (
    <Box
      sx={{
        mt: 3,
        mb: 4,
        maxWidth: { xs: '100%', sm: '88%' },
      }}
    >
      <Typography>
        {question}
      </Typography>
      {code && <CodeSnippet code={code} language="javascript" />}
      {image && <QuizImage image={image} />}
      <Box
        sx={{
          maxWidth: { xs: '100%', sm: '78%' },
        }}
      >
        {choices.map((choice, index) => (
          <Answer
            choice={choice}
            index={index}
            key={index}
            onChange={(e) => handleAnswerSelection(e, index)}
            type={type}
            selectedAnswer={selectedAnswer}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Question;
