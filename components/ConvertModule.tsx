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
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#3498db",
  },
  picker: {
    height: 55,
    width: "100%",
    marginBottom: 12,
    backgroundColor: "#2c3e50",
    borderRadius: 12,
  },
  inputEdit: {
    height: 55,
    borderColor: "#3498db",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: "#2c3e50",
  },
  inputNoEdit: {
    color: "#ecf0f1",
    height: 55,
    borderColor: "#3498db",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: "#34495e",
  },
});
