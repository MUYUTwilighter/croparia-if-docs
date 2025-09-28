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
}));

const HeaderOverlay = styled('div')({
  backgroundColor: 'var(--home-background)',
  color: 'var(--home-text)',
  padding: '4rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  width: 'fit-content',
  borderRadius: '1rem'
});

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const bg = require('@site/static/img/background.webp').default;
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
