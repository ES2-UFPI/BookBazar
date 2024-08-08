import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { styles } from './styles'; // Estilos

const TextInputField = ({ label, ...props }) => (
  <View style={styles.inputContainer}>
    {label && <Text style={styles.label}>{label}</Text>}
    <TextInput
      style={styles.input}
      {...props}
    />
  </View>
);

export default TextInputField;