import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { device } from '../../../styles/BreakPoints';

interface ButtonStyleProps {
  outline?: boolean;
  bold?: boolean;
  big?: boolean;
  children: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  [key: string]: any; // To allow any other props like onClick, etc.
}

const useStyles = makeStyles((theme) => ({
  buttonStyle: {
    width: '195px',
    minHeight: '50px',
    fontSize: 'clamp(16px, 5vw, 24px)',
    borderRadius: '9px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '@media (max-width: 960px)': {
      width: '150px',
      minHeight: '40px',
      tapHighlightColor: 'transparent',
      WebkitTapHighlightColor: 'transparent',
    },
    '&:active': {
      transform: 'scale(0.98)',
      boxShadow: theme.shadows[1],
      transition: '0.2s all',
    },
    '&:disabled': {
      backgroundColor: theme.palette.action.disabledBackground,
      color: theme.palette.text.disabled,
      cursor: 'not-allowed',
      transform: 'unset',
      boxShadow: 'unset',
    },
  },
  iconLeft: {
    marginRight: '10px',
    display: 'flex',
    '& svg path': {
      fill: theme.palette.common.white,
    },
  },
  iconRight: {
    marginLeft: '20px',
    display: 'flex',
    '& svg path': {
      fill: theme.palette.common.white,
    },
  },
}));

const ButtonStyle: React.FC<ButtonStyleProps> = ({
  outline = false,
  bold = false,
  big = false,
  children,
  iconLeft,
  iconRight,
  ...props
}) => {
  const classes = useStyles();

  const buttonClasses = `${classes.buttonStyle} ${
    outline ? 'outlined' : ''
  } ${bold ? 'bold' : ''} ${big ? 'big' : ''}`;

  return (
    <Button
      className={buttonClasses}
      style={{
        color: outline ? 'theme.palette.primary.main' : 'theme.palette.common.white',
        backgroundColor: outline
          ? 'theme.palette.common.white'
          : 'theme.palette.primary.main',
        fontWeight: bold ? 700 : 400,
        border: outline ? `1px solid theme.palette.primary.main` : 'none',
      }}
      {...props}
    >
      {iconLeft && <span className={classes.iconLeft}>{iconLeft}</span>}
      {children}
      {iconRight && <span className={classes.iconRight}>{iconRight}</span>}
    </Button>
  );
};

const IconLeft: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const classes = useStyles();
  return <span className={classes.iconLeft}>{children}</span>;
};

const IconRight: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const classes = useStyles();
  return <span className={classes.iconRight}>{children}</span>;
};

export { ButtonStyle, IconLeft, IconRight };
