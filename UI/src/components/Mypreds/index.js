import React from 'react';
import PredictionContext from '../../helper/PredictionContext';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useWallet } from '../../helper/WalletContext';
import Loading from '../../helper/Loading';
import { ContractProvider, CONTRACT_ADDRESS, wallet } from '../../helper/tezos';

const AddPredRes = ({ pred }) => {
  const colors = {
    bg: useColorModeValue('gray.200', 'gray.700'),
    text: useColorModeValue('black', 'white'),
  };

  const submit = async (e) => {
    e.preventDefault();
    const { option } = e.target.elements;
    console.log(option.value);
    const contract = await wallet.at(CONTRACT_ADDRESS);
    contract.methods.predictResults(pred.id, option.value).send();
  };

  return (
    <Popover returnFocusOnClose={false} placement="right" closeOnBlur={false}>
      <PopoverTrigger>
        <Button bg={colors.bg} textColor={colors.text} marginLeft="10px">
          Result
        </Button>
      </PopoverTrigger>
      <PopoverContent textColor={colors.text}>
        <PopoverHeader fontWeight="semibold">
          Update Prediction Result
        </PopoverHeader>
        <PopoverBody>
          <form onSubmit={submit}>
            <FormControl>
              <FormLabel htmlFor={pred.id + '_status'}>Options</FormLabel>
              <RadioGroup name="option">
                <Stack direction="column">
                  {pred.predictionOptions.map((option, i) => {
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
            </FormControl>
            <Button type="submit">Submit</Button>
          </form>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const UpdatePredStatus = ({ pred }) => {
  const colors = {
    bg: useColorModeValue('gray.200', 'gray.700'),
    text: useColorModeValue('black', 'white'),
  };

  const submit = async (e) => {
    e.preventDefault();
    const { status } = e.target.elements;

    const contract = await wallet.at(CONTRACT_ADDRESS);
    contract.methods.updatepredictionStatus(pred.id, status.value).send();
  };
  return (
    <Popover returnFocusOnClose={false} placement="right" closeOnBlur={false}>
      <PopoverTrigger>
        <Button bg={colors.bg} textColor={colors.text}>
          Update
        </Button>
      </PopoverTrigger>
      <PopoverContent textColor={colors.text}>
        <PopoverHeader fontWeight="semibold">
          Update Prediction Status
        </PopoverHeader>
        <PopoverBody>
          <form onSubmit={submit}>
            <FormControl>
              <FormLabel htmlFor={pred.id + '_status'}>Status</FormLabel>
              <RadioGroup name="status">
                <Stack direction="column">
                  {[
                    'Prediction In-Progress',
                    'Prediction Ended',
                    'Result Declared',
                  ].map((option, i) => {
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
            </FormControl>
            <Button type="submit">Submit</Button>
          </form>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const AddNewPrediction = () => {
  const [num, setNum] = React.useState(0);
  // const { connected, connect, activeAccount } = useWallet();
  const [options, setOptions] = React.useState({});

  const submit = async (e) => {
    e.preventDefault();
    const { prediction, resultRef, start, end } = e.target.elements;

    const contract = await wallet.at(CONTRACT_ADDRESS);

    contract.methods
      .addprediction(
        parseInt(end.value),
        resultRef.value,
        prediction.value,
        Object.keys(options).map((key) => options[key]),
        parseInt(start.value)
      )
      .send();
  };
  return (
    <Popover>
      <PopoverTrigger>
        <Button>Add New Prediction</Button>
      </PopoverTrigger>
      <PopoverContent padding="4">
        <form onSubmit={submit}>
          <FormControl>
            <FormLabel htmlFor="prediction">Prediction</FormLabel>
            <Input name="prediction" id="prediction"></Input>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="resultRef">Result Reference</FormLabel>
            <Input name="resultRef" id="resultRef"></Input>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="start">Start</FormLabel>
            <Input type="number" name="start" id="start"></Input>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="end">End</FormLabel>
            <Input type="number" name="end" id="end"></Input>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="number_options">Number of Options</FormLabel>
            <Input
              onChange={(e) => {
                console.log(e);
                setNum(parseInt(e.target.value) || 0);
              }}
              name="number_options"
              id="number_options"
              type="number"
            ></Input>
          </FormControl>
          {[...Array(num).keys()].map((i) => {
            return (
              <FormControl>
                <FormLabel htmlFor={'option_' + i}>Option {i}</FormLabel>
                <Input
                  onChange={(e) =>
                    setOptions((options) => {
                      var opt = options;
                      opt[`option_${i}`] = e.target.value;
                      return opt;
                    })
                  }
                  name={`option_${i}`}
                  id={`option_${i}`}
                ></Input>
              </FormControl>
            );
          })}
          <Button type="submit">Submit</Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default function MyPreds() {
   const [trades, setTrades] = React.useState(null);
   const [tradesArray, setTradesArray] = React.useState([]);
   const updateTrades = (trans, transArray) => {
    setTrades(trans);
    setTradesArray(transArray);
   };
  const { connected, connect, activeAccount } = useWallet();
  const [myPreds, setMyPreds] = React.useState([]);
  const colors = {
    bg: useColorModeValue('purple.100', 'purple.900'),
    text: useColorModeValue('black', 'white'),
  };

  React.useEffect(() => {
	 ContractProvider.at(CONTRACT_ADDRESS).then(async (contract) => {
      if (!connected) {
        await connect();
      }
	  const storage = await contract.storage();
      const trades = storage.portfolio.get(activeAccount.address).valueMap;
	  
	  
      const transList = [];
      for (let trans of trades.keys()) {
		 
		  transList.push({id:trans, ...trades.get(trans)}); 
		  console.log(trans);
		  console.log(transList);
		  console.log(activeAccount.address);
      }
      updateTrades(trades, transList);
	  setMyPreds(transList)
    });
    
  }, [activeAccount]);

  return myPreds ? (
    <Container
      width="auto"
      maxWidth="100vw"
      bg={colors.bg}
      height="auto"
      maxHeight="100vh"
      padding="10vh"
    >
	   <Text fontSize="2xl" colorScheme="blue" fontWeight="normal">
         Portfolio
        </Text>
 
      <Box display="flex" flexDirection="column" flexWrap="wrap">
        {myPreds.map((trans, i) => {
          return (
            <Box
              key={i}
              // onClick={}
              display="flex"
              maxWidth="2000px"
              border="1px solid"
              borderRadius="15px"
              padding="20px"
              margin="10px"
            >
			<Box display="flex" flexDirection="row " flexWrap="wrap" margin="5px" maxWidth="2000px" minWidth="1000px">
              <Text color={colors.text}>Contract Name : </Text>
			  <Text color={colors.text}>{trans.id}</Text>
			  <Text color={colors.text}> &emsp; MarkPrice :</Text>
			   <Text color={colors.text}>{trans.markPrice.toString()}</Text>
			   <Text color={colors.text}> &emsp; Open Positions :</Text>
			   <Text color={colors.text}>{trans.openPostions.toString()}</Text>
			   <Text color={colors.text}> &emsp; Value at Cost :</Text>
			   <Text color={colors.text}>{trans.valueAtCost.toString()}</Text>
			   <Text color={colors.text}> &emsp; Value at Market :</Text>
			   <Text color={colors.text}>{trans.valueAtMarket.toString()}</Text>
			  		  
			</Box>

            </Box>
          );
        })}
      </Box>
    </Container>
  ) : (
    <Loading />
  );
}
