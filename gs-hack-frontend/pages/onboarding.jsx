import { withSSRContext } from 'aws-amplify';
import React, { useState } from 'react';
import PhaseOnePartOne from '../components/onboarding/PhaseOnePartOne';
import PhaseOnePartTwo from '../components/onboarding/PhaseOnePartTwo';

export default function onboarding({ username, token, data }) {
  const [moveToPartOne, setMoveToPartOne] = useState(true);
  return (
    <>
      {moveToPartOne ? (
        <PhaseOnePartOne setComplete={setMoveToPartOne} />
      ) : (
        <PhaseOnePartTwo
          username={username}
          token={token}
          user={data}
          goBack={setMoveToPartOne}
        />
      )}
    </>
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
