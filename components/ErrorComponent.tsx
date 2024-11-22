import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ErrorComponentProps {
  message: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ message }) => {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorMessage}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: '#FFC107',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  errorMessage: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorComponent;