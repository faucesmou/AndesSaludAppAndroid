import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, PixelRatio, Image, Pressable, Linking, ScrollView, Modal, TouchableOpacity, Alert  } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import NotiComponent3 from '../../components/shared/NotiComponent3';
import NotiMensajes from '../../components/shared/Noti-mensajes';
import { useNotificationStore } from '../../store/notification-store';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { RootStackParams } from '../../routes/StackNavigator';
import { QuaternaryButton } from '../../components/shared/QuaternaryButton';
import { SecondaryButton } from '../../components/shared/SecondaryButton';
import { globalColors } from '../../theme/theme';
import Credencial from '../../components/shared/Credencial';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { QuaternaryButton2 } from '../../components/shared/QuaternaryButton2';
import { SecondaryButton2 } from '../../components/shared/SecondaryButton2';
import { IonIcon } from '../../components/shared/IonIcon';
import CredencialNew from '../../components/shared/CredencialNew';
import Icon from 'react-native-vector-icons/Ionicons';
/* import { LinearGradient } from 'react-native-svg'; */
import LinearGradient from 'react-native-linear-gradient';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Props {
  onPress: () => void;
  label?: string;
  id?: any;
  color?: string;
  disabled?: boolean;
  iconName?: string;
  description?: string;
  textOverflow?: string;
  textSize?: any;
  descriptionSize?: any;
}


export const HomeScreenUxNew = () => {
  const { setShouldUpdateNotifications, getUserName, UserName } = useAuthStore();

  const [currentUserName, setCurrentUserName] = useState<string | null>(null)

  function capitalizeWords(string: string) {
    return string.replace(/\b\w+/g, function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  }
  /*   const currentUserNameInicial = getUserName();
    const currentUserName = capitalizeWords(currentUserNameInicial);
    console.log('currentUserName es: ', currentUserName); */


  useEffect(() => {
    console.log('entrando al useEffect----->');
    const currentUserNameInicial = getUserName(); // Obtención síncrona del nombre
    if (currentUserNameInicial) {
      const capitalizedUserName = capitalizeWords(currentUserNameInicial);
      setCurrentUserName(capitalizedUserName); // Actualiza el estado
      console.log('currentUserName es----->', currentUserName);
    } else {
      console.log('No se encontró el nombre de usuario');
    }

  }, [UserName])

  useEffect(() => {
    setShouldUpdateNotifications(true);
  }, []);

  const setMedicalNotifications = useNotificationStore((state) => state.setMedicalNotifications);
  const setOrderNotifications = useNotificationStore((state) => state.setOrderNotifications);

  const [ordenConsulta, setOrdenConsulta] = useState("");
  let Url = `https://api.whatsapp.com/send?phone=542613300622&text=%C2%A1Hola%2C%20Pixi!%20Vengo%20de%20la%20APP%20y%20tengo%20algunas%20consultas.%20%F0%9F%91%8D`;

  const handleOpenURL = () => {
    setOrdenConsulta(Url);
  };

  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { top, bottom } = useSafeAreaInsets();
  const { height } = Dimensions.get('window');
  let headerHeight = hp('17%'); // Ajusta el tamaño de la cabecera según el alto de la pantalla

  if (height < 407) { // Pantallas más pequeñas como iPhone SE o iPhone 8
    headerHeight = hp('5%'); // Ajuste para pantallas más pequeñas
  }

  let buttonTextFontSize = wp('5%');
  let buttonDescriptionFontSize = wp('4.5%');

  let buttonsTitleFontSize = wp('3.7%');
  let DescriptionFontSize = wp('2.8%');

  let cardTitleFontSize: number = hp('2.5%');
  let cardDescriptionFontSize: number = hp('2%');
  let iconNotificationFontSize: number = wp('8%');
  let titleMarginBottom: number = hp('1%');
  let iconMarginBottom: number = hp('3%');

  if (height < 680) { // IMPORTANTE Pantallas más pequeñas como iPhone SE o iPhone 8 de 5.4 pulgadas o menos aproximadamente 

    buttonTextFontSize = wp('4.8%');
    buttonDescriptionFontSize = wp('4%');

    buttonsTitleFontSize = wp('3.4%')
    DescriptionFontSize = wp('2.5%');

    cardTitleFontSize = hp('3%');
    cardDescriptionFontSize = hp('2.5%');
    iconNotificationFontSize = wp('7%');
    titleMarginBottom = hp('3%');
    iconMarginBottom = hp('5%');
  }




  useEffect(() => {
    const openURL = async () => {
      if (ordenConsulta) {
        try {
          await Linking.openURL(ordenConsulta);
        } catch (err) {
          console.log('error al intentar ingresar a whatsapp:', err);
        } finally {
          setOrdenConsulta('');
        }
      }
    };
    openURL();
  }, [ordenConsulta]);

  /* definicion de estilos de boton para mejorar su control respecto a la pantalla */

  /* const backColor = disabled ? globalColors.disabled : (color ? color : globalColors.background); */


  const renderSecondaryButton = ({ onPress, label, color, disabled, iconName, description, textSize,
    descriptionSize, textOverflow, }: Props) => {
    const backColor = disabled ? 'gray' : '#fff';


  /*   const registerForPushNotifications = async () => {
      try {
        // Verificar si ya se ha registrado o si el usuario ya ha concedido el permiso
        const alreadyRequested = await AsyncStorage.getItem('notificationsRequested');

        if (alreadyRequested !== 'true') {
          // Solicitar permiso para notificaciones
          const authStatus = await messaging().requestPermission();
          const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

          if (enabled) {
            // Obtener el token FCM y enviarlo al servidor si el permiso es concedido
            const token = await messaging().getToken();
            await axios.post('https://gmfp.createch.com.ar/api/notificaciones', { token });

            // Marcar que el usuario ya otorgó el permiso
            await AsyncStorage.setItem('notificationsRequested', 'true');
            console.log("Permiso concedido y token registrado en el servidor");
          } else {
            console.log("El usuario denegó el permiso de notificaciones");
          }
        }
      } catch (error) {
        console.error("Error al registrar notificaciones:", error);
      }
    }; */

    /*  useEffect(() => {
         registerForPushNotifications();
     }, []); */


      return (
        <Pressable
          onPress={disabled ? undefined : onPress}
          style={({ pressed }) => [
            {
              backgroundColor: pressed && !disabled ? 'lightgray' : backColor,
              opacity: disabled ? 0.5 : 1,
            },
            styles.secondaryButton,
          ]}
        >
          <View style={{ margin: '0%', /* backgroundColor: 'violet', */ }} >
            <View style={{ alignItems: 'center', display: 'flex', justifyContent: 'center',  /* backgroundColor: 'violet', */ maxWidth: wp('42%'), }}  >
              <IonIcon name={iconName} size={hp('3.3%')} color="#505050" style={styles.icon} />
            </View>
            <View style={styles.innerContainerNew}>
              {label && <Text style={[styles.label, { fontSize: buttonsTitleFontSize }]}/* style={styles.label}  */>{label}</Text>}
              {description && <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.description, { fontSize: DescriptionFontSize }]}/* style={styles.description} */>{description}</Text>}
            </View>
          </View>
        </Pressable>
      );
    };

    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisibleGracias, setModalVisibleGracias] = useState(false);
    const [isModalVisibleNotificacion, setModalVisibleNotificacion] = useState(false);
    const [gcmData, setGcmData] = useState<any| null>(null);

    useEffect(() => {
      const checkPermission = async () => {
        const permission = await AsyncStorage.getItem('notificationPermission');

        // Mostrar el modal si nunca ha seleccionado permitir o denegar
        if (!permission) {
          setModalVisible(true);
        } else if (permission === 'granted') {
          console.log('El permiso ya ha sido concedido capo')
          //revisar si hace falta activar de nuevo el token
          //registerForPushNotifications() 
          // Activar función si ya ha permitido notificaciones ESTO DEBE HACERSE SIEMPRE ? 
        }
      };

      checkPermission();
    }, []);

    const registerForPushNotifications = async () => {
      try {
        await messaging().requestPermission(); // Solicitar permiso al sistema
        const token = await messaging().getToken();
        console.log('el token obtenido es---->', token)
        await axios.post('https://gmfp.createch.com.ar/api/notificaciones', { token });
      } catch (error) {
        console.error("Error al obtener o enviar el token FCM:-->", error);
      }
    };

    const handleAllow = async () => {
      setModalVisible(false);
      await AsyncStorage.setItem('notificationPermission', 'granted');
      registerForPushNotifications(); // Llamar a la función para registrar el token
      setModalVisibleGracias(true)

    };

    const handleDeny = async () => {
      setModalVisible(false);
      await AsyncStorage.setItem('notificationPermission', 'denied');
      console.log("El usuario se negó a recibir notificaciones-->");
    };



    useEffect(() => {
    
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        try {
          // Verificar si hay datos y si contienen la clave `default`
          if (remoteMessage.data?.default) {
            const data = JSON.parse(remoteMessage.data.default); // Parsear el JSON principal
    
            if (data.GCM) {
              const gcmData = JSON.parse(data.GCM); // Parsear la parte de `GCM`
    
              // Extraer título, cuerpo y extraInfo
              const title = gcmData.notification?.title || "Notificación de Andes Salud";
              const body = gcmData.notification?.body || "Tienes un nuevo mensaje desde el home";
              const extraInfo = gcmData.data?.extraInfo || "";
              const notificacion = {
                title: title,
                body: body,
                extraInfo : extraInfo
              }
              setGcmData(notificacion); 
             /*  setModalVisibleNotificacion(true) */
              console.log("El mensaje ha activado el setModalVisibleNotificacion.");
              console.log("el mensaje title--->", title );
              console.log("el mensaje body--->", body );
              console.log("el mensaje extraInfo--->", extraInfo );
              // Mostrar un Alert con la información de manera estructurada
            /*   Alert.alert(
                title,
                `${body}\n\nInformación adicional: ${extraInfo}`,
                [{ text: "OK", onPress: () => console.log("Alerta cerrada") }]
              ); */
            }
          } else {
            console.warn("El mensaje no contiene datos en el formato esperado.");
          }
        } catch (error) {
          console.error("Error al procesar el mensaje desde homeScreen:", error);
        }
      });
  
      return unsubscribe;
    }, []);


    useEffect(() => {
      if (gcmData) {
        setModalVisibleNotificacion(true);
        console.log("El mensaje ha activado el EFFECT DE setModalVisibleNotificacion.");
      }
    }, [gcmData]);
    
    return (
      <View style={styles.screenContainer}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
        /*    scrollToOverflowEnabled={false}  
           snapToInterval={2} 
           bounces={false}  */
        /*  persistentScrollbar={true} */
        >


          
          <LinearGradient
            colors={['#e49958', '#e49958', '#e1a159', '#e1a159', '#e1a159', '#e49958', '#e49958', '#e49958',]/* ['#e49958','#e49958','#e1a159', '#e1a159','#e1a159','#e1a159','#e1a159','#c88846','#daa36b' , '#e79340' ] */} // Degradado del color base
            start={{ x: 0, y: 0 }} // Inicio del gradiente (esquina superior izquierda)
            end={{ x: 1, y: 2 }} // Fin del gradiente (esquina inferior derecha)
            style={[{ height: headerHeight }, styles.headerContainer]} // Estilo inline para ajustar tamaño y posición
          >
            <View style={{ width: '80%', marginBottom: titleMarginBottom }}>
              <Text style={styles.headerText}>Inicio</Text>
            </View>

            <View>
              <Pressable
                onPress={() => {
                  navigation.navigate('Buzón');
                }}
                style={{ marginLeft: 0, marginBottom: iconMarginBottom }}
              >
                <NotiMensajes IonIconSize={iconNotificationFontSize} />
              </Pressable>
              <NotiComponent3 />
            </View>
          </LinearGradient>

          <View style={styles.cardContainer}>
            {/*  <Credencial /> */}
            <CredencialNew />
          </View>

          <View style={styles.imageContainer}>
            <View style={styles.innerContainer2}>

              {currentUserName ? (
                <Text style={styles.text2New}>¡Hola, {currentUserName}!</Text>
              )
                :
                (
                  <Text style={styles.text2New}>¡Te estábamos esperando!</Text>
                )
              }

            </View>
          </View>

          {/*   <ScrollView> */}
          <View style={styles.bigContentContainer}>

            {/* primera prueba de modal inicio */}

            {isModalVisible && (
              <Modal
                transparent={true}
                animationType="fade"
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>¿Permites a Andes Salud enviarte notificaciones?</Text>
                    <Text style={styles.modalMessage}>Esto te ayudará a recibir alertas importantes de salud.</Text>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity style={styles.allowButton} onPress={handleAllow}>
                        <Text style={styles.buttonText}>Permitir</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.denyButton} onPress={handleDeny}>
                        <Text style={styles.buttonText}>No permitir</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            )}




            {/* primera prueba de modal inicio */}

            {/* segundo modal agradeciendo el permiso */}

            {isModalVisibleGracias && (
                <Modal
                  transparent={true}
                  animationType="fade"
                  visible={isModalVisible}
                  onRequestClose={() => setModalVisibleGracias(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                      {/* <Icon name="alert-circle" size={40} color="#ff5c5c" /> */}
                      <Text style={styles.modalTitle}>Muchas gracias!</Text>
                      <Text style={styles.modalMessage}>te enviaremos sólo mensajes esenciales</Text>
                      <TouchableOpacity style={styles.button} onPress={() => setModalVisibleGracias(false)}>
                        <Text style={styles.buttonText}>Aceptar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}
            {isModalVisibleNotificacion && (
                <Modal
                  transparent={true}
                  animationType="fade"
                  visible={isModalVisibleNotificacion}
                  onRequestClose={() => setModalVisibleNotificacion(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                      {/* <Icon name="alert-circle" size={40} color="#ff5c5c" /> */}
                      <Text style={styles.modalTitle}>{gcmData?.title}</Text>
                      <Text style={styles.modalMessage}>{gcmData?.body}</Text>
                      <Text style={styles.modalMessage}>{gcmData?.extraInfo}</Text>
                      <TouchableOpacity style={styles.button} onPress={() => setModalVisibleNotificacion(false)}>
                        <Text style={styles.buttonText}>Aceptar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}

            <View style={styles.buttonsContainer}>



              <View style={styles.rowContainer1}>
                {renderSecondaryButton({
                  onPress: () => navigation.navigate('Perfil'),
                  label: 'Mi Perfil',
                  iconName: 'person-circle-outline',
                  description: 'Información personal, opciones de personalización',
                  textSize: { buttonsTitleFontSize },
                  descriptionSize: { DescriptionFontSize }
                })}
                {renderSecondaryButton({
                  onPress: () => navigation.navigate('Afiliados'),
                  label: 'Mi Grupo Familiar',
                  iconName: 'people-circle-outline',
                  description: 'Detalles del grupo familiar y credenciales ',
                  textSize: { buttonsTitleFontSize },
                  descriptionSize: { DescriptionFontSize }
                })}

              </View>

              <View style={styles.rowContainer2}>
                {renderSecondaryButton({
                  onPress: () => navigation.navigate('Pagos'),
                  label: 'Mis Pagos',
                  iconName: 'file-tray-full-outline',
                  description: 'Estados de pago, opciones de pago',
                  textSize: { buttonsTitleFontSize },
                  descriptionSize: { DescriptionFontSize }
                })}
                {renderSecondaryButton({
                  onPress: () => navigation.navigate('Facturas'),
                  label: 'Descargá tus Facturas',
                  iconName: 'cloud-download-outline',
                  description: 'Historial y descarga de facturas',
                  textSize: { buttonsTitleFontSize },
                  descriptionSize: { DescriptionFontSize }
                })}
              </View>
              <View style={styles.rowContainer2}>
                {renderSecondaryButton({
                  onPress: () => navigation.navigate('MiSalud'),
                  /*   onPress: handleOpenURL, */
                  label: 'Mi Salud',
                  iconName: 'fitness-outline',
                  /*   iconName: 'heart-circle-outline', */
                  /*   iconName: 'chatbubbles-outline', */
                  description: 'Cartilla médica y emergencias',
                  textSize: { buttonsTitleFontSize },
                  descriptionSize: { DescriptionFontSize }
                })}
                {renderSecondaryButton({
                  onPress: () => navigation.navigate('MiGestión'),
                  label: 'Gestiones',
                  iconName: 'layers-outline',
                  /* iconName: 'file-tray-full-outline', */
                  description: 'Órdenes de consulta, estudios médicos y más',
                  textSize: { buttonsTitleFontSize },
                  descriptionSize: { DescriptionFontSize }
                })}
              </View>
            </View>

            <View style={styles.mensajeSoporteContainer}>

              {/*  <Text style={styles.text3New}>¿Necesitas asistencia?</Text> */}

              <Pressable
                onPress={handleOpenURL}
                style={styles.mensajeSoporteContainer}
              >

                <View style={styles.containerText4New}>

                  <Text style={styles.text3New}>¿Necesitas asistencia?</Text>
                  <IonIcon name='chatbubbles-outline' color={'black'} size={wp('6%')} marginLeft={wp('1%')} />
                </View>
                {/* <Text style={styles.text3New}>¿Necesitas asistencia?</Text> */}

                <View style={styles.containerText4New2}>

                  <Text style={styles.text4New}>Chateá con nuestro soporte</Text>
                </View>

              </Pressable>


            </View>
          </View>
          {/*  <QuaternaryButton2
              onPress={handleOpenURL}
              label={'¿Necesitas asistencia?'}
              iconName="chatbubbles-outline"
              iconName2="mail-outline"
              description="Chatea con nuestro soporte"
              textSize={buttonTextFontSize}
              descriptionSize={buttonDescriptionFontSize}
            /> */}



        </ScrollView>
      </View>
    );
  };

  const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      /* backgroundColor: 'green', */
      marginHorizontal: wp('0%'),
      /*   display: 'flex', */
      /*   alignContent:'center', */
    },
    headerContainer: {
      width: wp('100%'),
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
      flexDirection: 'row',
    },
    headerText: {
      fontSize: wp('8%'), // Ajuste responsivo para el tamaño del texto
      textAlign: 'center',
      color: 'white',
      marginLeft: wp('10%'),
      fontWeight: 'bold',
    },
    cardContainer: {
      position: 'absolute',
      top: hp('10%'),
      height: hp('28%'),
      width: wp('95%'),
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      zIndex: 3,
      marginBottom: hp('0%'),
      borderRadius: 20,
      /*  backgroundColor: 'yellow', */
      /*    backgroundColor: globalColors.white2, */
    },

    /*  */
    bigContentContainer: {
      /*  flex: 1, */
      marginTop: hp('1%'),
      marginBottom: hp('1%'),
      zIndex: 2,
      borderRadius: 15,
      /* agrego los estilos de contenedor mayor por los margenes */
      top: hp('8%'),
      marginLeft: hp('2%'), //ESTO NO PUEDE SER INVESTIGAR CENTRADOS.
      maxHeight: hp('50%'),
      marginHorizontal: wp('3%'),
      /* backgroundColor: 'orange', */
    },
    mensajeSoporteContainer: {
      marginBottom: hp('1%'),
      marginTop: hp('1.5%'),
      alignContent: 'center',
      marginHorizontal: wp('5%'),
    },
    buttonsContainer: {
      zIndex: 1,
      marginTop: hp('-3%'),
      marginLeft: 0,
      /*  backgroundColor: 'violet', */
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      marginHorizontal: wp('2%'),

    },
    rowContainer1: {
      zIndex: 1,
      flexDirection: 'row',
      marginBottom: hp('0%'),
      maxWidth: wp('100%'),
      marginTop: hp('0%'),
      justifyContent: 'center',
      alignContent: 'center',
      /*  backgroundColor: 'black', */
    },
    rowContainer2: {
      zIndex: 1,
      flexDirection: 'row',
      marginBottom: hp('0%'),
      maxWidth: wp('100%'),
      marginTop: hp('0%'),
      justifyContent: 'center',
      alignContent: 'center',
      /*  backgroundColor: 'red',  */
    },
    buttonStyle: {
      width: wp('42%'),  // Ajusta el tamaño para que encaje bien 2 botones por fila
      height: hp('10%'),  // Fija una altura constante
      marginHorizontal: wp('2%'),  // Controla el espacio entre botones
    },
    imageContainer2: {
      marginTop: hp('20%'),
      flex: 0.2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageContainer: {
      marginBottom: hp('-4%'),
      /*  marginBottom: -60, */
      marginTop: hp('19%'),
      /* marginTop: 190, */
      /*  flex: hp('0.3%'), */
      /*  flex: 0.4, */
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      maxHeight: hp('10%'),
      /* maxHeight:'10%', */
      /*  marginHorizontal:0, */
      marginHorizontal: wp('3%'),
      padding: 0,
      /*   backgroundColor:'violet', */
      zIndex: 3, //cambiar
    },
    innerContainer2: {
      marginBottom: 0,
      marginTop: hp('0%'),
      /* marginTop: '6%', */
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: wp('100%'),
      /*  width: '100%', */
      flexDirection: 'row',
      height: hp('3%'),
      /* height: '50%', */
      marginHorizontal: wp('4%'),
      /*    backgroundColor:'blue', */
      /* marginHorizontal:20, *///En el 15maxpro estaba en 40.
    },
    image2: {
      flex: 0.2,
      width: wp('100%'),
      height: hp('3.5%')
    },
    text2: {
      fontSize: hp('2.5%'),
      textAlign: 'center',
      flex: 1,
      width: wp('100%'),
      height: hp('3%'),
      /*  width: '100%', */
      /*   height: '100%', */
      margin: 0,
      marginLeft: wp('4%'),
      flexWrap: 'wrap'
    },
    text2New: {
      fontSize: hp('2.8%'),
      fontWeight: 'bold',
      textAlign: 'center',
      flex: 1,
      width: wp('100%'),
      height: hp('3.5%'),

      margin: 0,
      marginLeft: wp('4%'),
      flexWrap: 'wrap',
      color: '#e1a159',
    },
    text3New: {
      fontSize: hp('2%'),
      fontWeight: 'bold',
      textAlign: 'center',
      margin: 0,
      marginLeft: wp('0'),
      flexWrap: 'wrap',
      color: 'black',
      /* backgroundColor: '#e1a159', */
    },
    containerText4New: {
      /*  backgroundColor: '#ebc103', */
      /* backgroundColor: '#e6ba00', */
      /* backgroundColor: '#fbd1a5', */
      /* backgroundColor: '#e1a159', */
      borderRadius: 5,
      /*  paddingHorizontal: wp('11%'), */
      marginHorizontal: wp('13%'),
      paddingVertical: 1,
      marginTop: wp('0%'),
      flexDirection: 'row',
      /*    backgroundColor: 'blue', */
      alignItems: 'center',
      alignContent: 'center'
    },
    containerText4New2: {
      backgroundColor: '#f4c55f', /* '#ebc103' */ /* #e1a159 #ffb71c ,#fdc141 */
      /* backgroundColor: '#e6ba00', */
      /* backgroundColor: '#fbd1a5', */
      /* backgroundColor: '#e1a159', */
      borderRadius: 15,
      paddingHorizontal: 0,
      paddingVertical: 3,
      marginTop: wp('0.5%'),
      marginHorizontal: wp('7%'),
      borderColor: 'white',
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 5,
    },
    text4New: {
      fontSize: hp('1.8%'),
      fontWeight: 'bold',
      textAlign: 'center',
      marginLeft: wp('0%'),
      flexWrap: 'wrap',
      color: 'black',
      marginBottom: wp('0.5%'),
    },
    image: {
      width: wp('40%'), // Ajuste responsivo para la imagen
      height: hp('20%'), // Ajuste responsivo para la imagen
    },
    text: {
      fontSize: wp('6%'), // Ajuste responsivo para el texto
      textAlign: 'center',
      marginBottom: hp('2%'),
    },
    /* nuevo intento para tener mas control sobre los botones*/
    secondaryButton: {
      flex: 0.5,
      maxHeight: hp('15%'),
      maxWidth: wp('54%'),
      minWidth: wp('45%'),
      minHeight: hp('12%'),
      borderColor: 'white',
      borderWidth: 1,
      borderRadius: 45,
      margin: wp('0.7%'),
      alignItems: 'center',
      /*  alignItems: 'flex-start', */
      textAlign: 'center',
      backgroundColor: globalColors.gray3,
      padding: wp('2%'),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 5,
      /*  alignItems: 'center', */
      justifyContent: 'center',
    },
    icon: {
      marginBottom: hp('1%'),
      alignSelf: 'center',
      justifyContent: 'center',

    },
    innerContainer: {
      flexDirection: 'column',
      /*   width: '100%',  */
      width: wp('100%'),
      marginTop: hp('0.2%'),
      maxWidth: wp('40%'),
      maxHeight: hp('8%'),
      minHeight: hp('7%'),
      /*   backgroundColor: 'violet', */
      flexWrap: 'wrap',
      overflow: 'hidden',
    },
    innerContainerNew: {
      flexDirection: 'column',
      /*   width: '100%',  */
      width: wp('100%'),
      marginTop: hp('0.1%'),
      maxWidth: wp('40%'),
      maxHeight: hp('10%'),
      minHeight: hp('7.2%'),
      /* backgroundColor: 'violet', */
      flexWrap: 'wrap',
      overflow: 'hidden',
    },
    label: {
      fontSize: hp('1.5%'),
      color: 'black',
      fontWeight: 'bold',
      /*  width: wp('100%'), */
      /*  maxwidth: '100%', */
      marginBottom: hp('0%'),
      /*   backgroundColor: 'red', */
      maxHeight: hp('2.5%'),
      minHeight: hp('2.4%'),
      marginTop: hp('0.5%'),
      textAlign: 'center',
      flexWrap: 'wrap',


    },
    description: {
      fontSize: hp('1%'),
      color: 'black',
      /*  color: '#707070', */
      maxWidth: wp('40%'),
      minWidth: wp('40%'),
      marginTop: hp('0.3%'),
      overflow: 'hidden',
      padding: hp('0.01%'),
      flexWrap: 'wrap',
      textAlign: 'center',
      marginBottom: hp('0%'),
      /* backgroundColor: 'violet', */
    },
    /* estilos para modal de aceptar notificaciones: */
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
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    allowButton: {
      backgroundColor: '#28a745',
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginRight: 10,
    },
    denyButton: {
      backgroundColor: '#dc3545',
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    button: {
      backgroundColor: '#ff5c5c',
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
  })
