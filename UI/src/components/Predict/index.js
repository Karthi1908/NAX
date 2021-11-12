import React from 'react';
import {
  Box,
  Container,
  useColorModeValue,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  RadioGroup,
  Stack,
  Radio,
  NumberInput,
  NumberInputField,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from '@chakra-ui/react';
import PredictionContext from '../../helper/PredictionContext';
import Loading from '../../helper/Loading';
import { CONTRACT_ADDRESS, wallet } from '../../helper/tezos';

const BuySellWindow = ({ id, options, sides }) => {
  const [request, setRequest] = React.useState({
    option: options[0],
    quantity: 0,
	side: sides[0],
  });

  const buySubmit = async (e) => {
    e.preventDefault();
    const { option, quantity, side } = e.target.elements;
	let buySellId = 1
	if (side.value == 'Sell') {
		buySellId = -1;
	}
    const contract = await wallet.at(CONTRACT_ADDRESS);
	console.log(side.value);
    const trade_event = await contract.methods
      .trade(quantity.value, buySellId, id, option.value)
	  .send();
	await trade_event.confirmation();
    alert("Trade Completed Successfully")
  };

  return (
    <Tabs variant="soft-rounded" width="100%">

      <TabPanels>
        <TabPanel>
          <form onSubmit={buySubmit}>
            <Container
              padding={{ base: '0' }}
              display="flex"
              flexDirection="column"
            >
              <Box margin="3">
				<Text fontWeight="bold" fontSize="md">
                  Pick an side
                </Text>
                <RadioGroup
                  onChange={(e) =>
                    setRequest((request) => {
                      return {
                        ...request,
                        side: e,
                      };
                    })
                  }
                  value={request.side}
                  name="side"
                >
                  <Stack direction="row">
                    {sides.map((side, i) => {
                      return (
                        <Radio key={i} value={side}>
                          <Box
                            borderWidth="1px"
                            borderColor="gray.400"
                            p="2"
                            borderRadius="2xl"
                          >
                            {side}
                          </Box>
                        </Radio>
                      );
                    })}
                  </Stack>
                </RadioGroup>

                <Text fontWeight="bold" fontSize="md">
                  Pick an option
                </Text>
                <RadioGroup
                  onChange={(e) =>
                    setRequest((request) => {
                      return {
                        ...request,
                        option: e,
                      };
                    })
                  }
                  value={request.option}
                  name="option"
                >
                  <Stack direction="row">
                    {options.map((option, i) => {
                      return (
                        <Radio key={i} value={option}>
                          <Box
                            borderWidth="1px"
                            borderColor="gray.400"
                            p="2"
                            borderRadius="2xl"
                          >
                            {option}
                          </Box>
                        </Radio>
                      );
                    })}
                  </Stack>
                </RadioGroup>
              </Box>
              <Box margin="3">
                <Text fontWeight="bold" fontSize="lg">
                  Trade amount/shares
                </Text>
                <NumberInput
                  isRequired
                  placeholder="Shares"
                  onChange={(e) =>
                    setRequest((request) => {
                      return {
                        ...request,
                        quantity: e,
                      };
                    })
                  }
                  value={request.quantity}
                  name="quantity"
                >
                  <NumberInputField />
                </NumberInput>
              </Box>
              <Box margin="3">
                <Button type="submit">Submit</Button>
              </Box>

            </Container>
          </form>
        </TabPanel>
        <TabPanel>Lol2</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default function Predict({ id }) {
  const { predictions } = React.useContext(PredictionContext);
  const [data, setData] = React.useState(null);
  const colors = {
    bg: useColorModeValue('blue.100', 'blue.900'),
    text: useColorModeValue('black', 'white'),
    border: useColorModeValue('gray.400', ''),
    cardBg: useColorModeValue('gray.200', 'gray.700'),
  };

  React.useEffect(() => {
    const _ = predictions.get(id);

    setData({
      key: id,
	  mp: _.markPrice.toString(),
	  lf: _.leverageFactor.toString(),
      disclosure:
        "Neo Asset Exchange is an experimental exchange for both visualizing data and market trends from on-chain activity, and interacting with said smart contracts directly via your Web 3 enabled wallet.",
    });
  }, []);

  return data ? (
    <Container
      maxWidth="100vw"
      width="auto"
      bg={colors.bg}
      color={colors.text}
      height="auto"
      minH="92vh"
      display="flex"
      flexDir="column"
      justifyContent="center"
      padding="0 15% 0 15%"
    >
      <Accordion allowToggle margin="6">
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1">Please Read this before making any purchases</Box>
            </AccordionButton>
          </h2>
          <AccordionPanel p="6">{data.disclosure}</AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Box
        p="6"
        maxW="max-content"
        borderWidth="1px"
        borderRadius="lg"
        borderColor={colors.border}
        overflow="hidden"
        display="flex"
        flexDirection="column"
        flexWrap="wrap"
      >
        <Text fontSize="xl" fontWeight="bold">Prepetual Contract: {data.key} </Text>
	    <Text fontSize="xs">Leverage Factor: {data.lf} </Text>
		<Text fontSize="xs">Mark Price: {data.mp} </Text>
      </Box>

      <Box
        margin="6"
        p={{ base: '2', md: '6' }}
        maxW="max-content"
        borderWidth="1px"
        borderRadius="lg"
        borderColor={colors.border}
        overflow="hidden"
        display="flex"
        flexDirection="column"
        flexWrap="wrap"
      >
        <BuySellWindow id={id} options={["New","SQR-OFF"]} sides = {['Sell','Buy']} />
      </Box>
    </Container>
  ) : (
    <Loading />
  );
}
