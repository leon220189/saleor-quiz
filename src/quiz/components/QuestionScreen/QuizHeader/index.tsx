import React, { FC } from 'react';
import { Box, Typography } from "@material-ui/core";
// import { addLeadingZero, formatTime } from '../../../utils/helpers';
import Counter from './Counter';

interface QuizHeaderProps {
  activeQuestion: number;
  totalQuestions: number;
  timer: number;
}

const QuizHeader: FC<QuizHeaderProps> = ({ activeQuestion, totalQuestions, timer }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        // gap: '6px',
      }}
    >
      <Box>
        <Typography>
          {/* {addLeadingZero(activeQuestion + 1)} */}
        </Typography>
        <Typography>
          {/* /{addLeadingZero(totalQuestions)} */}
        </Typography>
      </Box>
      <Box>
        {/* <Counter time={`${formatTime(timer)}`} /> */}
      </Box>
    </Box>
  );
};

export default QuizHeader;
