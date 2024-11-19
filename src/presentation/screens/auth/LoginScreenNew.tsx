import { Layout, Text, Input, Button } from "@ui-kitten/components"
import { Alert, StyleSheet, View, useWindowDimensions, Image, Linking, Modal, TouchableOpacity } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

import { StackScreenProps } from "@react-navigation/stack";

import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth/useAuthStore";
import { MyIcon } from "../../components/ui/MyIcon";
import { RootStackParams } from "../../routes/StackNavigator";
import { FullScreenLoader } from "../../components/ui/FullScreenLoader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Svg, { Path } from 'react-native-svg';
import { Icon } from "react-native-vector-icons/Icon";




interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'> { }


export const LoginScreenNew = ({ navigation }: Props) => {


  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  const [isModalVisible, setModalVisible] = useState(false);

 
  const { loginGonzaMejorado, guardarDatosLoginEnContext, loginGonzaMejorado2, setUserName } = useAuthStore();


  const [isPosting, setIsPosting] = useState(false)
  const [form, setForm] = useState({
    usuario: '',
    email: '',
    password: '',
    dni: '',
  })
  const [linkAndesSalud, setLinkAndesSalud] = useState("");
  let UrlAndes = `https://www.andessalud.com.ar/`

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
      const loginExitoso = await loginGonzaMejorado2(form.usuario, form.password);

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
                  Por favor, ingresa tu Usuario y Contraseña para continuar:
                </Text>
                <Input
                  placeholder="Usuario"
                  style={{ marginBottom: hp('1%'), maxWidth: hp('42%'), minWidth: hp('40%'), borderRadius: 15, alignSelf: 'center', borderColor: '#7ba1c3'/* 'black' */ }}
                  autoCapitalize="none"
                  value={form.usuario}
                  onChangeText={(usuario) => setForm({ ...form, usuario })}
                />
                <Input
                  placeholder="Contraseña"
                  secureTextEntry
                  style={{ marginBottom: hp('1%'), maxWidth: hp('42%'), minWidth: hp('40%'), borderRadius: 15, alignSelf: 'center', borderColor: '#7ba1c3'/* 'black' */ }}
                  value={form.password}
                  onChangeText={(password) => setForm({ ...form, password })}

                />
              </View>
              <Button style={styles.customButton}
                disabled={isPosting}
                onPress={onLoginGonza2}
           /*      onPress={() => navigation.navigate('home')} */
              >
                INGRESAR
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
                marginTop: hp('1%'),

              }}>
                <Text style={{ fontWeight: 'bold' }}>
                  ¿Aún no tienes cuenta? Regístrate en
                  {' '}
                </Text>
                <Text
                  style={styles.customText2}
                  status="primary"
                  category="s1"
                  onPress={handleOpenURLAndes}
                >
                  {' '}
                  Andes Salud{' '}
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
  text: {
    fontSize: wp('4%'),
    color: 'black',
    fontWeight: 'bold',
    marginBottom: hp('2%'),
  },
  customButton: {
    backgroundColor: '#ECB30C',
    borderColor: '#ECB30C',
    borderRadius: 10,
    marginTop: hp('2%'),
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
});
