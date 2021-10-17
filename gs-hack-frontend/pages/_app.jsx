/* eslint-disable react/jsx-props-no-spreading */
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import { ChakraProvider } from '@chakra-ui/react';
import Amplify from 'aws-amplify';
import { GlobalProvider } from '../context/reducer';
import awsExports from '../src/aws-exports';
import '../styles/date-picker.css';
import '../styles/globals.css';

Amplify.configure({
  ...awsExports,
  ssr: true,
});

// eslint-disable-next-line react/prop-types
function MyApp({ Component, pageProps }) {
  return (
    <GlobalProvider>
      <ChakraProvider>
        <AmplifyAuthenticator>
          <Component {...pageProps} />
        </AmplifyAuthenticator>
      </ChakraProvider>
    </GlobalProvider>

  );
}

export default MyApp;
