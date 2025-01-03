import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, ScrollView, StyleSheet, Image, Pressable, Modal, Linking, TouchableOpacity, } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { xml2js } from 'xml-js';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { globalColors } from '../../../theme/theme';
import { RootStackParams } from '../../../routes/StackNavigator';
import CustomHeader from '../../../components/CustomHeader';
import { BackButton } from '../../../components/shared/BackButton';
import { FullScreenLoader } from '../../../components/ui/FullScreenLoader';
import { IonIcon } from '../../../components/shared/IonIcon';
import Divider from '../../../components/shared/Divider';
import { BuzonOrdenesC } from './BuzonOrdenesC';
import { useNotificationStore } from '../../../store/notification-store';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { NotificacionesGenericas } from './NotificacionesGenericas';

interface Notificacion {
  idOrden: string;
  afiliado: string;
  fecSolicitud: string;
  estado: string;
  domicilio?: string;
  fecFinalizacion: string;
  comentarioRechazo?: string;
}
interface Rechazo {
  idOrden: string,
  estado: string;
  comentarioRechazo?: string;
}
interface AutorizadasData {
  palabraClaveENC: string,
  fecVencimientoENC: string;
  nombreConvenio: string;
  domRenglon1: string,
  domRenglon2: string;
  coseguroENC: string;
  prestacionDET: string;
}

export const Buzon = () => {
  const { idAfiliado, actualizacionDisponible } = useAuthStore();
  console.log('El estado de actualizacionDisponible es:::::-->', actualizacionDisponible);
  /*  console.log('idAfiliado es---------------------->:', idAfiliado); */


  const { top } = useSafeAreaInsets();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [isConsulting, setIsConsulting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [listadoEstMedicosVisible, setListadoEstMedicosVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);

  const [modalData, setModalData] = useState<AutorizadasData[]>([]);
  const [rechazoData, setRechazoData] = useState<Rechazo[]>([]);

  // Obtener las notificaciones y la función para actualizarlas del store
  const medicalNotifications = useNotificationStore.getState().medicalNotifications;

  /*  const setMedicalNotifications = useNotificationStore((state) => state.setMedicalNotifications); */


  /*   const notifications = useNotificationStore((state) => state.notifications);
    const setNotifications = useNotificationStore((state) => state.setNotifications); */

  useEffect(() => {
    console.log('Se ha activado el useEffect de Buzon');

    setIsConsulting(true);
    const ProductsRequest = async () => {
      /* let camote = '301936D8-6482-4625-82DD-38A932A4FC5A' */
      try {
        const response = await axios.get(`https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/APPBuzonActualizarORDENPRAC?idAfiliado=${idAfiliado}&IMEI=`);


        const xmlData = response.data;

        // Convertir XML a JSON
        const result = xml2js(xmlData, { compact: true });

        // @ts-ignore
        const notificacionesData = result.Resultado?.tablaDatos;
        /*       console.log('NotificacionesData es :',notificacionesData ); */


        if (notificacionesData === undefined) {
          console.log('En ProductsRequest notificacionesData es undefined: No hay notificaciones para este usuario.');
          setIsConsulting(false);

          return;
        }
        if (!notificacionesData) {
          setError('El formato de los datos recibidos no es el esperado.');
          console.log('En ProductsRequest el formato de los datos recibidos no es el esperado.');
        }

        // Mapear los datos 
        const mappedNotificaciones: Notificacion[] = Array.isArray(notificacionesData.idOrden) ? notificacionesData.idOrden.map((_: any, index: number) => ({
          idOrden: notificacionesData.idOrden[index]?._text || 'pendiente',
          afiliado: notificacionesData.afiliado[index]?._text || 'pendiente',
          fecSolicitud: notificacionesData.fecSolicitud[index]?._text || 'pendiente',
          estado: notificacionesData.estado[index]?._text || 'pendiente',
          fecFinalizacion: notificacionesData.fecFinalizacion[index]?._text || 'pendiente',
          comentarioRechazo: notificacionesData.comentarioRechazo[index]?._text || 'pendiente',
          /*   idOrden: notificacionesData.idOrden[index]._text,
          afiliado: notificacionesData.afiliado[index]._text,
          fecSolicitud: notificacionesData.fecSolicitud[index]._text,
          estado: notificacionesData.estado[index]._text,
          fecFinalizacion: notificacionesData.fecFinalizacion[index]._text,
          comentarioRechazo: notificacionesData.comentarioRechazo[index]._text, */
        })) : [];

        // Primero, definimos una función para convertir las fechas a objetos Date
        const parseDate = (dateString: string) => {
          // Asumimos que la fecha está en formato "DD/MM/YYYY HH:mm:ss"
          const [datePart, timePart] = dateString.split(' ');
          const [day, month, year] = datePart.split('/').map(Number);
          const [hours, minutes, seconds] = timePart.split(':').map(Number);

          // Creamos un objeto Date con los componentes de la fecha
          return new Date(year, month - 1, day, hours, minutes, seconds);
        };
        // Obtenemos la fecha actual
        const now = new Date();
        /* now2 es para hacer pruebas con la fecha: */
        const now2 = new Date(2024, 6, 23, 12, 0, 0); // Año, Mes (0-based), Día, Hora, Minuto, Segundo

        // Calcular la fecha de hace 2 semanas desde 'now'
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        console.log('Fecha de hace 2 semanas:', twoWeeksAgo);
        // Calcular la fecha de hace 1 semana desde 'now'
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        console.log('Fecha de hace 1 semana:', oneWeekAgo);
        const eightWeeksAgo = new Date(now.getTime() - 56 * 24 * 60 * 60 * 1000);

        // Filtramos las notificaciones basándonos en la fecha de vencimiento
        const filteredNotificaciones = mappedNotificaciones.filter((notificacion: Notificacion) => {
          const { fecFinalizacion, idOrden } = notificacion;

          // Aseguramos que el campo de fecha sea válido antes de intentar convertirlo
          if (!fecFinalizacion || typeof fecFinalizacion !== 'string') {
            console.log(`Fecha de finalización no válida para idOrden ${idOrden}. Valor recibido:`, fecFinalizacion);
            return false; // Excluir notificaciones con fechas no válidas
          }

          // Intentamos dividir la fecha en partes
          const fecFinalizacionParts = fecFinalizacion.split(' ');

          if (fecFinalizacionParts.length < 2) {
            console.log(`Fecha de finalización no se pudo parsear correctamente para idOrden ${idOrden}. Fecha recibida:`, fecFinalizacion);
            return false; // Excluir notificaciones con fechas no parseables
          }
          // Aseguramos que el campo de fecha sea válido antes de intentar convertirlo
          /*   if (!notificacion.fecFinalizacion || typeof notificacion.fecFinalizacion !== 'string') {
              console.log(`Fecha de finalización no válida para idOrden ${notificacion.idOrden}. Valor recibido:`, notificacion.fecFinalizacion);
              return false; 
          } */


          /*  este es el que estaba:  const fecFinalizacionDate = parseDate(notificacion.fecFinalizacion); */
          const fecFinalizacionDate = parseDate(fecFinalizacion);

          // Validar que la fecha sea un objeto Date válido
          if (isNaN(fecFinalizacionDate.getTime())) {
            /*  console.warn(`Fecha de finalización no se pudo parsear correctamente para idOrden ${notificacion.idOrden}. Fecha recibida:`, notificacion.fecFinalizacion); */
            return false; // Excluir notificaciones con fechas no parseables
          }
          /*  console.log('fecFinalizacionDate: ', fecFinalizacionDate); */

          /* MOMENTANEO !!!! PUSE 8 SEMANAS EN VEZ DE 2  !!! REVISAR--->-->-------------------------------------------------------------------->>>*/

          return fecFinalizacionDate >= eightWeeksAgo;
          /*  Retenemos solo las notificaciones cuya fecha de vencimiento es igual o posterior a la fecha actual ( return fecFinalizacionDate >= twoWeeksAgo; )
          o a la fecha dos semanas posterior al vencimiento:  return fecFinalizacionDate >= twoWeeksAgo; */
        });

        /* Se ordenan de la mas reciente a la mas antigua: */
        const notificacionesOrdenadas = filteredNotificaciones.reverse();

        // Ordenar las notificaciones por fecha de solicitud (de más reciente a más antigua)
        const notificacionesOrdenadas2 = filteredNotificaciones.sort((a, b) => {

          // Dividir la fecha y hora en partes (como cadenas)
          const [dateAString, timeAString] = a.fecSolicitud.split(' ');
          const [dayAString, monthAString, yearAString] = dateAString.split('/');
          const [hoursAString, minutesAString, secondsAString] = timeAString.split(':');

          const [dateBString, timeBString] = b.fecSolicitud.split(' ');
          const [dayBString, monthBString, yearBString] = dateBString.split('/');
          const [hoursBString, minutesBString, secondsBString] = timeBString.split(':');

          // Convertir las cadenas a números
          const yearA = Number(yearAString);
          const monthA = Number(monthAString) - 1; // Meses en JavaScript comienzan en 0
          const dayA = Number(dayAString);
          const hoursA = Number(hoursAString);
          const minutesA = Number(minutesAString);
          const secondsA = Number(secondsAString);

          const yearB = Number(yearBString);
          const monthB = Number(monthBString) - 1;
          const dayB = Number(dayBString);
          const hoursB = Number(hoursBString);
          const minutesB = Number(minutesBString);
          const secondsB = Number(secondsBString);

          // Crear objetos Date
          const dateObjectA = new Date(yearA, monthA, dayA, hoursA, minutesA, secondsA);
          const dateObjectB = new Date(yearB, monthB, dayB, hoursB, minutesB, secondsB);

          // Comparar las fechas y devolver un número para el ordenamiento
          return dateObjectB.getTime() - dateObjectA.getTime();
        });


        console.log('notificacionesOrdenadas2-->', notificacionesOrdenadas2);
        // Asignamos las notificaciones filtradas al estado
        setNotificaciones(notificacionesOrdenadas2);
        console.log('set Notificaciones. Notificaciones:-->', notificaciones);



        setIsConsulting(false);

      } catch (error) {
        console.error('Error al obtener las notificaciones (ProductsRequest):', error);
        setError('Error al obtener las notificaciones');
        setIsConsulting(false)
      }
    };

    ProductsRequest();

  }, [/* idAfiliado, */ listadoEstMedicosVisible]);

  const PracticaResueltaRequest = async (idOrden: string, estado: string, comentarioRechazo?: string) => {
    console.log('Se activó PracticaResueltaRequest de Buzon. Id de la Consulta Seleccionada->:', idOrden);

    // Importante: no tocar las siguientes constantes llamadas del contexto, son necesarias para contar con la información actualizada del contexto
    const { medicalNotifications, setMedicalNotifications } = useNotificationStore.getState();

    if (estado === 'RECHAZOPRACTICA') {
      console.log('En PracticaResueltaRequest estado === RECHAZOPRACTICA ');
      setIsConsulting(false);
      const rechazoInfo = [{
        idOrden: idOrden,
        estado: 'Esta práctica fue rechazada',
        comentarioRechazo: comentarioRechazo,
      }];
      setRechazoData(rechazoInfo);
      setModalVisible3(true);

      // Actualizamos el contexto para avisar que la notificación fue vista
      const updatedMedicalNotifications = medicalNotifications.map(notification =>
        notification.idOrden === idOrden
          ? { ...notification, visto: 'visto' }
          : notification
      );

      // Actualizar el estado global de las notificaciones de estudios médicos
      setMedicalNotifications(updatedMedicalNotifications);

      return;
    }

    try {
      /* APPDatosPracticaResuelta */
      const response = await axios.get(`https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/APPDatosPracticaResuelta?IMEI=&idOrdenAPP=${idOrden}`);
      const xmlData = response.data;

      // Convertir XML a JSON
      const result = xml2js(xmlData, { compact: true });

      const practicaResueltaData = {
        // @ts-ignore
        tablaEncabezado: result?.root?.tablaEncabezado,
        // @ts-ignore
        tablaDetalle: result?.root?.tablaDetalle,
      };

      if (practicaResueltaData.tablaEncabezado === undefined || practicaResueltaData.tablaDetalle === undefined) {
        console.log('En PracticaResueltaRequest practicaResueltaData tabla encabezado o tabla detalle es undefined: No hay notificaciones para este usuario.');
        setIsConsulting(false);
        setModalVisible2(true);
        return;
      }

      if (!practicaResueltaData) {
        setError('El formato de los datos recibidos no es el esperado.');
        console.log('En PracticaResueltaRequest el formato de los datos recibidos no es el esperado.');
        return;
      }

      console.log('En PracticaResueltaRequest tiene practicaResueltaData------> ', practicaResueltaData);

      // Verificar si practicaResueltaData y sus atributos necesarios están definidos
      if (practicaResueltaData && practicaResueltaData.tablaEncabezado && practicaResueltaData.tablaEncabezado.idOrdenENC) {
        // Aquí comprobamos si idOrdenENC es un array o un objeto
        const idOrdenENCArray = Array.isArray(practicaResueltaData.tablaEncabezado.idOrdenENC)
          ? practicaResueltaData.tablaEncabezado.idOrdenENC
          : [practicaResueltaData.tablaEncabezado.idOrdenENC]; // Si no es array, lo convertimos en uno

        const combinedData = idOrdenENCArray.map((item: any) => ({
          idOrden: item._text,
          idOrdenParcial: practicaResueltaData.tablaEncabezado.idOrdenParcialENC._text || '', // Usamos _text directamente ya que no es un array
          nombreConvenio: practicaResueltaData.tablaEncabezado.nombreConvenioENC._text || '',
          coseguroENC: practicaResueltaData.tablaEncabezado.coseguroENC._text || '',
          palabraClaveENC: practicaResueltaData.tablaEncabezado.palabraClaveENC._text || '',
          fecFinENC: practicaResueltaData.tablaEncabezado.fecFinENC._text || '',
          fecVencimientoENC: practicaResueltaData.tablaEncabezado.fecVencimientoENC._text || '',
          domRenglon1: practicaResueltaData.tablaEncabezado.domRenglon1._text || '',
          domRenglon2: practicaResueltaData.tablaEncabezado.domRenglon2._text || '',

          idOrdenDET: practicaResueltaData.tablaDetalle.idOrdenDET._text || '',
          idOrdenDetalleDET: practicaResueltaData.tablaDetalle.idOrdenDetalleDET._text || '',
          idOrdenParcialDET: practicaResueltaData.tablaDetalle.idOrdenParcialDET._text || '',
          cantidadDET: practicaResueltaData.tablaDetalle.cantidadDET._text || '',
          prestacionDET: practicaResueltaData.tablaDetalle.prestacionDET._text || '',
          coseguroDET: practicaResueltaData.tablaDetalle.coseguroDET._text || '',
        }));
        if (combinedData && combinedData.length > 0) {
          setModalData(combinedData);

          /* 9D29D0A4-3A2F-4FBA-AF43-3727ED1C1ED7 */

        } else {
          console.log('combinedData está vacío o no tiene la estructura esperada.');
        }
        /*  setModalData([combinedData]); */
        console.log('combinedData -->>>>>>>>:', JSON.stringify(combinedData));
        /*   console.log('ModalData -->>>>>>>>:', modalData);  */

        setModalVisible(true);

        // Actualizamos el contexto para avisar que la notificación fue vista
        const updatedMedicalNotifications = medicalNotifications.map(notification =>
          notification.idOrden === idOrden
            ? { ...notification, visto: 'visto' }
            : notification
        );
        console.log('Se actualizó la notificación a visto');

        // Actualizar el estado global de las notificaciones de estudios médicos
        setMedicalNotifications(updatedMedicalNotifications); /* este es el context donde guardamos el cambio*/
        console.log('SE ACTUALIZÓ EL SET MEDICAL NOTIFICATIONS ---');
      } else {
        console.error('practicaResueltaData o idOrdenENC es undefined');
        setModalVisible2(true);
      }
    } catch (error) {
      console.error('Error al obtener las notificaciones (PracticaResueltaRequest):', error);
      setModalVisible2(true);
    }

  };


  const getButtonText = (notificacion: string) => {
    if (notificacion === 'PRACTAUT') {
      return 'Autorizada';
    }
    else if (notificacion === 'AUD') {
      return 'En revisión';
    }
    else if (notificacion === 'RECHAZOPRACTICA') {
      return 'Rechazada';
    }

    return 'Pendiente';
  };
  //este es el original :
  const closeModal = () => {
    setModalVisible(false);
    setModalVisible2(false);
    setModalVisible3(false);
    setModalData([]);
  };
  const modifyEstMedicVisible = () => {
    setListadoEstMedicosVisible(prevState => !prevState);
  };

  const handlePress = (idOrden: string/* url: string */) => {
    const url = `https://andessalud.createch.com.ar/documento/estudios?idOrden=${idOrden}&idAfiliado=${idAfiliado}`
    console.log('este es el URL: ', url);

    Linking.openURL(url).catch((err) => console.error('Error al abrir el enlace del estudio:', err));
  };


  /* Función para solicitar los mensajes guardados de SNS */
  const registerForPushNotifications = async () => {
    try {
    /*   await messaging().requestPermission(); */ // guardar token en el context para obtenerlo aqui.
      /* const token = getToken(); */
      /* console.log('el token obtenido es---->', token) */
      await axios.post('https://dzwytx4yka.execute-api.us-east-1.amazonaws.com/primera/messages',/*  { token } */);
    } catch (error) {
      console.error("Error al obtener o enviar el token FCM:-->", error);
    }
  };

  const exampleModalData = [
    {
      palabraClaveENC: "DG9-M93VFUA5",
      fecVencimientoENC: "31/07/2024 16:29:54",
      nombreConvenio: "TERRAZAS ALTA MEDICINA SA",
      domRenglon1: "Calle: PATRICIAS MENDOCINAS, Nº: 873, ",
      domRenglon2: "MENDOZA - MENDOZA (C.P.:5500)",
      coseguroENC: "0.00",
      prestacionDET: "(Cod: 420169) CONSULTA GINECOLOGICA VESTIDA"
    },
    {
      palabraClaveENC: "FZY-57B64TF9",
      fecVencimientoENC: "31/07/2024 16:29:54",
      nombreConvenio: "A MANO",
      domRenglon1: "Calle: BELTRAN , Nº: 95, ",
      domRenglon2: "MENDOZA - GODOY CRUZ (C.P.:5501)",
      coseguroENC: "0.00",
      prestacionDET: "(Cod: 420101) CONSULTA EN CONSULTORIO"
    },
    {
      palabraClaveENC: "FZY-57B64TF9",
      fecVencimientoENC: "31/07/2024 16:29:54",
      nombreConvenio: "A MANO",
      domRenglon1: "Calle: BELTRAN , Nº: 95, ",
      domRenglon2: "MENDOZA - GODOY CRUZ (C.P.:5501)",
      coseguroENC: "0.00",
      prestacionDET: "(Cod: 420101) CONSULTA EN CONSULTORIO"
    }
    ,
    {
      palabraClaveENC: "FZY-57B64TF9",
      fecVencimientoENC: "31/07/2024 16:29:54",
      nombreConvenio: "A MANO",
      domRenglon1: "Calle: BELTRAN , Nº: 95, ",
      domRenglon2: "MENDOZA - GODOY CRUZ (C.P.:5501)",
      coseguroENC: "0.00",
      prestacionDET: "(Cod: 420101) CONSULTA EN CONSULTORIO"
    }
  ];

  function capitalizeWords(string: string) {
    return string.replace(/\b\w+/g, function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  }
  const color = globalColors.gray;
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  /*  console.log('estas son las notificaciones:', notificaciones); */
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
        marginTop: 0,
        backgroundColor: 'white',
        marginBottom: 0,
      }}
    >
      <CustomHeader /* color={globalColors.black}  */ titleSize={hp('4%')} />

      <BackButton Size={hp('4%')} />

      <View
        style={{
          /* marginBottom: 30, */
          marginBottom: wp('1%'),
          marginTop: 10,
          alignItems: 'center',
          /* backgroundColor: 'orange', */
          maxHeight: '80%',
          minHeight: '80%',
          marginHorizontal: wp('1%')
          /* wp('2%') */
        }}>

        <View style={styles.ContainerMainTitle} >

          {/*  <Text style={styles.MainTitle} >Notificaciones</Text> */}
          {/* <Text style={styles.MainTitle} >Selecciona el tipo de solicitud</Text> */}

          <Text style={{
            marginBottom: wp('1%'),
            marginTop: 0,
            fontSize: hp('3%'),
            textAlign: 'center',
            color: globalColors.gray2,
            fontWeight: 'bold'
          }}>Selecciona el tipo de solicitud</Text>

        </View>

        <View style={styles.ContainerEstudiosMedicosTitleAfuera} >
          <Pressable
            onPress={() => {
              console.log('se toco el titulo estudios medicos');
              modifyEstMedicVisible()
            }
            }
          >
            <Text style={styles.titleEstudiosMedicosAfuera} >Estudios Médicos:</Text>
          </Pressable>
        </View>



        {listadoEstMedicosVisible ? (
          <View style={{ /* marginBottom: 30,  */marginTop: wp('1%'),   /* backgroundColor: 'green', */ maxHeight: '80%', minHeight: '40%', width: '100%', marginHorizontal: wp('9%'),/* wp('4%') */ }}>


            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
            >

              {isConsulting ?
                (
                  <View style={styles.LoaderContainer}>

                    <View style={styles.noDataContainer}>
                      <Text style={styles.noDataText}>
                        Aguardá un momento
                      </Text>
                      <Text style={styles.noDataText}>
                        Esto puede tomar unos segundos
                      </Text>

                    </View>

                    <FullScreenLoader />

                  </View>
                )
                :
                error ? (
                  <>
                    <View style={styles.errorContainerBuzon} >
                      <Text style={styles.titleErrorBuzon} >No tienes notificaciones</Text>

                      <View style={styles.imageContainer}>

                        <View
                          style={styles.innerContainer}
                        >
                          <Image source={require('../../../assets/images/logogris.png')}
                            style={styles.image}
                            resizeMode="contain"
                          />
                        </View>

                      </View>
                    </View>

                  </>
                ) :
                  notificaciones.length > 0 ?
                    (
                      <>
                        <Text style={{
                          marginBottom: wp('2%'),
                          marginTop: 0,
                          fontSize: hp('2%'),
                          textAlign: 'center',
                          color: globalColors.gray2,
                          fontWeight: 'bold',
                          marginHorizontal: wp('9%'),
                        }}>Presiona en las notificaciones para acceder a los detalles:</Text>

                        {notificaciones.map((notificacion, index) => (
                          <Pressable
                            key={index}
                            onPress={() => {
                              console.log('se toco en la notificacion')
                              PracticaResueltaRequest(notificacion.idOrden, notificacion.estado, notificacion.comentarioRechazo)
                            }}

                          >
                            <View style={styles.TertiaryButton}>
                              {/*  <Text style={{ fontSize: 16, textAlign: 'center' }}>{notificacion.afiliado}</Text> */}
                              <View style={styles.contentWrapper2}>
                                <View style={styles.textWrapper}>
                                  {notificacion.afiliado && (
                                    <Text style={styles.buttonText}>
                                      {/* {notificacion.afiliado} */}
                                      {capitalizeWords(notificacion.afiliado)}
                                    </Text>
                                  )}
                                  {notificacion.estado && (
                                    <Text style={styles.descriptionText}>

                                      Estado:{
                                        getButtonText(notificacion.estado)
                                      }
                                    </Text>
                                  )}
                                  {notificacion.fecSolicitud && (
                                    <Text style={styles.descriptionText}>
                                      Solicitud: {notificacion.fecSolicitud}
                                    </Text>
                                  )}
                                </View>

                              </View>

                            </View>
                          </Pressable>
                        )
                        )}
                      </>
                    ) :
                    (
                      <>
                        <View style={styles.errorContainerBuzon} >
                          <Text style={styles.titleErrorBuzon} >No tienes notificaciones</Text>

                          <View style={styles.imageContainer}>

                            <View
                              style={styles.innerContainer}
                            >
                              <Image source={require('../../../assets/images/logogris.png')}
                                style={styles.image}
                                resizeMode="contain"
                              />
                            </View>

                          </View>
                        </View>

                      </>
                    )
              }

              <>
                {modalVisible && (
                  <View style={styles.overlay} />
                )}

                <Modal
                  /*    key={index} */
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={closeModal}
                >

                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.textStyletTitle}>Estudios autorizados: </Text>
                      <ScrollView contentContainerStyle={[styles.scrollViewContent, { flexGrow: 1 }]}>
                        {/*  {modalData.map((data, index) => ( */}
                        {modalData && modalData.map((data, index) => (
                          <>
                            <View
                              key={index}
                              style={{ marginTop: 10 }}>
                              <Text style={styles.textStyleContenedor}>
                                <Text style={styles.textStyleMensajeCodigo}>Compartile este código a tu prestador o clínica para que lo pueda autorizar:</Text>
                              </Text>
                              <Text style={styles.valueCoseguro}>{data.palabraClaveENC}</Text>
                              {/*  <Text style={styles.textStyle}>Codigo Autorización: {data.palabraClaveENC}</Text> */}
                              <Text style={styles.textStyle}>Fec. Vencimiento: {data.fecVencimientoENC}</Text>
                              <Text style={styles.textStyle}>Prestador: {data.nombreConvenio}</Text>
                              <Text style={styles.textStyle}>Dirección:{data.domRenglon1}{data.domRenglon2}</Text>
                              <Text style={styles.textStyleCoseguro}>Coseguro: ${data.coseguroENC}</Text>
                              <Text style={styles.textStylePractica}>Práctica: {data.prestacionDET}</Text>
                              {/* <Text style={styles.textStylePractica}>Id orden: {data.idOrden}</Text> */}

                              {/*    <Text style={styles.textStylePractica}>idOrden: {data.idOrdenDET}</Text> */}

                              {/*   <Text style={styles.textStylePractica}>idOrden: {data.idOrdenDET}</Text> */}

                              <LinearGradient
                                /*  colors={['#ba5050', '#ba5050','#dc7643','#e08050']} */
                                /* colors={[ '#c86443', '#d6783c', '#e08050', '#e88848']} */
                                colors={['#509d4f', '#5ab759', '#5ab759', '#5ab759']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.primaryButton45}>
                                <TouchableOpacity onPress={() => handlePress(data.idOrden)}>
                                  <Text style={styles.buttonText2}>Link de Descarga</Text>
                                </TouchableOpacity>
                              </LinearGradient>

                              {/*  <TouchableOpacity style={styles.primaryButton45} onPress={() => handlePress(data.idOrden)}>
                          <Text style={styles.buttonText2}>
                            Link de Descarga
                          </Text>
                        </TouchableOpacity> */}

                            </View>

                            <Divider />
                          </>
                        ))}
                      </ScrollView>
                      <Pressable
                        style={styles.button}
                        onPress={closeModal}
                      >
                        <Text style={styles.textCloseStyle}>Cerrar</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
              </>
              <>
                {modalVisible3 && (
                  <View style={styles.overlay} />
                )}

                <Modal
                  /*    key={index} */
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible3}
                  onRequestClose={closeModal}
                >

                  <View style={styles.centeredView}>
                    <View style={styles.modalViewEstudioRechazado}>
                      <Text style={styles.textStyletTitle}>Estudio rechazado: </Text>
                      <ScrollView contentContainerStyle={[styles.scrollViewContent, { flexGrow: 1 }]}>
                        {rechazoData.map((data, index) => (
                          <>
                            <View key={index} style={{ marginTop: 10, marginBottom: 20 }}>

                              <Text style={styles.textStyleOrdenRechazada}>Estado: {data.estado}</Text>
                              {/*  <Text style={styles.textStyleOrdenRechazada}>Detalle:</Text>   */}
                              <Text style={styles.textStyleMensajeCodigo}>Detalle: {data.comentarioRechazo}</Text>
                              <Text style={styles.textStyleOrdenRechazada}>idOrden: {data.idOrden}</Text>

                            </View>

                            <Divider />
                          </>
                        ))}
                      </ScrollView>
                      <Pressable
                        style={styles.button}
                        onPress={closeModal}
                      >
                        <Text style={styles.textCloseStyle}>Cerrar</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
              </>
              <>
                {modalVisible2 && (
                  <View style={styles.overlay} />
                )}

                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible2}
                  onRequestClose={closeModal}
                >

                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.textStyletTitlePracticaNoEncontrada}>No se encontró la solicitud de práctica indicada</Text>
                      <Text style={styles.textStyletTitlePracticaNoEncontrada}>Por favor intente nuevamente más tarde</Text>
                      <Pressable
                        style={styles.button}
                        onPress={closeModal}
                      >
                        <Text style={styles.textCloseStyle}>Cerrar</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
              </>
            </ScrollView>

          </View>
        ) :
          <></>
        }


        <BuzonOrdenesC />
        {/*  <NotificacionesGenericas/>  */}

        {actualizacionDisponible && (
          <View style={styles.ContainerEstudiosMedicosTitleAfuera} >
            <Pressable
              onPress={() => {
                console.log('se tocó el titulo actualizar');
                Linking.openURL('https://play.google.com/store/apps/details?id=com.ar.andessalud.andessalud')
              }
              }
            >
              <Text style={styles.titleEstudiosMedicosAfuera}  >
                Actualizar App
              </Text>
            </Pressable>
          </View >
          /*  <View style={styles.ContainerEstudiosMedicosTitleAfuera} >
            <Pressable
              onPress={() => {
                console.log('se toco el titulo estudios medicos');
                modifyEstMedicVisible()
              }
              }
            >
              <Text style={styles.titleEstudiosMedicosAfuera} >Estudios Médicos:</Text>
            </Pressable>
          </View> */
        )}

<View style={styles.ContainerEstudiosMedicosTitleAfuera} >
            <Pressable
              onPress={() => {
                console.log('se tocó el titulo actualizar');
                Linking.openURL('https://play.google.com/store/apps/details?id=com.ar.andessalud.andessalud')
              }
              }
            >
              <Text style={styles.titleEstudiosMedicosAfuera}  >
                Consultar Notificaciones!
              </Text>
            </Pressable>
          </View >

      </View >
    </View >
  );
};


const styles = StyleSheet.create({
  imageContainer: {
    marginBottom: wp('8%'),
    marginHorizontal: wp('3%'),
    marginTop: 0,
    /*    zIndex: 1.5, */
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: wp('20%'),
    minWidth: wp('20%'),
    maxHeight: wp('20%'),
    /* maxWidth:'50%', */
    /* backgroundColor: 'blue', */

  },
  innerContainer: {
    marginBottom: wp('3%'),
    marginTop: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    /* backgroundColor: 'green', */
  },
  image: {
    /*   flex: 1, */
    width: '100%',
    height: '100%',
    margin: 10,
  },

  LoaderContainer: {
    backgroundColor: 'white',
    minWidth: '80%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    padding: 10,
    margin: 5,
    marginBottom: 10,
    marginTop: 90,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  //ESTILOS PARA LAS NOTIFICACIONES (COPIADOS DE TERTIARY BUTTON):
  TertiaryButton: {
    backgroundColor: 'white',
    minWidth: '80%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    padding: 10,
    margin: 5,
    marginBottom: 10,
    marginHorizontal: wp('9%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  TertiaryButtonNotifications: {
    backgroundColor: 'white',
    minWidth: '80%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    padding: 10,
    margin: 5,
    marginBottom: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  textWrapper: {
    flex: 1,
    paddingRight: 5,
  },
  iconWrapper: {
    justifyContent: 'flex-end',
    marginLeft: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: hp('1.9%'),
    /* fontSize: 18, */
    fontWeight: 'normal',
  },
  descriptionText: {
    color: 'gray',
    fontSize: hp('1.9%'),
  },
  errorContainerBuzon: {
    marginTop: hp('1%'),
    marginBottom: wp('1%'),
    padding: 10,
    /*    backgroundColor: 'violet', */
    borderRadius: 5,
    marginHorizontal: 35,
  },
  ContainerMainTitle: {
    marginTop: 0,
    marginBottom: 10,
    padding: 5,
    backgroundColor: 'white'/* '#d7e5f8' */,
    borderRadius: 5,
    marginHorizontal: 20,
    minWidth: '100%',
    maxWidth: '100%',
  },
  ContainerEstudiosMedicosTitleAfuera: {
    marginTop: 5,
    marginBottom: wp('0%'),
    padding: 5,
    backgroundColor: '#e1a159'/* '#fbd1a5' *//* globalColors.earthYellow2  *//* brown2 *//* 'brown' *//* '#97e3b0' *//* '#d7e5f8' */,
    borderRadius: 15,
    borderWidth: 0,
    borderColor: globalColors.earthYellow2,
    marginHorizontal: 10,
    minWidth: '80%',
    maxWidth: '80%',
  },
  ContainerEstudiosMedicosTitle: {
    marginTop: 10,
    marginBottom: 5,
    padding: 5,
    backgroundColor: '#db9a79'/* '#d7e5f8' */,
    borderRadius: 5,
    marginHorizontal: 35,
  },

  ContainerOrdenConsultaTitle: {
    marginTop: 10,
    marginBottom: 5,
    padding: 5,
    backgroundColor: '#97b7f1'/* '#d7e5f8' */,
    borderRadius: 5,
    marginHorizontal: 20,
  },
  titleErrorBuzon: {
    marginBottom: 5,
    fontSize: 18,
    fontFamily: 'Quicksand-Light',
    textAlign: 'center',
    marginHorizontal: 20,
    color: 'black'
  },
  titleEstudiosMedicos: {
    marginBottom: 5,
    fontSize: 20,
    fontFamily: 'Quicksand-Light',
    textAlign: 'center',
  },
  MainTitle: {
    marginBottom: hp('1%'),
    fontSize: hp('2.4%'),
    fontFamily: 'Quicksand-Light',
    textAlign: 'center',
    /*    backgroundColor:'blue', */
    minWidth: '100%',
    color: 'black'
  },
  titleEstudiosMedicosAfuera: {
    marginBottom: 5,
    fontSize: hp('2.5%'),
    fontFamily: 'Quicksand-Light',
    textAlign: 'center',
    /*    backgroundColor:'blue', */
    minWidth: '100%',
    color: 'white',
    fontWeight: 'bold',
  },
  titleOrdenConsulta: {
    marginBottom: 5,
    fontSize: 20,
    fontFamily: 'Quicksand-Light',
    textAlign: 'center',
  },
  SinNotificacionesContainerBuzon: {
    marginTop: 20,
    padding: 30,
    borderRadius: 5,
  },
  SinNotificacionesTitleBuzon: {
    marginBottom: 5,
    fontSize: 25,
    fontFamily: 'Quicksand-Light',
    textAlign: 'center',
  },
  //estilos para el MODAL :
  modalView: {
    margin: 20,
    marginTop: '20%',
    backgroundColor: 'white'/* globalColors.gray3 */,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 2, // Asegúrate de que el modal esté por encima del overlay
    width: '80%', // Ajusta el ancho según sea necesario
    maxHeight: '60%', // Ajusta la altura según sea necesario
  },
  modalViewEstudioRechazado: {
    margin: 20,
    marginTop: '20%',
    backgroundColor: 'white'/* globalColors.gray3 */,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 10,
    zIndex: 2, // Asegúrate de que el modal esté por encima del overlay
    width: '80%',
    maxHeight: '40%',
  },
  // altura del scrollView: 
  scrollViewContent: {
    flexGrow: 0,
  },
  button: {
    borderRadius: 25,
    borderColor: 'gray',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderWidth: 0.3,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'normal',
    /*  textAlign: 'justify', */
    marginTop: 7,
  },
  textStyleContenedor: {
    color: 'black',
    fontWeight: 'normal',
    marginTop: 7,
  },
  textStyleMensajeCodigo: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'justify',
    marginTop: hp('0.5%'),
    fontSize: 14,
  },
  valueCoseguro: {
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 7,
  },
  textStyleOrdenRechazada: {
    color: 'black',
    /* fontWeight: 'normal', */
    fontWeight: 'bold',
    /*     textAlign: 'justify', */
    marginTop: 7,
  },
  textStyletTitle: {
    color: 'black',
    /*  fontWeight: 'normal', */
    fontWeight: 'bold',
    textAlign: 'justify',
    marginTop: 4,
    fontSize: 20,

  },
  textStyletTitlePracticaNoEncontrada: {
    color: 'black',
    fontWeight: 'normal',
    textAlign: 'center',
    marginTop: 4,
    fontSize: 18,
    marginBottom: 5,
  },
  textStylePractica: {
    color: 'black',
    fontWeight: 'bold',
    marginTop: 7,
    marginBottom: hp('0.5%'),
    fontSize: 13,
  },
  textStyleCoseguro: {
    color: '#cf6c2f',
    fontWeight: 'normal',
    textAlign: 'justify',
    marginTop: 7,
    /*   lineHeight: 10, */
  },
  textCloseStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  //estilos para lograr un background borroso cuando esta el modal:
  overlay: {
    position: 'absolute',
    overflow: 'hidden',
    /*  top: 0, */
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(196, 193, 193, 0.15)', // Fondo semitransparente
    borderRadius: 20,
    zIndex: 1, // Asegúrate de que esté por debajo del modal
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton45: {
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 5,
    margin: hp('1%'),
    marginTop: hp('1%'),
    marginBottom: 15,
    marginHorizontal: wp('1%'),
    paddingHorizontal: wp('1%'),
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center'
  },
  buttonText2: {
    color: 'white',
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  noDataContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: wp('5%'),
    marginTop: wp('0%'),
  },
  noDataText: {
    fontSize: wp('4%'),
    color: 'gray',
    textAlign: 'center',
    marginTop: wp('0%'),
  },

});

//Actualizamos el contexto para avisar que la notificacion fue vista
//esto modifica a todas en VISTO falta adaptar para que modifique solo la que abre el usuario:
/*   const updatedNotifications = notifications.map(notification =>
    notification.idOrden === idOrden 
    ? { ...notification, visto:'visto'}
    :
    notification
  )
  
  setNotifications(updatedNotifications); */ /* este es el context */


/*  idOrdenParcial: practicaResueltaData.tablaEncabezado.idOrdenParcialENC[index]._text,
   nombreConvenio: practicaResueltaData.tablaEncabezado.nombreConvenioENC[index]._text,
   coseguroENC: practicaResueltaData.tablaEncabezado.coseguroENC[index]._text,
   palabraClaveENC: practicaResueltaData.tablaEncabezado.palabraClaveENC[index]._text,
   fecFinENC: practicaResueltaData.tablaEncabezado.fecFinENC[index]._text,
   fecVencimientoENC: practicaResueltaData.tablaEncabezado.fecVencimientoENC[index]._text,
   domRenglon1: practicaResueltaData.tablaEncabezado.domRenglon1[index]._text  || '',
   domRenglon2: practicaResueltaData.tablaEncabezado.domRenglon2[index]._text || '',

   idOrdenDET: practicaResueltaData.tablaDetalle.idOrdenDET[index]._text,
   idOrdenDetalleDET: practicaResueltaData.tablaDetalle.idOrdenDetalleDET[index]._text,
   idOrdenParcialDET: practicaResueltaData.tablaDetalle.idOrdenParcialDET[index]._text,
   cantidadDET: practicaResueltaData.tablaDetalle.cantidadDET[index]._text,
   prestacionDET: practicaResueltaData.tablaDetalle.prestacionDET[index]._text,
   coseguroDET: practicaResueltaData.tablaDetalle.coseguroDET[index]._text, */

/*  if (practicaResueltaData &&   practicaResueltaData.tablaEncabezado && practicaResueltaData.tablaDetalle) */