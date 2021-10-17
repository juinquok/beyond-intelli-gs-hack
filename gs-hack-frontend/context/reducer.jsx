/* eslint-disable no-case-declarations */
import { useReducer, useContext, createContext } from 'react';
import initialState from './initialState';
// Create context
export const GlobalContext = createContext(initialState);

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case 'SAVE_COGNITO':
      return { ...state, token: action.token, cognitoUsername: action.username };
    case 'LOAD_USER':
      return { ...state, user: action.user };
    case 'UPDATE_ONBOARDING_1':
      return {
        ...state,
        onboardingData: action.payload,
      };
    case 'UPDATE_ONBOARDING_2':
      return {
        ...state,
        onboardingData:
        { ...state.onboardingData, questionnaire: action.payload },
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};
// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useShoppingItems must be used within a GlobalProvider');
  }
  return context;
};
