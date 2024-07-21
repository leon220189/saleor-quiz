import React, { FC } from 'react';
import { Box, Typography, Button as MUIButton, List, ListItem, Container } from "@material-ui/core";
import { AppLogo, Refresh } from '../../config/icons';
import { useQuiz } from '../../context/QuizContext';
import { refreshPage } from '@dashboard/quiz/components/utils/helpers'
import CodeSnippet from '../ui/CodeSnippet';
import QuizImage from '../ui/QuizImage';
import ResultOverview from './ResultOverview';
import RightAnswer from './RightAnswer';

interface AnswerProps {
  correct?: boolean;
  wrong?: boolean;
}

interface ScoreProps {
  right: boolean;
}

const ResultScreen: FC = () => {
  const { result } = useQuiz();

  const onClickRetry = () => {
    refreshPage();
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        {/* <AppLogo /> */}
      </Box>
      <Box
        sx={{
          // backgroundColor: 'background.paper',
          borderRadius: 1,
          mb: 4,
          p: { xs: 2, md: 6 },
        }}
      >
        <ResultOverview result={result} />
        {result.map(
          (
            { question, choices, code, image, correctAnswers, selectedAnswer, score, isMatch },
            index: number
          ) => {
            return (
              <Box
                key={question}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', md: 'row' },
                  mt: 4,
                }}
              >
                <Box sx={{ width: '100%', mb: { xs: 2, md: 0 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>
                      {`${index + 1}. `}
                    </Typography>
                    <Typography>
                      {question}
                    </Typography>
                  </Box>
                  <Box>
                    {code && <CodeSnippet code={code} language="javascript" />}
                    {image && <QuizImage image={image} />}
                    <List>
                      {choices.map((ans: string, index: number) => {
                        const label = String.fromCharCode(65 + index);
                        const correct = selectedAnswer.includes(ans) && correctAnswers.includes(ans);
                        const wrong = selectedAnswer.includes(ans) && !correctAnswers.includes(ans);

                        return (
                          <ListItem
                            key={ans}
                            // sx={{
                            //   border: 1,
                            //   borderColor: correct
                            //     ? 'success.main'
                            //     : wrong
                            //     ? 'error.main'
                            //     : 'border.main',
                            //   backgroundColor: correct
                            //     ? 'success.light'
                            //     : wrong
                            //     ? 'error.light'
                            //     : 'background.default',
                            //   borderRadius: 2,
                            //   fontSize: 'clamp(16px, 5vw, 18px)',
                            //   fontWeight: { xs: 600, md: 400 },
                            //   padding: 2,
                            //   mt: 1,
                            //   color: 'text.secondary',
                            // }}
                          >
                            <Box component="span" sx={{ mr: 2 }}>
                              {label}.
                            </Box>
                            {ans}
                          </ListItem>
                        );
                      })}
                    </List>
                    {!isMatch && (
                      <RightAnswer correctAnswers={correctAnswers} choices={choices} />
                    )}
                  </Box>
                </Box>
                <Typography
                  // component="span"
                  // sx={{
                  //   fontWeight: 500,
                  //   fontSize: 16,
                  //   color: isMatch ? 'success.main' : 'error.main',
                  //   mt: { xs: 2, md: 0 },
                  //   textAlign: { xs: 'right', md: 'initial' },
                  // }}
                >
                  {`Score ${isMatch ? score : 0}`}
                </Typography>
              </Box>
            );
          }
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <MUIButton
          variant="contained"
          // startIcon={<Refresh />}
          onClick={onClickRetry}
          // sx={{ fontWeight: 'bold' }}
        >
          RETRY
        </MUIButton>
      </Box>
    </Container>
  );
};

export default ResultScreen;
