import {
  Box,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { withSSRContext } from 'aws-amplify';
import Header from '../components/navbar';

const MaverickCommunity = ({ newsArticles }) => (
  <Box>
    <Box>
      <Header />
    </Box>

    <Box px={4}>
      <VStack spacing={4} align="stretch" p={4}>
        <Box>
          <Heading as="h1" size="xl" fontWeight="extrabold" color="blue.500">
            {' '}
            Maveric News
          </Heading>
          <Text pb={4}>
            Read the latest news across business, health, science and
            technology.
          </Text>
        </Box>
      </VStack>
      <SimpleGrid columns={4} spacing={2}>
        {newsArticles.articles.map((x) => (
          <Box>
            <Link href={x.url}>
              <a>
                <Box
                  maxW="xl"
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  m={3}
                >
                  <Box
                    borderWidth="1px"
                    verticalAlign="middle"
                    overflow="hidden"
                    height="180px"
                  >
                    <Image src={x.urlToImage} alt={x.title} w="100%" h="100%" />
                  </Box>
                  <Heading
                    as="h4"
                    size="sm"
                    fontWeight="extrabold"
                    textAlign="left"
                    alignItems="center"
                    px={3}
                    pt={3}
                  >
                    {' '}
                    {x.title}
                    {' '}
                  </Heading>

                  {x.author === null ? (
                    <Text p={3} size="xs">
                      {' '}
                      Author: No author found
                      {' '}
                    </Text>
                  ) : (
                    <Text p={3} size="xs">
                      Author:
                      {x.author}
                    </Text>
                  )}

                  {x.publishedAt === null ? (
                    <Text p={3} size="xs">
                      Published on: No date found
                    </Text>
                  ) : (
                    <Text p={3} size="xs">
                      Published on:
                      {x.publishedAt}
                    </Text>
                  )}

                  {x.description === null ? (
                    <Text p={3} size="xs">
                      No description found
                    </Text>
                  ) : (
                    <Text p={3} isTruncated as="p" size="xs">
                      {x.description}
                    </Text>
                  )}
                </Box>
              </a>
            </Link>
          </Box>
        ))}
      </SimpleGrid>
      <script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1" />
      <df-messenger
        intent="WELCOME"
        chat-title="AskMaverick"
        agent-id="1d6ea95b-3c75-4e34-a00e-38c6480ccafd"
        chat-icon="https://gs-hackathon-public-images.s3.amazonaws.com/agent.png"
        language-code="en"
      />
    </Box>
  </Box>
);
export default MaverickCommunity;

export async function getServerSideProps(context) {
  const { Auth } = withSSRContext(context);
  try {
    // authenticate user using cognito
    const user = await Auth.currentAuthenticatedUser();
    const { username } = user;
    const token = user.signInUserSession.idToken.jwtToken;

    // retrieve user object from dynamodb
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_USER_URL}/details/${username}`,
      {
        method: 'get',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      },
    );

    // const data = await res.json();
    // const userObject = data.Items[0];
    const article_type = 'general';
    const newsArticlesRes = await fetch(
      `${process.env.NEXT_PUBLIC_EDU_URL}/news_update/${article_type}`,
      {
        method: 'get',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      },
    );
    const newsArticles = await newsArticlesRes.json();
    console.log(newsArticles);
    return {
      props: {
        authenticated: true,
        username,
        token,
        newsArticles,
      },
    };
  } catch (err) {
    return {
      props: {
        authenticated: false,
      },
    };
  }
}
