import React from "react";
import {Stack, styled} from "@mui/material";
import Pic, {PicProps} from "@site/src/components/Pic";

const Container = styled(Stack)({
  alignItems: 'center',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  overflowX: 'scroll'
});

export interface Props {
  pictures: (PicProps | string)[];
  containerStyle?: React.CSSProperties;
}

export default function Gallery(props: Props) {
  return <Container style={{...props.containerStyle}}>
    {
      props.pictures.map((picture, i) => {
        if (typeof picture === 'string') return <Pic key={i} src={picture} alt={`image-${i}`}/>;
        else return <Pic key={i} {...picture}/>;
      })
    }
  </Container>
}