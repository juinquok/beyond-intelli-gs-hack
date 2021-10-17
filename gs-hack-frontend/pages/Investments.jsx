/* eslint-disable no-nested-ternary */
import {
  ArrowDownIcon, ArrowUpIcon,
} from '@chakra-ui/icons';
import {
  Box, Grid,
  GridItem, Heading, HStack,
  Image, SimpleGrid, Text,
  VStack,
} from '@chakra-ui/react';
import { withSSRContext } from 'aws-amplify';
// import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Header from '../components/navbar';
import Watchlist from '../components/Watchlist';
import teststockdata from '../components/teststockdata.json';
import testStockRecco from '../components/testStockRecco.json';

export default function Investments({ riskAppetite }) {
  return (
    <>
      <Box>
        <Header />
      </Box>
      <Box p={4}>
        <VStack spacing={4} align="stretch">
          <Box>
            <Heading as="h1" size="xl" fontWeight="extrabold" color="blue.500">
              {' '}
              Stocks
            </Heading>
            <Text pb={4} as="p" size="lg" fontWeight="bold">
              A stock (also known as equity) is a security that represents the
              ownership of a fraction of a corporation. This entitles the owner
              of the stock to a proportion of the corporation&aposs assets and
              profits equal to how much stock they own. Units of stock are
              called &quot;shares.&quot;(Source: Investopedia)
            </Text>
          </Box>
        </VStack>
        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
          <GridItem colSpan={7}>
            {riskAppetite === 'low' ? (
              <Box>
                <Heading
                  as="h2"
                  size="lg"
                  fontWeight="extrabold"
                  color="blue.500"
                >
                  {' '}
                  Your risk profile: Low
                </Heading>
                <Text as="p" size="lg">
                  {' '}
                  Low risk investing yields a lower expected return. While the
                  potential return is lower, the potential loss will also be
                  lower, protecting you against devastating losses. Some
                  low-risk stocks include:
                </Text>
                <Text as="p" size="lg">
                  Besides stocks, other low risk investments include Bonds, ETFs
                  or index funds.
                </Text>
                <Box>
                  {' '}
                  <Heading>Recommended Stocks </Heading>
                  <SimpleGrid columns={3} spacing={2}>
                    {testtestStockRecco.map((x) => (
                      <Box
                        maxW="2xl"
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                      >
                        <Box
                          borderWidth="1px"
                          p={4}
                          bg="rgba(49, 130, 206, 0.1)"
                          verticalAlign="middle"
                        >
                          <Box>{x.ticker}</Box>
                        </Box>
                      </Box>
                    ))}
                  </SimpleGrid>
                  <Heading>Related News </Heading>
                  <SimpleGrid columns={3} spacing={2}>
                    {testtestStockRecco.map((x) => (
                      <Box
                        maxW="2xl"
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                      >
                        <Box p={4} verticalAlign="middle">
                          <Box>
                            <HStack>
                              <VStack alignItems="left" p={3}>
                                <Heading size="md" as="h6">
                                  {x.profile.name}
                                  {' '}
                                </Heading>
                                <Text size="xs" as="p" opacity="0.5">
                                  {x.ticker}
                                </Text>
                              </VStack>
                              <VStack alignItems="center" p={3}>
                                <Heading
                                  size="md"
                                  as="h6"
                                  fontWeight="extrabold"
                                >
                                  {x.stock_prices.c}
                                  {' '}
                                </Heading>
                                {x.stock_prices.d > 0 ? (
                                  <Text
                                    size="xs"
                                    as="p"
                                    color="#00A86B"
                                    fontWeight="bold"
                                  >
                                    <ArrowUpIcon />
                                    {x.stock_prices.d}
                                    {' '}
                                    (
                                    {Number(x.stock_prices.dp).toFixed(2)}
                                    % )
                                  </Text>
                                ) : x.stock_prices.d === 0 ? (
                                  <Text size="xs" as="p" fontWeight="bold">
                                    {x.stock_prices.d}
                                    {' '}
                                    (
                                    {Number(x.stock_prices.dp).toFixed(2)}
                                    % )
                                  </Text>
                                ) : (
                                  <Text
                                    size="xs"
                                    as="p"
                                    color="#EE6855"
                                    fontWeight="bold"
                                  >
                                    <ArrowDownIcon />
                                    {x.stock_prices.d}
                                    {' '}
                                    (
                                    {Number(x.stock_prices.dp).toFixed(2)}
                                    % )
                                  </Text>
                                )}
                              </VStack>
                            </HStack>
                          </Box>
                        </Box>
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
            ) : riskAppetite === 'med' ? (
              <Box>
                <Heading
                  as="h2"
                  size="lg"
                  fontWeight="extrabold"
                  color="blue.500"
                >
                  {' '}
                  Your risk profile: Medium
                </Heading>
                <Text as="p" size="lg">
                  {' '}
                  Medium risk involves investments that yield a stable return
                  while still allowing for capital appreciation.
                  {' '}
                </Text>
                <Text as="p" size="lg">
                  Besides stocks, other low risk investments include Bonds, ETFs
                  or index funds.
                </Text>
                <Box>
                  {' '}
                  <Heading>Recommended Stocks </Heading>
                  <SimpleGrid columns={3} spacing={2}>
                    {testStockRecco.map((x) => (
                      <Box
                        maxW="2xl"
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                      >
                        <Box p={4} verticalAlign="middle">
                          <Box>
                            <HStack>
                              <VStack alignItems="left" p={3}>
                                <Heading size="md" as="h6">
                                  {x.profile.name}
                                  {' '}
                                </Heading>
                                <Text size="xs" as="p" opacity="0.5">
                                  {x.ticker}
                                </Text>
                              </VStack>
                              <VStack alignItems="center" p={3}>
                                <Heading
                                  size="md"
                                  as="h6"
                                  fontWeight="extrabold"
                                >
                                  {x.stock_prices.c}
                                  {' '}
                                </Heading>
                                {x.stock_prices.d > 0 ? (
                                  <Text
                                    size="xs"
                                    as="p"
                                    color="#00A86B"
                                    fontWeight="bold"
                                  >
                                    <ArrowUpIcon />
                                    {x.stock_prices.d}
                                    {' '}
                                    (
                                    {Number(x.stock_prices.dp).toFixed(2)}
                                    % )
                                  </Text>
                                ) : x.stock_prices.d === 0 ? (
                                  <Text size="xs" as="p" fontWeight="bold">
                                    {x.stock_prices.d}
                                    {' '}
                                    (
                                    {Number(x.stock_prices.dp).toFixed(2)}
                                    % )
                                  </Text>
                                ) : (
                                  <Text
                                    size="xs"
                                    as="p"
                                    color="#EE6855"
                                    fontWeight="bold"
                                  >
                                    <ArrowDownIcon />
                                    {x.stock_prices.d}
                                    {' '}
                                    (
                                    {Number(x.stock_prices.dp).toFixed(2)}
                                    % )
                                  </Text>
                                )}
                              </VStack>
                            </HStack>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </SimpleGrid>
                  <Heading>Related News </Heading>
                  <SimpleGrid columns={3} spacing={2}>
                    {testStockRecco.map((item) => (
                      <Link
                        href={
													item.news[
													  Math.floor(Math.random() * item.news.length)
													].url
												}
                      >
                        <Box>
                          <Box
                            maxW="sm"
                            borderWidth="1px"
                            borderRadius="lg"
                            overflow="hidden"
                            m={3}
                            _hover={{ cursor: 'pointer' }}
                          >
                            <Box
                              borderWidth="1px"
                              verticalAlign="middle"
                              overflow="hidden"
                              height="180px"
                            >
                              <Image
                                src={
																	item.news[
																	  Math.floor(Math.random() * item.news.length)
																	].image
																}
                                alt={
																	item.news[
																	  Math.floor(Math.random() * item.news.length)
																	].headline
																}
                                w="100%"
                                h="100%"
                              />
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
                              {
																item.news[
																  Math.floor(Math.random() * item.news.length)
																].headline
															}
                            </Heading>
                            <Text p={3} isTruncated as="p" size="xs">
                              {' '}
                              {
																item.news[
																  Math.floor(Math.random() * item.news.length)
																].summary
															}
                            </Text>
                          </Box>
                        </Box>
                      </Link>
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
            ) : (
              <Box>
                <Heading
                  as="h2"
                  size="lg"
                  fontWeight="extrabold"
                  color="blue.500"
                >
                  {' '}
                  Your risk profile: High
                </Heading>
                <Text as="p" size="lg">
                  {' '}
                  High risk investing involves a high expected return, although
                  these returns are never guaranteed. High-risk investments
                  should consist of money you can lose without any serious
                  repercussions, to avoid devastating losses.
                  {' '}
                </Text>
                <Text as="p" size="lg">
                  Besides stocks, other low risk investments include Bonds, ETFs
                  or index funds.
                </Text>
                <Box>
                  {' '}
                  <Heading pt={3}>Recommended Stocks </Heading>
                  <SimpleGrid columns={3} spacing={2}>
                    {testStockRecco.map((x) => (
                      <Box
                        maxW="2xl"
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                      >
                        <Box p={4} verticalAlign="middle">
                          <Box>
                            <HStack>
                              <VStack alignItems="left" p={3}>
                                <Heading size="md" as="h6">
                                  {x.profile.name}
                                  {' '}
                                </Heading>
                                <Text size="xs" as="p" opacity="0.5">
                                  {x.ticker}
                                </Text>
                              </VStack>
                              <VStack alignItems="center" p={3}>
                                <Heading
                                  size="md"
                                  as="h6"
                                  fontWeight="extrabold"
                                >
                                  {x.stock_prices.c}
                                  {' '}
                                </Heading>
                                {x.stock_prices.d > 0 ? (
                                  <Text
                                    size="xs"
                                    as="p"
                                    color="#00A86B"
                                    fontWeight="bold"
                                  >
                                    <ArrowUpIcon />
                                    {x.stock_prices.d}
                                    {' '}
                                    (
                                    {Number(x.stock_prices.dp).toFixed(2)}
                                    % )
                                  </Text>
                                ) : x.stock_prices.d === 0 ? (
                                  <Text size="xs" as="p" fontWeight="bold">
                                    {x.stock_prices.d}
                                    {' '}
                                    (
                                    {Number(x.stock_prices.dp).toFixed(2)}
                                    % )
                                  </Text>
                                ) : (
                                  <Text
                                    size="xs"
                                    as="p"
                                    color="#EE6855"
                                    fontWeight="bold"
                                  >
                                    <ArrowDownIcon />
                                    {x.stock_prices.d}
                                    {' '}
                                    (
                                    {Number(x.stock_prices.dp).toFixed(2)}
                                    % )
                                  </Text>
                                )}
                              </VStack>
                            </HStack>
                          </Box>
                        </Box>
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
            )}
            {/* <Text as="p" size="lg"> As with all investments,
            please do your own due diligence and understand what you are investing in!</Text> */}
          </GridItem>
          <GridItem colSpan={5}>
            <Watchlist stockData={teststockdata} />
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
          <GridItem colSpan={7}>
            <Heading pt={3}>Related News </Heading>
            <SimpleGrid columns={3} spacing={2}>
              {testStockRecco.map((item) => (
                <Link
                  href={
													item.news[
													  Math.floor(Math.random() * item.news.length)
													].url
												}
                >
                  <Box>
                    <Box
                      maxW="sm"
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      m={3}
                      _hover={{ cursor: 'pointer' }}
                    >
                      <Box
                        borderWidth="1px"
                        verticalAlign="middle"
                        overflow="hidden"
                        height="180px"
                      >
                        <Image
                          src={
																	item.news[
																	  Math.floor(Math.random() * item.news.length)
																	].image
																}
                          alt={
																	item.news[
																	  Math.floor(Math.random() * item.news.length)
																	].headline
																}
                          w="100%"
                          h="100%"
                        />
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
                        {
																item.news[
																  Math.floor(Math.random() * item.news.length)
																].headline
															}
                      </Heading>
                      <Text p={3} isTruncated as="p" size="xs">
                        {' '}
                        {
																item.news[
																  Math.floor(Math.random() * item.news.length)
																].summary
															}
                      </Text>
                    </Box>
                  </Box>
                </Link>
              ))}
            </SimpleGrid>
          </GridItem>
          <GridItem colSpan={5}>
            <Image src="./investment.png" alt="Investment Graphic" />
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}

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

    const data = await res.json();
    const userObject = data.Items[0];
    // retrieve watchlist data
    // const tickers = 'TSLA';
    // const stockQuotesRes = await fetch(
    //   `${process.env.NEXT_PUBLIC_FINN_URL}/stock/getInfo/${tickers}`,
    //   {
    //     method: 'get',
    //     headers: new Headers({
    //       Authorization: `Bearer ${token}`,
    //     }),
    //   },
    // );

    // const stockQuotes = await stockQuotesRes.json();
    // console.log(stockQuotes);

    // retrieve stock recommendation
    const riskAppetite = userObject.questionnaire.risk_appetite;
    const stockRes = await fetch(
      `${process.env.NEXT_PUBLIC_FINN_URL}/stock/recco/${riskAppetite}`,
      {
        method: 'get',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      },
    );

    const testStockRecco = await stockRes.json();
    console.log(testStockRecco);
    return {
      props: {
        authenticated: true,
        username,
        token,
        stockQuotes,
        testStockRecco,
        riskAppetite,
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
