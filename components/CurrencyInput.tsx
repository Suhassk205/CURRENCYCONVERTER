import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

interface CurrencyInputProps {
  amount: string;
  onAmountChange: (text: string) => void;
  convertedAmount: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  amount,
  onAmountChange,
  convertedAmount,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, styles.editableInput]}
        value={amount}
        onChangeText={onAmountChange}
        keyboardType="numeric"
        placeholder="Enter amount"
      />

      <TextInput
        style={[styles.input, styles.resultInput]}
        value={convertedAmount}
        editable={false}
        placeholder="Converted amount"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 15,
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
  editableInput: {
    marginBottom: 10,
  },
  resultInput: {
    backgroundColor: "#e9ecef",
    color: "#495057",
  },
});

export default CurrencyInput;
