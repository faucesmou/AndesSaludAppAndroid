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
import LinearGradient from 'react-native-linear-gradient';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { globalColors } from '../../../theme/theme';
import { useAuthStore } from '../../../store/auth/useAuthStore';




interface Cartilla {
  nombre: string;
  telefono: string;
  domicilio: string;
}

interface Props {
  cartillas: Cartilla[];
 /*  departamentoSeleccionado: string; */
}

const BuscadorFarmacia2: React.FC<Props> = ({ cartillas }) => {


  const { nombreDepartamento,  } = useAuthStore();

  function capitalizeWords(input: string | undefined): string {
    if (!input) {
      return "";
    }
    // Convierte cada palabra del texto a formato "Primera Mayúscula, resto Minúsculas"
    return input.replace(/\b\p{L}+/gu, function (word) {
      // Convertir toda la palabra a minúsculas primero
      const lowerCasedWord = word.toLocaleLowerCase("es-ES");
      // Convertir la primera letra en mayúscula y concatenar el resto
      return lowerCasedWord.charAt(0).toLocaleUpperCase("es-ES") + lowerCasedWord.slice(1);
    });
  }
    // Procesa los datos al cargarlos o antes de renderizarlos
/* const processedCartillas = cartillas.map(cartilla => ({
  ...cartilla,
  nombre: capitalizeWords(cartilla.nombre),
  domicilio: capitalizeWords(cartilla.domicilio),
  telefono: cartilla.telefono,
}));

console.log('Processed cartillas------------------------>>>>:', processedCartillas);  */

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCartillas, setFilteredCartillas] = useState(cartillas);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [errorAbrirDireccion, setErrorAbrirDireccion] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedSimpleAddress, setSelectedSimpleAddress] = useState('');

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

    // Procesa los datos al cargarlos o antes de renderizarlos
/* const processedCartillas = filtered.map(cartilla => ({
  ...cartilla,
  nombre: capitalizeWords(cartilla.nombre),
  domicilio: capitalizeWords(cartilla.domicilio),
  telefono: cartilla.telefono,
})); */

/* console.log('Processed cartillas------------------------>>>>:', processedCartillas);  */

    setFilteredCartillas(filtered);
   
   /*  setFilteredCartillas(filtered); */
  };

  // Manejar el modal para direcciones
  const handleAddressPress = (address) => {
      
   const addressComplete = `${address}, ${nombreDepartamento}`;
   console.log('addressComplete--CHAVALAL------------------>>', addressComplete);
   
   setSelectedSimpleAddress(address)
    setSelectedAddress(addressComplete);
    setAddressModalVisible(true);
  };


  /* const handleOpenMaps = () => {
    setAddressModalVisible(false);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAddress)}`;
    Linking.openURL(url);
  };
   */


  const handleOpenMaps = async () => {
    setAddressModalVisible(false);

    try {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAddress)}`;
      // Intenta abrir directamente la URL sin una validación excesiva
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error al intentar abrir la dirección:", error);
      setErrorAbrirDireccion(true); // Activar el modal de error
    }
  };

  const handleDenyMaps = () => {
    setAddressModalVisible(false);
  };
/*   function capitalizeWords(input: string | undefined): string {
    if (!input) {
      return "";
    }
    return input.replace(/\b\p{L}+/gu, function (word) {
      return word.charAt(0).toLocaleUpperCase("es-ES") + word.slice(1).toLocaleLowerCase("es-ES");
    });
  } */


   /*  console.log('filtered cartillas men----------->', filteredCartillas); */

  
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

                {/* Dirección */}
                <Text style={styles.addressText} onPress={() => handleAddressPress(cartilla.domicilio)} >{cartilla.domicilio}</Text>

                <TouchableOpacity>
                  <Text style={styles.descriptionTextMapa} onPress={() => handleAddressPress(cartilla.domicilio)} >Ver Mapa</Text>
                </TouchableOpacity>

                {/* Teléfonos */}
                {
                  cartilla.telefono === 'No disponible' ? (
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


              </View>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {/* Modal para la llamar por teléfono */}
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
                ¿Deseas llamar al siguiente número?
              </Text>
              <Text style={styles.selectedNumber}>{selectedPhoneNumber}</Text>

              <View style={styles.buttonContainer}>
                {/* <TouchableOpacity style={styles.allowButton} onPress={handleAllow}>
                  <Text style={styles.buttonText}>Llamar</Text>
                </TouchableOpacity> */}

                {/* nuevo con gradiente */}
                <LinearGradient
                  colors={['#509d4f', '#5ab759', '#5ab759', '#5ab759']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.allowButton} onPress={handleAllow}>
                    <Text style={styles.buttonText}>
                      Llamar
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>

                <LinearGradient
                  colors={['#c86443', '#d6783c', '#e08050', '#e88848']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.denyButton}>
                  <TouchableOpacity onPress={handleDeny}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                </LinearGradient>

              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal para la dirección */}
      {addressModalVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={addressModalVisible}
          onRequestClose={() => setAddressModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                ¿Deseas abrir esta dirección en Google Maps?
                {/*   {"\n"} */}
                {/*     {selectedAddress} */}
              </Text>
              <Text style={styles.selectedAddress}>

                {selectedSimpleAddress}
              </Text>
              <View style={styles.buttonContainer}>

                {/* <TouchableOpacity style={styles.allowButton} onPress={handleOpenMaps}>
                  <Text style={styles.buttonText}>Abrir</Text>
                </TouchableOpacity> */}

                <LinearGradient
                  colors={['#509d4f', '#5ab759', '#5ab759', '#5ab759']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.allowButton} onPress={handleOpenMaps}>
                    <Text style={styles.buttonText}>
                      Abrir
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>


                <LinearGradient
                  colors={['#c86443', '#d6783c', '#e08050', '#e88848']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.denyButton}>
                  <TouchableOpacity onPress={handleDenyMaps}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                </LinearGradient>

                {/*   <TouchableOpacity style={styles.denyButton} onPress={handleDenyMaps}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal para manejo de errores */}
      {errorAbrirDireccion && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={errorAbrirDireccion}
          onRequestClose={() => setErrorAbrirDireccion(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                Tuvimos inconvenientes para abrir la dirección, por favor intenta nuevamente más tarde.
              </Text>
              <TouchableOpacity
                style={styles.denyButton}
                onPress={() => setErrorAbrirDireccion(false)}
              >
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    padding: 8,
    margin: 5,
    marginTop: 0,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    fontSize: wp('4%'),
    alignSelf: 'center',
    paddingHorizontal: wp('5%'),
    color: 'black'
    /*  minWidth: wp('80%'), */
  },
  card: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginHorizontal: wp('1%'),
  },
  title: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#3b3937',
    /*  color: globalColors.black, */
    /*   color: 'black' */
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginHorizontal: wp('5%'),
    maxWidth: wp('80%'),
    minWidth: wp('75%')
  },
  modalTitle: {
    /* fontSize: 18, */
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
    textAlign: 'center',
    color: '#3b3937',
    /*  */
    /* color:'gray' */
  },
  selectedAddress: {
    /*  fontSize: 16, */
    fontSize: hp('2%'),
    marginBottom: wp('3%'),
    alignSelf: 'center',
    marginTop: 0,
    textAlign: 'center',
    color: 'gray'
  },
  selectedNumber: {
    fontSize: hp('2.3%'),
    marginBottom: wp('3%'),
    alignSelf: 'center',
    marginTop: 0,
    fontWeight: 'bold',
    color: globalColors.profile
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 15,
  },
  allowButton: {
    /*    backgroundColor: '#4CAF50', */
    padding: 10,
    borderRadius: 15,
    minWidth: 70,
    maxWidth: 70,
  },
  denyButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    alignSelf: 'center',
  },
  phoneContainer: {
    flexDirection: 'column',
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    fontSize: hp('2%'),
    color: 'black',
    marginBottom: 2,
  },
  phoneList: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que los teléfonos pasen a la siguiente fila
    gap: 10, // Espaciado entre los teléfonos
  },
  phoneText: {
    /*  color: '#4285F4', */
    /*  fontSize: 15, */
    marginRight: 10,
    marginBottom: 2, // Espaciado entre filas si hay demasiados teléfonos
    color: globalColors.yellow,
    fontWeight: 'bold',
    fontSize: hp('2%'),
    alignSelf:'center'

  },
  addressText: {
    /* fontSize: 15, */
    fontSize: hp('2%'),
    color: '#4e4747',
    marginTop: 0, // Espaciado superior para separar de los teléfonos
    textAlign: 'center'
  },
  descriptionTextMapa: {
    color: 'black',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  
});

export default BuscadorFarmacia2;
