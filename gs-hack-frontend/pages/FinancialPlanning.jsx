import {
  Box, Grid,
  GridItem, Heading, HStack,
  Image, ListItem, SimpleGrid, Table, Tbody, Td, Text, Tr, UnorderedList, VStack,
} from '@chakra-ui/react';
// import Image from 'next/image';
import { withSSRContext } from 'aws-amplify';
import Link from 'next/link';
import React from 'react';
import { Pie } from 'react-chartjs-2';
import NumberFormat from 'react-number-format';
import KycModal from '../components/kyc/KycModal';
import Header from '../components/navbar';

// import creditcard from '../components/testcreditcard.json';
// import testUserData from '../components/testuserdata.json';
// import financialplanninggraphic from '../public/financialplanning.png';

export default function FinancialPlanning({
  questionnaire,
  creditcard,
  loans,
  username,
  token,
}) {
  const spending = questionnaire.spendings;
  const testdata = {
    labels: Object.keys(spending),
    datasets: [
      {
        label: 'Breakdown of Spending',
        data: Object.values(spending),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <Box>
        <Header />
      </Box>
      <Box p={4}>
        <Grid
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(5, 1fr)"
          gap={4}
        >
          <GridItem rowSpan={1} colSpan={1}>
            {' '}
            <Heading>Summary</Heading>
            <Box>
              <Box>
                <Pie
                  // w={2}
                  // h={2}
                  data={testdata}
                  options={{
								  responsive: true,
                  }}
                />
              </Box>

              <Table>
                <Tbody>
                  <Tr>
                    <Td>Loan amount you wish to take: </Td>
                    <Td>
                      <NumberFormat value={Number(questionnaire.loan_amt)} displayType="text" thousandSeparator prefix="$" />
                      {' '}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td> Risk Appetite: </Td>
                    <Td>{questionnaire.risk_appetite}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      Financial Goal:
                    </Td>
                    <Td>
                      {questionnaire.financial_goals}
                    </Td>
                  </Tr>

                  <Tr>
                    <Td>Percentage allocated to achieving this goal:</Td>
                    <td>
                      {Number(questionnaire.perc_income) * 100}
                      %
                    </td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </GridItem>
          <GridItem colSpan={3}>
            <Heading> Recommended Credit Cards </Heading>
            <SimpleGrid columns={3} spacing={2}>
              {Object.keys(creditcard).map((item) => (
                <Box>
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
                      p={2}
                      borderRadius="lg"
                    >
                      <Image src={creditcard[item].photoURL} alt={item} w="100%" h="100%" />
                      <Heading
                        as="h4"
                        size="sm"
                        fontWeight="extrabold"
                        textAlign="left"
                        alignItems="center"
                        px={3}
                        pt={3}
                      >
                        {item}
                      </Heading>
                      <Text p={3} size="xs">
                        <UnorderedList>
                          <ListItem>
                            {' '}
                            Benefits:
                            {' '}
                            {creditcard[item].benefits}
                          </ListItem>
                          <ListItem>
                            Annual Fee and Waiver:
                            {' '}
                            {creditcard[item]['annual_fee_&_waiver']}
                          </ListItem>
                          <ListItem>
                            Credit Limit:
                            {' '}
                            {creditcard[item].credit_limit}
                          </ListItem>
                        </UnorderedList>
                      </Text>
                    </Box>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </GridItem>

          <GridItem colSpan={5}>
            <Heading pb={3}> Recommended Loans </Heading>
            <SimpleGrid columns={3} spacing={2}>
              {Object.keys(loans).map((item) => (
                <Box
                  maxW="xl"
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  verticalAlign="middle"
                  alignItems="center"
                >
                  <Box borderWidth="1px" p={4} verticalAlign="middle">
                    <HStack>
                      <Image
                        src={loans[item].photo_url}
                        alt={item}
                        w="25%"
                        h="25%"
                      />
                      <Heading
                        as="h3"
                        size="lg"
                        fontWeight="extrabold"
                        textAlign="left"
                        alignItems="center"
                      >
                        {' '}
                        {item}
                        {' '}
                      </Heading>
                    </HStack>
                  </Box>
                  <VStack py={2}>
                    <UnorderedList>
                      <ListItem>
                        Loan Amount:
                        {' '}
                        <NumberFormat
                          value={Number(loans[item].loan_amt)}
                          displayType="text"
                          thousandSeparator
                          prefix="$"
                        />
                      </ListItem>
                      <ListItem>
                        Loan Tenure:
                        {' '}
                        {loans[item].loan_tenure}
                      </ListItem>
                      <ListItem>
                        Interest Rate:
                        {' '}
                        {(Number(loans[item].interest_rate) * 100).toFixed(2)}
                        %
                      </ListItem>
                      <ListItem>
                        Processing Fee: $
                        {loans[item].processing_fee}
                      </ListItem>
                    </UnorderedList>
                    <Link href={loans[item].url}>
                      <Box
                        as="button"
                        width="200px"
                        height="35px"
                        lineHeight="1.2"
                        transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                        px="8px"
                        borderRadius="30px"
                        fontSize="16px"
                        fontWeight="bold"
                        bg="#3182CE"
                        color="#ffffff"
                      >
                        READ MORE
                      </Box>
                    </Link>
                    <KycModal
                      loan={loans[item]}
                      loanName={item}
                      cognitoUsername={username}
                      token={token}
                    />
                  </VStack>
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
          </GridItem>
        </Grid>
      </Box>
    </Box>
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
    // console.log(data);
    const userObject = data.Items[0];

    // console.log(userObject);
    const { creditcard, loans } = userObject.recommendations;
    const { questionnaire } = userObject;
    // const userdata = userObject.Items
    console.log(questionnaire);
    return {
      props: {
        authenticated: true,
        username,
        token,
        creditcard,
        loans,
        questionnaire,
        // userdata,
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
