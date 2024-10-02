import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, ScrollView, StyleSheet, Image, Pressable, Modal } from 'react-native';
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
import { useNotificationStore } from '../../../store/notification-store';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';



interface Notificacion {
  idOrden: string;
  prestador: string;
  dom1Prestador: string;
  dom2Prestador: string;
  codAutorizacion: string;
  fecSolicitud: string;
  fecVencimiento: string;
  afiliado: string;
  codEstado: string;
  coseguro: string;

}
interface Rechazo {
  idOrden: string,
  estado: string;
  comentarioRechazo: string;
  nombrePrestacion:string;
}
interface AutorizadasData {

  idOrden: string;
  estado: string;
  codAutorizacion: string;
  nombrePrestacion: string;
  comentarioRechazo: string;
  fecVencimiento: string;
  prestador: string;
  dom1Prestador: string;
  dom2Prestador: string;
  afiliado: string;
  coseguro: string;
}


type Notification = {
  idOrden: string;
  visto: string;
};

interface NotificacionData {
  idOrden: string;
  prestador: string;
  dom1Prestador: string;
  dom2Prestador: string;
  codAutorizacion: string;
  fecSolicitud: string;
  fecVencimiento: string;
  afiliado: string;
  codEstado: string;
  coseguro: string;
  nombrePrestacion: string;
  cantidad: string;
  coseguroPrestacion: string;
}

export const BuzonOrdenesC = () => {



  const { idAfiliado } = useAuthStore();
  const { top } = useSafeAreaInsets();

  const [notificacionesOrdenConsulta, setNotificacionesOrdenConsulta] = useState<NotificacionData[]>([]);

  const [isConsulting, setIsConsulting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [listadoEstMedicosVisible, setListadoEstMedicosVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);

  const [modalData, setModalData] = useState<AutorizadasData[]>([]);
  const [rechazoData, setRechazoData] = useState<Rechazo[]>([]);


  // Obtener las notificaciones y la función para actualizarlas del store
 /*  const orderNotifications = useNotificationStore.getState().orderNotifications; */
/*   const setOrderNotifications = useNotificationStore((state) => state.setOrderNotifications); */
const { orderNotifications, setOrderNotifications } = useNotificationStore.getState();
/*   const notifications = useNotificationStore((state) => state.notifications);
  const setNotifications = useNotificationStore((state) => state.setNotifications); */

  useEffect(() => {
    console.log('Se ha activado el useEffect de BuzonOrdenesC');
    setIsConsulting(true);

    const CombinedData2 = async () => {
      
      try {
        setIsConsulting(true);
        const response = await axios.get(`https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/APPBuzonActualizarORDENAMB?idAfiliado=${idAfiliado}&IMEI=`);

        const xmlData = response.data;
        const result = xml2js(xmlData, { compact: true });
  
        // Extraer datos de tablaDatos y tablaDetalle
        //@ts-ignore
        const tablaDatos = result.Resultado?.tablaDatos;
         //@ts-ignore
        const tablaDetalle = result.Resultado?.tablaDetalle;
        

        if (!tablaDatos || !tablaDetalle) {
          console.log('En CombinedData tablaDatos o tablaDetalle es undefined: No hay datos disponibles.');
          setIsConsulting(false);
          /*   setModalVisible2(true); */
          return;
        }

   /*      function extractData(data: any[]): string[] {
          return data ? data.map((item: any) => (item._text || '').trim()) : [];
        } */

        // Definir y verificar los datos extraídos
        const idOrden = tablaDatos.idOrden ? tablaDatos.idOrden.map((item: any) => (item._text || '').trim()) : [];
        const prestador = tablaDatos.prestador ? tablaDatos.prestador.map((item: any) => (item._text || '').trim()) : [];
        const dom1Prestador = tablaDatos.dom1Prestador ? tablaDatos.dom1Prestador.map((item: any) => (item._text || '').trim()) : [];
        const dom2Prestador = tablaDatos.dom2Prestador ? tablaDatos.dom2Prestador.map((item: any) => (item._text || '').trim()) : [];
        const codAutorizacion = tablaDatos.codAutorizacion ? tablaDatos.codAutorizacion.map((item: any) => (item._text || '').trim()) : [];
        const fecSolicitud = tablaDatos.fecSolicitud ? tablaDatos.fecSolicitud.map((item: any) => (item._text || '').trim()) : [];
        const fecVencimiento = tablaDatos.fecVencimiento ? tablaDatos.fecVencimiento.map((item: any) => (item._text || '').trim()) : [];
        const afiliado = tablaDatos.afiliado ? tablaDatos.afiliado.map((item: any) => (item._text || '').trim()) : [];
        const codEstado = tablaDatos.codEstado ? tablaDatos.codEstado.map((item: any) => (item._text || '').trim()) : [];
        const coseguro = tablaDatos.coseguro ? tablaDatos.coseguro.map((item: any) => (item._text || '').trim()) : [];

        const idOrdenDetalle = tablaDetalle.idOrdenDetalle ? tablaDetalle.idOrdenDetalle.map((item: any) => (item._text || '').trim()) : [];
        const nombrePrestacion = tablaDetalle.nombrePrestacion ? tablaDetalle.nombrePrestacion.map((item: any) => (item._text || '').trim()) : [];
        const descripcionPrestacion = tablaDetalle.descripcionPrestacion ? tablaDetalle.descripcionPrestacion.map((item: any) => (item._text || '').trim()) : [];
        const montoPrestacion = tablaDetalle.montoPrestacion ? tablaDetalle.montoPrestacion.map((item: any) => (item._text || '').trim()) : [];
        const codPrestacion = tablaDetalle.codPrestacion ? tablaDetalle.codPrestacion.map((item: any) => (item._text || '').trim()) : [];

        // Crear un array combinado
        const combinedData = idOrden.map((id, index) => ({
          idOrden: id,
          prestador: prestador[index] || '',
          dom1Prestador: dom1Prestador[index] || '',
          dom2Prestador: dom2Prestador[index] || '',
          codAutorizacion: codAutorizacion[index] || '',
          fecSolicitud: fecSolicitud[index] || '',
          fecVencimiento: fecVencimiento[index] || '',
          afiliado: afiliado[index] || '',
          codEstado: codEstado[index] || '',
          coseguro: coseguro[index] || '',
          // Agregar datos de tablaDetalle
          idOrdenDetalle: idOrdenDetalle[index] || '',
          nombrePrestacion: nombrePrestacion[index] || '',
          descripcionPrestacion: descripcionPrestacion[index] || '',
          montoPrestacion: montoPrestacion[index] || '',
          codPrestacion: codPrestacion[index] || ''
        }));

     /*    console.log('Datos combinados----------------------------->>>:', combinedData);  */

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
        const now2 = new Date(2024, 7, 15, 12, 0, 0); // Año, Mes (0-based), Día, Hora, Minuto, Segundo

        // Calcular la fecha de hace 2 semanas desde 'now'
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
   /*      console.log('Fecha de hace 2 semanas:', twoWeeksAgo); */
        // Calcular la fecha de hace 1 semana desde 'now'
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
/*         console.log('Fecha de hace 1 semana:', oneWeekAgo); */

        // Filtramos las notificaciones basándonos en la fecha de vencimiento
        const filteredNotificaciones = combinedData.filter((notificacion: Notificacion) => {
          const fecFinalizacionDate = parseDate(notificacion.fecVencimiento);
       /*    console.log('fecFinalizacionDate: ', fecFinalizacionDate); */
          return fecFinalizacionDate >= twoWeeksAgo;
          /*  Retenemos solo las notificaciones cuya fecha de vencimiento es igual o posterior a la fecha actual ( return fecFinalizacionDate >= twoWeeksAgo; )
          o a la fecha dos semanas posterior al vencimiento:  return fecFinalizacionDate >= twoWeeksAgo; */
        });

        /* Se ordenan de la mas reciente a la mas antigua: */
        const notificacionesOrdenadas = filteredNotificaciones.sort((a:any, b:any) => {
          const dateA = parseDate(a.fecSolicitud);
          const dateB = parseDate(b.fecSolicitud);
          return dateB.getTime() - dateA.getTime();
        })

        setNotificacionesOrdenConsulta(notificacionesOrdenadas);
        
        setIsConsulting(false);
    
      } catch (error) {
        console.log('Error al obtener combinar y guardar los datos de ordenes de consulta:', error);
        setIsConsulting(false);
       /*  setModalVisible2(true); */
      }
    };
    
 CombinedData2()

  }, [/* idAfiliado, */ listadoEstMedicosVisible]);

  const PracticaResueltaRequest = async (
    afiliado: string,
    idOrden: string,
    estado: string,
    codAutorizacion:string,
    fecVencimiento: string,
    nombrePrestacion: string,
    prestador: string,
    dom1Prestador: string,
    dom2Prestador: string,
    coseguro: string,
    ) => {
      const { orderNotifications, setOrderNotifications } = useNotificationStore.getState();
    console.log('Se activo PracticaResueltaRequest de BuzonOrdenesC. Id de la Consulta Seleccionada->:', idOrden);
   try {
    if (estado === 'RECHAZOPRACTICA' ) {
      console.log('En PracticaResueltaRequest de orden de consulta el estado === RECHAZOPRACTICA ');
      setIsConsulting(false);
      const rechazoInfo = [{
        idOrden: idOrden,
        estado: 'Esta practica fue rechazada',
        nombrePrestacion: nombrePrestacion,
        comentarioRechazo: '',
      }];
      setRechazoData(rechazoInfo)
      setModalVisible3(true);

 // Mapeamos las notificaciones y actualizamos solo la que corresponde a idOrden
 const updatedNotifications = orderNotifications.map(notification =>
  notification.idOrden === idOrden
    ? { ...notification, visto: 'visto' }
    : notification
);

      setOrderNotifications(updatedNotifications); /* este es el context */
     
      return;
    }
    const ordenInfo = [{
      afiliado: afiliado,
      idOrden: idOrden,
      estado: estado,
      codAutorizacion: codAutorizacion,
      fecVencimiento: fecVencimiento,
      nombrePrestacion: nombrePrestacion,
      comentarioRechazo: '',
      prestador: prestador,
      dom1Prestador: dom1Prestador,
      dom2Prestador: dom2Prestador,
      coseguro: coseguro,
    }];
  

     // Actualizamos el contexto para avisar que la notificación fue vista
  
     const updatedNotifications = orderNotifications.map(notification =>
       notification.idOrden === idOrden
         ? { ...notification, visto: 'visto' }
         : notification
     );
 
     setOrderNotifications(updatedNotifications); // Actualizar el estado global

      //Actualizamos el contexto para avisar que la notificacion fue vista
      // consultamos el context para que modifique solo la que abre el usuario:
      

    setModalData(ordenInfo);
    setModalVisible(true);
  } catch(error){
    console.error('Error al obtener las notificaciones de ordenes de consulta (BuzonOrdenesC):', error);
    setModalVisible2(true);
  }
  }

  const getButtonText = (notificacion: string) => {
    if (notificacion === 'AUT') {
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
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  return (
    <>
     <View style={styles.ContainerEstudiosMedicosTitleAfuera} >
        <Pressable
          onPress={() => {
           
            modifyEstMedicVisible()
          }
          }
        >
          <Text style={styles.titleEstudiosMedicosAfuera} >Órdenes de Consulta:</Text>
        </Pressable>
      </View>
      {listadoEstMedicosVisible ?
        (
          <View style={{ marginBottom: 40, marginTop: 5, /* backgroundColor: 'blue', */ maxHeight: '80%', minHeight: '40%', width: '100%', marginHorizontal: 30, }}>

<ScrollView nestedScrollEnabled={true}>
            
            {isConsulting ?
              (
                <View style={styles.LoaderContainer}>
                  <FullScreenLoader />
                </View>
              )
              :
              error ? (
                <>
                  <View style={styles.errorContainerBuzon} >
                      <Text style={styles.titleErrorBuzon} >Sin notificaciones</Text>  

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
              notificacionesOrdenConsulta.length > 0 ?
                  (
                    <>
                     

                      {notificacionesOrdenConsulta.map((notificacion, index) => (
                      <Pressable
                      key={index} 
                        onPress={() => {
                         PracticaResueltaRequest(
                          notificacion.afiliado,
                          notificacion.idOrden, 
                          notificacion.codEstado,
                          notificacion.codAutorizacion, 
                          notificacion.fecVencimiento,
                          notificacion.nombrePrestacion,
                          notificacion.prestador,
                          notificacion.dom1Prestador,
                           notificacion.dom2Prestador,
                          notificacion.coseguro,
                           ) 
                        }}

                      >
                        <View style={styles.TertiaryButton}>
                          {/*  <Text style={{ fontSize: 16, textAlign: 'center' }}>{notificacion.afiliado}</Text> */}
                          <View style={styles.contentWrapper2}>
                            <View style={styles.textWrapper}>

                              {notificacion.afiliado && (
                                <Text style={styles.buttonText}>
                                  {notificacion.afiliado}
                                </Text>
                              )}
                              {notificacion.codEstado && (
                                <Text style={styles.descriptionText}>

                                  Estado:{
                                    getButtonText(notificacion.codEstado)
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
                      ) }  
                    </>
                  ) :
                  (
                    <>
                    <View style={styles.errorContainerBuzon} >
                        <Text style={styles.titleErrorBuzon} >Sin notificaciones</Text>  
  
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
                  // La animación de entrada y salida duracion en milisegundos
                /*   animationInTiming={50} 
                  animationOutTiming={50}  */
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={closeModal}
                >

                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.textStyletTitle}>Órdenes autorizadas: </Text>
                      <ScrollView contentContainerStyle={[styles.scrollViewContent, { flexGrow: 1 }]}>

                        {modalData.map((data, index) => (
                          <>
                            <View
                              key={index}
                              style={{ marginTop: 10 }}>
                              {/*                   <Text style={styles.textStyleOrdenConsulta}>idOrden: {data.idOrden}</Text> */}
                              <Text style={styles.textContenedorMensajeCod}>
                                <Text style={styles.textStyleMensajeCodigo}>Compartile este código a tu prestador para que lo pueda autorizar: </Text>
                                {'\n'}
                                <Text style={styles.valueCodAutorizado}>{data.codAutorizacion}</Text>
                              </Text>
                              <Text style={styles.textStyle}>{data.afiliado}</Text>
                              {/*  <Text style={styles.textStyle}>
                              <Text style={styles.textStyle}>Codigo Autorización: </Text>
                              <Text style={styles.valueCodAutorizado}>{data.codAutorizacion}</Text>
                            </Text>  */}
                              <Text style={styles.textStyle}>Fec. Vencimiento: {data.fecVencimiento}</Text>
                              <Text style={styles.textStyle}>Prestador: {data.prestador}</Text>
                              <Text style={styles.textStyle}>Dirección:{data.dom1Prestador}{data.dom2Prestador}</Text>
                              <Text style={styles.textStyle}>
                                <Text style={styles.textStyle}>Coseguro: </Text>
                                <Text style={styles.valueCoseguro}>${data.coseguro}</Text>
                              </Text>
                              <Text style={styles.textStylePractica}>Práctica: {data.nombrePrestacion}</Text>
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
                  <View style={styles.modalView}>
                    <Text style={styles.textStyletTitle}>Órden rechazada: </Text>
                    <ScrollView contentContainerStyle={[styles.scrollViewContent, { flexGrow: 1 }]}>
                      {rechazoData.map((data, index) => (
                        <>
                          <View style={{ marginTop: 10, marginBottom: 20 }}>

                            <Text style={styles.textStyleOrdenRechazada}>idOrden: {data.idOrden}</Text>
                            <Text style={styles.textStyleOrdenRechazada}>Estado: {data.estado}</Text>
                            {/* <Text style={styles.textStyleOrdenRechazada}>Detalle: {data.comentarioRechazo}</Text> */}
                          
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
          (
            <></>
         
          )
        }
    </>
  );
};
 {/* <Pressable
            style={styles.button}
           
          >
            <Text style={styles.textCloseStyle}>hola</Text>
          </Pressable> */}

const styles = StyleSheet.create({
  imageContainer: {
    marginBottom: 30,
    marginHorizontal: 20,
    marginTop: 10,
    /*    zIndex: 1.5, */
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '30%',
    minWidth: '30%',
   
  },
  innerContainer: {
    marginBottom: 15,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    /*  backgroundColor: 'blue', */
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
/*     fontSize: 18, */
     fontSize: hp('1.9%'),
    fontWeight: 'normal',
  },
  descriptionText: {
    color: 'gray',
    fontSize: hp('1.9%'),
  },
  errorContainerBuzon: {
    marginTop: 20,
    padding: 10,
/*     backgroundColor: 'violet', */
    borderRadius: 5,
    marginHorizontal:35,
  },
  ContainerEstudiosMedicosTitleAfuera: {
    marginTop: 10,
    marginBottom:5,
    padding: 5,
    backgroundColor: globalColors.white22 /* yellow3 *//*  '#9dcaf1' *//* '#d7e5f8' */,
    borderRadius: 15,
    borderWidth:0,
    borderColor: globalColors.white22,
    marginHorizontal:10,
    minWidth:'80%',
    maxWidth:'80%',
  },
  titleEstudiosMedicosAfuera: {
    marginBottom: 5,
    fontSize: hp('2.3%'),
    fontFamily: 'Quicksand-Light',
    textAlign: 'center',
    minWidth:'100%',
  },
  ContainerEstudiosMedicosTitle: {
    marginTop: 10,
    marginBottom:5,
    padding: 5,
    backgroundColor: '#9dcaf1'/* '#d7e5f8' */,
    borderRadius: 5,
    marginHorizontal:35,
  },
  titleErrorBuzon: {
    marginBottom: 5,
    fontSize: 18,
    fontFamily: 'Quicksand-Light',
    textAlign: 'center',
    marginHorizontal:20,
  },
  titleEstudiosMedicos: {
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
  // altura del scrollView: 
   scrollViewContent: {
    flexGrow: 0,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'normal',
   /*  textAlign: 'justify', */
    marginTop: 7,
/*     lineHeight: 18, */
  },
  textContenedorMensajeCod: {
    color: 'black',
    fontWeight: 'normal',
    marginTop: 7,
    lineHeight: 20,
  },
  textStyleMensajeCodigo: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 5,
    fontSize:15,
  },
  valueCodAutorizado: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
   
  },
  valueCoseguro: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 7,
  },
  textStyleOrdenConsulta: {
    color: 'black',
    fontWeight: 'normal',
 /*    textAlign: 'justify', */
    marginTop: 7,
  },
  textStyleOrdenRechazada: {
    color: 'black',
    fontWeight: 'normal',
/*     textAlign: 'justify', */
    marginTop: 7,
  },
  textStyletTitle: {
    color: 'black',
    fontWeight: 'normal',
    textAlign: 'justify',
    marginTop: 4,
    fontSize: 19,
  },
  textStyletTitlePracticaNoEncontrada: {
    color: 'black',
    fontWeight: 'normal',
    textAlign: 'center',
    marginTop: 4,
    fontSize: 18,
    marginBottom:5,
  },
  textStylePractica: {
    color: 'black',
    fontWeight: 'bold',
    /*  textAlign: 'justify', */
    marginTop: 7,
    marginBottom: 15,
    fontSize: 13,
    /*   lineHeight: 10, */
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
    marginTop: 10,
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

});

