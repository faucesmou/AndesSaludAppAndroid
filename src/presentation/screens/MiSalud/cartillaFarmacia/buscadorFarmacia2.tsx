import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Linking,
  Alert,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Cartilla {
  nombre: string;
  telefono: string;
  domicilio: string;
}

interface Props {
  cartillas: Cartilla[];
}

const BuscadorFarmacia2: React.FC<Props> = ({ cartillas }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCartillas, setFilteredCartillas] = useState(cartillas);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handlePhonePress3 = (phoneNumber: string) => {
    setSelectedPhoneNumber(phoneNumber);
    setModalVisible(true);
  };

  const handleAllow = () => {
    setModalVisible(false);
    if (selectedPhoneNumber) {
      Linking.openURL(`tel:${selectedPhoneNumber}`)
        .then(() => {
          console.log('Llamada iniciada correctamente');
        })
        .catch((err) => {
          Alert.alert(
            'Ups!',
            'No se pudo llamar al número indicado, por favor verifica que sea válido'
          );
          console.log('El error al intentar hacer la llamada es el siguiente:', err);
        });
    }
  };

  const handleDeny = () => {
    setModalVisible(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const filtered = cartillas.filter((cartilla) =>
      [cartilla.nombre, cartilla.telefono, cartilla.domicilio]
        .some((field) => field.toLowerCase().includes(query.toLowerCase()))
    );

    setFilteredCartillas(filtered);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* TextInput para la búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre, teléfono o domicilio"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <ScrollView>
        {filteredCartillas.map((cartilla, index) => (
          <View key={index} style={{ marginBottom: 5 }}>
            <Pressable>
              <View style={styles.card}>
                <Text style={styles.title}>Farmacia {cartilla.nombre}</Text>
                {/* Teléfonos */}
                {
                  cartilla.telefono.toLowerCase() === 'no disponible' ? (
                    <Text style={[styles.phoneText, { color: 'gray', textDecorationLine: 'none' }]}>
                      Teléfonos: No disponible
                    </Text>
                  ) : (

                    cartilla.telefono && (
                      <View style={styles.phoneContainer}>
                        <Text style={styles.label}>
                          Teléfonos:{' '}
                          {cartilla.telefono.split(/[,;\s]+/).map((phone, idx) => (
                            <Text
                              key={idx}
                              style={styles.phoneText}
                              onPress={() => handlePhonePress3(phone.trim())}
                            >
                              {phone.trim()}
                              {idx < cartilla.telefono.split(/[,;\s]+/).length - 1 ? ', ' : ''}
                            </Text>
                          ))}
                        </Text>
                      </View>
                    )
                  )
                }

                {/* Dirección */}
                <Text style={styles.addressText}>{cartilla.domicilio}</Text>
              </View>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {isModalVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                ¿Deseas llamar al número {selectedPhoneNumber}?
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.allowButton} onPress={handleAllow}>
                  <Text style={styles.buttonText}>Llamar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.denyButton} onPress={handleDeny}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    padding: 7,
    margin: 5,
    marginTop: 0,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: wp('4%'),
  },
  card: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginHorizontal:wp('1%'),
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  /*   phoneText: {
      color: '#4285F4',
      marginRight: 10,
  
    }, */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  allowButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
  },
  denyButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  phoneContainer: {
    flexDirection: 'column',
    marginTop: 5,
  },
  label: {
    fontSize: 17,
    color: 'black',
    marginBottom: 2,
  },
  phoneList: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que los teléfonos pasen a la siguiente fila
    gap: 10, // Espaciado entre los teléfonos
  },
  phoneText: {
    color: '#4285F4',
    fontSize: 15,
    marginRight: 10,
    marginBottom: 2, // Espaciado entre filas si hay demasiados teléfonos
  },
  addressText: {
    fontSize: 15,
    color: '#666',
    marginTop: 0, // Espaciado superior para separar de los teléfonos
  },
});

export default BuscadorFarmacia2;
