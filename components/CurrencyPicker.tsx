import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AllCountry from "../constants/countries.json";
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
        {AllCountry.map((country) => (
          <Picker.Item
            key={country.value}
            label={`${country.value} - ${country.label}`}
            value={country.value}
          />
        ))}
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
    color: "#ddd",
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
