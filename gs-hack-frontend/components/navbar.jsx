import {
  Box, Button, Flex, HStack,
} from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Auth } from 'aws-amplify';
import DarkModeToggle from './DarkModeToggle';

async function signOut() {
  try {
    await Auth.signOut();
  } catch (error) {
    console.log('error signing out: ', error);
  }
}

const Header = () => (

  <HStack borderWidth="1px" p={4} bg="rgba(49, 130, 206, 0.1)" justifyContent="space-between">
    <Link href="/home/">
      <Flex _hover={{ cursor: 'pointer' }}>
        <Image as="Button" src="/logo.png" width="270px" height="67px" />
      </Flex>
    </Link>
    <Box px={4} justifyContent="space-between">
      <Link href="/FinancialPlanning/">
        <Box
          as="button"
          transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
          p={3}
          m={3}
          borderRadius="10px"
          fontSize="16px"
          fontWeight="regular"
          _hover={{ bg: 'blue.500', color: 'white' }}
          _active={{
            bg: 'blue.500',
            transform: 'scale(0.98)',
          }}
        >
          {' '}
          Financial Planner
        </Box>
      </Link>
      <Link href="/Loans/">
        <Box
          as="button"
          transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
          p={3}
          m={3}
          borderRadius="10px"
          fontSize="16px"
          fontWeight="regular"
          _hover={{ bg: 'blue.500', color: 'white' }}
          _active={{
            bg: 'blue.500',
            transform: 'scale(0.98)',
          }}
        >
          {' '}
          Loans
        </Box>
      </Link>
      <Link href="/MaverickCommunity/">
        <Box
          as="button"
          transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
          p={3}
          m={3}
          borderRadius="10px"
          fontSize="16px"
          fontWeight="regular"
          _hover={{ bg: 'blue.500', color: 'white' }}
          _active={{
            bg: 'blue.500',
            transform: 'scale(0.98)',
          }}
        >
          {' '}
          Maverick Community
        </Box>
      </Link>
      <Link href="/Investments/">
        <Box
          as="button"
          transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
          p={3}
          m={3}
          borderRadius="10px"
          fontSize="16px"
          fontWeight="regular"
          _hover={{ bg: 'blue.500', color: 'white' }}
          _active={{
            bg: 'blue.500',
            transform: 'scale(0.98)',
          }}
        >
          {' '}
          Investments
        </Box>
      </Link>
      <Box
        as="button"
        onClick={signOut}
        transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
        p={3}
        m={3}
        borderRadius="10px"
        fontSize="16px"
        fontWeight="regular"
        _hover={{ bg: 'blue.500', color: 'white' }}
        _active={{
          bg: 'blue.500',
          transform: 'scale(0.98)',
        }}
      >
        {' '}
        Logout
      </Box>
      {/* <Button onClick={signOut} fontWeight="regular">Logout</Button> */}
      <DarkModeToggle />
    </Box>
  </HStack>

);

export default Header;
