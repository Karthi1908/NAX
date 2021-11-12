import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import Header from './components/Header';
import Trade from './components/Trade';
import Predict from './components/Predict';
import './App.css';
import Home from './components/Home';
import { ContractProvider, CONTRACT_ADDRESS } from './helper/tezos';
import PredictionContext from './helper/PredictionContext';
import Loading from './helper/Loading';
import MyPreds from './components/Mypreds';

function App() {
  const [predictions, setPredictions] = React.useState(null);
  const [predictionsArray, setPredictionsArray] = React.useState([]);
  const updatePredictions = (preds, predArray) => {
    setPredictions(preds);
    setPredictionsArray(predArray);
  };

  React.useEffect(() => {
    ContractProvider.at(CONTRACT_ADDRESS).then(async (contract) => {
      const storage = await contract.storage();
      const predictions = storage.contractStore;
      // for (let key of storage.predictTokenDetails.keys()) {
      //   console.log(key);
      //   console.log(storage.predictTokenDetails.get(key));
      // }
      const predList = [];
      for (let pred of predictions.keys()) {
        predList.push({ id: pred, ...predictions.get(pred) });
      }
      updatePredictions(predictions, predList);
    });
  }, []);

  return (
    <ChakraProvider>
      <ColorModeProvider
        options={{
          initialColorMode: 'dark',
          useSystemColorMode: true,
        }}
      >
        {predictions ? (
          <>
            <PredictionContext.Provider
              value={{
                predictions,
                predictionsArray,
                updatePredictions,
              }}
            >
              <Router>
                <Header />
                <Route exact path="/">
                  <Home />
				  <Trade />
                </Route>
				
                <Route
                  path="/predict/:id"
                  component={(props) => <Predict id={props.match.params.id} />}
                />
                <Route path="/mypreds" component={MyPreds} />
              </Router>
            </PredictionContext.Provider>
          </>
        ) : (
          <Loading />
        )}
      </ColorModeProvider>
    </ChakraProvider>
	
  );
}

export default App;
