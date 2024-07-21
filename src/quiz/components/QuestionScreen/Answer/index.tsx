import React, { FC } from 'react';
import { Box, FormControlLabel, Radio, Checkbox, Typography } from "@material-ui/core";

interface AnswerProps {
  index: number;
  choice: string;
  type: string;
  selectedAnswer: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Answer: FC<AnswerProps> = ({ onChange, index, choice, type, selectedAnswer }) => {
  // Convert index to alphabet character to show ABCD before question
  const label = String.fromCharCode(65 + index);
  const isSelected = selectedAnswer.includes(choice);

  return (
    <Box
      key={index}
      sx={{
        fontSize: 'clamp(18px, 4vw, 16px)',
        color: 'secondaryText.main',
        fontWeight: { xs: 400, md: 500 },
        border: 1,
        borderColor: isSelected ? 'themeColor.main' : 'border.main',
        // backgroundColor: isSelected ? 'selectedAnswer.main' : 'answerBg.main',
        borderRadius: 2,
        mt: 'clamp(13px, calc(10px + 6 * ((100vw - 600px) / 1320)), 16px)',
        // cursor: 'pointer',
        // transition: isSelected ? 'border 0.2s ease-in' : 'none',
      }}
    >
      <FormControlLabel
        control={
          type === 'MAQs' ? (
            <Checkbox
              name={choice}
              checked={isSelected}
              onChange={onChange}
              // sx={{ visibility: 'hidden', m: 0 }}
            />
          ) : (
            <Radio
              name={choice}
              checked={isSelected}
              onChange={onChange}
              // sx={{ visibility: 'hidden', m: 0 }}
            />
          )
        }
        label={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: { xs: 2, md: 1.5 },
              // cursor: 'pointer',
            }}
          >
            <Typography component="span">{label}.</Typography>
            <Typography>
              {choice}
            </Typography>
          </Box>
        }
        // sx={{
        //   m: 0,
        //   width: '100%',
        // }}
      />
    </Box>
  );
};

export default Answer;
