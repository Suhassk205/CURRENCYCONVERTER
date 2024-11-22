import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";
import { getAllCurrencies } from "@/constants/Apis";

interface Props {
  label: string;
  pickerSelectedValue: string;
  onPickerValueChange: (itemValue: string) => void;
  amount: string;
  onAmountValueChange: (text: string) => void;
  isEditabled: boolean;
}

const ConvertModule = ({
  label,
  pickerSelectedValue,
  onPickerValueChange,
  amount,
  onAmountValueChange,
  isEditabled,
}: Props) => {
  const currencies = getAllCurrencies();
  return (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <Picker
          selectedValue={pickerSelectedValue}
          onValueChange={onPickerValueChange}
          style={styles.picker}
        >
          {currencies.map((currency) => (
            <Picker.Item
              key={currency.code}
              label={`${currency.code} - ${currency.name}`}
              value={currency.code}
            />
          ))}
        </Picker>

        <TextInput
          style={isEditabled ? styles.inputEdit : styles.inputNoEdit}
          value={amount}
          onChangeText={onAmountValueChange}
          keyboardType="numeric"
          editable={isEditabled}
          placeholder={`${pickerSelectedValue} Amount`}
        />
      </View>
    </>
  );
};

export default ConvertModule;

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
  inputEdit: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  inputNoEdit: {
    color: "#495057",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#e9ecef",
  },
});
