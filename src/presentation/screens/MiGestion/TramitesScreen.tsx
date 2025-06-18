import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, Pressable, Dimensions, Linking } from 'react-native'
import { globalColors, globalStyles } from '../../theme/theme'
import { FlatList } from 'react-native-gesture-handler'
import { PrimaryButton } from '../../components/shared/PrimaryButton'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParams } from '../../routes/StackNavigator'
import { HamburgerMenu } from '../../components/shared/HamburgerMenu'
import CustomHeader from '../../components/CustomHeader'
import { useAuthStore } from '../../store/auth/useAuthStore'
import { TertiaryButton } from '../../components/shared/TertiaryButton'

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SecondaryButton } from '../../components/shared/SecondaryButton'
import { IonIcon } from '../../components/shared/IonIcon'
import NotiMensajes from '../../components/shared/Noti-mensajes'
import NotiComponent3 from '../../components/shared/NotiComponent3'
import NotiComponent4 from '../mas/NotiComponent4'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios'

interface Familiar {
  email: string;
  name: string;
  documentNumber: string;
  birthDate: string;
  gender: string;
  phone: string;
  credential: string;
/*   tipoPlan: string;
  parentesco: string; */
}

export const TramitesScreen = () => {
  console.log('Entrando a TramitesScreen (Mi Gestion)')

  const { top, bottom } = useSafeAreaInsets();
  const { idAfiliado, setGrupoFamiliar2 } = useAuthStore();

  const [isConsulting, setIsConsulting] = useState(false);
  const [grupoFamiliarDatos, setGrupoFamiliarDatos] = useState<any>([]);
  const [grupoFamiliarCargado, setGrupoFamiliarCargado] = useState(false);

  /* mejorando responsividad: */
  const { height } = Dimensions.get('window');

  let headerHeight = hp('16%'); // Ajusta el tamaño de la cabecera según el alto de la pantalla
  let buttonTextFontSize = wp('4.5%');
  let buttonDescriptionFontSize = wp('4%');
  let cardTitleFontSize: number = hp('2.6%');
  let cardDescriptionFontSize: number = hp('2%');
  let iconNotificationFontSize: number = wp('8%');
  let titleMarginBottom: number = hp('4%');
  let iconMarginBottom: number = hp('7%');
  let arrowMarginBottom: number = hp('4%');
  let adjustedHeaderHeight = headerHeight + top
  if (height < 680) { // IMPORTANTE Pantallas más pequeñas como iPhone SE o iPhone 8 de 5.4 pulgadas o menos aproximadamente 
    headerHeight = hp('17%'); // Ajuste para pantallas más pequeñas
    adjustedHeaderHeight = headerHeight + top;
    buttonTextFontSize = wp('4.8%');
    buttonDescriptionFontSize = wp('4%');
    cardTitleFontSize = hp('3%');
    cardDescriptionFontSize = hp('2.5%');
    iconNotificationFontSize = wp('7%');
    titleMarginBottom = hp('3%');
    iconMarginBottom = hp('6%');
    arrowMarginBottom = hp('3%');
  }

  const [linkAndesSalud, setLinkAndesSalud] = useState("");

  let UrlAndes2 = `https://andessalud.com.ar/appManualUso.pdf`

  let UrlAndes = `https://www.andessalud.com.ar/`

  const handleOpenURLAndes = () => {
    console.log('entrando a descarga de manual de uso');

    setLinkAndesSalud(UrlAndes);
  }


  useEffect(() => {
    const openURLAndesSalud = async () => {
      if (linkAndesSalud) {
        try {
          await Linking.openURL(linkAndesSalud)
        } catch (err) {
          console.log('Error al intentar descargar el manual de uso:', err);
        } finally {

          setLinkAndesSalud('');
        }
      }
    }
    openURLAndesSalud()
  }, [linkAndesSalud])

  const navigation = useNavigation<NavigationProp<RootStackParams>>()

  /*   useEffect(() => {
      setShouldUpdateNotifications(true);
    }, []); */

  /* MODIFICACIONES PARA CARGAR EL GRUPO FAMILIAR ANTES DE PASAR A LA PAGINA DE LLAMANDO AL DOCTOR */
  /* función para adaptar con expresiones regulares la fecha de nacimiento: */
  const fechaNacimientoFormateada = (fechaNacimiento: string): string => {
    if (!fechaNacimiento || typeof fechaNacimiento !== 'string') return ""; // Validación inicial

    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/; // Expresión regular para el formato dd/mm/yyyy
    const match = fechaNacimiento.match(regex);

    return match ? `${match[1]}-${match[2]}-${match[3]}` : ""; // Formatea o retorna un string vacío
  };

  const ConsultaGrupoFamiliar2 = async () => {
    setIsConsulting(true);
    function quitarPrimerosDosYUltimo(valor: number | string): string {
      const valorString = String(valor); // Convertimos el valor a string si no lo es

      if (valorString.length <= 3) {
        return ""; // Si la cadena tiene 3 o menos caracteres, no podemos quitar 2 al inicio y 1 al final
      }

      const nuevoString = valorString.slice(2, -1); // slice(inicio, fin): extrae desde el índice 'inicio' hasta 'fin - 1'

      return nuevoString;
    }
    try {

      console.log('Iniciando consulta para recabar datos del grupo familiar---> ');

      const response = await axios.post(`https://fiscalizacion.createch.com.ar/contratos/identificador?idAfiliado=${idAfiliado}`);

   
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
          /*     owner: false, */
        }));

      /*  setGrupoFamiliarDatos(grupoFamiliarObtenido); */
/*       setGrupoFamiliar2(grupoFamiliarObtenido); */
      /* setGrupoFamiliarCargado(true) */
   /*    console.log('este es el grupoFamiliarObtenido:---x-x-x-x-<<>>>', grupoFamiliarObtenido);
      setIsConsulting(false); */
      return grupoFamiliarObtenido;

    } catch (error) {
      console.error('Error al obtener la info del grupo familiar:', error);
      /* setIsConsulting(false); */
    } finally {
      setIsConsulting(false);
    }
  };


  const ConsultaGrupoFamiliar = async (): Promise<Familiar[]> => {
  setIsConsulting(true);

  function quitarPrimerosDosYUltimo(valor: number | string): string {
    const valorString = String(valor);
    if (valorString.length <= 3) return "";
    return valorString.slice(2, -1);
  }

  try {
    console.log('Iniciando consulta para recabar datos del grupo familiar...');

    const response = await axios.post(
      `https://fiscalizacion.createch.com.ar/contratos/identificador?idAfiliado=${idAfiliado}`
    );

    const data = response.data.data;

    // Si no hay grupo familiar (array vacío), devolver []
    if (!Array.isArray(data) || data.length === 0) {
      console.log('No se encontró grupo familiar para este afiliado.');
      return [];
    }

    // Filtrar para excluir al titular
    const grupoFamiliarFiltrado = data.filter(
      (item: { IdAfiliado: any }) => item.IdAfiliado !== idAfiliado
    );

    // Mapear los datos al tipo Familiar
    const grupoFamiliarObtenido: Familiar[] = grupoFamiliarFiltrado.map((item) => ({
      email: item.mail,
      name: item.apellnombAfilado,
      documentNumber: quitarPrimerosDosYUltimo(item.CUILAfiliado),
      birthDate: fechaNacimientoFormateada(item.fecNac),
      gender: item.sexo,
      phone: item.celular,
      credential: item.nroAfiliado,
    /*   tipoPlan: item.planAfiliado, */
      /* parentesco: item.parentesco, */
    }));

    return grupoFamiliarObtenido;
  } catch (error) {
    console.error('Error al obtener la info del grupo familiar:', error);
    return []; // ✅ También retornamos [] en caso de error
  } finally {
    setIsConsulting(false);
  }
};

/* 
  setGrupoFamiliar2(grupoFamiliarObtenido, () => {
    setGrupoFamiliarCargado(true);
    navigation.navigate('Ingresando');
  }); */


  // Esta es la nueva función que manejará el onPress del botón
const handlePressLlamarDoctor = async () => {
  try {
    const datosParaNavegar = await ConsultaGrupoFamiliar();

    if (datosParaNavegar.length > 0) {
      setGrupoFamiliar2(datosParaNavegar, () => {
        console.log('Grupo familiar seteado correctamente, navegando...');
        navigation.navigate('Ingresando');
      });
    }
  } catch (error) {
    console.error('Error al consultar grupo familiar:', error);
  }
};

const handlePressLlamarDoctor2 = async () => {
  const grupoFamiliarObtenido = await ConsultaGrupoFamiliar();

  // Asegurarse de guardar el grupo, aunque esté vacío
  setGrupoFamiliar2(grupoFamiliarObtenido, () => {
    setGrupoFamiliarCargado(true);

    // Podés agregar un log para confirmar qué se recibió
  /*   console.log('Grupo familiar obtenido:', grupoFamiliarObtenido); */

    // Navegar siempre, incluso si el grupo es vacío
    navigation.navigate('Doctor Online');
  });
};


  return (
    <View style={styles.screenContainer}
    >

      <View style={[styles.headerContainer,
      {
        height: adjustedHeaderHeight,
        display: 'flex',
        flexDirection: 'row'
      }
      ]}>

        <Pressable onPress={() => {
          console.log('presiono el boton ');
          navigation.navigate('HomeScreenUxNew')
        }}
          style={{ marginLeft: wp('3%'), marginBottom: arrowMarginBottom, }}
        >

          <IonIcon name='arrow-back' color={'white'} size={30} />
        </Pressable>




        <View style={{ width: '75%', marginBottom: titleMarginBottom }}>

          <Text style={{
            fontSize: wp('7%'), // Ajuste responsivo para el tamaño del texto
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'white',
            marginLeft: wp('0%'),
            marginBottom: hp('1%'),
          }} >
            Mi Gestión
          </Text>
        </View>

        <View>

          <Pressable onPress={() => {
            console.log('presiono el boton ');
            navigation.navigate('Buzón')
          }}
            style={{ marginLeft: 0, marginBottom: iconMarginBottom, marginRight: wp('3%') }}
          >
            {/* 
            <IonIcon name='notifications-outline' color={'white'} size={35} /> */}

            <NotiMensajes IonIconSize={iconNotificationFontSize} />
          </Pressable>

          {/*   <NotiComponent4/>   */}
          {/*    <NotiComponent3/>  */}
        </View>
      </View>


      <View style={styles.cardContainer} >
        <View style={styles.card}>
          <Text style={{ fontSize: cardTitleFontSize, fontWeight: 'normal', textAlign: 'center', marginBottom: wp('2%'), color: 'black' }}>Autorizaciones</Text>

          <Text style={{
            fontSize: cardDescriptionFontSize,
            textAlign: 'center',
            color: 'black',
          }}>Gestioná todas tus solicitudes</Text>
        </View>
      </View>
      <View style={styles.bigContentContainer} >


        <View style={styles.buttonsContainer} /* style={{ backgroundColor: 'yellow',  marginTop: 40 }} */
        >

          <TertiaryButton
            onPress={() => navigation.navigate('Consulta')}
            label="Solicitar orden de consulta"
            color={globalColors.profile2}
            iconName='people-outline'
            description='Gestioná la orden de tu consulta'
            textSize={buttonTextFontSize}
            descriptionSize={buttonDescriptionFontSize}
          />{/* <ion-icon name="people-outline"></ion-icon> */}


          <TertiaryButton
            onPress={() => navigation.navigate('Estudios')}
            label="Estudios Médicos"
            color={globalColors.profile2}
            iconName='medkit-outline'
            description='Gestioná la orden de tus estudios'
            textSize={buttonTextFontSize}
            descriptionSize={buttonDescriptionFontSize}
          />

          {/*   <TertiaryButton
           onPress={handleOpenURLAndes}
            label="Manual de uso y tutoriales"
            color={globalColors.profile2}
            iconName='extension-puzzle-outline'
            description='Descargá la guía de uso'
            textSize={buttonTextFontSize} 
            descriptionSize={buttonDescriptionFontSize}
          /> */}

          <TertiaryButton
            onPress={() => navigation.navigate('Formularios')}
            label="Obtener Formularios Especiales"
            color={globalColors.profile2}
            iconName='document-text-outline'
            description='Descargá tus formularios'
            textSize={buttonTextFontSize}
            descriptionSize={buttonDescriptionFontSize}
          />

          <TertiaryButton
            onPress={() => handlePressLlamarDoctor2()}
            /* onPress={() => ConsultaGrupoFamiliar()} */
            /*    onPress={() => navigation.navigate('Ingresando')} */
            label="Doctor Online"
            color={globalColors.profile2}
            iconName='person-add-outline'
            description='Comunicate con un especialista'
            textSize={buttonTextFontSize}
            descriptionSize={buttonDescriptionFontSize}
          />


        </View>

        <View>

          <View style={styles.imageContainer}>

            <View
              style={styles.innerContainer}
            >
              <Text style={{
                fontSize: wp('6%'),
                textAlign: 'center',
                color: globalColors.gray,
              }} >
                Andes Salud
              </Text>

              <Image source={require('../../assets/images/logogrisClaro.png')}
                style={styles.image}
                resizeMode="contain" // Ajusta la imagen manteniendo su relación de aspecto
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  )

}
const styles = StyleSheet.create({

  screenContainer: {
    flex: 1,
    paddingHorizontal: 0,
    marginTop: 0,
    /*   backgroundColor: 'violet', */
    zIndex: 0.5,
  },
  headerContainer: {
    zIndex: 0.25,
    width: '100%',
    backgroundColor: '#e1a159',
    /* backgroundColor: globalColors.gray2, */
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  cardContainer: {
    position: 'absolute',
    top: hp('9%'),
    width: wp('97%'),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    paddingHorizontal: 0,
    marginBottom: hp('0%'),
    borderRadius: 20,
  },
  bigContentContainer: {
    flex: 1,
    marginTop: wp('-6%'),
    zIndex: 0.5,
    borderRadius: 15,
    backgroundColor: globalColors.white2
  },
  card: {
    /*  width: '90%', */
    width: wp('90%'),
    /*   padding: '3%', */
    padding: wp('2.5%'),
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonsContainer: {
    zIndex: 1.5,
    marginTop: hp('7%'),
    /*  marginTop: 70, */
    borderRadius: 15,
    marginHorizontal: wp('3%'),
    /*     backgroundColor: 'yellow' */
  },
  imageContainer: {
    marginBottom: hp('1%'),
    marginHorizontal: wp('7%'),
    marginTop: hp('3%'),
    zIndex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '40%',
    minWidth: '50%',
    /* backgroundColor: 'yellow' */
  },
  innerContainer: {
    marginBottom: 15,
    marginTop: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  image: {
    flex: 0.7,
    width: '80%',
    height: '80%',
    margin: 10,
  },
  text: {
    fontSize: 25,
    textAlign: 'center',
  },
});

/*  useEffect(() => {
   navigation.setOptions({
     headerStyle: {
       backgroundColor: globalColors.primary, 
       height: 130,
     },
     headerTintColor: 'white',
     headerTitleStyle: {
       fontSize: 28, 
     },
   })
   }, []); */


/*
let idAfiliadoUsuario = idAfiliado;
if(idAfiliadoUsuario !== undefined){
  const idsFamiliares = ObtenerFamiliares(idAfiliadoUsuario)
  console.log('estos son los idsFamiliares desde el effect de TramitesScreen', idsFamiliares); 
}
else {
  console.error('idAfiliado es undefined. No se puede llamar a ObtenerFamiliares.');
}

} )*/