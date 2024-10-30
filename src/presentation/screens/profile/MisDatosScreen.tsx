import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, Text, View,TouchableOpacity, Clipboard  } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { globalColors, globalStyles } from '../../theme/theme'
import { FlatList } from 'react-native-gesture-handler'
import { RootStackParams } from '../../routes/StackNavigator'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { HamburgerMenu } from '../../components/shared/HamburgerMenu'
import { BackButton } from '../../components/shared/BackButton'
import CustomHeader from '../../components/CustomHeader'
import { FullScreenLoader } from '../../components/ui/FullScreenLoader'
import { useAuthStore } from '../../store/auth/useAuthStore'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';



export const MisDatosScreen = () => {

  const { idAfiliadoTitular, idAfiliado, nombreCompleto, numeroCredencial, tipoPlan, estadoAfiliacion, tipoPago, mail, numCelular } = useAuthStore();

  const [isConsulting, setIsConsulting] = useState(false);
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParams>>()

  const [afiliado, setAfiliado] = useState(null);


  /*  useEffect(() => {
     setIsConsulting(false);
     const AfiliadosRequest = async () => {
       setIsConsulting(true);
       try {
         console.log('is posting en true! daled man ere');
 
         const response = await axios.get(`https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/consultarAfiliadoJson?usuario=CHATBOT&password=DrtEchat%&administradora=F100376F-33F9-49FD-AFB9-EE53616E7F0C&datosAfiliado=${idAfiliado}`);
         console.log('este es el response', response);
 
         const mappedAfiliados = response.data.map((
           item: {
             apellNomb: any;
             nroAfiliado: any;
             edad: any;
             estadoAfiliacion: any;
             planPrestacional: any
           }) => ({
             apellidoYNombre: item.apellNomb,
             nroAfiliado: item.nroAfiliado,
             edad: item.edad,
             estadoAfiliacion: item.estadoAfiliacion,
             planPrestacional: item.planPrestacional
 
           }));
 
         setAfiliado(mappedAfiliados);
         console.log('este es el mappedAfiliados:', mappedAfiliados);
         setIsConsulting(false);
 
       } catch (error) {
         console.error('Error al obtener los datos de los afiliados:', error);
       }
     };
     AfiliadosRequest()
 
   }, []) */
  const colorNaranja = globalColors.orange




  return (
    <View style={{
      marginTop: 0,
    }}
    >
      <CustomHeader /* color={globalColors.black} */ titleSize={hp('4%')} />

      <BackButton Size={hp('4%')} />

      {/* <Text style={{ marginBottom: hp('1%'), fontSize: hp('3%'), textAlign: 'center', color: 'black' }}>Mis Datos</Text> */}

      <Text style={{
        marginBottom: wp('2%'),
        marginTop: wp('-1%'),
        fontSize: hp('3.5%'),
        textAlign: 'center',
        color: globalColors.gray2,
        fontWeight: 'bold'
      }}>Mis Datos</Text>


      <View style={{ alignItems: 'center' }}>
        <View style={styles.TertiaryButton}>
          <View style={styles.container}>
            <View style={{ alignItems: 'center' }}>

            <Text style={[styles.text, { fontSize: hp('2%') }]}>{`${nombreCompleto}`}</Text>
            </View>
            <Text style={[styles.text, { fontSize: hp('2%') }]}>{`Numero de Afiliado: ${numeroCredencial}`}</Text>
            {/*    <Text style={styles.text}>{`Edad: ${item.edad}`}</Text> */}
            <Text style={[styles.text, { fontSize: hp('2%') }]}>{`Plan: ${tipoPlan}`}</Text>
            <Text style={[styles.text, { fontSize: hp('2%') }]}>{`Estado: ${estadoAfiliacion}`}</Text>
            <Text style={[styles.text, { fontSize: hp('2%') }]}>{`Tipo de Pago: ${tipoPago}`}</Text>
            <Text style={[styles.text, { fontSize: hp('2%') }]}>{`Celular: ${numCelular}`}</Text>
            <Text style={[styles.text, { fontSize: hp('2%') }]}>{`Correo: ${mail}`}</Text>

          </View>

        </View>


      </View>


    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    marginBottom: 5,
    marginTop: 5,
    fontSize: 18,
    textAlign: 'left',
    /* color: 'black', */
    color: globalColors.gray,
    fontWeight: 'bold',

  },
  container: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  //ESTILOS PARA EL BORDE (COPIADOS DE TERTIARY BUTTON):
  TertiaryButton: {
    backgroundColor: 'white',
    minWidth: '95%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    padding: wp('1%'),
    margin: wp('1%'),
    marginBottom: wp('2%'),
    marginHorizontal: wp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },

})