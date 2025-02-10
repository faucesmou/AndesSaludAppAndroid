import { Layout, Text, Input, Button } from "@ui-kitten/components"
import { Alert, StyleSheet, View, useWindowDimensions, Image, Linking, Modal, TouchableOpacity, ActivityIndicator } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

import { StackScreenProps } from "@react-navigation/stack";

import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth/useAuthStore";
import { loadAuthDataFromStorage } from "../../store/auth/authStore";
import { MyIcon } from "../../components/ui/MyIcon";
import { RootStackParams } from "../../routes/StackNavigator";
import { FullScreenLoader } from "../../components/ui/FullScreenLoader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Svg, { Path } from 'react-native-svg';
import { Icon } from "react-native-vector-icons/Icon";

/* prueba de persistencia de datos: */
import { initializeAuth } from '../../store/auth/authService';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRscanner2 from "../../components/shared/QRscanner2";
import QRscanner4 from "../../components/shared/QRscanner4";
import QRscanner5gpt from "../../components/shared/QRscanner5gpt";
import QRscanner6gpt from "../../components/shared/QRscanner6gpt";





interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'> { }

type DNIData = {
  numTram: string;
  apellido: string;
  nombre: string;
  dni: string;
  fechNacimiento: string;
  fecEmision: string;
};


export const RegisterDni = ({ navigation }: Props) => {

  /* QR: */

  const [scannedData, setScannedData] = useState('');

  const [isScanSuccessful, setIsScanSuccessful] = useState(false);
  const [showScanError, setShowScanError] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDniScanned, setIsDniScanned] = useState(false);
  const [isDniUpdated, setIsDniUpdated] = useState(false);
  /* const [form, setForm] = useState({ usuario: '', password: '' }); */

  /*   const handleScanComplete = (data: DNIData) => {
      setScannedData(data);
      console.log('scannedData=====>>>===>>', scannedData);
  
    }; */

  /*   const handleScanComplete = async (data: DNIData) => {
      setIsLoading(true);
      if (data && data.dni) {
        console.log('documento escaneado con éxito perrrisonnnn');
        setScannedData(data);
        setIsScanSuccessful(true);
        setShowScanError(false);
        let dni = scannedData.dni ;  
          useAuthStore.getState().setDni(dni);
          console.log('DNI guardado en Zustand:', dni);
          await new Promise(resolve => useAuthStore.getState().setDni(dni, resolve));
          console.log('DNI guardado en Zustand:', dni);
          setIsLoading(false);
          setIsDniScanned(true);
      } else {
        console.log('error al escanear el documento');
  
        setIsScanSuccessful(false);
        setShowScanError(true);
        setIsLoading(false);
      }
    }; */

  const handleScanComplete = async (data: DNIData) => {
    setIsLoading(true);
    try {
      if (data && data.dni) {
        console.log('documento escaneado con éxito perrrisonnnn');
        setScannedData(data);
        setIsScanSuccessful(true);
        setShowScanError(false);
        const dni = data.dni;

        // Actualiza el store de Zustand y espera a que se complete
        await new Promise(resolve => useAuthStore.getState().setDni(dni, resolve));

        console.log('DNI guardado en Zustand:', dni);

        setIsLoading(false);
        setIsDniScanned(true);

      } else {
        console.log('error al escanear el documento');
        setIsScanSuccessful(false);
        setShowScanError(true);
      }
    } catch (error) {
      console.error("Error en handleScanComplete:", error);
      setIsLoading(false);
      setShowScanError(true);
    }
  };

  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  const [isModalVisible, setModalVisible] = useState(false);


  const { loginGonzaMejorado, guardarDatosLoginEnContext, guardarDatosLoginEnContextMejorada, loginGonzaMejorado2, setUserName, loginGonzaMejorado3, setDni } = useAuthStore();
  /*  const { loadAuthDataFromStorage } = AuthStore(); */



  /* lógica para habilitar el LOGIN SÓLO CON EL ESCANEO + EL USUARIO Y CONTRASEÑA: */

  const handleLoginPress = () => {
    if (!isScanSuccessful) {
      setShowScanModal(true);
      return;
    }
    onLoginGonza2(); // Procede con el login si el escaneo fue exitoso
  };




  const [isPosting, setIsPosting] = useState(false)
  const [form, setForm] = useState({
    usuario: '',
    email: '',
    password: '',
    dni: '',
  })
  const [linkAndesSalud, setLinkAndesSalud] = useState("");
  let UrlAndes2 = `https://www.andessalud.com.ar/`
  let UrlAndes = `https://www.andessalud.com.ar/register/`

  const handleOpenURLAndes = () => {
    console.log('entrando a Andes Salud');

    setLinkAndesSalud(UrlAndes);
  }

  useEffect(() => {
    const openURLAndesSalud = async () => {
      if (linkAndesSalud) {
        try {
          await Linking.openURL(linkAndesSalud)
        } catch (err) {
          console.log('Error al intentar ingresar a Andes Salud:', err);
        } finally {

          setLinkAndesSalud('');
        }
      }
    }
    openURLAndesSalud()
  }, [linkAndesSalud])

  const onLoginGonza2 = async () => {

    if (form.password.length === 0 || form.usuario.length === 0) {
      Alert.alert('Usuario y contraseña son obligatorios');
      return;
    }

    setIsPosting(true);

    try {
      const loginExitoso = await loginGonzaMejorado3(form.usuario, form.password);

      if (loginExitoso) {
        /* const idAfiliadoActual = idAfiliado */
        const { idAfiliado } = useAuthStore.getState();

        if (idAfiliado) {
          // Llama a guardarDatosLoginEnContext con el idAfiliado actualizado

          const datosGuardados = await guardarDatosLoginEnContext(idAfiliado);
          if (!datosGuardados) {
            console.log('No se pudieron guardar los datos de usuario desde el LoginScreen');
          }
        } else {
          console.log('idAfiliado no está disponible');
        }
        if (loginExitoso) {
          const { idAfiliado, cuilTitular, nombreCompleto, idAfiliadoTitular, UserName, numeroCredencial, tipoPlan, estadoAfiliacion, tipoPago, numCelular, mail } = useAuthStore.getState();

          if (idAfiliado) {

            await useAuthStore.getState().setAuthenticated(idAfiliado);
            await useAuthStore.getState().setDataStore(cuilTitular, nombreCompleto, idAfiliadoTitular, UserName, numeroCredencial, tipoPlan, estadoAfiliacion, tipoPago, numCelular, mail);


          } else {
            console.log('idAfiliado no está disponible');
          }
        }


      } else {
        /* Alert.alert('Ups!', 'Usuario o contraseña incorrectos'); */
        setModalVisible(true)
        /*  console.log('Error durante el login:'); */
      }
    } catch (error) {
      console.log('Error durante el login:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const onLoginGonza3 = async (form: { usuario: string; password: string }, setIsPosting: (status: boolean) => void, setModalVisible: (visible: boolean) => void) => {
    if (form.password.length === 0 || form.usuario.length === 0) {
      Alert.alert('Usuario y contraseña son obligatorios');
      return;
    }

    setIsPosting(true);

    try {
      const loginExitoso = await loginGonzaMejorado2(form.usuario, form.password);

      if (loginExitoso) {
        const { idAfiliado } = useAuthStore.getState();

        if (idAfiliado) {
          // Guardamos los datos en AsyncStorage y en el contexto
          const datosGuardados = await guardarDatosLoginEnContextMejorada(idAfiliado);

          if (!datosGuardados) {
            console.log('No se pudieron guardar los datos de usuario desde el LoginScreen');
          } else {
            await AsyncStorage.setItem('authData', JSON.stringify(datosGuardados));
            await saveAuthDataToStorage(datosGuardados); // Guarda en AsyncStorage
          }
        } else {
          console.log('idAfiliado no está disponible');
        }

        // Establece el estado de autenticación
        if (loginExitoso) {
          const { idAfiliado } = useAuthStore.getState();
          if (idAfiliado) {
            await useAuthStore.getState().setAuthenticated(idAfiliado);
          } else {
            console.log('idAfiliado no está disponible');
          }
        }

      } else {
        setModalVisible(true);
      }
    } catch (error) {
      console.log('Error durante el login:', error);
    } finally {
      setIsPosting(false);
    }
  };

  let paddingTopNumber = hp('1%');
  if (height < 680) { // IMPORTANTE Pantallas más pequeñas como iPhone SE o iPhone 8 de 5.4 pulgadas o menos aproximadamente 
    paddingTopNumber = hp('1%');

  }

  return (
    <Layout style={{ flex: 1, }}>
      <ScrollView style={{ marginHorizontal: hp('0.7%') }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Layout style={{ paddingTop: paddingTopNumber, backgroundColor: 'white', }}>

          <View style={styles.container}>

            <View style={styles.topSection}>
              <Image source={require('../../assets/images/logoBlanco3.png')}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.textTitle}>Bienvenidos a</Text>
              <Text style={styles.textTitle}>Andes Salud</Text>

            </View>


            <View style={styles.waveContainer}>
              <Svg
                height={hp('13%')} // Ajusta el tamaño de la onda
                width='100%'
                /* width={wp('100%')} */
                /*  color={'black'} */
                viewBox="0 0 1440 320" // Vista para el SVG
                preserveAspectRatio="none" // Esto evita que la onda se distorsione al ajustar el ancho
              >
                <Path
                  fill="white" // Color de la sección inferior (fondo blanco)
                  /* para controlar los picos y valles modifica estos primeros valores:  */
                  d="M0,40 C520,20 1140,420 1440,160 L1440,320 L0,320Z "  /* "M0,40 C520,20 1140,420 1440,160 L1640,1090 L0,400Z" */
                />
              </Svg>
            </View>

            {/* Sección inferior */}

            <View style={styles.bottomSection}>
              <View>


                <Text style={styles.text}>
                  {/*  Por favor, ingresá tu Número de Credencial y Contraseña para continuar: */}
                  Para comenzar necesitamos que escanees tu DNI:
                </Text>
                <Text style={styles.textConsigna}>
                  {/*  Por favor, ingresá tu Número de Credencial y Contraseña para continuar: */}
                  Tienes que escanear el código de barra que aparece en tu DNI tarjeta, dependiendo el año en que lo tramitaste puede estar en frente o el dorso.
                </Text>


                <QRscanner6gpt onScanComplete={handleScanComplete} />

                {/*  {scannedData && (
                  <View style={styles.result}>
                    <Text style={styles.resultText}>Aguarda un momento</Text>
                    <Text style={styles.resultData}>{JSON.stringify(scannedData, null, 2)}</Text>
                        <Text>Apellido: {scannedData.apellido}</Text>
                    <Text>Nombre: {scannedData.nombre}</Text>
                    <Text style={styles.resultData} >DNI: {scannedData.dni}</Text>

                  </View>
                )} */}

                {isLoading && (
                  <>
                    <View style={styles.result}>
                      <Text style={styles.resultText}>Aguarda un momento</Text>
                    </View>
                    <View
                      style={{
                        flex: 0.1,
                        marginTop: hp('1%'),
                        marginBottom: hp('0%'),
                      }}
                    >
                      <FullScreenLoader />
                    </View>
                  </>
                )}

              </View>

               {isDniScanned && (
                <View style={styles.cajaDatosGuardados} >
                  <Text style={styles.TextDatosGuardados}>¡Datos guardados!</Text>
                </View>
              )}



              <Button style={styles.customButton}
                /*  disabled={isPosting} */
                /* onPress={handleLoginPress} */
                /*  onPress={onLoginGonza2} */
                onPress={() => navigation.navigate('Registro telefono')}
                disabled={!isDniScanned}
              >
                CONTINUAR
              </Button>


              {showScanError && (
                <Text style={styles.errorText}>Error en el escaneo de QR</Text>
              )}

              {showScanModal && (
                <Modal
                  transparent={true}
                  animationType="fade"
                  visible={showScanModal}
                  onRequestClose={() => setShowScanModal(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.modalTitle}>Aviso</Text>
                      <Text style={styles.modalMessage}>Debe escanear su DNI para continuar.</Text>
                      <TouchableOpacity style={styles.button} onPress={() => setShowScanModal(false)}>
                        <Text style={styles.buttonText}>Aceptar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}

              {
                isPosting ? (

                  <View
                    style={{
                      flex: 0.3,
                      marginTop: hp('3%'),
                      marginBottom: hp('0%'),
                    }}
                  >
                    <FullScreenLoader />
                  </View>

                )
                  :
                  <>
                  </>
              }

              {isModalVisible && (
                <Modal
                  transparent={true}
                  animationType="fade"
                  visible={isModalVisible}
                  onRequestClose={() => setModalVisible(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                      {/* <Icon name="alert-circle" size={40} color="#ff5c5c" /> */}
                      <Text style={styles.modalTitle}>Ups!</Text>
                      <Text style={styles.modalMessage}>Usuario o contraseña incorrectos</Text>
                      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                        <Text style={styles.buttonText}>Aceptar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}

              <Layout style={{ height: hp('4%') }} />

              <Layout style={{
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                marginBottom: hp('2%'),
                marginTop: hp('0%'),

              }}>
                <Text style={{ fontWeight: 'bold' }}>
                  ¿Ya tienes una cuenta?
                  {' '}
                </Text>
                <Text
                  style={styles.customText2}
                  status="primary"
                  category="s1"
                  onPress={() => navigation.navigate('LoginScreenNew')}
                >
                  {' '}
                  Iniciar sesión{' '}
                </Text>

              </Layout>


              <Layout style={{
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Text style={{ fontWeight: 'bold' }} >
                  ¿No recuerdas tu Usuario/Contraseña?
                  {' '}
                </Text>
                <Text
                  style={styles.customText2}
                  status="primary"
                  category="s1"
                  onPress={() => navigation.navigate('RecoverData')}
                >
                  {' '}
                  Recuperar Datos{' '}
                </Text>
              </Layout>
            </View>

          </View>
        </Layout>
      </ScrollView>
    </Layout>

  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    backgroundColor: '#ECB30C', // Fondo naranja en la parte superior
    height: hp('25%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveContainer: {
    backgroundColor: '#ECB30C', // Fondo blanco en la parte inferior
    marginTop: -hp('2%'), // Para ajustar la superposición de la onda
    marginBottom: hp('0%'),
  },
  bottomSection: {
    backgroundColor: 'white', // Fondo blanco en la parte inferior
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('-1%'),

  },
  textTitle: {
    fontSize: wp('8%'),
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center'
  },
  textConsigna: {
    fontSize: wp('3.5%'),
    color: 'black',
    /* fontWeight: 'bold', */
    marginBottom: hp('2%'),
    textAlign: 'justify',
  },
  text: {
    fontSize: wp('4%'),
    color: 'black',
    fontWeight: 'bold',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  textQR: {
    fontSize: wp('4%'),
    color: 'black',
    fontWeight: 'bold',
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
    alignSelf: 'center',

  },
  customButton: {
    backgroundColor: '#ECB30C',
    borderColor: '#ECB30C',
    borderRadius: 10,
    marginTop: hp('1%'),
    maxWidth: hp('20%'),
    minWidth: hp('15%'),
  },
  image: {
    width: wp('20%'),
    height: hp('10%'),
    marginBottom: wp('1%'),
    marginTop: 0,
  },
  customText2: {
    color: '#7ba1c3',//color enviado en el pdf de referencia
    /*  color: '#4285F4', */
    fontWeight: 'bold',
    fontSize: wp('4%')
  },
  /* estilos de modal en caso de usuario incorrecto: */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#ff5c5c',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#ff5c5c',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  /* QR: */
  result: {
    marginTop: wp('0.5%'),
    marginBottom: wp('1%'),
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  resultData: {
    fontSize: 16,
    color: '#333',
    alignSelf: 'center',
  },
  /* datos guardados: */
  cajaDatosGuardados: {
    marginTop: hp('0.5%'),
    alignSelf: 'center', // Centra horizontalmente
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center', // Centra elementos
  },
  TextDatosGuardados: {
    fontSize: hp('1.8%'),
   /*  fontWeight: 'bold', */
    marginVertical: 10,
    color: '#4cad18',
    textAlign: 'justify',
    marginTop: hp('0%'),
  },
});
