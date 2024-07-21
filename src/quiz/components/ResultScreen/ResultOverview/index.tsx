import React, { FC } from 'react';
import { Box, Typography } from "@material-ui/core";
import { useQuiz } from '../../../context/QuizContext';
import { convertSeconds } from '@dashboard/quiz/components/utils/helpers'
import { Result } from '../../../types';

interface ResultOverviewProps {
  result: Result[];
}

const ResultOverview: FC<ResultOverviewProps> = ({ result }) => {
  const { quizDetails, endTime } = useQuiz();

  const totalQuestionAttempted = result.length;

  const obtainedScore = result
    .filter((item) => item.isMatch && typeof item.score === 'number')
    .reduce((accumulator, currentValue) => accumulator + (currentValue.score || 0), 0);

  const calculateStatus =
    (obtainedScore / quizDetails.totalScore) * 100 >= 60 ? 'Passed' : 'Failed';

  return (
    <Box
      // sx={{
      //   textAlign: 'center',
      //   mb: { xs: 4, md: 9 },
      // }}
    >
      <Typography
        component="p"
        // sx={{
        //   mt: 2,
        //   fontWeight: 500,
        //   fontSize: 18,
        // }}
      >
        You attempted questions: 
        <Typography component="span">
          {totalQuestionAttempted}
        </Typography>
        /{quizDetails.totalQuestions}
      </Typography>
      <Typography
        component="p"
        // sx={{
        //   mt: 2,
        //   fontWeight: 500,
        //   fontSize: 18,
        // }}
      >
        Score secured: 
        <Typography component="span">
          {obtainedScore}
        </Typography>
        /{quizDetails.totalScore}
      </Typography>
      <Typography
        component="p"
        // sx={{
        //   mt: 2,
        //   fontWeight: 500,
        //   fontSize: 18,
        // }}
      >
        Time Spent: 
        <Typography component="span">
          {convertSeconds(endTime)}
        </Typography>
      </Typography>
      <Typography
        component="p"
        // sx={{
        //   mt: 2,
        //   fontWeight: 500,
        //   fontSize: 18,
        // }}
      >
        Status: 
        <Typography component="span">
          {calculateStatus}
        </Typography>
      </Typography>
    </Box>
  );
};

export default ResultOverview;
