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
import LinearGradient from 'react-native-linear-gradient';
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


export const RegisterTel = ({ navigation }: Props) => {

  /* QR: */



  const [scannedData, setScannedData] = useState('');

  const [isScanSuccessful, setIsScanSuccessful] = useState(false);
  const [showScanError, setShowScanError] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);

  /* const [form, setForm] = useState({ usuario: '', password: '' }); */

  /*   const handleScanComplete = (data: DNIData) => {
      setScannedData(data);
      console.log('scannedData=====>>>===>>', scannedData);
  
    }; */

  const handleScanComplete = (data: DNIData) => {
    if (data && data.dni) {
      console.log('documento escaneado con éxito perrrisonnnn');
      setScannedData(data);
      setIsScanSuccessful(true);
      setShowScanError(false);
    } else {
      console.log('error al escanear el documento');

      /*   setScannedData(null); */
      setIsScanSuccessful(false);
      setShowScanError(true);
    }
  };

  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  const [isModalVisible, setModalVisible] = useState(false);


  const { loginGonzaMejorado, guardarDatosLoginEnContext, guardarDatosLoginEnContextMejorada, loginGonzaMejorado2, setUserName, loginGonzaMejorado3 } = useAuthStore();
  /*  const { loadAuthDataFromStorage } = AuthStore(); */

  /* const { dni } = useAuthStore(); */

  const [loadedDni, setLoadedDni] = useState<string | null>(null);
  const { dni } = useAuthStore();

  useEffect(() => {
    setLoadedDni(dni);
    console.log('DNI actualizado------------------->:', dni); // Para depuración
  }, [dni]);


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
    dni: loadedDni,
    area: '',
    celular: '',
    contraseña1: '',
    contraseña2: '',
  })

  const [isFormComplete, setIsFormComplete] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordsMatchModal, setPasswordsMatchModal] = useState(false);

  const [areaMissing, setAreaMissing] = useState(false);
  const [celularMissing, setCelularMissing] = useState(false);
  const [contraseña1Missing, setContraseña1Missing] = useState(false);
  const [contraseña2Missing, setContraseña2Missing] = useState(false);



  useEffect(() => {
    // Verifica si todos los campos están completos
    const allFieldsComplete = Object.values(form).every(value => value !== '');
    setIsFormComplete(allFieldsComplete);

    // Verifica si las contraseñas coinciden
    setPasswordsMatch(form.contraseña1 === form.contraseña2);

  }, [form]); // El efecto se ejecuta cuando el formulario cambia

  const handleContinue = () => {

    // Reiniciamos los estados de campos faltantes antes de verificar
    setAreaMissing(false);
    setCelularMissing(false);
    setContraseña1Missing(false);
    setContraseña2Missing(false);

    if (isFormComplete && passwordsMatch) {
      console.log('se tocó en continuar y va bien');

    } else {
      // Puedes mostrar un mensaje de error o realizar alguna acción adicional
      if (!passwordsMatch) {
        console.log('se activa el modal de contraseñas no coinciden');
        setPasswordsMatchModal(true)
      } else {

        // Verifica qué campos faltan y activa los estados correspondientes
        if (form.area === '') setAreaMissing(true);
        if (form.celular === '') setCelularMissing(true);
        if (form.contraseña1 === '') setContraseña1Missing(true);
        if (form.contraseña2 === '') setContraseña2Missing(true);

        /*  alert("Por favor, complete todos los campos."); */
        console.log('se activa mensaje de complete todos los campos');
      }
    }
  };



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

                  Ahora necesitamos que registres tu teléfono:
                </Text>

                <View style={styles.result}>
                  <Text style={styles.resultData}>Número de Documento: {loadedDni}</Text>
                  {/*  <Text style={styles.resultData} >DNI: {dni}</Text> */}
                </View>

              </View>



              <View style={styles.cajaSubtitulos}>

                <Text style={styles.subtitulos}>
                  Celular:
                </Text>
              </View>

              <View style={{
                flexDirection: 'row',
                alignItems: 'flex-start', // Alinea los elementos en la parte superior
                marginBottom: hp('1%'),
                maxWidth: hp('42%'),
                minWidth: hp('40%'),
                alignSelf: 'center',
              }}>
                <View style={{ flex: 1, marginRight: wp('1%') }}>
                  <Input
                    placeholder="261"
                    style={{
                      borderRadius: 15,
                      borderColor: '#7ba1c3',
                    }}
                    keyboardType="numeric"
                    maxLength={4}
                    value={form.area}
                    onChangeText={(area) => setForm({ ...form, area })}
                  />
                  <Text style={{
                    fontSize: 12,
                    color: 'gray',
                    marginTop: hp('0.5%'),
                    marginLeft: hp('0.7%'),
                  }}>Sin el 0</Text>

                  {areaMissing && (
                    <Text style={{
                      /* flex:wp('0.2%'), */
                      flex: 1,
                      fontSize: 12,
                      color: 'red',
                      marginTop: hp('0%'),
                      marginLeft: hp('0.7%'),
                      textAlign: 'justify',
                    }}>Campo obligatorio</Text>
                  )
                  }


                </View>

          
            

                <View style={{ flex: 2 }}>

                  <Input
                    placeholder="199046"
                    style={{
                      borderRadius: 15,
                      borderColor: '#7ba1c3',
                    }}
                    keyboardType="numeric"
                    maxLength={8}
                    value={form.celular}
                    onChangeText={(celular) => setForm({ ...form, celular })}
                  />
                  <View style={{ flexDirection: 'row', /* backgroundColor:'green', */ }}>
                    <Text style={{
                      fontSize: 12,
                      color: 'gray',
                      marginTop: hp('0.5%'),
                      marginLeft: hp('0.7%'),
                    }}>Sin el 15   </Text>

                    {celularMissing && (
                      <Text style={{
                        fontSize: 12,
                        color: 'red',
                        marginTop: hp('0.5%'),
                        marginLeft: hp('0.7%'),
                      }}>Campo obligatorio</Text>
                    )
                    }
                  </View>
                </View>
              </View>


              <View style={styles.cajaSubtitulos}>

                <Text style={styles.subtitulos}>
                  Contraseña:
                </Text>
              </View>
              <Input
                placeholder="Ingresá tu contraseña"
                style={{
                  flex: 1,
                  marginBottom: hp('0.5%'),
                  maxWidth: hp('40%'),
                  minWidth: hp('40%'),
                  borderRadius: 15,
                  alignSelf: 'center',
                  borderColor: '#7ba1c3',
                }}
                autoCapitalize="none"
                value={form.contraseña1}
                onChangeText={(contraseña1) => setForm({ ...form, contraseña1 })}
              />
              <View style={{ flexDirection: 'row', /* backgroundColor:'green', */ marginHorizontal: wp('5%'), marginTop: hp('0%'), }}>

                {contraseña1Missing && (
                  <Text style={{
                    /* flex:wp('0.2%'), */
                    flex: 1,
                    fontSize: 12,
                    color: 'red',
                    marginTop: hp('0%'),
                    marginLeft: hp('0.7%'),
                    textAlign: 'justify',
                  }}>Campo obligatorio</Text>
                )
                }
              </View>



              <View style={styles.cajaSubtitulos}>

                <Text style={styles.subtitulos}>
                  Confirmar contraseña:
                </Text>
              </View>
              <Input
                placeholder="Confirmá tu contraseña"
                style={{
                  flex: 1,
                  marginBottom: hp('0%'),
                  maxWidth: hp('40%'),
                  minWidth: hp('40%'),
                  borderRadius: 15,
                  alignSelf: 'center',
                  borderColor: '#7ba1c3',
                }}
                autoCapitalize="none"
                value={form.contraseña2}
                onChangeText={(contraseña2) => setForm({ ...form, contraseña2 })}
              />
              <View style={{ flexDirection: 'row', /* backgroundColor:'green', */ marginHorizontal: wp('5%'), marginTop: hp('0%'), }}>

                {contraseña2Missing && (
                  <Text style={{
                    /* flex:wp('0.2%'), */
                    flex: 1,
                    fontSize: 12,
                    color: 'red',
                    marginTop: hp('0%'),
                    marginLeft: hp('0.7%'),
                    textAlign: 'justify',
                  }}>Campo obligatorio</Text>
                )
                }
              </View>
              {/* Modal para la llamar por teléfono */}
              {passwordsMatchModal && (
                <Modal
                  transparent={true}
                  animationType="fade"
                  visible={passwordsMatchModal}
                  onRequestClose={() => setPasswordsMatchModal(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.modalTitle}>
                        Las contraseñas ingresadas no coinciden
                      </Text>
                      {/* nuevo con gradiente */}
                      <LinearGradient
                        colors={['#509d4f', '#5ab759', '#5ab759', '#5ab759']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.allowButton} onPress={() => setPasswordsMatchModal(false)} >
                          <Text style={styles.buttonText}>
                            Aceptar
                          </Text>
                        </TouchableOpacity>
                      </LinearGradient>

                    </View>
                  </View>

                </Modal>
              )
              }



              <Button style={styles.customButton}
                /* disabled={!isFormComplete} */
                onPress={handleContinue}
              >
                CONTINUAR
              </Button>
              {/* /* onPress={() => navigation.navigate('LoginScreenNew')} */
          /*  onPress={() => { handleSendCode(); navigation.navigate('home'); }} */}

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
                      <Text style={styles.modalMessage}>Debe completar todos los datos para continuar.</Text>
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

              <Layout style={{ height: hp('3%') }} />

              <Layout style={{
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                marginBottom: hp('2%'),
                marginTop: hp('0%'),

              }}>
                {/*  <Text style={{ fontWeight: 'bold' }}>
                  ¿Aún no tienes cuenta? Regístrate en
                  {' '}
                </Text> */}
                <Text
                  style={styles.customText2}
                  status="primary"
                  category="s1"
                  /*    onPress={handleOpenURLAndes} */
                  onPress={() => navigation.navigate('Registro')}
                >
                  {' '}
                  Volver{' '}
                </Text>

              </Layout>

              {/*   <Layout style={{
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
              </Layout> */}

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
    color: '#3b3937',
    fontWeight: 'bold',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  cajaSubtitulos: {
    /*  backgroundColor: 'green', */
    maxWidth: hp('40%'),
    minWidth: hp('40%'),
    marginLeft: hp('0.7%'),
    marginBottom: hp('0.5%'),
  },
  subtitulos: {
    fontSize: wp('3.5%'),
    color: '#3b3937',
    fontWeight: 'bold',
    textAlign: 'left',
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
    fontSize: wp('5%')
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
    textAlign: 'center',
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
    textAlign: 'center',
  },
  /* QR: */
  result: {
    marginTop: wp('0.5%'),
    marginBottom: wp('1%'),
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  /*  style={{ marginBottom: hp('1%'), maxWidth: hp('42%'), minWidth: hp('40%'), borderRadius: 15, alignSelf: 'center', borderColor: '#7ba1c3' }} */

  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  resultData: {
    fontSize: 16,
    color: '#322',
    alignSelf: 'center',
    borderRadius: 15,
    borderColor: '#7ba1c3',
    fontWeight: 'bold',
  },
  /* modal de aviso contraseñas no coinciden */

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
    maxWidth: 100,
  },
  /*   modalOverlay2: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer2: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 15,
      marginHorizontal:wp('5%'),
      maxWidth:wp('80%'),
      minWidth:wp('75%')
    },
    modalTitle2: {
      fontSize: hp('2.2%'),
      fontWeight: 'bold',
      alignSelf:'center',
       marginBottom:10,
      textAlign:'center',
      color: '#3b3937',
    }, */
});
