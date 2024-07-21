import React, { FC } from 'react';
import { Box } from "@material-ui/core";

interface QuizImageProps {
  image: string;
}

const QuizImage: FC<QuizImageProps> = ({ image }) => (
  <Box
    sx={{
      borderRadius: 2,
      height: 400,
      maxWidth: '100%',
      boxShadow: 6,
      mb: 2,
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <img
      src={image}
      alt="picture quiz"
      style={{
        borderRadius: '10px',
        height: '100%',
        width: 'auto',
        maxWidth: '100%',
      }}
    />
  </Box>
);

export default QuizImage;
