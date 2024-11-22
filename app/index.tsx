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
          activeOpacity={0.8}
        >
          <MaterialIcons name="swap-vert" size={24} color="#888" />
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
          onAmountChange={(text) =>
            dispatch({
              type: "SET_AMOUNT",
              payload: text.replace(/[^0-9]/g, ""),
            })
          }
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
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  converterContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#666",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  resultInput: {
    backgroundColor: "#e9ecef",
    color: "#495057",
  },
  swapButton: {
    alignSelf: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default CurrencyConverter;
