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

export const CartillaFarmaciaDepartamento = () => {
  console.log('Entrando a CartillaFarmaciaDepartamento------->');
  const { idAfiliadoTitular, idAfiliado, GuardarIdCartillaSeleccionada, idZona,  GuardarIdDepartamentoSeleccionado, nombreProvincia } = useAuthStore();
 
   console.log('idZona------->', idZona);
   console.log('idAfiliado------->', idAfiliado);


  const { top } = useSafeAreaInsets();

  const [cartillas, setCartillas] = useState<{ nombre: string; idZona: string }[]>([]);

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
        const response = await axios.get(`https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/APPObtenerFarmaciasZona?idAfiliado=${idAfiliado}&idZona=${idZona}`)

        const xmlData = response.data;

   
        const result = xml2js(xmlData, { compact: true });
       

  const cartillasData = result.Resultado.fila.tabZonaFarmacias;
console.log('cartillasData es:>>.,', cartillasData);
      
        const mappedCartillas = Array.isArray(cartillasData.idZona)
          ? cartillasData.idZona.map((_: any, index: number) => ({
            nombre: cartillasData.nombre[index]._text,
            idZona: cartillasData.idZona[index]._text,
          })):
          "no coincide el formato"
          
          

        setCartillas(mappedCartillas); 
     


        setIsConsulting(false);

        //acá hay que modificar la lógica para poder recibir una sola cartilla porque en el caso de que se cargue UNA sola cartilla el formato de cartillaData queda como un objeto en vez de un array de objetos con lo cual al no ser array pasa a  "no coincide el formato" y no se puede hacer map sobre cartillas. Considerar si es necesario y hacer la prueba con casos de una sola cartilla. 
        

        /*   console.log('este es el mappedCartillas DE CARTILLA MEDICA---x--x-x--x->:', mappedCartillas); */
        /*  console.log('este es el cartillas useState:', cartillas); */

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
        fontSize: hp('3%'),
        textAlign: 'center',
        color: globalColors.gray2,
        fontWeight: 'bold'
      }}>Departamentos de {capitalizeWords(nombreProvincia)}:</Text>

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

                            let idDepartamento = cartilla.idZona;
                            let nombreDepartamento = cartilla.nombre;
                            GuardarIdDepartamentoSeleccionado(idDepartamento, nombreDepartamento);
                          
                            navigation.navigate('Farmacias')
                          }
                          }
                        >
                          <View key={index} style={styles.TertiaryButton}>
                            <View style={styles.contentWrapper2}>
                              <View style={styles.textWrapper}>
                                <Text style={styles.descriptionText}>
                                  {capitalizeWords(cartilla.nombre)}
                                </Text>
                                   {/* <Text style={{ fontSize: 15, marginBottom: 10, color: "black" }}>ID: {cartilla.idZona}</Text> */} 
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
    marginHorizontal: hp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionText: {
    color: '#3b3937', /* globalColors.gray, */ /* 'black' */
   /*  fontSize: 20, */
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
