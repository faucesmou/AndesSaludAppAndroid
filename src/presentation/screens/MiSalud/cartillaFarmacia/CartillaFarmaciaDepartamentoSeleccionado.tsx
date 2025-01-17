import React, { useEffect, useState } from 'react'
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { Text, View, ScrollView, StyleSheet, Pressable, Modal, TouchableOpacity, Linking, Alert } from 'react-native';

import axios from 'axios';

/* import { FlatList } from 'react-native-gesture-handler'; */
/* import { ScrollView } from 'react-native-gesture-handler'; */
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { xml2js } from 'xml-js';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { BackButton } from '../../../components/shared/BackButton';
import { globalColors, globalStyles } from '../../../theme/theme';
import CustomHeader from '../../../components/CustomHeader';
import { PrimaryButton } from '../../../components/shared/PrimaryButton';
import { RootStackParams } from '../../../routes/StackNavigator';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FullScreenLoader } from '../../../components/ui/FullScreenLoader';

export const CartillaFarmaciaDepartamentoSeleccionado = () => {

  console.log('Entrando a CartillaFarmaciaDepartamentoSeleccionado------>');

  const { idAfiliadoTitular, idAfiliado, GuardarIdCartillaSeleccionada, idZona, idDepartamento, nombreDepartamento, GuardarIdDepartamentoSeleccionado } = useAuthStore();




  const { top } = useSafeAreaInsets();

  const [cartillas, setCartillas] = useState<{ nombre: string; idZona: string, domicilio: string, telefono: string }[]>([]);

  const [isConsulting, setIsConsulting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');

/* Buscador de farmacias por el nombre:  */

const [searchText, setSearchText] = useState(''); // Estado para el texto de búsqueda
  const [filteredCartillas, setFilteredCartillas] = useState(cartillas); // Estado para las cartillas filtradas


 // Función para manejar la búsqueda
 const handleSearch = (text: string) => {
  setSearchText(text);

  // Filtrar cartillas cuyo nombre contenga el texto ingresado (sin importar mayúsculas/minúsculas)
  const filtered = cartillas.filter((cartilla) =>
    cartilla.nombre.toLowerCase().includes(text.toLowerCase())
  );

  setFilteredCartillas(filtered);
};

  /* const navigation = useNavigation<NavigationProp<RootStackParams>>() */
  const handlePhonePress3 = (phoneNumber: string) => {
    setSelectedPhoneNumber(phoneNumber);
    setModalVisible(true);
  };

  const handleAllow = () => {
    setModalVisible(false);
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
  };

  const handleDeny = () => {
    setModalVisible(false);
  };



  function capitalizeWords(input: string | undefined): string {
    if (!input) {
      return "";
    }
    return input.replace(/\b\p{L}+/gu, function (word) {
      return word.charAt(0).toLocaleUpperCase("es-ES") + word.slice(1).toLocaleLowerCase("es-ES");
    });
  }

  const departamento = capitalizeWords(nombreDepartamento);

  useEffect(() => {

    const CartillaRequest = async () => {
      setIsConsulting(true);

      try {
        const response = await axios.get(`https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/APPBuscarFarmaciasCartilla?IMEI=&idAfiliado=${idAfiliado}&idZona=${idDepartamento}`)

        const xmlData = response.data;
        console.log('ESTE es el id del departamento seleccionado:--> ', idDepartamento);

        // Convertir XML a JSON
        const result = xml2js(xmlData, { compact: true });

        const cartillasData = result.Resultado.fila.tablaFarmacias;
        const cartillasTelefonos = result.Resultado.fila.tablaTelefonos;

        console.log('cartillasData-----------<<<<<', cartillasData);
        console.log('cartillasTelefonos-----------<<<<<', cartillasTelefonos);

        // Verificar si cartillasData es un array o un objeto y procesar en consecuencia
        const mappedCartillas = Array.isArray(cartillasData.idFarmacia)
          ? cartillasData.idFarmacia.map((_: any, index: number) => ({
            nombre: cartillasData.nombre[index]._text,
            idFarmacia: cartillasData.idFarmacia[index]._text,
            domicilio: cartillasData.domicilio[index]._text,
          })) : cartillasData.idFarmacia // Si no es un array, procesarlo como objeto único
            ? [
              {
                nombre: cartillasData.nombre._text,
                idFarmacia: cartillasData.idFarmacia._text,
                domicilio: cartillasData.domicilio._text,
              },
            ]
            : [{ domicilio: "", idFarmacia: "", nombre: "No se encontraron Farmacias disponibles" }];

        console.log('mappedCartillas-----------<<<<<', mappedCartillas);

        if (cartillasTelefonos) {

          const mappedTelefonos = Array.isArray(cartillasTelefonos.idFarmaciaTel)
            ? cartillasTelefonos.idFarmaciaTel.map((_: any, index: number) => ({
              idFarmacia: cartillasTelefonos.idFarmaciaTel[index]._text,
              telefono: cartillasTelefonos.telefono[index]._text
            })) : cartillasTelefonos.idFarmaciaTel // Si no es un array, procesarlo como objeto único
              ? [
                {
                  idFarmacia: cartillasTelefonos.idFarmaciaTel._text,
                  telefono: cartillasTelefonos.telefono._text,
                },
              ]
              : [];

          console.log('mappedTelefonos-----------<<<<<', mappedTelefonos);

          // Integra farmacias y teléfonos.
          const mappedIntegrado = mappedCartillas.map((farmacia: any) => {
            // Encuentra los teléfonos asociados a la farmacia actual.
            const telefonos = mappedTelefonos
              .filter((telefono: any) => telefono.idFarmacia === farmacia.idFarmacia)
              .map((tel: any) => tel.telefono)
              .join(", "); // Concatena los teléfonos con comas.

            return {
              idFarmacia: farmacia.idFarmacia,
              nombre: farmacia.nombre,
              domicilio: farmacia.domicilio,
              telefono: telefonos || "No disponible",
            };
          });
          console.log('este es el mappedIntegrado MI MAN:---------->>>>>>>>', mappedIntegrado);

          // Actualiza el estado con los datos integrados.
          if (Array.isArray(mappedIntegrado)) {

            setCartillas(mappedIntegrado);
          }
        } else {
          // Si no existe tablaTelefonos, usa mappedCartillas directamente
          console.log("No se encontró tablaTelefonos, usando solo datos de farmacias.");
          setCartillas(mappedCartillas);
        }

        /*   setCartillas(mappedCartillas);
          console.log('mappedCartillas es: eeee:---->>.,', mappedCartillas); */


        setIsConsulting(false);

      }
      catch (error) {
        console.error('Error al obtener los formularios:', error);
        setIsConsulting(false);
        setIsError(true)
      }
    };
    CartillaRequest()

  }, [idAfiliadoTitular])



  const color = globalColors.orange

  return (
    <View

      style={{ ...globalStyles.container, marginBottom: 0, }}

    >
      <CustomHeader /* color={globalColors.gray2} */ titleSize={hp('4%')} />

      <BackButton Size={hp('4%')} />

      <Text style={{
        marginBottom: 0,
        marginTop: wp('-1%'),
        fontSize: hp('4%'),
        textAlign: 'center',
        color: globalColors.gray2,
        fontWeight: 'bold'
      }}>{capitalizeWords(departamento)}:</Text>

      <View style={{ flex: 1, marginBottom: hp('2%'), marginTop: hp('1%') }}>
        <ScrollView >

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

          {

            isConsulting ?
              (

                <View
                  style={{
                    flex: 0.5,
                    marginTop: top - hp('-10%'),
                    marginBottom: hp('6%'),
                  }}
                >
                  <FullScreenLoader />
                </View>

              )
              : isError ? (

                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>
                    ¡Ups! Parece que algo salió mal.
                  </Text>
                  <Text style={styles.noDataText}>
                    Por favor, intenta nuevamente más tarde.
                  </Text>
                  <Text style={styles.noDataText2}>
                    Si el problema persiste, no dudes en comunicarte con nuestro servicio de atención al cliente
                  </Text>
                </View>
              )
                :
                

                (


                  cartillas.map(
                    (cartilla, index) => (

                      <View
                        key={index}
                        style={{ marginBottom: 5 }}
                      >
                        {/* mejora del estilo:  */}
                        <Pressable
                        /*   onPress={() => {
                             */
                        >
                          <View key={index} style={styles.TertiaryButton}>
                            <View style={styles.contentWrapper2}>
                              <View style={styles.textWrapper}>
                                <Text style={styles.descriptionText}>
                                 Farmacia {capitalizeWords(cartilla.nombre)}
                                </Text>

                                {/*  {cartilla.nombre !== "No se encontraron Farmacias disponibles" && (
                                  <Text style={{ fontSize: 17, marginBottom: 2, color: "black", marginTop: 5 }}>
                                    Teléfonos: {cartilla.telefono !== "" ? cartilla.telefono : "No Disponible"}
                                  </Text>
                                )} */}

                                {cartilla.nombre !== 'No se encontraron Farmacias disponibles' && (
                                  <View>

                                    {/*       {cartilla.telefono && (
                                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
                                        <Text style={{ fontSize: 17, color: 'black' }}>Teléfonos: </Text>
                                        {cartilla.telefono
                                          .split(/[,;\s]+/) 
                                          .map((phone, idx) => (
                                            <Text
                                              key={idx}
                                              style={[styles.phoneText, { marginRight: 10, 
                                              color:'#4285F4',    
                                            }]}
                                              onPress={() => handlePhonePress3(phone)}
                                            >
                                              {phone}
                                            </Text>
                                          ))}
                                      </View>
                                    )} */}

                                    {/*   {cartilla.telefono && (
                                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
                                        <Text style={{ fontSize: 17, color: 'black' }}>Teléfonos: </Text>
                                        {cartilla.telefono
                                          .split(/[,;\s]+/) 
                                          .map((phone, idx) => (
                                            <Text
                                              key={idx}
                                              style={[
                                                styles.phoneText,
                                                {
                                                  marginRight: 10,
                                                  color: phone === "No disponible" ? 'gray' : '#4285F4',
                                                },
                                              ]}
                                              onPress={phone === "No disponible" ? undefined : () => handlePhonePress3(phone)} 
                                            >
                                              {phone}
                                            </Text>
                                          ))}

                                      </View>
                                    )} */}
                                    {cartilla.telefono && (
                                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
                                        <Text style={{ fontSize: 17, color: 'black' }}>Teléfonos: </Text>
                                        {cartilla.telefono.toLowerCase().trim() === 'no disponible' ? (

                                          // Caso "No disponible"
                                          <Text
                                            style={[
                                              styles.phoneText,
                                              {
                                                marginRight: 10,
                                                color: 'gray', // Color gris para no disponible
                                                textDecorationLine: 'none', // Sin subrayado
                                              },
                                            ]}
                                          >
                                            No disponible
                                          </Text>
                                        ) : (
                                          // Caso de teléfonos válidos
                                          cartilla.telefono
                                            .split(/[,;\s]+/) // Divide los números en un array
                                            .map((phone, idx) => {
                                              const cleanedPhone = phone.trim(); // Limpia los espacios extra
                                              return (
                                                <Text
                                                  key={idx}
                                                  style={[
                                                    styles.phoneText,
                                                    {
                                                      marginRight: 10,
                                                      color: '#4285F4', // Azul para números clickeables
                                                    
                                                    },
                                                  ]}
                                                  onPress={() => handlePhonePress3(cleanedPhone)} // Ejecuta la acción al presionar
                                                >
                                                  {cleanedPhone}
                                                </Text>
                                              );
                                            })
                                        )}
                                      </View>
                                    )}

                                  </View>
                                )}

                                <Text style={{ fontSize: 17, marginBottom: 10, color: "black" }}>{cartilla.domicilio}</Text>
                              </View>
                            </View>
                          </View>
                        </Pressable>


                      </View>
                    )

                  )
                )


          }


        </ScrollView>
      </View>

    </View>

  )
}

const styles = StyleSheet.create({
  TertiaryButton: {
    backgroundColor: 'white',
    minWidth: '80%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: 5,
    margin: 5,
    marginBottom: 5,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionText: {
    color: globalColors.gray,
    fontSize: hp('2.5%'),
    textAlign: 'center',
    fontWeight: "bold"
  },
  contentWrapper2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  textWrapper: {
    flex: 1,
    padding: 0,
    justifyContent: 'center',
  },
  /* cartel de error: no se pudieron obtener las especialidades:  */
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: wp('4.5%'),
    color: 'gray',
    textAlign: 'center',
    marginTop: wp('3%'),
  },
  noDataText2: {
    fontSize: wp('4%'),
    color: 'gray',
    textAlign: 'center',
    marginTop: wp('8%'),
  },
  /* mejora de modal que pregunta si desea llamar----------ZZZZ */
  callButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: "black"
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  allowButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    alignItems: 'center',
  },
  denyButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  phoneText: {
    fontSize: 17,
    color: '#007bff',
  },



})
/* <FlatList
        data={products}
        renderItem={({ item }) => (
          <PrimaryButton
            onPress={() => navigation.navigate('Product', { id:item.apellidoYNombre, nroAfiliado: item.nroAfiliado })}
            label={item.apellidoYNombre} 
            color={color} 
          />
        )}
      /> */

/*  <Text style={{ fontSize: 17, marginBottom: 2, color: "black", marginTop: 5 }}>Teléfonos: {cartilla.telefono}</Text> */