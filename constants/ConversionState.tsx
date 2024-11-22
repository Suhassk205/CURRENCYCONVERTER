export interface ConversionState {
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  convertedAmount: string;
  rates: Record<string, number>;
}
