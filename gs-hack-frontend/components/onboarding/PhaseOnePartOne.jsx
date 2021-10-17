/* eslint-disable react/jsx-props-no-spreading */
import {
  Box, Button, Container, FormControl, FormLabel,
  Input, NumberInput, NumberInputField, NumberInputStepper, Select, Text,
} from '@chakra-ui/react';
import _ from 'lodash';
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from 'react-hook-form';
import { useGlobalContext } from '../../context/reducer';

export default function PhaseOnePartOne({ setComplete }) {
  const { state, dispatch } = useGlobalContext();
  const {
    register, handleSubmit, formState: { errors, isSubmitting },
  } = useForm();
  const onSubmit = (data) => {
    dispatch({ type: 'UPDATE_ONBOARDING_1', payload: data });
    setComplete(false);
  };
  const checkIfOnboardingDataExist = !!state.onboardingData;

  return (
    <Box>
      <Container mt="10">
        <Text textAlign="center" fontSize="4xl" color="blue.500" fontWeight="bold" textTransform="uppercase">maverick</Text>
        <Text mb={6} textAlign="center" fontSize="3xl" fontWeight="bold" textTransform="uppercase">Get started with us.</Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.name}>
            {/* data picker */}
            {/* <FormLabel htmlFor="dob">Date of Birth</FormLabel>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  id="dob"
                  placeholderText="Select date"
                  onChange={(date) => field.onChange(date)}
                  selected={field.value}
                />
              )}
            /> */}

            {/* first name */}
            <FormLabel mt={3} htmlFor="firstname">First Name</FormLabel>
            <Input
              borderRadius="50px"
              id="firstname"
              placeholder="First Name"
              defaultValue={checkIfOnboardingDataExist ? state.onboardingData.firstname : ''}
              {...register('firstname', {
                required: 'This is required',
              })}
            />

            {/* last name */}
            <FormLabel mt={3} htmlFor="lastname">Last Name</FormLabel>
            <Input
              borderRadius="50px"
              id="lastname"
              placeholder="Last Name"
              defaultValue={checkIfOnboardingDataExist ? state.onboardingData.lastname : ''}
              {...register('lastname', {
                required: 'This is required',
              })}
            />

            {/* age */}
            <FormLabel mt={3} htmlFor="age">Age</FormLabel>
            <NumberInput>
              <NumberInputField
                borderRadius="50px"
                id="age"
                placeholder="Age"
                defaultValue={checkIfOnboardingDataExist ? _.parseInt(state.onboardingData.age) : ''}
                {...register('age', {
                  required: 'This is required',
                  max: { value: 99, message: 'Please enter a valid age' },
                })}
              />
              <NumberInputStepper />
            </NumberInput>

            {/* gender */}
            <FormLabel htmlFor="male" mt={3}>Gender</FormLabel>

            <input {...register('gender', { required: true })} id="male" type="radio" value="Male" />
            <label> Male </label>

            <input {...register('gender', { required: true })} type="radio" value="Female" />
            <label> Female </label>

            <input {...register('gender', { required: true })} type="radio" value="Prefer not to say" />
            <label> Prefer not to say </label>

            {/* occupation */}
            <FormLabel mt={3} htmlFor="occupation">Occupation</FormLabel>
            <Select
              borderRadius="50px"
              id="occupation"
              {...register('occupation', {
                required: 'This is required',
              })}
              placeholder="Select option"
            >
              <option value="Full-time Student">Full-time Student</option>
              <option value="Working Adult">Working adult</option>
              <option value="Self-employed">Self-employed</option>
              <option value="NSF">NSF</option>
              <option value="Retiree">Retiree</option>
              <option value="Unemployed">Unemployed</option>
            </Select>

            {/* monthly income */}
            <FormLabel mt={3} htmlFor="monthly_income">Monthly Income</FormLabel>
            <NumberInput>
              <NumberInputField
                borderRadius="50px"
                id="monthly_income"
                placeholder="Monthly Income"
                {...register('monthly_income', {
                  required: 'This is required',
                })}
              />
              <NumberInputStepper />
            </NumberInput>
            <FormLabel mt={3} htmlFor="occupation">Citizenship Status</FormLabel>
            <Select
              borderRadius="50px"
              id="citizenship"
              {...register('citizenship', {
                required: 'This is required',
              })}
              placeholder="Select option"
            >
              <option value="Singapore Citizen">Singapore Citizen</option>
              <option value="Singapore PR">Singapore PR</option>
              <option value="Foreigner">Foreigner</option>
            </Select>

            {/* address */}
            <FormLabel mt={3} htmlFor="address">Address</FormLabel>
            <Input
              borderRadius="50px"
              id="address"
              placeholder="Address"
              defaultValue={checkIfOnboardingDataExist ? state.onboardingData.address : ''}
              {...register('address', {
                required: 'This is required',
              })}
            />

            {/* postal code */}
            <FormLabel mt={3} htmlFor="postal_code">Postal Code</FormLabel>
            <Input
              borderRadius="50px"
              id="postal_code"
              placeholder="Postal Code"
              defaultValue={checkIfOnboardingDataExist ? state.onboardingData.postal_code : ''}
              {...register('postal_code', {
                required: 'This is required',
              })}
            />
          </FormControl>
          <Button backgroundColor="orange.500" w="100px" borderRadius="50px" mt={4} float="right" colorScheme="teal" isLoading={isSubmitting} type="submit">
            Next
          </Button>
        </form>
      </Container>
    </Box>
  );
}
