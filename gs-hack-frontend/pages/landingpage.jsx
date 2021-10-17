import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  VStack,
  HStack,
  Text,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import Image from 'next/image';
import Header from '../components/navbar';
import FinancialPlanner from '../public/FinancialPlanner.png';
import Loans from '../public/Loans.png';
import MaverickCommunity from '../public/MaverickCommunity.png';
import Investments from '../public/Investments.png';

export default function landingpage() {
  return (
    <Grid
      w="100%"
      h="95%"
      templateRows="repeat(3)"
      templateColumns="repeat(2)"
      gap={4}
      px={8}
      py={4}
      verticalAlign="middle"
    >
      <GridItem colSpan={2}>
        <Heading
          as="h1"
          size="xl"
          fontWeight="extrabold"
          color="blue.500"
          textAlign="center"
        >
          Welcome to Maverick!
        </Heading>
        <Heading
          as="h6"
          size="md"
          fontWeight="normal"
          textAlign="center"
          py={2}
        >
          A one stop platform for your financial needs.
          Get the latest information and recommendations.
        </Heading>
      </GridItem>
      <GridItem>
        <Link href="/FinancialPlanning/">
          <Box _hover={{ cursor: 'pointer' }} size="xl" borderWidth="1px" borderRadius="lg" alignItems="center" width="100%" minH="240px" p={4} justifyContent="center">
            <VStack>
              <Image src={FinancialPlanner} alt="FinancialPlanning" width="100%" height="100%" minH="150px" />
              <Heading size="lg" as="h2" color="blue.500" fontWeight="extrabold" textAlign="center">
                Financial Planning
              </Heading>
              <Text size="md" as="p" textAlign="center">
                Track your finances and understand if you are on track to meeting your goals.
              </Text>
            </VStack>
          </Box>
        </Link>
      </GridItem>
      <GridItem>
        <Link href="/Loans/">
          <Box _hover={{ cursor: 'pointer' }} size="2xl" borderWidth="1px" borderRadius="lg" alignItems="center" width="100%" minH="240px" p={4} justifyContent="center">
            <VStack>
              <Image src={Loans} alt="Loans" width="100%" height="100%" />
              <Heading size="lg" as="h2" color="blue.500" fontWeight="extrabold" textAlign="center">
                Loans
              </Heading>
              <Text size="md" as="p" textAlign="center">
                Find out what loans are available to you and how to apply for them.
              </Text>
            </VStack>
          </Box>
        </Link>
      </GridItem>
      <GridItem>
        <Link href="/MaverickCommunity">
          <Box _hover={{ cursor: 'pointer' }} size="2xl" borderWidth="1px" borderRadius="lg" alignItems="center" width="100%" minH="240px" p={4} justifyContent="center">
            <VStack>
              <Image src={MaverickCommunity} alt="MaverickCommunity" width="100%" height="100%" />
              <Heading size="lg" as="h2" color="blue.500" fontWeight="extrabold" textAlign="center">
                Maverick Community
              </Heading>
              <Text size="md" as="p" textAlign="center">
                Interact with like-minded individuals through a
                community-based platform for financial QnAs.
              </Text>
            </VStack>
          </Box>
        </Link>
      </GridItem>
      <GridItem>
        <Link href="/Investments/">
          <Box _hover={{ cursor: 'pointer' }} size="2xl" borderWidth="1px" borderRadius="lg" alignItems="center" width="100%" minH="240px" p={4} justifyContent="center">
            <VStack>
              <Image src={Investments} alt="Loans" width="100%" height="100%" />
              <Heading size="lg" as="h2" color="blue.500" fontWeight="extrabold" textAlign="center">
                Investments
              </Heading>
              <Text size="md" as="p" textAlign="center">
                Learn more about investment fundamentals,
                and find suitable stocks to meet your needs.
              </Text>
            </VStack>
          </Box>
        </Link>
      </GridItem>
      <script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1" />
      <df-messenger
        intent="WELCOME"
        chat-title="AskMaverick"
        agent-id="1d6ea95b-3c75-4e34-a00e-38c6480ccafd"
        chat-icon="https://gs-hackathon-public-images.s3.amazonaws.com/agent.png"
        language-code="en"
      />
    </Grid>
  );
}
