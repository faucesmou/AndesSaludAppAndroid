import React, { useEffect, useState } from 'react'
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { globalColors } from '../../theme/theme'
import { RootStackParams } from '../../routes/StackNavigator'
import { HamburgerMenu } from '../../components/shared/HamburgerMenu'
import { BackButton } from '../../components/shared/BackButton'
import CustomHeader from '../../components/CustomHeader'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FullScreenLoader } from '../../components/ui/FullScreenLoader'
import { useAuthStore } from '../../store/auth/useAuthStore'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export const MiOrdenConsultaScreen = () => {
  console.log('entrando a MiOrdenConsultaScreen----->>>:');
  const {  idAfiliadoTitular, idPrestacion, idPrestador, idAfiliadoSeleccionado } = useAuthStore();
  
  const navigation = useNavigation<NavigationProp<RootStackParams>>()

  const { top } = useSafeAreaInsets();

  const [ordenConsulta, setOrdenConsulta] = useState(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [mounted, setMounted] = useState(false); 

  useEffect(() => {

     // Verificamos que las constantes estén definidas antes de proceder
     if (!idAfiliadoTitular || !idPrestacion || !idPrestador || !idAfiliadoSeleccionado || isConsulting || mounted) {
      console.log('Esperando que todas las constantes estén definidas...');
      return; // Si no están definidas, no ejecutes la consulta todavía
    }

 // Si ya se está consultando, no lo hagas de nuevo

setIsConsulting(true);
setMounted(true);  // Marca como montado para evitar re-ejecuciones

    const OrdenConsultaRequest = async () => {

      console.log('este es el idAfiliadoSeleccionado:', idAfiliadoSeleccionado);
      console.log('este es el idAfiliadoTitular:', idAfiliadoTitular);
      console.log('este es el idPrestacion:', idPrestacion);
      console.log('este es el idPrestador:', idPrestador);

      try {

        const response = await axios.get(`https://andessalud.createch.com.ar/api/ordenDeConsulta?idAfiliado=${idAfiliadoSeleccionado}&idAfiliadoTitular=${idAfiliadoTitular}&idPrestacion=${idPrestacion}&idPrestador=${idPrestador}`);
        const Url = response.data;
        console.log('este es el Url', Url);
        setOrdenConsulta(Url);
        console.log('este es el ordenConsulta (url):', ordenConsulta);
        setIsConsulting(false);

      } catch (error:any) {
        console.error('Error al obtener los datos de los afiliados:', error);
        const errorMessage = error.response?.data || 'no hay mensaje de error'
        console.log('este es el errorMessage:', errorMessage);
        setShowErrorMessage(true); 
       
      } finally{
        setIsConsulting(false);
      }
    };
    OrdenConsultaRequest()

  }, [idAfiliadoTitular, idPrestacion, idPrestador, idAfiliadoSeleccionado, mounted]);

  const handleOpenURL = () => {
    if (ordenConsulta) {
      Linking.openURL(ordenConsulta);
    }
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
      <CustomHeader /* color={globalColors.gray2}  */titleSize={28} />
      <BackButton onPress={() => navigation.navigate('home')} />
      {
        isConsulting ? (
          <>

            <View

              style={styles.waitingContainer}
            >
              <View style={styles.containerMessage}>
              <View  style={styles.containerEpigrafe} >
                <Text style={styles.epigrafeMessage}>Aguardá un momento por favor</Text>
                <Text style={styles.epigrafeMessage}>Estamos procesando tu orden</Text>
                </View>
                <View  style={styles.containerEpigrafe2} >
                <Text style={styles.epigrafeMessage2} >Esto puede tomar algunos unos minutos</Text>
                <Text style={styles.epigrafeMessage2} >No cierre esta ventana hasta que se complete el proceso de solicitud</Text>
                </View>
              </View>

            </View>
         <FullScreenLoader
              layoutStyle={{ justifyContent: 'flex-start', alignItems: 'center', marginTop: 35 }}
              spinnerSize="giant"
              spinnerStatus="info"

            /> 
          </>
        )
          :

          (
            showErrorMessage ? (
              <>
            
              <View style={styles.errorContainer}>
                <Text style={styles.titleMessage}>No se pudo enviar la información</Text>
                <Image source={require('../../assets/images/400ErrorBadRequest-bro.png')} style={styles.errorImage} />
              </View>
              <View
                style={{
                  marginTop: 10,
                  backgroundColor: '#FFFFFF',
                  marginHorizontal:10,
                }}
              >
                <Text style={{ marginBottom: 5, fontSize: 20,  color:'#030136' }}>Dificultades en la solicitud</Text>
                <Text style={{ marginBottom: 5, fontSize: 18, color:'#595960' }}>Tuvimos inconvenientes para procesar tu solicitud por favor intenta nuevamente más tarde</Text>
             
              </View>
              </>
            ) :
              (

                <View
                  style={styles.successContainer}
                >
                  <View style={styles.textContainer}>

                  <Text style={styles.titleMessage}
                  >¡Tu Orden está lista!</Text>

                  <Text style={{ marginBottom: 5, fontSize: hp('2.1%'), marginTop: 10, color:'#595960', justifyContent:'center'  }}>Ingresá al siguiente link para descargarla:</Text>

                  <TouchableOpacity onPress={handleOpenURL}>
                    <Text style={{ marginBottom: wp('2%'), marginTop: 15, fontSize: 15, color: '#0e77e7', fontWeight:'bold' }}>
                      {ordenConsulta}
                    </Text>
                  </TouchableOpacity>



                  </View>
                  <View style={styles.imageContainer}>
               
                <Image source={require('../../assets/images/logoAndesSaludRedondo4.png')} style={styles.successImage} />
              
               <Text style={styles.epigrafeMessage}>Estar bien es más fácil</Text>
              </View>
                </View>
              )
          )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  waitingContainer: {
    marginTop: 20,
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
  successContainer: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
  shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5, 
  },
  textContainer: {
  /*   marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10, */
    alignItems: 'center',
     marginHorizontal: wp('4%'),
     justifyContent:'center'
/*   shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5,  */
  },
  
  imageContainer: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  errorContainer: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
  shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5, 
  },
  containerMessage: {
    marginTop: 15, 
    marginBottom:20, 
    marginHorizontal: 5,
  }, 
  titleMessage: {
    /* fontSize: 22, */
    fontSize: hp('3%'),
    marginTop:10,
    marginBottom:5,
    color:'#030136',
    fontWeight:'bold',
   /*  justifyContent:'center' */
  },
  epigrafeMessage: {
    fontSize: 20,
    marginTop:0,
    marginBottom:5,
    alignSelf: 'center',
   color:'#030136',
   fontWeight:'bold',
 
  },
  containerEpigrafe: {
   /*  fontSize: 18, */
    marginTop:0,
    marginBottom:5,
    alignSelf: 'center',
    textAlign:'center',
    color:'#595960' ,
  },
  containerEpigrafe2: {
   /*  fontSize: 18, */
    marginTop:15,
    marginBottom:5,
    alignSelf: 'center',
    textAlign:'center',
    color:'#595960' ,
  },
  epigrafeMessage2: {
    fontSize: 17,
    marginTop:3,
    marginBottom:5,
    alignSelf: 'center',
    color:'#595960' ,
    textAlign:'center'
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
})