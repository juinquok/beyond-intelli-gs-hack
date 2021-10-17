import { ArrowDownIcon, ArrowUpIcon, StarIcon } from '@chakra-ui/icons';
import {
  Box, Divider, Grid, GridItem, Heading, HStack, Image,
  Modal, ModalCloseButton, ModalContent, Table, Tbody, Td, Text, Tr, useDisclosure, VStack,
} from '@chakra-ui/react';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import NumberFormat from 'react-number-format';
// import IndividualStock from './IndividualStock';

export default function watchlist({ stockData }) {
  console.log(stockData);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const timePeriod = stockData[0].trends.map((x) => (x.period));
  const StrongBuy = stockData[0].trends.map((x) => Number(x.strongBuy));
  const Buy = stockData[0].trends.map((x) => Number(x.buy));
  const Hold = stockData[0].trends.map((x) => Number(x.hold));
  const Sell = stockData[0].trends.map((x) => Number(x.sell));
  const StrongSell = stockData[0].trends.map((x) => Number(x.strongSell));

  const data = {
    labels: timePeriod,
    datasets: [
      {
        label: 'Strong Sell',
        data: StrongSell,
        backgroundColor: [
          'rgba(238, 104, 85, 0.5)',
        ],
        borderColor: [
          'rgba(238, 104, 85, 1)',
        ],
        borderWidth: 1,
        grouped: false,
        stack: timePeriod,
      },
      {
        label: 'Sell',
        data: Sell,
        backgroundColor: [
          'rgba(237, 137, 54, 0.5)',
        ],
        borderColor: [
          'rgba(237, 137, 54, 1)',
        ],
        borderWidth: 1,
        grouped: false,
        stack: timePeriod,
      },
      {
        label: 'Hold',
        data: Hold,
        backgroundColor: [
          'rgba(234, 175, 23, 0.5)',
        ],
        borderColor: [
          'rgba(234, 175, 23, 1)',
        ],
        borderWidth: 1,
        grouped: false,
        stack: timePeriod,
      },
      {
        label: 'Buy',
        data: Buy,
        backgroundColor: [
          'rgba(0, 168, 107, 0.5',
        ],
        borderColor: [
          'rgba(0, 168, 107, 1)',
        ],
        borderWidth: 1,
        grouped: false,
        stack: timePeriod,
      },
      {
        label: 'Strong Buy',
        data: StrongBuy,
        backgroundColor: [
          'rgba(0, 117, 75, 0.5)',
        ],
        borderColor: [
          'rgba(0, 117, 75, 1)',
        ],
        borderWidth: 1,
        grouped: false,
        stack: timePeriod,
      },
    ],
  };
  return (
    <Box maxW="3xl" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box borderWidth="1px" p={4} bg="rgba(49, 130, 206, 0.1)" verticalAlign="middle">
        <HStack justifyContent="space-between">
          <Heading as="h3" size="lg" fontWeight="extrabold" textAlign="left" alignItems="center"> Watchlist </Heading>
          {/* <AddIcon /> */}
        </HStack>
      </Box>
      <Box>
        {stockData.map((x) => (
          <Box>
            <HStack justifyContent="space-between">
              <VStack alignItems="left" p={3}>
                <Heading size="md" as="h6">
                  {x.profile.name}
                  {' '}
                </Heading>
                <Text size="xs" as="p" opacity="0.5">{x.ticker}</Text>
              </VStack>
              <VStack alignItems="center" p={3}>
                <Heading size="md" as="h6" fontWeight="extrabold">
                  {x.stock_prices.c}
                  {' '}
                </Heading>
                {x.stock_prices.d > 0 ? (
                  <Text size="xs" as="p" color="#00A86B" fontWeight="bold">
                    <ArrowUpIcon />
                    {x.stock_prices.d}
                    {' '}
                    (
                    {x.stock_prices.dp}
                    %
                    )
                  </Text>
                ) : (x.stock_prices.d === 0 ? (
                  <Text size="xs" as="p" fontWeight="bold">
                    {x.stock_prices.d}
                    {' '}
                    (
                    {x.stock_prices.dp}
                    %
                    )
                  </Text>
                ) : (
                  <Text size="xs" as="p" color="#EE6855" fontWeight="bold">
                    <ArrowDownIcon />
                    {x.stock_prices.d}
                    {' '}
                    (
                    {x.stock_prices.dp}
                    %
                    )
                  </Text>
                ))}
              </VStack>
              <Box p="6">
                <VStack>
                  <Box
                    as="button"
                // width="290px"
                    height="35px"
                    lineHeight="1.2"
                    transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                    p={2}
                    borderRadius="30px"
                    fontSize="16px"
                    fontWeight="bold"
                    bg="#3182CE"
                    color="#ffffff"
                    onClick={onOpen}
                  >
                    View Info
                  </Box>
                  <Modal isOpen={isOpen} onClose={onClose} size="3xl">
                    <ModalContent>
                      <Box p={4}>
                        <HStack justifyContent="space-between">
                          <Box>
                            <Heading>
                              {x.profile.name}
                              {' '}
                              (
                              {x.ticker}
                              )
                              {' '}
                            </Heading>
                            <Text>
                              {x.profile.exchange}
                              , Currency in
                              {' '}
                              {x.profile.currency}
                            </Text>
                          </Box>
                          <ModalCloseButton />
                        </HStack>
                        <Grid templateColumns="repeat(8, 1fr)" gap={6} px={2}>
                          <GridItem colSpan={4}>
                            {' '}
                            <Box>
                              <VStack alignItems="left">
                                <Heading as="h4" size="md"> Company Profile</Heading>
                                <HStack justifyContent="space-between">
                                  <Image src={x.profile.logo} alt="logo" maxH="80px" />
                                  <Box>
                                    <Heading as="h1" size="xl" fontWeight="extrabold">{x.stock_prices.c}</Heading>
                                    {x.stock_prices.d > 0 ? (
                                      <Text color="#00A86B" fontWeight="bold" size="lg">
                                        <ArrowUpIcon />
                                        {' '}
                                        {x.stock_prices.d}
                                        {' '}
                                        (
                                        {Number(x.stock_prices.dp).toFixed(2)}
                                        %
                                        )
                                      </Text>
                                    ) : (x.stock_prices.d === 0 ? (
                                      <Text fontWeight="bold" size="lg">
                                        {' '}
                                        {x.stock_prices.d}
                                        {' '}
                                        (
                                        {Number(x.stock_prices.dp).toFixed(2)}
                                        %
                                        )
                                      </Text>
                                    ) : (
                                      <Text color="#EE6855" fontWeight="bold" size="lg">
                                        <ArrowDownIcon />
                                        {' '}
                                        {x.stock_prices.d}
                                        {' '}
                                        (
                                        {Number(x.stock_prices.dp).toFixed(2)}
                                        %
                                        )
                                      </Text>
                                    )
                                    )}
                                  </Box>
                                  <StarIcon color="blue.500" width="60px" />
                                </HStack>
                                <Text as="p" size="xs">
                                  <Table variant="simple">
                                    <Tbody>
                                      <Tr>
                                        <Td>Country </Td>
                                        <Td>{x.profile.country}</Td>
                                      </Tr>
                                      <Tr>
                                        <Td>Industry</Td>
                                        <Td>{x.profile.finnhubIndustry}</Td>
                                      </Tr>
                                      <Tr>
                                        <Td>Market Cap</Td>
                                        <Td>
                                          <NumberFormat
                                            value={x.profile.marketCapitalization}
                                            displayType="text"
                                            thousandSeparator
                                          />

                                        </Td>
                                      </Tr>
                                      <Tr>
                                        <Td> Shares Outstanding</Td>
                                        <Td>
                                          <NumberFormat
                                            value={Number(x.profile.shareOutstanding).toFixed(2)}
                                            displayType="text"
                                            thousandSeparator
                                          />

                                        </Td>
                                      </Tr>
                                      <Tr>
                                        <Td>Previous Close</Td>
                                        <Td>{x.stock_prices.pc}</Td>
                                      </Tr>
                                      <Tr>
                                        <Td>Open</Td>
                                        <Td>{x.stock_prices.o}</Td>
                                      </Tr>
                                    </Tbody>
                                  </Table>
                                </Text>
                              </VStack>
                            </Box>
                          </GridItem>
                          <GridItem colSpan={4}>
                            {' '}
                            <Box w={1} h={1} />
                            <Bar
                              data={data}
                              width={2}
                              height={2}
                              options={{
                                responsive: true,
                                aspectRatio: 0.8,
                                maintainAspectRatio: true,
                                legend: {
                                  display: true,
                                },
                                tooltips: {
                                  enabled: true,
                                },
                                scales: {
                                  xAxes: [
                                    {
                                      stacked: false,
                                      gridLines: {
                                        display: false,
                                      },
                                      scaleLabel: {
                                        display: false,
                                      },
                                    },
                                  ],
                                  yAxes: [
                                    {
                                      stacked: true,
                                      ticks: {
                                        beginAtZero: true,
                                        precision: 0,
                                        stepSize: 5,
                                        maxTicksLimit: 5,
                                      },
                                      gridLines: {
                                        display: false,
                                      },
                                      scaleLabel: {
                                        display: true,
                                      },
                                    },
                                  ],
                                },
                              }}
                            />
                            {' '}
                          </GridItem>
                        </Grid>
                      </Box>
                    </ModalContent>
                  </Modal>
                </VStack>
              </Box>
            </HStack>
            <Divider orientation="horizontal" />
          </Box>
        ))}
      </Box>
    </Box>

  );
}
