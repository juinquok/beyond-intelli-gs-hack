/* eslint-disable react/prop-types */
import { Box } from '@chakra-ui/react';
import { withSSRContext } from 'aws-amplify';
import Router from 'next/router';
import { useEffect } from 'react';
import Header from '../components/navbar';
import { useGlobalContext } from '../context/reducer';
import Hero from './landingpage';

export default function Home({
  username, token, authenticated, data,
}) {
  const { state, dispatch } = useGlobalContext();
  console.log(data);
  // console.log(username);
  useEffect(() => {
    if (data && data.onboarding === false) {
      Router.push('/onboarding');
    }
  });

  return (
    <Box>
      {data && data.onboarding ? (
        <>
          <Header />
          <Hero />
        </>
      ) : null}
    </Box>
  );
}

export async function getServerSideProps(context) {
  const { Auth } = withSSRContext(context);
  try {
    const user = await Auth.currentAuthenticatedUser();
    const { username } = user;
    const token = user.signInUserSession.idToken.jwtToken;
    console.log(username, token);
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
    console.log(data);
    return {
      props: {
        authenticated: true,
        username,
        token,
        data: data.Items[0],
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
