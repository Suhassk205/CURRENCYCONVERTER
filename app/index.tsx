import React, { useReducer, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { fetchExchangeRates } from "@/constants/Apis";

import CurrencyPicker from "@/components/CurrencyPicker";
import CurrencyInput from "@/components/CurrencyInput";
import ErrorComponent from "@/components/ErrorComponent";

interface ConversionState {
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  convertedAmount: string;
  rates: { [key: string]: number };
  error: string | null;
}

type Action =
  | { type: "SET_FROM_CURRENCY"; payload: string }
  | { type: "SET_TO_CURRENCY"; payload: string }
  | { type: "SET_AMOUNT"; payload: string }
  | { type: "SET_CONVERTED_AMOUNT"; payload: string }
  | { type: "SET_RATES"; payload: { [key: string]: number } }
  | { type: "SET_ERROR"; payload: string | null };

const reducer = (state: ConversionState, action: Action): ConversionState => {
  switch (action.type) {
    case "SET_FROM_CURRENCY":
      return { ...state, fromCurrency: action.payload };
    case "SET_TO_CURRENCY":
      return { ...state, toCurrency: action.payload };
    case "SET_AMOUNT":
      return { ...state, amount: action.payload };
    case "SET_CONVERTED_AMOUNT":
      return { ...state, convertedAmount: action.payload };
    case "SET_RATES":
      return { ...state, rates: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const initialState: ConversionState = {
  fromCurrency: "USD",
  toCurrency: "EUR",
  amount: "1",
  convertedAmount: "",
  rates: {},
  error: null,
};

const CurrencyConverter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { fromCurrency, toCurrency, amount, convertedAmount, rates, error } =
    state;

  useEffect(() => {
    loadLastUsedSettings();
    fetchRates();
  }, []);

  const loadLastUsedSettings = async () => {
    try {
      const lastFromCurrency = await SecureStore.getItemAsync("fromCurrency");
      const lastToCurrency = await SecureStore.getItemAsync("toCurrency");
      const lastAmount = await SecureStore.getItemAsync("amount");

      dispatch({
        type: "SET_FROM_CURRENCY",
        payload: lastFromCurrency || "USD",
      });
      dispatch({
        type: "SET_TO_CURRENCY",
        payload: lastToCurrency || "EUR",
      });
      dispatch({
        type: "SET_AMOUNT",
        payload: lastAmount || "1",
      });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Error loading settings" });
    }
  };

  const fetchRates = async () => {
    try {
      const rates = await fetchExchangeRates(fromCurrency);
      dispatch({ type: "SET_RATES", payload: rates });
      if (amount) {
        convertCurrency(amount, rates);
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Error fetching exchange rates" });
    }
  };

  const convertCurrency = (inputAmount: string, currentRates = rates) => {
    if (!inputAmount) {
      dispatch({ type: "SET_AMOUNT", payload: "" });
      dispatch({ type: "SET_CONVERTED_AMOUNT", payload: "" });
      return;
    }

    const amountNum = parseFloat(inputAmount);
    if (isNaN(amountNum)) {
      dispatch({ type: "SET_CONVERTED_AMOUNT", payload: "" });
      return;
    }

    const rate = currentRates[toCurrency] || 1;
    const converted = (amountNum * rate).toFixed(2);

    dispatch({ type: "SET_AMOUNT", payload: inputAmount });
    dispatch({ type: "SET_CONVERTED_AMOUNT", payload: converted });

    SecureStore.setItemAsync("fromCurrency", fromCurrency);
    SecureStore.setItemAsync("toCurrency", toCurrency);
    SecureStore.setItemAsync("amount", inputAmount);
  };

  const handleSwapCurrencies = () => {
    dispatch({
      type: "SET_FROM_CURRENCY",
      payload: toCurrency,
    });
    dispatch({
      type: "SET_TO_CURRENCY",
      payload: fromCurrency,
    });
    dispatch({
      type: "SET_AMOUNT",
      payload: convertedAmount || "0",
    });
    dispatch({
      type: "SET_CONVERTED_AMOUNT",
      payload: amount,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>

      <View style={styles.converterContainer}>
        <CurrencyPicker
          label="From:"
          selectedValue={fromCurrency}
          onValueChange={(value) =>
            dispatch({ type: "SET_FROM_CURRENCY", payload: value })
          }
        />

        <TouchableOpacity
          style={styles.swapButton}
          onPress={handleSwapCurrencies}
        >
          <MaterialIcons name="swap-vert" size={32} color="#fff" />
        </TouchableOpacity>

        <CurrencyPicker
          label="To:"
          selectedValue={toCurrency}
          onValueChange={(value) =>
            dispatch({ type: "SET_TO_CURRENCY", payload: value })
          }
        />

        <CurrencyInput
          amount={amount}
          onAmountChange={convertCurrency}
          convertedAmount={convertedAmount}
        />

        {error && <ErrorComponent message={error} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    paddingBlock: 64,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    flexGrow: 1,
    fontWeight: "800",
    marginBottom: 25,
    color: "#ff9800",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: "center",
  },
  converterContainer: {
    width: "100%",
    backgroundColor: "#444",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  labelContainer: {
    marginBottom: 10,
  },
  labelHeading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#3498db",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pickerContainer: {
    marginBottom: 15,
    backgroundColor: "#2c3e50",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#3498db",
    overflow: "hidden",
  },
  picker: {
    height: 55,
    width: "100%",
    color: "#ecf0f1",
  },
  inputContainer: {
    marginBottom: 15,
  },
  resultContainer: {
    marginTop: 5,
  },
  input: {
    height: 55,
    borderColor: "#3498db",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
  },
  resultInput: {
    backgroundColor: "#2c3e50",
    color: "#e74c3c",
    fontWeight: "700",
  },
  swapButton: {
    alignSelf: "center",
    backgroundColor: "#ff9800",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default CurrencyConverter;
