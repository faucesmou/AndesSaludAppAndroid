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
  const [grupoFamiliarDatos, setGrupoFamiliarDatos] = useState<any>([]); // Estado para 
  const [grupoFamiliarCargado, setGrupoFamiliarCargado] = useState(false);

  
  // almacenar los datos del grupo familiar

  /* función para adaptar con expresiones regulares la fecha de nacimiento: */
/*   const fechaNacimientoFormateada = (fechaNacimiento: string): string => {
    if (!fechaNacimiento || typeof fechaNacimiento !== 'string') return ""; // Validación inicial

    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/; // Expresión regular para el formato dd/mm/yyyy
    const match = fechaNacimiento.match(regex);

    return match ? `${match[1]}-${match[2]}-${match[3]}` : ""; // Formatea o retorna un string vacío
  }; */

/*   useEffect(() => {

    console.log('este es el mail:', mail);
    console.log('este es el nombreCompleto:', nombreCompleto);
    console.log('este es el dni:', dni);
    console.log('este es el sexo:', sexo);
    console.log('este es el numCelular:', numCelular);
    console.log('este es el tipoPlan:', tipoPlan);
    console.log('este es el numeroCredencial:', numeroCredencial);
    console.log('este es el grupoFamiliarDatos:', grupoFamiliarDatos);

    
    if (!nombreCompleto || !dni || !sexo || !numCelular || !tipoPlan || !numeroCredencial || isConsulting || !fecNacimiento || mounted) {
      console.log('Esperando que todas las constantes estén definidas para consultar familiar...');
      return;
     
    }
    console.log('Estan todas las constantes definidas iniciando la primera petición grupo familiar...');
  

    setIsConsulting(true);
    setMounted(true);  



    const ConsultaGrupoFamiliar = async () => {


      function quitarPrimerosDosYUltimo(valor: number | string): string {
        const valorString = String(valor); 

        if (valorString.length <= 3) {
          return ""; 
        }

        const nuevoString = valorString.slice(2, -1); 

        return nuevoString;
      }
      try {

        console.log('Iniciando consulta para recabar datos del grupo familiar---> ');

        const response = await axios.post(`https://fiscalizacion.createch.com.ar/contratos/identificador?idAfiliado=${idAfiliado}`);

        console.log('consulta  grupo familiar response.data ---> ', response.data);
        const grupoFamiliarFiltrado = response.data.data.filter(
          (item: { nroAfiliado: any; IdAfiliado: any }) => item.IdAfiliado !== idAfiliado
        );


        const grupoFamiliarObtenido = grupoFamiliarFiltrado.map((item:
          {
            apellnombAfilado: any;
            nroAfiliado: any;
            idAfiliado: any
            CUILAfiliado: any;
            sexo: any
            celular: any;
            planAfiliado: any;
            mail: any;
            parentesco: any;
            fecNac: any;
          }) => ({
            email: item.mail,
            name: item.apellnombAfilado,
            documentNumber: quitarPrimerosDosYUltimo(item.CUILAfiliado),
            birthDate: fechaNacimientoFormateada(item.fecNac),
            gender: item.sexo,
            phone: item.celular,
            credential: item.nroAfiliado,
            tipoPlan: item.planAfiliado,
            parentesco: item.parentesco,
                owner: false,
          }));


        setGrupoFamiliarDatos(grupoFamiliarObtenido);
        setIsConsulting(false);
        setGrupoFamiliarCargado(true)
        


      } catch (error) {
        console.error('Error al obtener la info del grupo familiar:', error);
     
      } finally {
        setIsConsulting(false);
      }
    };
    ConsultaGrupoFamiliar()

  }, [idAfiliado, nombreCompleto, dni, sexo, numCelular, tipoPlan, numeroCredencial, mounted]) */

  /* console.log('entrando a ingresoLAD y este es el grupoFamiliar----->>>:', grupoFamiliar); */

 /*  useEffect(() => {

    console.log('este es el mail:', mail);
    console.log('este es el nombreCompleto:', nombreCompleto);
    console.log('este es el dni:', dni);
    console.log('este es el sexo:', sexo);
    console.log('este es el numCelular:', numCelular);
    console.log('este es el tipoPlan:', tipoPlan);
    console.log('este es el numeroCredencial:', numeroCredencial);
    console.log('este es el grupoFamiliar:', grupoFamiliar);

   
    if (!nombreCompleto || !dni || !sexo || !numCelular || !tipoPlan || !numeroCredencial || isConsulting || !fecNacimiento || !grupoFamiliar ||  mounted) {
      console.log('Esperando que todas las constantes estén definidas para consultar url de ingreso...');
      return;
   
    }
    console.log('Estan todas las constantes definidas iniciando la segunda petición ...');
  

    setIsConsulting(true);
    setMounted(true); 

    

    const LlamandoAlDocRequest = async () => {

   
      try {
        const body = {
          "provider": "67d9c78739efc64afafe205c",
          "email": mail,
          "name": nombreCompleto,
          "documentNumber": dni,
          "birthDate": fecNacimiento,
          "gender": sexo,
          "phone": numCelular,
          "plan": tipoPlan,
          "credential": numeroCredencial,
            "owner": true,
          "externalId": "666",
          "zipCode": "77036",
          "familyGroup": grupoFamiliarDatos,
        }

        console.log('El body quedó así======>>>:', body);

        const response = await axios.post(`https://dev.api.llamandoaldoctor.com/patient/token`, body, {
          headers: {
            'Content-Type': 'application/json'
          }
        }
        );

        console.log('este es el response de la obtención del token', response);
        const token = response.data.token;
        console.log('este es el token', token);
      
        setTokenListo(token);
        setIsConsulting(false);

      } catch (error: any) {
        console.error('Error al obtener los datos del afiliado:', error);
        const errorMessage = error.response?.data || 'no hay mensaje de error'
        console.log('este es el errorMessage no conseguimos token maestro:', errorMessage);
        setShowErrorMessage(true);

      } finally {
        setIsConsulting(false);
      }
    };
    LlamandoAlDocRequest()

  }, [nombreCompleto, dni, sexo, numCelular, tipoPlan, numeroCredencial, grupoFamiliar, mounted]); */

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
    return;
  }

  setMounted(true);
  setIsConsulting(true);

  const LlamandoAlDocRequest = async () => {

    const normalizarTelefono = (telefono: string): string => {
  return telefono.startsWith('549') ? telefono.slice(3) : telefono;
};
    const body = {
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
      familyGroup: grupoFamiliar,
   /*    plan: tipoPlan, */
    };

    /* console.log('Body para solicitud LAD:=======>', body); */

    try {
      const response = await axios.post(
        'https://dev.api.llamandoaldoctor.com/patient/token',
        body,
        { headers: { 'Content-Type': 'application/json' } }
      );
      const token = response.data.token;
      setTokenListo(token);
    } catch (error: any) {
      console.error('Error al obtener token LAD:', error);
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

/* consultarGrupoFamiliarDatos: async idAfiliado => {
   try {
     console.log('Iniciando consulta para recabar datos---> ');
        console.log('USUARIO----------------->', USUARIO);
     console.log('--> el PASSWORD es:', PASSWORD);
     console.log('--> el ADMINISTRADORA es:', ADMINISTRADORA);
     console.log('--> el idAfiliado es:', idAfiliado);
 
     const respuestaFrancoMejorada = await axios.get(
       `https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/consultarAfiliadoJson?usuario=${USUARIO}&password=${PASSWORD}&administradora=${ADMINISTRADORA}&datosAfiliado=${idAfiliado}`,
     );
 
     if (
       respuestaFrancoMejorada &&
       respuestaFrancoMejorada.data &&
       respuestaFrancoMejorada.data.length > 0
     ) {
       const idAfiliado = respuestaFrancoMejorada.data[0].idAfiliado;
       const idAfiliadoTitular =
         respuestaFrancoMejorada.data[0].idAfiliadoTitular;
       const cuilTitular = respuestaFrancoMejorada.data[0].cuilTitular;
       const nombrePila = respuestaFrancoMejorada.data[0].nombre;
 
       const nombreCompleto = respuestaFrancoMejorada.data[0].apellNomb;
       const numeroCredencial = respuestaFrancoMejorada.data[0].nroAfiliado;
       const tipoPlan = respuestaFrancoMejorada.data[0].planPrestacional;
       const estadoAfiliacion = respuestaFrancoMejorada.data[0].estadoAfiliacion;
       const tipoPago = respuestaFrancoMejorada.data[0].tipoPago;
       const numCelular = respuestaFrancoMejorada.data[0].numCelular;
       const mail = respuestaFrancoMejorada.data[0].mail;
       const sexo = respuestaFrancoMejorada.data[0].sexo;
       const dni = respuestaFrancoMejorada.data[0].nroDocumento;
       const fecNacimiento = respuestaFrancoMejorada.data[0].fecNac;
 
       if (
         idAfiliado != undefined &&
         idAfiliadoTitular != undefined &&
         cuilTitular != undefined
       ) {
         
       } else {
         console.error(
           'no se pudo obtener datos de los familiares',
         );
         return false;
       }
     } else {
       console.log(
         'respuestaFrancoMejorada && respuestaFrancoMejorada.data && respuestaFrancoMejorada.data.length no es mayor a 0',
       );
       console.error('No se encontraron datos perro');
       return false;
     }
   } catch (error) {
     console.error(
       'Error al consultar datos y guardarlos en useState',
       error,
     );
     return false;
   }
 }, */


/* useEffect(() => {
 const obtenerDatosGrupoFamiliar = async () => {
   console.log('Entrando a obtenerDatosGrupoFamiliar...');
   try {
     const grupoFamiliar = await consultarGrupoFamiliarDatos(idAfiliado);
     setGrupoFamiliarDatos(grupoFamiliar);
     console.log('Este es el grupo familiar perrito:', grupoFamiliar);
   } catch (error) {
     console.error('Error al obtener grupo familiar: error>', error);
   }
 };
 
 obtenerDatosGrupoFamiliar();
}, [idAfiliado]); */