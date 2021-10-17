import React, { useState } from 'react';
import {
  Text, Heading, Flex, Box, Image, Stack, VStack, StackDivider,
} from '@chakra-ui/react';
import creditcarddata from './creditcarddata.json';


const creditCardRecommendations = (testuser) => (

function findSuitableCards(testUserData, CardData) { // CardData = single card
  // const temp = CardData.eligibility;
  const citizenshipEligibility = CardData.eligibility.citizenship.split(',');
  if (Number(CardData.eligibility.min_age) <= Number(testUserData.Age)) {
    if (Number(CardData.eligibility.max_age) != 0) {
      if (Number(testUserData.Age) <= Number(CardData.eligibility.max_age)) {
        if (citizenshipEligibility.includes(testUserData.citizenship)) {
          if (testUserData.occupation === 'Full-time Student') {
            // eligibleCards.push(CardData);
            // console.log(CardData);
            return true;
            // eligibleCards.push(CardData);
          } if (testUserData.occupation != 'Full-time Student') {
            if (Number(testUserData['Monthly Income']) >= Number(CardData.min_income.adult)) {
              // eligibleCards.push(CardData);
              // console.log(CardData);
              return true;
            }
          }
        }
      }
    }
  }
}
  <Box>
    {Object.keys(creditcarddata).map((item) => (
      <Box>
        {findSuitableCards(testUserData, creditcarddata[item]) === true ? (
          <Box>
            {' '}
            {item}
            {' '}
          </Box>
        ) : (
          <Box>
            {' '}
            no card
            {' '}
          </Box>
        )}
      </Box>
    ))}
  </Box>
);

export default creditCardRecommendations;
