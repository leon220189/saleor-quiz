import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

// import { AppLogo } from '../../config/icons';
import { useQuiz } from '../../context/QuizContext';
import { quizTopics } from '../../data/quizTopics';
import { ScreenTypes } from '../../types';

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: '32px',
    fontWeight: 700,
    marginBottom: '20px',
    textAlign: 'center',
  },
  detailText: {
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '29px',
    textAlign: 'center',
  },
  selectButtonContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '60%',
    gap: '30px',
    marginTop: '40px',
    marginBottom: '45px',
    [theme.breakpoints.down('md')]: {
      rowGap: '20px',
      columnGap: '20px',
      maxWidth: '100%',
    },
  },
  selectButton: {
    borderRadius: '10px',
    padding: '14px 10px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.4s ease-out',
    [theme.breakpoints.down('md')]: {
      padding: '10px',
      tapHighlightColor: 'transparent',
    },
  },
  selectButtonText: {
    fontSize: '18px',
    fontWeight: 600,
    marginLeft: '10px',
    [theme.breakpoints.down('md')]: {
      fontSize: '16px',
      fontWeight: 500,
    },
  },
}));

const QuizTopicsScreen = () => {
  const classes = useStyles();
  const { quizTopic, selectQuizTopic, setCurrentScreen } = useQuiz();

  const goToQuizDetailsScreen = () => {
    setCurrentScreen(ScreenTypes.QuizDetailsScreen);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box mb={3}>
            {/* <AppLogo /> */}
          </Box>
          <Typography variant="h2" className={classes.heading}>
            WELCOME TO <span style={{ color: 'highlight' }}> XEVEN QUIZ</span>
          </Typography>
          <Typography className={classes.detailText}>
            Select topic below to start your Quiz.
          </Typography>
          <Box className={classes.selectButtonContainer}>
            {quizTopics.map(({ title, icon, disabled }) => (
              <Box
                key={title}
                className={classes.selectButton}
                style={{
                  backgroundColor: disabled ? '#f0f0f0' : '#ffffff',
                  border: quizTopic === title ? '2px solid theme.palette.primary.main' : '1px solid #e0e0e0',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                }}
                onClick={() => !disabled && selectQuizTopic(title)}
              >
                {icon}
                <Typography className={classes.selectButtonText}>{title}</Typography>
              </Box>
            ))}
          </Box>
          <Button variant="contained" color="primary" onClick={goToQuizDetailsScreen}>
            Continue
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default QuizTopicsScreen;
