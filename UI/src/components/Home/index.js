import React from 'react';
import { Box, Container, Text, useColorModeValue, HStack, } from '@chakra-ui/react';
import PredictionContext from '../../helper/PredictionContext';
import { useHistory } from 'react-router-dom';

export default function Home() {
  const { predictionsArray } = React.useContext(PredictionContext);
  const history = useHistory();
  const colors = {
    bg: useColorModeValue('purple.100', 'purple.900'),
    text: useColorModeValue('black', 'white'),
  };

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
          Prepetual Contracts
        </Text>
      <Box display="flex" flexDirection="row" flexWrap="wrap">
        {predictionsArray.map((pred, i) => {
          return (
            <Box
              key={i}
              onClick={() => history.push('/predict/' + pred.id)}
              display="flex"
              maxWidth="3000px"
			  flexDirection="row"
              border="1px solid"
              borderRadius="15px"
              padding="20px"
              margin="10px"
            >
			 <Box display="flex" flexDirection="row" flexWrap="wrap" margin="5px" >
				<Text color={colors.text} fontWeight="bold">Perpetual Contract : </Text>
				<Text color={colors.text}>{pred.id}</Text>
			  </Box>
			  <Box display="flex" flexDirection="row" flexWrap="wrap" margin="5px" >
				<Text color={colors.text}fontWeight="bold">Leverage : </Text>
				<Text color={colors.text}>{pred.leverageFactor.toString()}</Text>
			  </Box>
			  <Box display="flex" flexDirection="row" flexWrap="wrap" margin="5px" >
				<Text color={colors.text}fontWeight="bold">Mark Price : </Text>
				<Text color={colors.text}>{pred.markPrice.toString()}</Text>
			  </Box>
			
            </Box>
          );
        })}
      </Box>
    </Container>
  );
}
