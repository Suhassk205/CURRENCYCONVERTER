import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { CurrencyData } from "./CurrencyData";
import CountryList from "./countries.json";

const API_KEY = "f7930de7d887b5b25883efde";
const BASE_URL = "https://v6.exchangerate-api.com/v6";

export const fetchExchangeRates = async (baseCurrency: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${API_KEY}/latest/${baseCurrency}`
    );

    if (response.data.result === "success") {
      // Cache rates for offline use
      await SecureStore.setItemAsync(
        "cachedRates",
        JSON.stringify({
          rates: response.data.conversion_rates,
          timestamp: Date.now(),
        })
      );

      return response.data.conversion_rates;
    }
  } catch (error) {
    // Fallback to cached rates if network fails
    const cachedRatesString = await SecureStore.getItemAsync("cachedRates");
    if (cachedRatesString) {
      const cachedData = JSON.parse(cachedRatesString);
      return cachedData.rates;
    }

    console.error("Exchange rate fetch error:", error);
    throw error;
  }
};

export const getAllCurrencies = (): CurrencyData[] => {
  // Comprehensive list of currencies
  return CountryList;
};
