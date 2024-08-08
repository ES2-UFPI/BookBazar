import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './styles'; // Estilos

const SubmitButton = ({ onPress, title, disabled }) => (
  <TouchableOpacity
    style={[styles.btnCadastrarUsuario, disabled && { backgroundColor: 'gray' }]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.btnText}>{title}</Text>
  </TouchableOpacity>
);

export default SubmitButton;