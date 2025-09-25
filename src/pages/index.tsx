import React, {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import {Stack, styled, Typography} from "@mui/material";

const Header = styled('header')<{ bg: string }>((bg) => ({
  background: `transparent url(${bg.bg}) center / cover no-repeat`,
  padding: 0
}));

const HeaderOverlay = styled('div')({
  backgroundColor: 'rgba(192, 192, 192, 0.5)',
  padding: '4rem 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center'
});

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const bg = require('@site/static/img/background.png').default;
  return (
    <Header bg={bg} className={clsx('hero hero--primary', styles.heroBanner)}>
      <HeaderOverlay className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <Stack direction='row' justifyContent={'center'} alignItems={'center'}>
          <Typography variant={'h5'}>
            Available on:
          </Typography>
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="https://modrinth.com/mod/croparia-if">
              Modrinth
            </Link>
          </div>
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="https://www.curseforge.com/minecraft/mc-mods/croparia-if">
              CurseForge
            </Link>
          </div>
        </Stack>
      </HeaderOverlay>
    </Header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title={`Hello from Elematilius`}
      description="Documentation for Croparia IF"
    >
      <HomepageHeader/>
      <main>
        <HomepageFeatures/>
      </main>
    </Layout>
  );
}
