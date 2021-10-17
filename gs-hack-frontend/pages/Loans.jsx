import {
  Box,
  Heading,
  Text,
  VStack,
  Grid,
  GridItem,
  Image,
  UnorderedList,
  ListItem,
  ListIcon,
  HStack,
  SimpleGrid,
  Tooltip,
} from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
// import Image from 'next/image';
import InfoIcon from '@chakra-ui/icons';
import NumberFormat from 'react-number-format';
import { withSSRContext } from 'aws-amplify';
import KycModal from '../components/kyc/KycModal';
import Header from '../components/navbar';
import { useGlobalContext } from '../context/reducer';
import LoanGraphic from '../public/Loans.png';
import testloandata from '../components/testloandata.json';

export default function Loans({ username, token, loans }) {
  const { state, dispatch } = useGlobalContext();

  return (
    <Box>
      <Box>
        <Header />
      </Box>
      <Box p={4}>
        <Box>
          <Heading as="h1" size="xl" fontWeight="extrabold" color="blue.500">
            {' '}
            Loans
            {' '}
          </Heading>
          <Text>
            {' '}
            A personal loan is an amount of money you can borrow to use for a
            variety of purposes. For instance, you may use a personal loan to
            consolidate debt, pay for home renovations, or plan a dream wedding.
            Personal loans can be offered by banks, credit unions, or online
            lenders. The money you borrow must be repaid over time, typically
            with interest. Some lenders may also charge fees for personal loans.
            (Source: Investopedia)
          </Text>
        </Box>
        <Box w="100%" h="95%">
          <Heading as="h4" size="lg" py={3}>
            Your top recommended loans are:
          </Heading>
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
          {/* <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={7} />
        <GridItem colSpan={5}>
          <Image src={LoanGraphic} alt="Loan Graphic" />
        </GridItem>
      </Grid> */}
        </Box>
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
    const userObject = data.Items[0];

    const retrievedLoans = userObject.recommendations.loans;
    console.log(retrievedLoans);

    // retrieve stock recommendation
    // const riskAppetite = userObject.questionnaire.risk_appetite;
    // const stockRes = await fetch(`${process.env.NEXT_PUBLIC_FINN_URL}/stock/recco/${riskAppetite}`, {
    //   method: 'get',
    //   headers: new Headers({
    //     Authorization: `Bearer ${token}`,
    //   }),
    // });

    // const stockRecco = await stockRes.json();
    // console.log(stockRecco);

    return {
      props: {
        authenticated: true,
        username,
        token,
        loans: retrievedLoans,
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
