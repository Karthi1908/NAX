import React from 'react';
import { Box, Container, Text, useColorModeValue, HStack, } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { ContractProvider, CONTRACT_ADDRESS } from '../helper/tezos';

export default function Trade() {
   const [trades, setTrades] = React.useState(null);
   const [tradesArray, setTradesArray] = React.useState([]);
   const updateTrades = (trans, transArray) => {
    setTrades(trans);
    setTradesArray(transArray);
   };
   const history = useHistory();
   const colors = {
    bg: useColorModeValue('purple.100', 'purple.900'),
    text: useColorModeValue('black', 'white'),
  };
  
  React.useEffect(() => {
    ContractProvider.at(CONTRACT_ADDRESS).then(async (contract) => {
      const storage = await contract.storage();
      const trades = storage.tradeBlotter;
      const transList = [];
      for (let trans of trades.keys()) {
        transList.push({ id: trans, ...trades.get(trans) });
      }
      updateTrades(trades, transList);
    });
  }, []);

  return (
    <Container
      width="auto"
      maxWidth="1000vw"
      bg={colors.bg}
      height="auto"
      maxHeight="1000vh"
      padding="10vh"
    >
	    <HStack spacing={8} alignItems={'center'}>
          <Box></Box>
        </HStack>
        <Text fontSize="2xl" colorScheme="blue" fontWeight="normal">
          Trade Blotter
        </Text>
		<Box
              display="flex"
              maxWidth="1500px"
			  flexDirection="row"
              //border="1px solid"
              borderRadius="5px"
              padding="1px"
              margin="1px"
            >
			<Box display="flex" flexDirection="row" flexWrap="wrap" margin="5px" border="1px solid" maxWidth="30px" minWidth="30px">
				<Text color={colors.text} fontWeight="bold">ID : </Text>
			</Box>
			<Box display="flex" flexDirection="row" flexWrap="wrap" margin="5px" border="1px solid" maxWidth="200px" minWidth="200px">
				<Text color={colors.text} fontWeight="bold">Time : </Text>
			</Box>
			<Box display="flex" flexDirection="row" flexWrap="wrap" margin="5px" border="1px solid" maxWidth="200px" minWidth="200px">
				<Text color={colors.text} fontWeight="bold">Contract : </Text>
			</Box>
			<Box display="flex" flexDirection="row" flexWrap="wrap" margin="5px" border="1px solid" maxWidth="100px" minWidth="100px">
				<Text color={colors.text}fontWeight="bold">Amount : </Text>
			</Box>
			<Box display="flex" flexDirection="row" flexWrap="wrap" margin="5px" border="1px solid" maxWidth="100px" minWidth="100px">
				<Text color={colors.text}fontWeight="bold">Mark Price : </Text>
			</Box>
			<Box display="flex" flexDirection="row" flexWrap="wrap" margin="5px" border="1px solid" maxWidth="100px" minWidth="100px">
				<Text color={colors.text}fontWeight="bold">Quantity : </Text>
			</Box>
			<Box display="flex" flexDirection="row" flexWrap="wrap" margin="5px" border="1px solid" maxWidth="350px" minWidth="350px">
				<Text color={colors.text}fontWeight="bold">Trader : </Text>
			</Box>
		</Box>
      <Box display="flex" flexDirection="row" flexWrap="wrap">
        {tradesArray.map((trade, i) => {
          return (
            <Box
              key={i}
              onClick={() => history.push(trade.id)}
              display="flex"
              maxWidth="1500px"
			  flexDirection="row"
              //border="1px solid"
              borderRadius="5px"
              padding="1px"
              margin="1px"
            >
			 <Box display="flex" flexDirection="row" flexWrap="wrap" margin="5px" maxWidth="30px" minWidth="30px">
				
				<Text color={colors.text}>{trade.id}</Text>
			  </Box>
			 <Box display="flex" flexDirection="row" flexWrap="wrap" margin="5px" maxWidth="200px" minWidth="200px" >
				
				<Text color={colors.text}>{trade.timeOfTrade}</Text>
			  </Box>
			 <Box display="flex" flexDirection="row" flexWrap="wrap" margin="5px" maxWidth="200px" minWidth="200px" >
				
				<Text color={colors.text}>{trade.tradedInstrument}</Text>
			  </Box>
			  <Box display="flex" flexDirection="row" flexWrap="wrap" margin="5px" maxWidth="100px" minWidth="100px">
				
				<Text color={colors.text}>{trade.tradedAmount.toString()}</Text>
			  </Box>
			  <Box display="flex" flexDirection="row" flexWrap="wrap" margin="5px" maxWidth="100px" minWidth="100px">
				
				<Text color={colors.text}>{trade.tradedPrice.toString()}</Text>
			  </Box>
			  <Box display="flex" flexDirection="row" flexWrap="wrap" margin="5px" maxWidth="100px" minWidth="100px">
				
				<Text color={colors.text}>{trade.tradedQuantity.toString()}</Text>
			  </Box>
			  
			  <Box display="flex" flexDirection="row" flexWrap="wrap" margin="5px" maxWidth="350px" minWidth="350px">
			
				<Text color={colors.text}>{trade.trader.toString()}</Text>
			  </Box>
			  
			
            </Box>
          );
        })}
      </Box>
    </Container>
  );
}
