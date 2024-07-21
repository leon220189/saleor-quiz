import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import { AppLogo, StartIcon } from '../../config/icons';
import { useQuiz } from '../../context/QuizContext';
import { ScreenTypes } from '../../types';

const useStyles = makeStyles((theme) => ({
  appTitle: {
    fontWeight: 700,
    fontSize: '32px',
    color: theme.palette.primary.main,
  },
  detailTextContainer: {
    fontSize: '20px',
    fontWeight: 500,
    marginTop: '15px',
    marginBottom: '40px',
    textAlign: 'center',
    maxWidth: '500px',
  },
  detailText: {
    fontSize: '20px',
    fontWeight: 500,
    marginTop: '15px',
    lineHeight: 1.3,
  },
  highlightedText: {
    color: theme.palette.secondary.main,
    fontWeight: 700,
  },
  button: {
    marginTop: theme.spacing(2),
    fontWeight: 700,
  },
}));

const QuizDetailsScreen = () => {
  const classes = useStyles();
  const { setCurrentScreen, quizDetails } = useQuiz();

  const { selectedQuizTopic, totalQuestions, totalScore, totalTime } = quizDetails;

  const goToQuestionScreen = () => {
    setCurrentScreen(ScreenTypes.QuestionScreen);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box mb={3}>
            {/* <AppLogo /> */}
          </Box>
          <Typography variant="h2" className={classes.appTitle}>
            XEVEN QUIZ
          </Typography>
          <Box className={classes.detailTextContainer}>
            <Typography className={classes.detailText}>
              Selected Quiz Topic: <span className={classes.highlightedText}>{selectedQuizTopic}</span>
            </Typography>
            <Typography className={classes.detailText}>
              Total questions to attempt: <span className={classes.highlightedText}>{totalQuestions}</span>
            </Typography>
            <Typography className={classes.detailText}>
              Score in total: <span className={classes.highlightedText}>{totalScore}</span>
            </Typography>
            {/* <Typography className={classes.detailText}>
              Total time: <span className={classes.highlightedText}>{convertSeconds(totalTime)}</span>
            </Typography> */}
            <Typography className={classes.detailText}>
              To save time, you can skip questions. Skipped questions will show up at the end of the quiz.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            // startIcon={<StartIcon />}
            onClick={goToQuestionScreen}
            className={classes.button}
          >
            Start
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default QuizDetailsScreen;
