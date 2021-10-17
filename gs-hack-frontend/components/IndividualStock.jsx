// import { React, useEffect, useState } from 'react';
// import {
//   Text, Heading, Box, Image, Grid, GridItem, Table, HStack, VStack, Modal, Button,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton, useDisclosure,
//   Tbody,
//   Tr,
//   Td,
// } from '@chakra-ui/react';
// import axios from 'axios';
// import NumberFormat from 'react-number-format';
// import { Bar } from 'react-chartjs-2';
// import {
//   ArrowUpIcon, ArrowDownIcon, StarIcon, CloseIcon,
// } from '@chakra-ui/icons';

// const analystSentiment = (stockData) => {
//   console.log(stockData);
//   const timePeriod = stockData.trends.map((x) => (x.period));
//   const StrongBuy = stockData.trends.map((x) => Number(x.strongBuy));
//   const Buy = stockData.trends.map((x) => Number(x.buy));
//   const Hold = stockData.trends.map((x) => Number(x.hold));
//   const Sell = stockData.trends.map((x) => Number(x.sell));
//   const StrongSell = stockData.trends.map((x) => Number(x.strongSell));

//   const data = {
//     labels: timePeriod,
//     datasets: [
//       {
//         label: 'Strong Sell',
//         data: StrongSell,
//         backgroundColor: [
//           'rgba(238, 104, 85, 0.5)',
//         ],
//         borderColor: [
//           'rgba(238, 104, 85, 1)',
//         ],
//         borderWidth: 1,
//         grouped: false,
//         stack: timePeriod,
//       },
//       {
//         label: 'Sell',
//         data: Sell,
//         backgroundColor: [
//           'rgba(237, 137, 54, 0.5)',
//         ],
//         borderColor: [
//           'rgba(237, 137, 54, 1)',
//         ],
//         borderWidth: 1,
//         grouped: false,
//         stack: timePeriod,
//       },
//       {
//         label: 'Hold',
//         data: Hold,
//         backgroundColor: [
//           'rgba(234, 175, 23, 0.5)',
//         ],
//         borderColor: [
//           'rgba(234, 175, 23, 1)',
//         ],
//         borderWidth: 1,
//         grouped: false,
//         stack: timePeriod,
//       },
//       {
//         label: 'Buy',
//         data: Buy,
//         backgroundColor: [
//           'rgba(0, 168, 107, 0.5',
//         ],
//         borderColor: [
//           'rgba(0, 168, 107, 1)',
//         ],
//         borderWidth: 1,
//         grouped: false,
//         stack: timePeriod,
//       },
//       {
//         label: 'Strong Buy',
//         data: StrongBuy,
//         backgroundColor: [
//           'rgba(0, 117, 75, 0.5)',
//         ],
//         borderColor: [
//           'rgba(0, 117, 75, 1)',
//         ],
//         borderWidth: 1,
//         grouped: false,
//         stack: timePeriod,
//       },
//     ],
//   };
//   const { onClose } = useDisclosure();

//   return (
//     <Box p={4}>
//       <HStack justifyContent="space-between">
//         <Box>
//           <Heading>
//             {stockData.profile.name}
//             {' '}
//             (
//             {stockData.ticker}
//             )
//             {' '}
//           </Heading>
//           <Text>
//             {stockData.profile.exchange}
//             , Currency in
//             {' '}
//             {stockData.profile.currency}
//           </Text>
//         </Box>
//         <ModalCloseButton />
//       </HStack>
//       <Grid templateColumns="repeat(8, 1fr)" gap={6} px={2}>
//         <GridItem colSpan={4}>
//           {' '}
//           <Box>
//             <VStack alignItems="left">
//               <Heading as="h4" size="md"> Company Profile</Heading>
//               <HStack justifyContent="space-between">
//                 <Image src={stockData.profile.logo} alt="logo" maxH="80px" />
//                 <Box>
//                   <Heading as="h1" size="xl" fontWeight="extrabold">{stockData.stock_prices.c}</Heading>
//                   {stockData.stock_prices.d > 0 ? (
//                     <Text color="#00A86B" fontWeight="bold" size="lg">
//                       <ArrowUpIcon />
//                       {' '}
//                       {stockData.stock_prices.d}
//                       {' '}
//                       (
//                       {Number(stockData.stock_prices.dp).toFixed(2)}
//                       %
//                       )
//                     </Text>
//                   ) : (stockData.stock_prices.d === 0 ? (
//                     <Text fontWeight="bold" size="lg">
//                       {' '}
//                       {stockData.stock_prices.d}
//                       {' '}
//                       (
//                       {Number(stockData.stock_prices.dp).toFixed(2)}
//                       %
//                       )
//                     </Text>
//                   ) : (
//                     <Text color="#EE6855" fontWeight="bold" size="lg">
//                       <ArrowDownIcon />
//                       {' '}
//                       {stockData.stock_prices.d}
//                       {' '}
//                       (
//                       {Number(stockData.stock_prices.dp).toFixed(2)}
//                       %
//                       )
//                     </Text>
//                   )
//                   )}
//                 </Box>
//                 <StarIcon color="blue.500" width="60px" />
//               </HStack>
//               <Text as="p" size="xs">
//                 <Table variant="simple">
//                   <Tbody>
//                     <Tr>
//                       <Td>Country </Td>
//                       <Td>{stockData.profile.country}</Td>
//                     </Tr>
//                     <Tr>
//                       <Td>Industry</Td>
//                       <Td>{stockData.profile.finnhubIndustry}</Td>
//                     </Tr>
//                     <Tr>
//                       <Td>Market Cap</Td>
//                       <Td>
//                         <NumberFormat
//                           value={stockData.profile.marketCapitalization}
//                           displayType="text"
//                           thousandSeparator
//                         />

//                       </Td>
//                     </Tr>
//                     <Tr>
//                       <Td> Shares Outstanding</Td>
//                       <Td>
//                         <NumberFormat
//                           value={Number(stockData.profile.shareOutstanding).toFixed(2)}
//                           displayType="text"
//                           thousandSeparator
//                         />

//                       </Td>
//                     </Tr>
//                     <Tr>
//                       <Td>Previous Close</Td>
//                       <Td>{stockData.stock_prices.pc}</Td>
//                     </Tr>
//                     <Tr>
//                       <Td>Open</Td>
//                       <Td>{stockData.stock_prices.o}</Td>
//                     </Tr>
//                   </Tbody>
//                 </Table>
//               </Text>
//             </VStack>
//           </Box>
//         </GridItem>
//         <GridItem colSpan={4}>
//           {' '}
//           <Box w={1} h={1} />
//           <Bar
//             data={data}
//             width={2}
//             height={2}
//             options={{
//               responsive: true,
//               aspectRatio: 0.8,
//               maintainAspectRatio: true,
//               legend: {
//                 display: true,
//               },
//               tooltips: {
//                 enabled: true,
//               },
//               scales: {
//                 xAxes: [
//                   {
//                     stacked: false,
//                     gridLines: {
//                       display: false,
//                     },
//                     scaleLabel: {
//                       display: false,
//                     },
//                   },
//                 ],
//                 yAxes: [
//                   {
//                     stacked: true,
//                     ticks: {
//                       beginAtZero: true,
//                       precision: 0,
//                       stepSize: 5,
//                       maxTicksLimit: 5,
//                     },
//                     gridLines: {
//                       display: false,
//                     },
//                     scaleLabel: {
//                       display: true,
//                     },
//                   },
//                 ],
//               },
//             }}
//           />
//           {' '}
//         </GridItem>
//       </Grid>
//     </Box>
//   );
// };

// export default analystSentiment;
