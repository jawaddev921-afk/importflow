import { Flex, Anchor, Box } from '@mantine/core';
import { PropsWithChildren } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { API_KEYS, colors, CONSTANTS, TEXTS } from '@config';
import { IErrorObject } from '@importflow/shared';
import DarkLogo from '@assets/images/logo-dark.png';

import { LeftSideContent } from './LeftSideContent';

import { useAppState } from 'store/app.context';
import { useStyles } from './LeftSideContent.style';

const Support = dynamic(() => import('components/common/Support').then((mod) => mod.Support), {
  ssr: false,
});

type OnboardLayoutProps = PropsWithChildren;

export function OnboardLayout({ children }: OnboardLayoutProps) {
  const { classes } = useStyles();
  const { setProfileInfo } = useAppState();

  useQuery<unknown, IErrorObject, IProfileData, [string]>(
    [API_KEYS.ME],
    () => commonApi<IProfileData>(API_KEYS.ME as any, {}),
    {
      onSuccess(profileData) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.usetifulTags = { userId: profileData?._id };
        setProfileInfo(profileData);
      },
    }
  );

  return (
    <>
      <Head>
        <title>Get started | ImportFlow</title>
        <meta name="description" content={TEXTS.SEO_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content={TEXTS.SEO_TITLE} />
        <meta name="og:description" content={TEXTS.SEO_DESCRIPTION} />
      </Head>
      <main className={classes.splitContainer}>
        {/* Left side with gradient background */}
        <div className={classes.leftSide}>
          <LeftSideContent />
        </div>

        <div className={classes.rightSide}>
          <Box className={classes.logoContainer}>
            <Image src={DarkLogo} width={30} height={35} alt="ImportFlow Logo" />
            <Flex gap="xs" align="center">
              <Link href={CONSTANTS.IMPORTFLOW_DOCUMENTATION} passHref legacyBehavior>
                <Anchor underline={false} component="a" fw={600} c="dimmed" fz="sm">
                  Need Help?
                </Anchor>
              </Link>
              <Anchor underline={false} href={CONSTANTS.IMPORTFLOW_CAL_QUICK_MEETING} fw={600} c={colors.yellow} fz="sm">
                Get in Touch
              </Anchor>
            </Flex>
          </Box>

          <Box className={classes.content}>
            {/* <Paper withBorder radius="md" p="lg" w="100%"> */}
            {children}
            {/* </Paper> */}
          </Box>
        </div>
      </main>
      <Support />
    </>
  );
}
