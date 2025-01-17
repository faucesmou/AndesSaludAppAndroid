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


interface Notificacion {
  id: string;
  title: string;
  body: string;
  extraInfo: string;
  timestamp: string;
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

interface Notification {
  timestamp: string;
  [key: string]: any; // Otras propiedades que puedan existir
}

export const NotificacionesGenericas = () => {
  const { idAfiliado } = useAuthStore();
  console.log('idAfiliado es---------------------->:', idAfiliado);


  const { top } = useSafeAreaInsets();
  const [notificaciones, setNotificaciones] = useState([]);
 /*  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]); */

  const [isConsulting, setIsConsulting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [listadoEstMedicosVisible, setListadoEstMedicosVisible] = useState(false);
  const [listadoNotificacionesVisible, setlistadoNotificacionesVisible] = useState(false);

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



  //const response = await axios.get(`https://jqsccdqrh0.execute-api.us-east-1.amazonaws.com/messages/unread`);


  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        setIsConsulting(true)
        const response = await axios({
          method: "get",
          url: "https://dzwytx4yka.execute-api.us-east-1.amazonaws.com/primera/messages",
          data: {}, // Enviar un objeto vacío como body
        });
      
        console.log("Datos recibidos------>:", response.data);
        console.log("Tipo de response.data.body:", typeof response.data.body);
console.log("Contenido de response.data.body:", response.data.body);
        // Asegúrate de que response.data.body sea un array
     /*  const dataNoti = Array.isArray(response.data.body) ? response.data.body : []; */
     
      const dataNoti = JSON.parse(response.data.body)
      console.log("dataNoti--------->>>", dataNoti);
     /*  setNotificaciones(dataNoti); */
      /*   let dataNoti = response.data.body; */
        console.log("response.data.body--EHEH---->:", response.data.body);

            // Ordenar el array por timestamp en orden descendente
    const sortedNoti = dataNoti.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Tomar los primeros 4 objetos más recientes
    const recentNoti = sortedNoti.slice(0, 4);

    console.log("Notificaciones recientes (últimos 4):", recentNoti);


        setNotificaciones(recentNoti);
       /*  console.log("notificaciones--------->>>", notificaciones);
        setIsConsulting(false) */
      } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
        setIsConsulting(false)
      }
    };
    fetchNotificaciones();
  }, [listadoNotificacionesVisible]);

  useEffect(() => {
    if (notificaciones.length > 0) {
      console.log("notificaciones--------->>>", notificaciones);
      setIsConsulting(false);
    }
  }, [notificaciones]); // Se ejecutará cada vez que notificaciones cambie

  useEffect(() => {
    
    console.log("notificaciones actualizado:", notificaciones);
    setIsConsulting(false);
  }, [notificaciones]); // Se ejecutará cada vez que `notificaciones` cambie.



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
  const modifyNotificacionesVisible = () => {
    setlistadoNotificacionesVisible(prevState => !prevState);
  };

  const handlePress = (idOrden: string/* url: string */) => {
    const url = `https://andessalud.createch.com.ar/documento/estudios?idOrden=${idOrden}&idAfiliado=${idAfiliado}`
    console.log('este es el URL: ', url);

    Linking.openURL(url).catch((err) => console.error('Error al abrir el enlace del estudio:', err));
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
  console.log("notificaciones--------->>>", notificaciones); //BORRAR ESTOOOOO----------------------zzz

  return (
      
    <>

      <View style={styles.ContainerEstudiosMedicosTitleAfuera} >
        
        <Pressable
         onPress={() => {
           console.log('se toco el titulo Notificaciones genéricas');
           
           modifyNotificacionesVisible()
         }
         }
        >
          <Text style={styles.titleEstudiosMedicosAfuera} >Notificaciones Andes Salud:</Text>
        </Pressable>
      </View>



      {listadoNotificacionesVisible ? (
        <View style={{ /* marginBottom: 30,  */marginTop: wp('1%'),   /* backgroundColor: 'green', */ maxHeight: '80%', minHeight: '40%', width: '100%', marginHorizontal: wp('9%'),/* wp('4%') */ }}>


          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
          >

            { isConsulting ?
              (
                <View style={styles.LoaderContainer}>
                  <FullScreenLoader />
                </View>
              )
              :
              notificaciones.length === 0 ? (
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

              {/*   <Text style={{
                          marginBottom: wp('2%'),
                          marginTop: 0,
                          fontSize: hp('2%'),
                          textAlign: 'center',
                          color: globalColors.gray2,
                          fontWeight: 'bold',
                          marginHorizontal: wp('9%'),
                        }}>Presiona en las notificaciones para acceder a los detalles:</Text> */}

                      {notificaciones.map((notificacion, index) => (
                        <Pressable
                          /* key={notificacion.id}  */// Usa `id` como clave única
                          key={index}
                          onPress={() => {
                            console.log(`Se tocó en la notificación: ${notificacion.id}`);
                            // Aquí podrías mostrar el modal y pasar `notificacion` como datos
                          }}
                        >
                          <View style={styles.TertiaryButton}>
                            <View style={styles.contentWrapper2}>
                              <View style={styles.textWrapper}>
                                {notificacion.title && (
                                  <Text style={styles.buttonText}>
                                    {notificacion.title}
                                  </Text>
                                )}
                                {notificacion.messageBody && (
                                  <Text style={styles.descriptionText}>
                                    {notificacion.messageBody}
                                  </Text>
                                )}
                                {notificacion.extraInfo && (
                                  <Text style={styles.descriptionText}>
                                    {notificacion.extraInfo}
                                  </Text>
                                )}
                                {notificacion.timestamp && (
                                  <Text style={styles.descriptionText}>
                                    {new Date(notificacion.timestamp).toLocaleString()}
                                  </Text>
                                )}
                              </View>
                            </View>
                          </View>
                        </Pressable>
                      ))}
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
                    <Text style={styles.textStyletTitle}>Notificación: </Text>
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

</>

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
    marginTop: 10,
    marginBottom: 5,
    padding: 5,
    backgroundColor: '#e1a159',
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
    color: 'red',
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
    marginTop: hp('0%'),
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

  /* console.log("Datos recibidos------>:", response.data);
        //verificamos si recibimos un array:

        if (response.data && Array.isArray(response.data.body)) {
          
          const formattedData = response.data.body.map((notificacion: any) => ({
            id: notificacion.messageId,
            title: notificacion.title || "Sin título",
            body: notificacion.messageBody || "Sin mensaje",
            extraInfo: notificacion.extraInfo || "",
            timestamp: notificacion.timestamp || "",
          }));

          console.log("formattedData--------->>>", formattedData);
          setNotificaciones(formattedData);
        } // Guardar las notificaciones formateadas

        else {
          console.error('La respuesta del servidor no es un arreglo válido');
        } */

          
        /* if (response.data && typeof response.data.body === 'string' ) {

          try {
            const parsedData = JSON.parse(response.data.body);
            if (parsedData) { 
          const formattedData = response.data.body.map((notificacion: any) => ({
            id: notificacion.messageId,
            title: notificacion.title || "Sin título",
            body: notificacion.messageBody || "Sin mensaje",
            extraInfo: notificacion.extraInfo || "",
            timestamp: new Date(notificacion.timestamp),
          }));
  
          console.log("formattedData--------->>>", formattedData);
          setNotificaciones(formattedData);
        } else {
          console.error('La respuesta del servidor no contiene datos en la propiedad "body"');
          setNotificaciones([]); 
        }} catch (error) {
          console.error('Error al parsear la respuesta del servidor:', error);
        }
        } else {
          console.error('La respuesta del servidor no es un arreglo válido en la propiedad "body"');
          setNotificaciones(dataNoti);
          console.log("notificaciones--------->>>", notificaciones);
        } */