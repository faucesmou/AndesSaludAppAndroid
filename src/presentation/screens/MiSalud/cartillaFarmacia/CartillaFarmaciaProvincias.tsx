import React, { useEffect, useState } from 'react'
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { Text, View, ScrollView, StyleSheet, Pressable } from 'react-native';

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

export const CartillaFarmaciaProvincias = () => {

  console.log('Entrando a CARTILLA FARMACIA PROVINCIAS------->');


  const { idAfiliadoTitular, idAfiliado, GuardarIdCartillaSeleccionada, GuardarIdMacroZonaSeleccionada } = useAuthStore();



  const { top } = useSafeAreaInsets();

  const [cartillas, setCartillas] = useState<{ nombre: string; idProvincia: string; idCartilla: string }[]>([]);

  const [isConsulting, setIsConsulting] = useState(false);
  const [isError, setIsError] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParams>>()

  function capitalizeWords(input: string | undefined): string {
    if (!input) {
      return "";
    }
    return input.replace(/\b\p{L}+/gu, function (word) {
      return word.charAt(0).toLocaleUpperCase("es-ES") + word.slice(1).toLocaleLowerCase("es-ES");
    });
  }


  useEffect(() => {

    const CartillaRequest = async () => {
      setIsConsulting(true);

      try {
        const response = await axios.get(`https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/APPObtenerFarmaciasMacroZona?idAfiliado=${idAfiliado}`)
      /*   const response = await axios.get(`https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/APPObtenerCartillas?IMEI=&idAfiliado=${idAfiliado}&otrasCartillas=`) */

        const xmlData = response.data;

        // Convertir XML a JSON
        const result = xml2js(xmlData, { compact: true });

        const cartillasData = result.Resultado.fila.tabZonaFarmacias;

        // Verificar si cartillasData es un array o un objeto y procesar en consecuencia
        const mappedCartillas = Array.isArray(cartillasData.idZona)
          ? cartillasData.idZona.map((_: any, index: number) => ({
            nombre: cartillasData.nombre[index]._text,
            idProvincia: cartillasData.idZona[index]._text,
          })):
          "no coincide el formato"
           /*  .filter(cartilla => cartilla.nombre !== "Otras cartillas") 
          : [{
            nombre: cartillasData.nombre._text,
            idCartilla: cartillasData.idCartilla._text,
          }].filter(cartilla => cartilla.nombre !== "Otras cartillas"); */

        setCartillas(mappedCartillas);
      


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
        marginTop: wp('-3%'),
        fontSize: hp('4%'),
        textAlign: 'center',
        color: globalColors.gray2,
        fontWeight: 'bold'
      }}>Provincias</Text>

      <View style={{ flex: 1, marginBottom: hp('2%'), marginTop: hp('1%') }}>
        <ScrollView >
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
                          onPress={() => {

                            let idZona = cartilla.idProvincia;
                            let nombreProvincia = cartilla.nombre;
                            console.log('idZona: ', idZona);
                            console.log('nombreProvincia: ', nombreProvincia);
                            GuardarIdMacroZonaSeleccionada(idZona, nombreProvincia);
                           
                            navigation.navigate('Cartillas Farmacias')
                          }
                          }
                        >
                          <View key={index} style={styles.TertiaryButton}>
                            <View style={styles.contentWrapper2}>
                              <View style={styles.textWrapper}>
                                <Text style={styles.descriptionText}>
                                  {capitalizeWords(cartilla.nombre)}
                                </Text>
{/*                                    <Text style={{ fontSize: 15, marginBottom: 10, color:"black" }}>ID PROVINCIA: {cartilla.idProvincia}</Text>  */}
                              </View>
                            </View>
                          </View>
                        </Pressable>


                      </View>
                    )

                  )
                )


          }

{/* <Pressable
        onPress={() => {
          navigation.navigate('Otras Cartillas')
        }
        }
      >
        <View style={styles.TertiaryButton}>
          <View style={styles.contentWrapper2}>
            <View style={styles.textWrapper}>
              <Text style={styles.descriptionText}>
              OTRAS CARTILLAS
              </Text>
              
            </View>
          </View>
        </View>
      </Pressable> */}

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
    marginHorizontal: hp('1%'),
    /* fontSize: hp('2.3%'), */
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionText: {
    color: '#3b3937', 
    /* fontSize: 18, */
    fontSize: hp('2.3%'),
    textAlign: 'center',
    fontWeight:"bold",
  },
  contentWrapper2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  textWrapper: {
    flex: 1,
    paddingRight: 5,
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
