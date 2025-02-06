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





interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'> { }

type DNIData = {
  numTram: string;
  apellido: string;
  nombre: string;
  dni: string;
  fechNacimiento: string;
  fecEmision: string;
};


export const ValidateTel = ({ navigation }: Props) => {

  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  const { guardarDatosLoginEnContext, guardarDatosLoginEnContextMejorada, loginGonzaMejorado2, loginGonzaMejorado3,  } = useAuthStore();

  const [loadedDni, setLoadedDni] = useState<string | null>(null);
 
  const [loadedArea, setLoadedArea] = useState<string | null>(null);
  const [loadedContraseña1, setLoadedContraseña1] = useState<string | null>(null);
  const [loadedTeléfono, setLoadedTeléfono] = useState<string | null>(null);
  const [loadedVerificationCode, setLoadedVerificationCode] = useState<string | null>(null);

  const { dni, celular, contraseña1, area, verificationCode} = useAuthStore();

  useEffect(() => {
    setLoadedDni(dni);
    setLoadedTeléfono(celular);
    setLoadedContraseña1(contraseña1);
    setLoadedArea(area);
    setLoadedVerificationCode(verificationCode)
    console.log('DNI actualizado------------------->:', dni); 
    console.log('celular actualizado------------------->:', celular); 
    console.log('contraseña actualizado------------------->:', contraseña1); 
    console.log('area actualizado------------------->:', area); 
    console.log('verificationCode actualizado------------------->:', verificationCode); 

  }, [dni, celular, contraseña1, area, celular, verificationCode]);

  const [isPosting, setIsPosting] = useState(false)

  const [code, setCode] = useState(['', '', '', '', '', '']); // Array para guardar los dígitos
    const inputs = useRef([]); // Referencia a los inputs

    const handleCodeChange = (text, index) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Pasar al siguiente input si se ingresa un dígito
        if (text && index < 5) {
            inputs.current[index + 1].focus();
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

                  Ingresa el código de validación que enviamos a tu teléfono: {loadedVerificationCode}
                </Text>

                <View style={styles.result}>
                  <Text style={styles.resultData}>Tus datos: {loadedDni} {loadedContraseña1} {loadedTeléfono} </Text>
                  {/*  <Text style={styles.resultData} >DNI: {dni}</Text> */}
                </View>

              </View>



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

              <Button style={styles.customButton}
                /* disabled={!isFormComplete} */
               
              >
                CONTINUAR
              </Button>

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
   color:'black',
    alignSelf: 'center',
    borderRadius: 15,
    borderColor: '#7ba1c3',
    fontWeight: 'bold',
  },
  /* cajaSubtitulos: {
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
  }, */
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
  /* estilos de inputs codigo: */
  cajaSubtitulos: {
    marginTop: hp('2%'),
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
});
