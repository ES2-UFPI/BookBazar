import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  pagCadastro: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 15,
    fontWeight: 'bold',
    paddingLeft: 8,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16,
  },
  btnCadastrarUsuario: {
    width: '100%',
    height: 40,
    marginTop: 12,
    backgroundColor: '#004a55',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});