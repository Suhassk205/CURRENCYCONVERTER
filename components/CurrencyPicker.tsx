import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface CurrencyPickerProps {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const CurrencyPicker: React.FC<CurrencyPickerProps> = ({
  label,
  selectedValue,
  onValueChange,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <Picker
        style={styles.picker}
        selectedValue={selectedValue}
        onValueChange={onValueChange}
      >
        <Picker.Item label="US Dollar (USD)" value="USD" />
        <Picker.Item label="Euro (EUR)" value="EUR" />
        <Picker.Item label="Japanese Yen (JPY)" value="JPY" />
        <Picker.Item label="Pound Sterling (GBP)" value="GBP" />
        <Picker.Item label="Australian Dollar (AUD)" value="AUD" />
        <Picker.Item label="Canadian Dollar (CAD)" value="CAD" />
        <Picker.Item label="Swiss Franc (CHF)" value="CHF" />
        <Picker.Item label="Chinese Yuan (CNY)" value="CNY" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default CurrencyPicker;
