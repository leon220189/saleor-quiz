import React, { FC, useEffect, useState, ReactNode } from 'react';
import { Box, Button as MUIButton, Container, Typography, Modal } from "@material-ui/core";
// import { AppLogo, CheckIcon, Next, TimerIcon } from '../../config/icons';
import { useQuiz } from '../../context/QuizContext';
// import { useTimer } from '../../hooks';
import { ScreenTypes } from '../../types';
import Question from './Question';
import QuizHeader from './QuizHeader';

interface QuizContainerProps {
  children: ReactNode;
  selectedAnswer: boolean;
}

const QuizContainer: FC<QuizContainerProps> = ({ children, selectedAnswer }) => (
  <Box
    sx={{
      width: '900px',
      minHeight: '500px',
      // backgroundColor: 'cardBackground.main',
      borderRadius: 1,
      p: { xs: 2, md: 6 },
      mb: 9,
      position: 'relative',
    }}
  >
    {children}
  </Box>
);

const LogoContainer: FC = () => (
  <Box sx={{ my: { xs: 2, md: 6 } }}>
    {/* <AppLogo /> */}
  </Box>
);

interface ButtonWrapperProps {
  children: ReactNode;
}

const ButtonWrapper: FC<ButtonWrapperProps> = ({ children }) => (
  <Box
    sx={{
      position: 'absolute',
      right: { xs: 2, md: 6 },
      bottom: 3,
      display: 'flex',
      // gap: 2,
      justifyContent: { xs: 'flex-end', md: 'initial' },
      width: { xs: '90%', md: 'auto' },
    }}
  >
    {children}
  </Box>
);

const QuestionScreen: FC = () => {
  const [activeQuestion, setActiveQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string[]>([]);
  const [showTimerModal, setShowTimerModal] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  const {
    questions,
    quizDetails,
    result,
    setResult,
    setCurrentScreen,
    timer,
    setTimer,
    setEndTime,
  } = useQuiz();

  const currentQuestion = questions[activeQuestion];
  const { question, type, choices, code, image, correctAnswers } = currentQuestion;

  const onClickNext = () => {
    const isMatch: boolean =
      selectedAnswer.length === correctAnswers.length &&
      selectedAnswer.every((answer) => correctAnswers.includes(answer));

    setResult([...result, { ...currentQuestion, selectedAnswer, isMatch }]);

    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      const timeTaken = quizDetails.totalTime - timer;
      setEndTime(timeTaken);
      setShowResultModal(true);
    }
    setSelectedAnswer([]);
  };

  const handleAnswerSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (type === 'MAQs') {
      if (selectedAnswer.includes(name)) {
        setSelectedAnswer((prevSelectedAnswer) =>
          prevSelectedAnswer.filter((element) => element !== name)
        );
      } else {
        setSelectedAnswer((prevSelectedAnswer) => [...prevSelectedAnswer, name]);
      }
    }

    if (type === 'MCQs' || type === 'boolean') {
      if (checked) {
        setSelectedAnswer([name]);
      }
    }
  };

  const handleModal = () => {
    setCurrentScreen(ScreenTypes.ResultScreen);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    if (showTimerModal || showResultModal) {
      document.body.style.overflow = 'hidden';
    }
  }, [showTimerModal, showResultModal]);

  // useTimer(timer, quizDetails, setEndTime, setTimer, setShowTimerModal, showResultModal);

  return (
    <Container>
      <LogoContainer />
      <QuizContainer selectedAnswer={selectedAnswer.length > 0}>
        <QuizHeader
          activeQuestion={activeQuestion}
          totalQuestions={quizDetails.totalQuestions}
          timer={timer}
        />
        <Question
          question={question}
          code={code}
          image={image}
          choices={choices}
          type={type}
          handleAnswerSelection={handleAnswerSelection}
          selectedAnswer={selectedAnswer}
        />
        <ButtonWrapper>
          <MUIButton
            variant="contained"
            onClick={onClickNext}
            // endIcon={<Next />}
            disabled={selectedAnswer.length === 0}
          >
            {activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </MUIButton>
        </ButtonWrapper>
      </QuizContainer>
      {(showTimerModal || showResultModal) && (
        <Modal open={showTimerModal || showResultModal} onClose={handleModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              // transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2">
              {showResultModal ? 'Done!' : 'Your time is up!'}
            </Typography>
            <Typography>
              You have attempted {result.length} questions in total.
            </Typography>
            <MUIButton onClick={handleModal}>
              SHOW RESULT
            </MUIButton>
          </Box>
        </Modal>
      )}
    </Container>
  );
};

export default QuestionScreen;
