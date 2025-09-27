import {Stack, styled, Typography} from "@mui/material";
import React from "react";

const Container = styled(Stack)({
  flexDirection: 'column',
  width: 'fit-content',
  maxWidth: 'inherit',
  height: 'fit-content',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 'none',
  padding: '1rem',
});

const Img = styled('img')({
  display: 'block',
  borderRadius: '1rem',
  objectFit: 'contain'
});

const Title = styled(Typography)({
  margin: '1rem 0',
  color: 'gray'
});

export interface PicProps {
  src: string;
  alt?: string;
  imgStyle?: React.CSSProperties;
  title?: string | React.ReactNode;
  titleStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  fullWidth?: boolean;
}

export default function Pic(props: PicProps) {
  return <Container style={{
    width: props.fullWidth ? '100%' : 'fit-content',
    ...props.containerStyle
  }}>
    <Img src={props.src} alt={props.alt ?? (typeof props.title === 'string' && props.title)} style={{...props.imgStyle}}/>
    {props?.title && <Title style={{...props.titleStyle}}>{props.title}</Title>}
  </Container>
}