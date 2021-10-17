import { Box, Button, Code } from '@chakra-ui/react';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState();
  const [jwt, setJwt] = useState();
  useEffect(() => {
    const getUser = async () => {
      try {
        const authenticatedUser = await Auth.currentAuthenticatedUser();

        setUser(authenticatedUser);

        Auth.currentSession().then((res) => {
          const responseAccessToken = res.getAccessToken();
          const responseJwtToken = responseAccessToken.getJwtToken();
          setAccessToken(JSON.stringify(responseAccessToken));
          setJwt(responseJwtToken);
        });
      } catch {
        router.push('/');
      }
    };

    getUser();
  }, []);

  async function signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  if (user) {
    return (
      <Box>
        <Box m={4}>
          Email:
          {' '}
          {user.attributes.email}
        </Box>
        <Box m={4}>
          Access Token:
          {' '}
          <Code width="70vw">{accessToken}</Code>
        </Box>
        <Box m={4}>
          Just the JWT token:
          {' '}
          <Code width="70vw">{jwt}</Code>
        </Box>
        <Box>
          <Button colorScheme="red" onClick={() => signOut()}>Sign out</Button>
        </Box>
      </Box>
    );
  }

  return null;
}
