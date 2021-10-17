/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  WrapItem,
  Tooltip,
  NumberInput,
  NumberInputField,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import _ from 'lodash';
import axios from 'axios';
import { CheckCircleIcon, CheckIcon } from '@chakra-ui/icons';
import FileInput from './FileInput';

export default function KycModal({
  loan, loanName, token, cognitoUsername,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [submit, setSubmit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('img', data.img[0]);
    formData.append('statement', data.statement[0]);
    formData.append('nric', data.nric);
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('address', data.address);
    formData.append('postal_code', data.postal_code);
    formData.append('cognito_username', cognitoUsername);

    console.log(data);
    axios
      .post(`${process.env.NEXT_PUBLIC_USER_URL}/kyc/verify`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          console.log('success');
          setSuccess(true);
          sleep(2000).then(() => {
            setDisplaySuccess(true);
          });
        }
      });
  };
  let buttonType;
  if (submit && success) {
    buttonType = 'tick';
  } else if (submit) {
    buttonType = 'spinner';
  } else if (!submit) {
    buttonType = 'submit';
  }

  // console.log(loan);
  return (
    <>
      <WrapItem>
        <Tooltip
          label="To check your eligibility for this loan, please verify your identity"
          placement="auto-start"
        >
          <Button
            width="200px"
            height="35px"
            borderRadius="30px"
            onClick={onOpen}
          >
            Verify Your Identity
          </Button>
        </Tooltip>
      </WrapItem>

      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {displaySuccess ? 'Identity verified' : 'Verify your identity'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={4}>
            {displaySuccess ? (
              <Box>
                <Flex mb={5} justifyContent="center">
                  <CheckCircleIcon boxSize="100px" color="green.500" />
                </Flex>
                <Box>
                  <Text
                    mb={3}
                    textAlign="center"
                    fontWeight="bold"
                    fontSize="1xl"
                  >
                    Congratulations! Your identity has been verified through
                    Maverick&apos;s e-KYC process.
                  </Text>
                  <Text textAlign="center">
                    Your loan application for
                    {` ${loanName} `}
                    has been submitted to
                    {' '}
                    {loanName.split(' ')[0]}
                    . Please wait
                    1-2 days for your loan to be processed, you will be
                    contacted by the bank for furhter instructions.
                  </Text>
                  <Flex mb={4} justifyContent="center">
                    <Button
                      onClick={onClose}
                      borderRadius="50px"
                      mt={4}
                      colorScheme="teal"
                      bg="green.500"
                    >
                      Awesome!
                    </Button>
                  </Flex>
                </Box>
              </Box>
            ) : (
              <Box>
                <Flex justifyContent="center">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {/* NRIC */}
                    <FormLabel mt={3} htmlFor="nric">
                      NRIC
                    </FormLabel>
                    <Input
                      borderRadius="50px"
                      id="id"
                      placeholder="S1234567A"
                      {...register('nric', {
											  required: 'This is required',
                      })}
                    />

                    {/* first name */}
                    <FormLabel mt={3} htmlFor="first_name">
                      First name
                    </FormLabel>
                    <Input
                      borderRadius="50px"
                      id="first_name"
                      placeholder="First Name"
                      {...register('first_name', {
											  required: 'This is required',
                      })}
                    />

                    {/* last name */}
                    <FormLabel mt={3} htmlFor="last_name ">
                      Last name
                    </FormLabel>
                    <Input
                      borderRadius="50px"
                      id="last_name "
                      placeholder="Name"
                      {...register('last_name ', {
											  required: 'This is required',
                      })}
                    />

                    {/* address */}
                    <FormLabel mt={3} htmlFor="address">
                      Address
                    </FormLabel>
                    <Input
                      borderRadius="50px"
                      id="address"
                      placeholder="Address"
                      {...register('address', {
											  required: 'This is required',
                      })}
                    />

                    {/* postal code */}
                    <FormLabel mt={3} htmlFor="postal_code">
                      Postal code
                    </FormLabel>
                    <NumberInput>
                      <NumberInputField
                        borderRadius="50px"
                        id="postal_code"
                        placeholder="Postal code"
                        maxLength={6}
                        {...register('postal', {
												  required: 'This is required',
                        })}
                      />
                    </NumberInput>

                    <FormLabel mt={3}>Upload NRIC</FormLabel>
                    <FileInput name="img" control={control} />
                    <FormLabel mt={4}>Upload bank income statement</FormLabel>
                    <FileInput name="statement" control={control} />
                    <Flex mt={5} justifyContent="center">
                      {buttonType === 'submit' ? (
                        <Button
                          onClick={() => setSubmit(true)}
                          backgroundColor="orange.500"
                          w="100px"
                          borderRadius="50px"
                          mt={4}
                          colorScheme="teal"
                          isLoading={isSubmitting}
                          type="submit"
                        >
                          Submit
                        </Button>
                      ) : buttonType === 'spinner' ? (
                        <Button
                          _hover={{ backgroundColor: 'orange.500' }}
                          isDisabled
                          backgroundColor="orange.500"
                          w="100px"
                          borderRadius="50px"
                          mt={4}
                          colorScheme="teal"
                          type="submit"
                          isLoading={isSubmitting}
                        >
                          <Spinner />
                        </Button>
                      ) : buttonType === 'tick' ? (
                        <Button
                          _hover={{ backgroundColor: 'green.500' }}
                          isDisabled
                          backgroundColor="green.500"
                          w="100px"
                          borderRadius="50px"
                          mt={4}
                          colorScheme="teal"
                          type="submit"
                          isLoading={isSubmitting}
                        >
                          <CheckIcon color="white" />
                        </Button>
                      ) : (
                        <Button bg="red">Error</Button>
                      )}
                    </Flex>
                  </form>
                </Flex>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
