import React, { useEffect, useState } from 'react'
import { Linking, Text, TouchableOpacity, View, Modal, Image, Button, StyleSheet,Platform, NativeModules, Dimensions, ScrollView,   } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import axios from 'axios'
/*  import * as Clipboard from '@react-native-clipboard/clipboard';  */

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RootStackParams } from '../../../routes/StackNavigator'
import { HamburgerMenu } from '../../../components/shared/HamburgerMenu'
import CustomHeader from '../../../components/CustomHeader'
import { BackButton } from '../../../components/shared/BackButton'
import { FullScreenLoader } from '../../../components/ui/FullScreenLoader'
import { useAuthStore } from '../../../store/auth/useAuthStore'
import { xml2js } from 'xml-js';
import { globalColors, globalStyles } from '../../../theme/theme'
import { globalStylesCredentials } from '../../credential/css/themeCredentials'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';




export const EstudiosMedicosEnv = () => {

  const { idAfiliadoTitular, idPrestador, idAfiliadoSeleccionado, imagen1, GuardarIdFamiliarSeleccionado, GuardarIdPrestador, GuardarImagenes, imagenes } = useAuthStore();


  const navigation = useNavigation<NavigationProp<RootStackParams>>()

  const { top } = useSafeAreaInsets();

  const [ordenConsulta, setOrdenConsulta] = useState(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [verificacionMensaje, setVerificacionMensaje] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Nuevo estado
  const [showErrorMessage, setShowErrorMessage] = useState(false); // Nuevo estado

  
  useEffect(() => {
    const getIMEI = async () => {
      try {
        if (Platform.OS === 'ios') {
          const { getDeviceIdentifier } = NativeModules;
          const imei = await getDeviceIdentifier();
          console.log('El IMEI ES---->', imei);
          return imei;
        } else {
          console.log('El dispositivo no es iOS');
          return null;
        }
      } catch (error) {
        console.error('Error al obtener el IMEI:', error);
        console.log('Error al obtener el IMEI:', error);
        return null;
      }
    };


    const EnvioIdAfiliadoSeleccionado = async () => {
      try {
        await axios.get(`https://andessalud.createch.com.ar/api/estudiosMedicos?idAfiliado=${idAfiliadoSeleccionado}`);
        console.log('idAfiliado seleccionado enviado correctamente');
      } catch (error) {
        console.log('no se pudo enviar el idAfiliado Seleccionado a cristian. Error: ', error);
      }
    }

    const EstudiosMedicosRequest = async () => {
      console.log('ingresando a Estudios MEDICOS rEQUEST ---> ');
      
     /*  const imei = await getIMEI(); */
     const imei = '358973323343919'
      console.log('ingresando a Estudios MEDICOS rEQUEST y LAIMEI ES:  ---> ', imei);
      try {
        setIsConsulting(true);

        console.log('ENTRANDO A ESTUDIOS MEDICOS Y VIENDO EL ID AFILIADO TITULAR, ID AFILIADO SELECCIONADO ELEGIDO Y ID PRESTADOR(idConvenio) ----->>:', idAfiliadoTitular, idAfiliadoSeleccionado, idPrestador);

        const params = new URLSearchParams({
          idAfiliadoTitular: idAfiliadoTitular || '',
          idAfiliado: idAfiliadoSeleccionado || '',
          imagen1: imagenes[0] || '',
          imagen2: imagenes[1] || '',
          imagen3: imagenes[2] || '',
          imagen4: imagenes[3] || '',
          imagen5: imagenes[4] || '',
          IMEI: imei || '',
          idConvenio: idPrestador || '',
        });
        console.log('LOS PARAMS SON:  ---> ', JSON.stringify(params));
        const response = await axios.post(
          'https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/APPSolicitarPractica',
          params.toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

        // Convertir la respuesta XML a JSON
        const result = xml2js(response.data, { compact: true });

        // Verificación de la estructura del resultado
        //@ts-ignore
        if (!result || !result.Resultado || !result.Resultado.fila) {
          console.log('La respuesta XML no contiene los datos esperados');
          setError('La respuesta no contiene los datos esperados');
          return;
        }

        //@ts-ignore
        const fila = result.Resultado.fila;
        setResult({
          valorDevuelto: fila.valorDevuelto._text,
          mensaje: fila.mensaje._text,
          idOrden: fila.idOrden._text,
          fecSolicitud: fila.fecSolicitud._text,
          idEstado: fila.idEstado._text,
        });
        
        
/*         console.log('resultado del envio de datos: result:', JSON.stringify(result));
        console.log('resultado del envio de datos: result.mensaje:', JSON.stringify(result.mensaje));
        console.log('resultado del envio de datos: result.idOrden:', JSON.stringify(result.idOrden));
        console.log('resultado del envio de datos: result.fecSolicitud', JSON.stringify(result.fecSolicitud));
        console.log('resultado del envio de datos: result.idEstado:', JSON.stringify(result.idEstado)); */

            
        
        // Verificar si el valor devuelto es "00"
        if (fila.valorDevuelto._text === "00") {
          setShowSuccessMessage(true);// Mostrar el mensaje de éxito
          setShowErrorMessage(false); 
          setShowSuccessModal(true); // Mostrar el modal de éxito
          setError(null);
        } else {
          setShowErrorMessage(true);    // Mostrar el mensaje de error
        }
        

      } catch (error: any) {
        console.error('Error al realizar la solicitud desde el useEffect--->', error);
        const errorMessage = error.response?.data || 'Hubo un problema al realizar la solicitud';
        setError(errorMessage);
        setShowErrorMessage(true); 
        setIsConsulting(errorMessage);
      } finally {
        setIsConsulting(false);

      }
    }

  EstudiosMedicosRequest()   /* descomentar al terminar */
  /*   EnvioIdAfiliadoSeleccionado() */
  }, []);


/*   const handleCopyPress = (textToCopy: string) => {
    Clipboard.setString(textToCopy)
      .then(() => {
        Alert.alert('Texto copiado', 'El texto se ha copiado al portapapeles');
      })
      .catch(err => {
        console.error('Error al copiar al portapapeles:', err);
      });
}; */


const { height } = Dimensions.get('window');
let MarginTopSeleccionaFamiliar: number = hp('0.5%');
let MarginTopDivider: number = hp('0.5%');
let buttonTextFontSize = wp('4.3%');
let optionSelectedTextFontSize = wp('4.3%'); 
let buttonDescriptionFontSize = wp('4.5%');
if (height < 680) { // IMPORTANTE Pantallas más pequeñas como iPhone SE o iPhone 8 de 5.4 pulgadas o menos aproximadamente 

  MarginTopSeleccionaFamiliar = hp('0%');
  MarginTopDivider = hp('0.5%');
  buttonTextFontSize = wp('3.8%');
  buttonDescriptionFontSize = wp('4%');
  optionSelectedTextFontSize = wp('4%'); 
}
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 0,
          backgroundColor: 'white' 
      }}
    >
      <HamburgerMenu />
      <CustomHeader /* color={globalColors.gray2}  */titleSize={hp('4%')} /* titleSize={28} *//>
      <BackButton onPress={() => navigation.navigate('home')} Size={hp('4%')} />
      <ScrollView>  
      {
        isConsulting ? (
          <View
            style={{
              flex: 0.5,
              marginTop: top - 10,
            }}
          >
            <FullScreenLoader 
            spinnerSize="giant" 
            />
         
          </View>
        )
          :
          <View style={globalStyles.containerEstudiosMedicosEnv}>

            {/* View para mostrar éxito */}
            {showSuccessMessage && (
              <View style={styles.successContainer}>
                <Text style={styles.successMessage}>!Petición enviada con Éxito!</Text>
                <Image source={require('../../../assets/images/logoAndesSaludRedondo4.png')} style={styles.successImage} />
               {/*  <Image source={require('../../../assets/images/MailSent-rafiki.png')} style={styles.successImage} /> */}
               <Text style={styles.epigrafeMessage}>Estar bien es más fácil</Text>
              </View>
            )}

            {/* View para mostrar mensaje de mensaje no enviado con exito*/}
            {showErrorMessage && (
              <View style={styles.problemsContainer}>
                <Text style={styles.problemMessage}>No se pudo procesar la solicitud</Text>
                <Text style={styles.epigrafeMessage}>Por favor intente nuevamente más tarde</Text>
                <Image source={require('../../../assets/images/400ErrorBadRequest-bro.png')} style={styles.errorImage} />
              </View>
            )}

            { !showErrorMessage && result && (


              <View>
                 <View style={styles.informationContainer}>
                 <View  /* style={{ alignItems: 'center'}}  */>
                 <Text style={globalStyles.infoEstudiosMedicosEnv}>Información de tu solicitud</Text>
                 </View>
                 
                 <Text style={globalStyles.resultText}>{result.mensaje}</Text>
                 <View style={{ marginTop:5, marginBottom: 10,}}>
                <Text style={globalStyles.resultOrdenText}>ID Orden:</Text>
               
                <Text style={globalStyles.resultFecha}>{result.idOrden}</Text>
                
                <Text style={globalStyles.resultOrdenText}>Fecha de Solicitud:</Text>
              
                <Text style={globalStyles.resultFecha}>{result.fecSolicitud}</Text>
           
                </View>
                {/*  <Text style={globalStyles.resultText}>ID Estado: {result.idEstado}</Text> */}
                {verificacionMensaje && <Text style={globalStyles.resultText} >{verificacionMensaje}</Text>}

              </View>

        

              </View>
            )}


        

          </View>

      }
       </ScrollView>  
    </View>
  )
}




const styles = StyleSheet.create({
  successContainer: {
    marginTop: 20,
    marginBottom: 20,
    /*     padding: 20, */
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5, 
  },
  problemsContainer: {
    marginTop: 20,
    marginBottom: 20,
    /*     padding: 20, */
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5, 
  },
  informationContainer: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5, 
   
  },
  successMessage: {
    fontSize: 22,
    marginTop:10,
    marginBottom:5,
    color:'#030136',
    fontWeight:'bold',
   
  },
  problemMessage: {
    fontSize: 22,
    marginTop:10,
    marginBottom:5,
    color:'#030136',
    fontWeight:'bold',
    
   
  },
  epigrafeMessage: {
    fontSize: 20,
    marginTop:5,
    marginBottom:10,
    color:'#595960' ,
    alignSelf: 'center',
  },
  successImage: {
    width: 150,
    height: 150,
    marginBottom:5,
  },
  errorImage: {
    width: 220,
    height: 220,
    marginBottom:5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
})
