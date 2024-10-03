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

export const CartillaMedicaScreen = () => {
  console.log('Entrando a CARTILLA MEDICA------->');
  const { idAfiliadoTitular, idAfiliado, GuardarIdCartillaSeleccionada } = useAuthStore();
  console.log('idAfiliadoTitular desde Cartilla Medica Screen---->', idAfiliadoTitular);


  const { top } = useSafeAreaInsets();

  const [cartillas, setCartillas] = useState<{ nombre: string; descripcion: string; idCartilla: string }[]>([]);

  const navigation = useNavigation<NavigationProp<RootStackParams>>()

  useEffect(() => {

    const CartillaRequest = async () => {

      try {
        const response = await axios.get(`https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/APPObtenerCartillas?IMEI=&idAfiliado=${idAfiliado}&otrasCartillas=`)

        const xmlData = response.data;

        // Convertir XML a JSON
        const result = xml2js(xmlData, { compact: true });

        const cartillasData = result.Resultado.fila.tabCartillas;

        // Verificar si cartillasData es un array o un objeto y procesar en consecuencia
        const mappedCartillas = Array.isArray(cartillasData.idCartilla)
          ? cartillasData.idCartilla.map((_: any, index: number) => ({
            nombre: cartillasData.nombre[index]._text,
            idCartilla: cartillasData.idCartilla[index]._text,
          }))
          : [{
            nombre: cartillasData.nombre._text,
            idCartilla: cartillasData.idCartilla._text,
          }];
        setCartillas(mappedCartillas);
      
        

      /*   console.log('este es el mappedCartillas DE CARTILLA MEDICA---x--x-x--x->:', mappedCartillas); */
        /*  console.log('este es el cartillas useState:', cartillas); */

      }
      catch (error) {
        console.error('Error al obtener los formularios:', error);
      }
    };
    CartillaRequest()

  }, [idAfiliadoTitular])


  const color = globalColors.orange

  return (
    <View

      style={{...globalStyles.container, marginBottom:0, }}

    >
      <CustomHeader /* color={globalColors.gray2} */ titleSize={hp('4%')} />

      <BackButton Size={hp('4%')}/>

      <Text style={{
        marginBottom: 0,
        marginTop: 0,
        fontSize: hp('4%'),
        textAlign: 'center',
        color: globalColors.gray2,
        fontWeight: 'bold'
      }}>Especialidades</Text>

      <View style={{ /* backgroundColor: 'yellow', */ flex: 1, marginBottom: hp('4%'), marginTop: hp('1%') }}>
        <ScrollView /* contentContainerStyle={styles.scrollViewContent} */>
          {cartillas.map((cartilla, index) => (

            <View 
            key={index} 
            style={{ marginBottom: 5 }} 
            >
            {/*   <Text 
              onPress={ ()=> {
                console.log('Valor de idCartilla ACA ACA ACAA:', cartilla.idCartilla);
              let idCartilla = cartilla.idCartilla;
                GuardarIdCartillaSeleccionada(idCartilla); 
                navigation.navigate('Prestadores', { idCartilla: cartilla.idCartilla })}
              }
                style={{ fontSize: 16, textAlign: 'center', }}>{cartilla.nombre}</Text> */}

              {/* mejora del estilo:  */}
              <Pressable
                onPress={() => {
                 
                  let idCartilla = cartilla.idCartilla;
                  let nombre88 = cartilla.nombre;
                  GuardarIdCartillaSeleccionada(idCartilla, nombre88);
                  console.log('nombre es----->>>',cartilla.nombre );
                  console.log('cartilla es----->>>',cartilla.nombre );
                  console.log('nombre88----->>>',nombre88 );
                  navigation.navigate('Prestadores', { 
                    idCartilla: cartilla.idCartilla,
                })
                }
                }
              >
                <View key={index} style={styles.TertiaryButton}>
                  <View style={styles.contentWrapper2}>
                    <View style={styles.textWrapper}>
                      <Text style={styles.descriptionText}>
                      {cartilla.nombre}
                      </Text>
                      {/*    <Text style={{ fontSize: 15, marginBottom: 10 }}>ID: {cartilla.idCartilla}</Text>  */}
                    </View>
                  </View>
                </View>
              </Pressable>

            </View>
          ))}

        </ScrollView>
      </View>

    </View>

  )
}

const styles = StyleSheet.create ({
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
    color: 'black',
    fontSize: 18,
    textAlign: 'center'
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
