import React from 'react';

const PredictionContext = React.createContext({
  predictions: {},
  predictionsArray: [],
  updatePredictions: () => {},
});

export default PredictionContext;
