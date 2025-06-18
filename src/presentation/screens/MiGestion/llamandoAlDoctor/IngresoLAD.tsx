import React, { useEffect, useState } from 'react'
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import axios from 'axios'
/* import { globalColors, globalStyles } from '../../theme/theme' */
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RootStackParams } from '../../../routes/StackNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { HamburgerMenu } from '../../../components/shared/HamburgerMenu';
import CustomHeader from '../../../components/CustomHeader';
import { BackButton } from '../../../components/shared/BackButton';
import { FullScreenLoader } from '../../../components/ui/FullScreenLoader';
import { globalColors } from '../../../theme/theme';
import { RouteProp, useRoute } from '@react-navigation/native';


export const IngresoLAD = () => {
  console.log('entrando a IngresoLAD----->>>:');
  const {
    /*   consultarGrupoFamiliarDatos, */
    idAfiliado,
    nombreCompleto,
    dni,
    numeroCredencial,
    tipoPlan,
    numCelular,
    mail,
    sexo,
    fecNacimiento,
    grupoFamiliar,
  } = useAuthStore();



  
  const navigation = useNavigation<NavigationProp<RootStackParams>>()

  const { top } = useSafeAreaInsets();
  const [tokenListo, setTokenListo] = useState(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [botonHabilitado, setBotonHabilitado] = useState(false);

  
   useEffect(() => {
  const ready =
    nombreCompleto &&
    dni &&
    sexo &&
    numCelular &&
    tipoPlan &&
    numeroCredencial &&
    fecNacimiento &&
    grupoFamiliar &&
/*     !isConsulting && */
    !mounted;

  if (!ready) {
    console.log('Esperando datos necesarios...');
     console.log('tipoPlan para solicitud LAD dentro del !ready:=======>', tipoPlan);
    return;
  }

  setMounted(true);
  setIsConsulting(true);

  const LlamandoAlDocRequest = async () => {

    console.log('tipoPlan para solicitud LAD:=======>', tipoPlan);

    const normalizarTelefono = (telefono: string): string => {
  return telefono.startsWith('549') ? telefono.slice(3) : telefono;
};

const simplificarTipoPlan = (tipoPlan: string): string => {
  if (!tipoPlan) return "DESCONOCIDO";

  const palabrasClave = [
    "TITANIUM",
    "BLACK",
    "PLATINUM",
    "GOLD",
    "PLAN JOVEN",
    "GREEN",
    "PMO",
    "OTR"
  ];

  const tipoEnMayusculas = tipoPlan.toUpperCase();

  for (const palabra of palabrasClave) {
    if (tipoEnMayusculas.includes(palabra)) {
      return palabra;
    }
  }

  return "DESCONOCIDO";
};


const tipoPlanSimple = simplificarTipoPlan(tipoPlan);

    console.log('tipoPlanSimple :=======>', tipoPlanSimple);

    const body: any = {
      /* provider para subir a producción: */

 /* provider para entorno de pruebas: */
 provider: '67d9c78739efc64afafe205c',
      email: mail,
      name: nombreCompleto,
      documentNumber: dni,
      birthDate: fecNacimiento,
      gender: sexo,
      phone: normalizarTelefono(numCelular),
      credential: numeroCredencial,
    /*   externalId: '666',
      zipCode: '77036', */
    /*   familyGroup: grupoFamiliar, */
      /* plan: tipoPlan, */
    };

   

      // Condicionalmente agregar familyGroup si el array no está vacío
  if (Array.isArray(grupoFamiliar) && grupoFamiliar.length > 0) {
    body.familyGroup = grupoFamiliar;
  }

  if (tipoPlanSimple) {
  body.plan = tipoPlanSimple;
}

   console.log(
     'Body para solicitud LAD:=======> después de la verificación: en proceso chequear=======>',
     body,
   );

    try {
      const response = await axios.post(
        /* endpoint para producción: */
        'https://api.llamandoaldoctor.com/patient/token ',

        /* endpoint para desarrollo: */
       /*  'https://dev.api.llamandoaldoctor.com/patient/token', */
        body,
        {headers: {'Content-Type': 'application/json'}},
      );
      const token = response.data.token;
      setTokenListo(token);
    } catch (error: any) {
      console.error('Error al obtener token LAD:', error);

        if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Detalles de la respuesta de error de la API:');
      console.error('Código de estado (Status):', error.response.status);
      console.error('Datos de respuesta (Data):', error.response.data); // Esto es lo más importante para ver el mensaje de error del servidor
      console.error('Cabeceras de respuesta (Headers):', error.response.headers);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta (ej. no hay red, CORS)
      console.error('La solicitud fue hecha pero no se recibió respuesta:', error.request);
    } else {
      // Algo sucedió al configurar la solicitud que disparó un error
      console.error('Error al configurar la solicitud:', error.message);
    }

      setShowErrorMessage(true);
    } finally {
      setIsConsulting(false);
    }
  };

  LlamandoAlDocRequest();
}, [
  nombreCompleto,
  dni,
  sexo,
  numCelular,
  tipoPlan,
  numeroCredencial,
  mail,
  fecNacimiento,
  grupoFamiliar,
  mounted,
]);

  useEffect(() => {
    if (tokenListo && typeof tokenListo === 'string' /* && tokenListo.trim() !== '' */) {
      setBotonHabilitado(true);
    }
  }, [tokenListo]);


  const PeticionIngresoSistema2 = async () => {
    if (!tokenListo) {
      console.log('Token no disponible aún. Esperando...');
      return;
    }

    const url = `https://dev.app.llamandoaldoctor.com/?token=${tokenListo}`;
   /*  console.log('Intentando abrir URL:', url); */

    // Validamos que la URL sea válida y que se pueda abrir
    try {
      const puedeAbrirse = await Linking.canOpenURL(url);

      if (!puedeAbrirse) {
        console.log('Advertencia: canOpenURL devolvió false, pero se intentará abrir igual.');
        /*  return; */
      }

      // Intentamos abrir la URL
      await Linking.openURL(url);
      console.log('URL abierta correctamente');
    } catch (error: any) {
      console.error('Error al intentar abrir la URL:', error);

      if (axios.isAxiosError(error)) {
        console.log('AxiosError.message:', error.message);
     /*         console.log('AxiosError.config:', error.config);
        console.log('AxiosError.response:', error.response); */
      } else {
        console.log('Error desconocido:', error);
      }

      setShowErrorMessage(true); // Si tenés algún feedback en pantalla
    }
  };

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
      <CustomHeader /* color={globalColors.gray2}  */ titleSize={28} />
      <BackButton onPress={() => navigation.navigate('home')} />
      <Text style={{
        marginBottom: wp('2%'),
        marginTop: hp('2%'),
        fontSize: hp('3.2%'),
        textAlign: 'center',
        color: globalColors.gray2,
        fontWeight: 'bold'
      }}>Comunicate con tu Doctor</Text>
      {
        isConsulting ? (
          <>

            <View

              style={styles.waitingContainer}
            >
              <View style={styles.containerMessage}>
                <View style={styles.containerEpigrafe} >
                  <Text style={styles.epigrafeMessage}>Aguardá un momento por favor</Text>
                  <Text style={styles.epigrafeMessage}>Estamos procesando tu solicitud</Text>
                </View>
                <View style={styles.containerEpigrafe2} >
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
                  <Text style={styles.titleMessage}>No se pudo cargar la información de llamando al doctor</Text>
                  <Image source={require('../../../assets/images/400ErrorBadRequest-bro.png')} style={styles.errorImage} />
                </View>
                <View
                  style={{
                    marginTop: 10,
                    backgroundColor: '#FFFFFF',
                    marginHorizontal: wp('5%'),
                    alignContent: 'center',
                    alignItems: 'center',

                  }}
                >

                  <Text style={{ marginBottom: 5, fontSize: wp('4%'), color: '#595960' }}>Tuvimos inconvenientes para procesar tu solicitud por favor intenta nuevamente más tarde o comunicate con nuestros asesores</Text>

                </View>
              </>
            ) :
              (

                <View
                  style={styles.successContainer}
                >
                  <View style={styles.textContainer}>

                    <Text style={styles.titleMessage}
                    >¡Todo Listo!</Text>

                    <Text style={{ marginBottom: 5, fontSize: hp('2.1%'), marginTop: 10, color: '#595960', justifyContent: 'center' }}>Ingresá al siguiente link para comunicarte:</Text>

                    <TouchableOpacity
                      style={styles.primaryButton45}
                      onPress={PeticionIngresoSistema2}
                      disabled={!botonHabilitado}
                    >

                      <Text style={styles.buttonTextLink}>
                        {botonHabilitado ? 'Ingresar al sistema' : 'Aguardá un momento...'}
                      </Text>
                    </TouchableOpacity>



                  </View>
                  <View style={styles.imageContainer}>

                    <Image source={require('../../../assets/images/logoAndesSaludRedondo4.png')} style={styles.successImage} />

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
    marginHorizontal: wp('3%'),
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
    justifyContent: 'center'
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
    marginHorizontal: wp('3%'),
  },
  containerMessage: {
    marginTop: 15,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  titleMessage: {
    /* fontSize: 22, */
    fontSize: hp('3%'),
    marginTop: 10,
    marginBottom: 5,
    color: '#030136',
    fontWeight: 'bold',
    marginHorizontal: 0,
    /*  justifyContent:'center' */
  },
  epigrafeMessage: {
    fontSize: 20,
    marginTop: 0,
    marginBottom: 5,
    alignSelf: 'center',
    color: '#030136',
    fontWeight: 'bold',

  },
  containerEpigrafe: {
    /*  fontSize: 18, */
    marginTop: 0,
    marginBottom: 5,
    alignSelf: 'center',
    textAlign: 'center',
    color: '#595960',
  },
  containerEpigrafe2: {
    /*  fontSize: 18, */
    marginTop: 15,
    marginBottom: 5,
    alignSelf: 'center',
    textAlign: 'center',
    color: '#595960',
  },
  epigrafeMessage2: {
    fontSize: 17,
    marginTop: 3,
    marginBottom: 5,
    alignSelf: 'center',
    color: '#595960',
    textAlign: 'center'
  },
  successImage: {
    width: 150,
    height: 150,
    marginBottom: 5,
  },
  errorImage: {
    width: 220,
    height: 220,
    marginBottom: 5,
  },
  primaryButton45: {
    backgroundColor: '#0e77e7',
    borderRadius: 17,
    padding: 7,
    margin: 10,
    marginTop: 10,
    marginBottom: 15,
    marginHorizontal: 60,
    paddingHorizontal: 10,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center'

  },
  buttonTextLink: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
})

