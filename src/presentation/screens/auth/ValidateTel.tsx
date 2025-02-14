import { Layout, Text, Input, Button } from "@ui-kitten/components"
import { Alert, StyleSheet, View, useWindowDimensions, Image, Linking, Modal, TouchableOpacity, ActivityIndicator, TextInput } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

import { StackScreenProps } from "@react-navigation/stack";

import { useEffect, useRef, useState } from "react";
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
import axios from "axios";
import { xml2js } from 'xml-js';



interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'> { }

type DNIData = {
  numTram: string;
  apellido: string;
  nombre: string;
  dni: string;
  fechNacimiento: string;
  fecEmision: string;
};
type datosMongo = {
  loadedTeléfono: string | null | undefined;
  loadedDni: string | null | undefined;
  loadedIdAfiliado: string | null | undefined;
  error: string | null | undefined;
};
type guardarErrorEnMongo = {
  loadedTeléfono: string | null | undefined;
  loadedDni: string | null | undefined;
  loadedIdAfiliado: string | null | undefined;
  error: string | null | undefined;
};


export const ValidateTel = ({ navigation }: Props) => {

  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  const { guardarDatosLoginEnContext, guardarDatosLoginEnContextMejorada, loginGonzaMejorado2, loginGonzaMejorado3, verificarAfiliado } = useAuthStore();

  const [loadedDni, setLoadedDni] = useState<string | null>(null);
  const [loadedIdAfiliado, setLoadedIdAfiliado] = useState<string | null | undefined>(null);

  const [loadedArea, setLoadedArea] = useState<string | null>(null);
  const [loadedContraseña1, setLoadedContraseña1] = useState<string | null>(null);
  const [loadedTeléfono, setLoadedTeléfono] = useState<string | null | undefined>(null);
  const [loadedAfiliado, setLoadedAfiliado] = useState<string | null>(null);
  const [loadedVerificationCode, setLoadedVerificationCode] = useState<string | null>(null);

  const { idAfiliado, dni, celular, contraseña1, area, verificationCode, setVerificationCode } = useAuthStore();

  /* prueba */
  const [codeExpiration, setCodeExpiration] = useState<number | null>(null); // Nuevo estado
  const [codigoIngresado, setCodigoIngresado] = useState(false); // Nuevo estado
  //useEffect para agregar un timer al código de verificación y que expire

  useEffect(() => {
    setLoadedVerificationCode(verificationCode);

    if (verificationCode) {
      // Establecer tiempo de expiración (5 minutos = 300000 ms)
      const expirationTime = Date.now() + 55000;
      setCodeExpiration(expirationTime);

      const timer = setTimeout(() => {
        // Si el código no se ha verificado, invalidarlo
        if (loadedVerificationCode && !codigoIngresado) {
          setVerificationCode(null);
          setCodigoExpirado(true)
          setCodigoExpiradoModal(true)
          console.log('El código de verificación ha expirado. Solicita uno nuevo.');
          setCodeExpiration(null);
        }

      }, 55000); // 6 segundos

      return () => clearTimeout(timer); // Limpiar el timer si el componente se desmonta o el código se verifica antes de que expire
    }

  }, [verificationCode, setVerificationCode, loadedVerificationCode, codigoIngresado]); // Dependencia de verificationCode

  useEffect(() => {
    setLoadedIdAfiliado(idAfiliado)
    setLoadedDni(dni);
    setLoadedTeléfono(celular);
    setLoadedContraseña1(contraseña1);
    setLoadedArea(area);
    setLoadedAfiliado(null)
    /*   setLoadedVerificationCode(verificationCode) */
    console.log('DNI actualizado------------------->:', dni);
    console.log('celular actualizado------------------->:', celular);
    console.log('contraseña actualizado------------------->:', contraseña1);
    console.log('area actualizado------------------->:', area);
    console.log('verificationCode actualizado------------------->:', verificationCode);
    console.log('idAfiliado actualizado------------------->:', idAfiliado);

  }, [dni, celular, contraseña1, area, celular, loadedAfiliado /* verificationCode */]);

  const [isPosting, setIsPosting] = useState(false)
  const [code, setCode] = useState(['', '', '', '', '', '']); // Array para guardar los dígitos
  const [codigoCorrecto, setCodigoCorrecto] = useState(false);

  const [quitarBoton, setQquitarBoton] = useState(false);
  const [codigoIncorrecto, setCodigoIncorrecto] = useState(false);
  const [codigoIncorrectoModal, setCodigoIncorrectoModal] = useState(false);
  const [codigoExpirado, setCodigoExpirado] = useState(false);
  const [codigoExpiradoModal, setCodigoExpiradoModal] = useState(false);
  const inputs = useRef([]); // Referencia a los inputs


  useEffect(() => {
    // Si el usuario empieza a ingresar un nuevo código, reiniciamos codigoIncorrecto
    setQquitarBoton(false);
  }, []);

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);


    // Pasar al siguiente input si se ingresa un dígito
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const [areaMissing, setAreaMissing] = useState(false);


  const guardarDatosEnMongoDB = async (datos: datosMongo) => {

    /* console.log("ENTRÓ AAA guardarDatosEnMongoDB AHORA A PUNTO DEL POST A GUARDAR-DATOS ========================>:");
    
    const { loadedTeléfono, loadedDni, loadedIdAfiliado } = datos;
    console.log("ENTRÓ AAA guardarDatosEnMongoDB loadedTeléfono, loadedDni y loadedIdAfiliado ========================>:",loadedTeléfono, loadedDni, loadedIdAfiliado); */
    try {
      const fecha = new Date();

      const formateador = new Intl.DateTimeFormat('es-AR', { // 'es-AR' para Argentina
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'America/Argentina/Buenos_Aires' // Zona horaria de Argentina
      });
      const fechaHoraLegible = formateador.format(fecha);

      const response = await axios.post(`https://fincapropia.createch.com.ar/guardarCelular/guardar`, {
        celular: loadedTeléfono,
        dni: loadedDni,
        idAfiliado: loadedIdAfiliado,
        fecha: fechaHoraLegible,
        error: 'Sin errores'
      });

      if (response.status === 201) {
        console.log('Datos guardados en MongoDB!!:', response.data);
        return null;
      } else {
        console.error('Error al guardar datos:', response.data);
        return new Error('Error al guardar datos');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      console.error("Error en la solicitud completo:", error.message, error.response?.data)
      return error;
    }
  };
  const guardarErrorEnMongoDB = async (datos: guardarErrorEnMongo) => {

    console.log("ENTRÓ AAA guardarErrorEnMongoDB ========================>:");
    console.log("datos ========================>:", datos);

    try {
      const fecha = new Date();

      const formateador = new Intl.DateTimeFormat('es-AR', { // 'es-AR' para Argentina
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'America/Argentina/Buenos_Aires' // Zona horaria de Argentina
      });
      const fechaHoraLegible = formateador.format(fecha);

      const response = await axios.post(`https://fincapropia.createch.com.ar/guardarCelular/guardar`, {
        celular: loadedTeléfono,
        dni: loadedDni,
        idAfiliado: loadedIdAfiliado,
        fecha: fechaHoraLegible,
        error: datos
      });

      if (response.status === 201) {
        console.log('Datos del error guardados correctamente en MongoDB!!:', response.data);
        return true;
      } else {
        console.error('Error al guardar datos del error en MongoDB:', response.data);
        return new Error('Error al guardar datos en mongo db');
      }
    } catch (error) {
      console.error('Error en la solicitud a mongo DB:', error);
      console.error("Error en la solicitud a mongo DB completo:", error.message, error.response?.data)
      return error;
    }
  };

  //EDITAR CELULAR EN EL SISTEMA DE FRANCO:
  const editarCelular = async (celular: string | undefined | null, idAfiliado: string | null | undefined) => {

    try {
      /* const pruebaError = '100000' */
      const resultado = await axios.get(`https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/APPActualizaDatosContacto?idAfiliado=${idAfiliado}&mail=&celular=${celular}&calle=&num=&piso=&depto=&idLocalidad=`);

      // Convertir XML a JSON
      const jsonData = xml2js(resultado.data, { compact: true, spaces: 2 });
      // Verificar si la respuesta está completa (puedes ajustar esta condición según la estructura esperada)

      /*  console.log('Datos JSON convertidos PERRO ---------->>:', jsonData); */

      if (jsonData?.Resultado?.fila?.valorDevuelto?._text === '00') {
        console.log('El celular fue modificado con éxito---->>:');
        const misDatos: datosMongo = {
          loadedTeléfono: loadedTeléfono,
          loadedDni: loadedDni,
          loadedIdAfiliado: loadedIdAfiliado,
          error: 'Sin errores'
        };
        console.log("ENTRANDO AAA guardarDatosEnMongoDB========================>:");
        const error = await guardarDatosEnMongoDB(misDatos);
        if (error) {
          console.error("Error al guardar los datos en MONGO DB:error:", error);
          return false;
        } else {
          console.log("Datos guardados correctamente en MONGO DB!");
          return true;
        }
      }
      else {
        console.log("ENTRANDO AL ELSE DE LA FUNCION editarCelular========================>:");
        const datosError = jsonData?.root?.table?.mensaje?._text || 'no se pudo recolectar el mensaje de error'

        console.log("A punto de enviar el mensaje recibido con  guardarErrorEnMongoDB========================>:datosError=>", datosError);

        const resultado = await guardarErrorEnMongoDB(datosError);
        if (resultado === true) {
          console.log("Datos del error guardados correctamente en MONGO DB!");
          return true;
        } else {
          console.error("Error al guardar los datos del Error en MONGO DB (guardarErrorEnMongoDB), el resultado de guardarErrorEnMongoDB--->", resultado);
        }
        console.log('El celular NO fue modificado---->>>:');
        return false
      }
    } catch (error) {
      console.log('Tuvimos inconvenientes inesperados, catch error. el error-->>:', error);
      console.log('El celular NO fue modificado---->>>:');
      return false
    }
  }
  //CREAR USUARIO (NUMERO DE AFILIADO) Y CONTRASEÑA EN EL SISTEMA DE FRANCO (ESTE ENDPOINT HACE AMBAS):
  const editarContraseña = async (contraseña: string | null, idAfiliado: string | null | undefined) => {
    try {
      const respuesta = await axios.get(`https://srvloc.andessalud.com.ar//WebServicePrestacional.asmx/APPRestablecerPass?idAfiliado=${idAfiliado}&pass=${contraseña}&IMEI=`);


      if (respuesta.status === 200) {
        console.log('la contraseña se ha cambiado con éxito! so cra--->');
        return true
      }
      else {
        console.log('la contraseña NO se ha cambiado a revisar-->');
        return false
      }
    } catch (error) {
      console.log('Algo pasó bastante inesperado el error es-->', error);
      return false
    }
  }
  //VERIFICAR EL CÓDIGO ENVIADO AL CELULAR, SI ES CORRECTO SE CONCRETAN TODAS LAS ACCIONES:
  const handleVerifyCode = async () => {
    setIsPosting(true)

    // Validar que todos los campos estén completos
    if (code.some(digit => !digit)) { // Verificar si algún dígito está vacío
      setAreaMissing(true);
      setIsPosting(false);
      return; // Detener la ejecución si falta algún dígito
    }

    const enteredCode = code.join(''); // Unir los dígitos ingresados en un string
    if (enteredCode === loadedVerificationCode) {
      // Código correcto, realizar acciones necesarias!!! ==>>
      console.log('Código correcto!');
      //Verificamos que el DNI ingresado pertenezca a un afiliado : 
      /*    validandoAfiliado() */

      /* establecemos la pass */
      const respuestaCambioContraseña = await editarContraseña(loadedContraseña1, loadedIdAfiliado)
      console.log('respuestaCambioContraseña--->', respuestaCambioContraseña)
      /* editamos el celular: */
      const respuestaEdicion = await editarCelular(loadedTeléfono, loadedIdAfiliado)
      console.log('respuestaEdicion--->', respuestaEdicion)

      setCodigoCorrecto(true)
      setCodigoIngresado(true);
      setIsPosting(false)
      /*  navigation.navigate('LoginScreenNew'); */


    } else {
      // Código incorrecto, mostrar mensaje de error
      setCodigoCorrecto(false)
      setCodigoIncorrecto(true)
      setCodigoIncorrectoModal(true)
      setCodigoIngresado(true);
      setQquitarBoton(true)
      setIsPosting(false)
      console.log('Código incorrecto. Inténtalo de nuevo.');
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

                  Ingresa el código de validación que enviamos al siguiente teléfono: {loadedTeléfono}
                </Text>

                {/*    <View style={styles.result}>
                  <Text style={styles.resultData}>Tus datos: loadedDni: {loadedDni} </Text>
                </View> */}

              </View>

              {/* revisar porque no aparece: */}

              {/*  {!codigoCorrecto || codigoExpirado && (
                <View style={styles.cajaSubtitulos}>

                  <Text style={styles.subtitulos}>
                    Código de verificación:
                  </Text>
                </View>
              )} */}



              {!codigoCorrecto && !codigoIngresado && codeExpiration && Date.now() < codeExpiration ? (
                <>
                  <View style={styles.cajaSubtitulos}>

                    <Text style={styles.subtitulos}>
                      Código de verificación:
                    </Text>
                  </View>

                  <View style={styles.codeContainer}>
                    {code.map((digit, index) => (
                      <TextInput
                        key={index}
                        style={styles.codeInput}
                        keyboardType="numeric"

                        maxLength={1}
                        value={digit}
                        onChangeText={(text) => handleCodeChange(text, index)}
                        ref={(el) => (inputs.current[index] = el)} // Guarda la referencia al input
                      />
                    ))}
                  </View>

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
                </>

              ) : (
                <>
                </>

              )}

              {codigoExpirado && (
                <View style={styles.cajaSubtitulosCodigoExpirado} >
                  <Text style={styles.modalTextCodigoExpirado}>El código de verificación ha expirado. Por favor vuelve al paso anterior para solicitar uno nuevo.</Text>
                </View>
              )}
              {codigoIncorrecto && (
                <View style={styles.cajaSubtitulosCodigoExpirado} >
                  <Text style={styles.modalTextCodigoExpirado}>El código de verificación es incorrecto. Por favor vuelve al paso anterior para solicitar uno nuevo.</Text>
                </View>
              )}

              {codigoCorrecto && (
                <View style={styles.cajaSubtitulosCodigoExpirado} >
                  <Text style={styles.TextVerificacionCorrecta}>¡Verificación correcta!</Text>
                </View>
              )}

              {/* Modal para avisar que las contraseñas no coinciden */}
              {codigoCorrecto && (
                <Modal
                  transparent={true}
                  animationType="fade"
                  visible={codigoCorrecto}
                  onRequestClose={() => setCodigoCorrecto(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.modalTitleExitoso}>
                        ¡Verificación correcta!
                      </Text>
                      <LinearGradient
                        colors={['#509d4f', '#5ab759', '#5ab759', '#5ab759']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.allowButton} onPress={() => navigation.navigate('LoginScreenNew')} >
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


              {codigoIncorrectoModal && (
                <Modal
                  transparent={true}
                  animationType="fade"
                  visible={codigoIncorrectoModal}
                  onRequestClose={() => setCodigoIncorrectoModal(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.modalTitle}>
                        Código incorrecto, por favor intenta nuevamente.
                      </Text>
                      {/* nuevo con gradiente */}
                      <LinearGradient
                        colors={['#509d4f', '#5ab759', '#5ab759', '#5ab759']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.allowButton} onPress={() => setCodigoIncorrectoModal(false)} >
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
              {!codigoCorrecto && codigoExpiradoModal && (
                <Modal
                  transparent={true}
                  animationType="fade"
                  visible={codigoExpirado}
                  onRequestClose={() => setCodigoExpiradoModal(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.modalTitle}>
                        El código ha expirado, por favor repite el proceso e intenta nuevamente.
                      </Text>
                      {/* nuevo con gradiente */}
                      <LinearGradient
                        colors={['#509d4f', '#5ab759', '#5ab759', '#5ab759']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.allowButton} onPress={() => setCodigoExpiradoModal(false)} >
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
              {!codigoExpirado && !quitarBoton && (
                <Button style={styles.customButton}
                  /*     disabled={!codigoCorrecto} */
                  onPress={handleVerifyCode}
                >
                  CONTINUAR
                </Button>
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

              <Layout style={{ height: hp('3%') }} />

              {!codigoCorrecto && (
                <Layout style={{
                  alignItems: 'center',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  marginBottom: hp('2%'),
                  marginTop: hp('0%'),

                }}>

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
              )}



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
  result: {
    marginTop: wp('0.5%'),
    marginBottom: wp('1%'),
    padding: 8,
    backgroundColor: 'green'/* '#fff' */,
    borderRadius: 12,
    elevation: 2,
  },
  resultData: {
    fontSize: 16,
    /*  color: '#322', */
    color: 'black',
    alignSelf: 'center',
    borderRadius: 15,
    borderColor: '#7ba1c3',
    fontWeight: 'bold',
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
  modalTextCodigoExpirado: {
    fontSize: hp('2%'),
    /*  fontWeight: 'bold', */
    marginVertical: 10,
    color: '#ff5c5c',
    textAlign: 'justify',
    marginTop: hp('0%'),
  },
  TextVerificacionCorrecta: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#4cad18',
    textAlign: 'justify',
    marginTop: hp('0%'),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#ff5c5c',
    textAlign: 'center',
  },
  modalTitleExitoso: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#4cad18',
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
  /* estilos de inputs codigo: */
  cajaSubtitulos: {
    marginTop: hp('2%'),
    alignSelf: 'center', // Centra horizontalmente
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center', // Centra elementos
  },
  cajaSubtitulosCodigoExpirado: {
    marginTop: hp('0%'),
    alignSelf: 'center', // Centra horizontalmente
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center', // Centra elementos
  },

  subtitulos: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: hp('1%'),
    textAlign: 'center' // Centra el texto horizontalmente
  },

  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribuye los inputs uniformemente
    alignItems: 'center',
    marginBottom: hp('1%'),
    maxWidth: hp('42%'),
    minWidth: hp('40%'),
    alignSelf: 'center',

  },
  codeInput: {
    width: wp('10%'),
    height: hp('7%'),
    borderRadius: 15,
    borderColor: '#7ba1c3',
    borderWidth: 1,
    fontSize: hp('3%'), // Tamaño de la fuente
    textAlign: 'center', // Texto centrado
    color: 'black'
  },
  /* modal de aviso que el codigo es correcto: */

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
});
