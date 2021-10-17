/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import _ from 'lodash';
import Router from 'next/router';
import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from 'react-hook-form';
import { useGlobalContext } from '../../context/reducer';

export default function Phase1PartTwo({
  goBack, username, token, user,
}) {
  const [askLoanAmount, setAskLoanAmount] = useState(false);
  const { state, dispatch } = useGlobalContext();
  const [validPercentageSpending, setValidPercentageSpending] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const validate = (listOfSpendingHabits) => {
    const setIntList = listOfSpendingHabits.map((x) => parseInt(x, 10));
    if (_.sum(setIntList) === 100) {
      return true;
    }
    setValidPercentageSpending(false);
    return false;
  };
  const onSubmit = (data) => {
    const {
      spendingHabitsSavings,
      spendingHabitsInvestment,
      spendingHabitsNecessities,
      spendingHabitsOthers,
    } = data;
    const dataToCheck = {
      spendingHabitsSavings,
      spendingHabitsInvestment,
      spendingHabitsNecessities,
      spendingHabitsOthers,
    };
    const arrayOfValues = Object.values(dataToCheck);
    if (validate(arrayOfValues)) {
      const spendingsObject = {
        necessities: parseFloat(spendingHabitsNecessities / 100).toFixed(2),
        investment: parseFloat(spendingHabitsInvestment / 100).toFixed(2),
        savings: parseFloat(spendingHabitsSavings / 100).toFixed(2),
        discretionary_spending: parseFloat(spendingHabitsOthers / 100).toFixed(
          2,
        ),
      };
      const formattedData = {
        ..._.omit(data, [
          'spendingHabitsSavings',
          'spendingHabitsInvestment',
          'spendingHabitsNecessities',
          'spendingHabitsOthers',
        ]),
        perc_income: parseFloat(data.perc_income / 100).toFixed(2),
        spendings: spendingsObject,
      };
      // dispatch({ type: 'UPDATE_ONBOARDING_2', payload: formattedData });
      // api call here, if 200 then redirect to /
      const dataToSubmit = {
        cognito_id: username,
        ...state.onboardingData,
        questionnaire: formattedData,
      };
      console.log(dataToSubmit);
      axios
        .post(`${process.env.NEXT_PUBLIC_USER_URL}/form`, dataToSubmit, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            axios
              .get(
                `${process.env.NEXT_PUBLIC_FINN_URL}/user/recommendation/${username}`,
                { headers: { Authorization: `Bearer ${token}` } },
              )
              .then((recommendationRes) => {
                if (recommendationRes.status === 200) {
                  Router.push('/home/');
                }
              });
          }
        });
    }
  };

  return (
    <Box>
      <Container mt="10">
        <Text
          mb={4}
          textAlign="center"
          fontSize="4xl"
          color="blue.500"
          fontWeight="bold"
        >
          A plan, made just for you.
        </Text>
        <Text mb={9} textAlign="center" fontSize="xl" fontWeight="bold">
          Let us know more about your current situation, so we can make this
          experience unique to you and your needs.
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.name}>
            {/* goals */}
            <FormLabel mt={3} htmlFor="financial_goals">
              What are your current financial goals?
            </FormLabel>
            <Select
              borderRadius="50px"
              id="financial_goals"
              {...register('financial_goals', {
							  required: 'This is required',
              })}
              placeholder="Select option"
            >
              <option value="General living expenses">
                General living expenses
              </option>
              <option value="Retirement">Retirement</option>
              <option value="Save up for big milestones">
                Save up for big milestones
              </option>
              <option value="Pay off debt">Pay off debt</option>
            </Select>

            {/* goal years */}
            <FormLabel mt={3} htmlFor="num_years">
              When do you plan to do this by?
            </FormLabel>
            <Select
              borderRadius="50px"
              id="num_years"
              {...register('num_years', {
							  required: 'This is required',
              })}
              placeholder="Select option"
            >
              <option value="1">In 1 year</option>
              <option value="5">In 5 years</option>
              <option value="10">In 10 years</option>
              <option value="20">In 20 years</option>
            </Select>

            {/* percentage income */}
            <FormLabel mt={3} htmlFor="perc_income">
              What percentage of your income do you think you can allocate
              towards this goal?
            </FormLabel>
            <NumberInput>
              <NumberInputField
                borderRadius="50px"
                id="perc_income"
                placeholder="% of Income"
                {...register('perc_income', {
								  required: 'This is required',
								  max: {
								    value: 100,
								    message: 'Please enter a valid percentage',
								  },
                })}
              />
            </NumberInput>

            {/* risk appetite */}
            <FormLabel mt={3} htmlFor="risk_appetite">
              What do you think is your risk appetite regarding finances?
            </FormLabel>
            <Select
              borderRadius="50px"
              id="risk_appetite"
              {...register('risk_appetite', {
							  required: 'This is required',
              })}
              placeholder="Select option"
            >
              <option value="low">Low</option>
              <option value="med">Medium</option>
              <option value="high">High</option>
            </Select>

            {/* current spending */}
            <FormLabel mt={3} htmlFor="spendingHabits">
              Approximately, what percentage of your monthly income do you
              usually spend on the following?
            </FormLabel>
            {validPercentageSpending ? null : (
              <Text my={4} color="red">
                Error! Please ensure that the distribution of spending habits
                sum to 100%
              </Text>
            )}
            <Box w={['300px', '300px', '400px', '500px']}>
              <Flex mb={1} justifyContent="space-between">
                <Text fontSize="xl" mr={3}>
                  Savings:
                </Text>
                <NumberInput>
                  <NumberInputField
                    float="right"
                    w="100px"
                    borderRadius="20px"
                    id="percentageIncome"
                    placeholder="%"
                    {...register('spendingHabitsSavings', {
										  required: 'This is required',
										  max: {
										    value: 100,
										    message: 'Please enter a valid percentage',
										  },
                    })}
                  />
                </NumberInput>
              </Flex>
              <Flex mb={1} justifyContent="space-between">
                <Text fontSize="xl" mr={3}>
                  Investment:
                </Text>
                <NumberInput>
                  <NumberInputField
                    float="right"
                    w="100px"
                    borderRadius="20px"
                    id="spendingHabitsInvestment"
                    placeholder="%"
                    {...register('spendingHabitsInvestment', {
										  required: 'This is required',
										  max: {
										    value: 100,
										    message: 'Please enter a valid percentage',
										  },
                    })}
                  />
                </NumberInput>
              </Flex>
              <Flex mb={1} justifyContent="space-between">
                <Text fontSize="xl" mr={3}>
                  Necessities:
                </Text>
                <NumberInput display="flex">
                  <NumberInputField
                    w="100px"
                    borderRadius="20px"
                    id="spendingHabitsNecessities"
                    placeholder="%"
                    {...register('spendingHabitsNecessities', {
										  required: 'This is required',
										  max: {
										    value: 100,
										    message: 'Please enter a valid percentage',
										  },
                    })}
                  />
                </NumberInput>
              </Flex>
              <Flex mb={1} justifyContent="space-between">
                <Text fontSize="xl" mr={3}>
                  Others:
                </Text>
                <NumberInput display="flex">
                  <NumberInputField
                    w="100px"
                    borderRadius="20px"
                    id="spendingHabitsOthers"
                    placeholder="%"
                    {...register('spendingHabitsOthers', {
										  required: 'This is required',
										  max: {
										    value: 100,
										    message: 'Please enter a valid percentage',
										  },
                    })}
                  />
                </NumberInput>
              </Flex>
            </Box>

            <Flex mt={10}>
              <FormLabel id="loan_amt">
                Are you looking to take a loan in the near future?
              </FormLabel>
              <Button
                mr={4}
                borderRadius="50px"
                bg="green.300"
                onClick={() => setAskLoanAmount(true)}
              >
                Yes
              </Button>
              <Button
                bg="red.300"
                borderRadius="50px"
                onClick={() => setAskLoanAmount(false)}
              >
                No
              </Button>
            </Flex>
            {askLoanAmount ? (
              <NumberInput mt={5}>
                <NumberInputField
                  borderRadius="50px"
                  id="loan_amt"
                  placeholder="Loan amount"
                  {...register('loan_amt', {})}
                />
              </NumberInput>
            ) : null}
          </FormControl>
          <Button
            backgroundColor="orange.500"
            w="100px"
            borderRadius="50px"
            mt={4}
            float="left"
            colorScheme="teal"
            onClick={() => goBack(true)}
          >
            Back
          </Button>
          <Button
            backgroundColor="orange.500"
            w="100px"
            borderRadius="50px"
            mt={4}
            float="right"
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Container>
    </Box>
  );
}
