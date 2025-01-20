import React, { useState } from 'react'
import { Alert, Dimensions, Linking, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { globalColors } from '../../theme/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../routes/StackNavigator';
import CustomHeader from '../../components/CustomHeader';
import { HamburgerMenu } from '../../components/shared/HamburgerMenu';
import { TertiaryButton } from '../../components/shared/TertiaryButton';
import { IonIcon } from '../../components/shared/IonIcon';
import NotiMensajes from '../../components/shared/Noti-mensajes';
import NotiComponent3 from '../../components/shared/NotiComponent3';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BackButton } from '../../components/shared/BackButton';
import LinearGradient from 'react-native-linear-gradient';

export const CartillaScreen = () => {
  console.log('Entrando a Cartilla Screen--------->');
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const { top } = useSafeAreaInsets();
  /*   const headerHeight = 120; // Altura del encabezado
    const adjustedHeaderHeight = headerHeight + top  */

  const { height } = Dimensions.get('window');

  let headerHeight = hp('16%'); // Ajusta el tamaño de la cabecera según el alto de la pantalla
  let adjustedHeaderHeight = headerHeight + top
  let buttonTextFontSize = wp('4.5%');
  let buttonDescriptionFontSize = wp('4%');
  let cardTitleFontSize: number = hp('2.6%');
 let cardDescriptionFontSize: number = hp('2%');
 let iconNotificationFontSize: number = wp('8%');
 let titleMarginBottom: number  = hp('4%'); 
 let iconMarginBottom: number  = hp('7%');  
 let arrowMarginBottom: number  = hp('4%');  
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
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');

  const handlePhonePress2 = (phoneNumber: any) => {
    Alert.alert(
      'Llamar',
      `¿Deseas llamar al número ${phoneNumber}?`,
      [
        {
          text: 'Llamar',
          onPress: () => {
            
            console.log('Llamar:', phoneNumber);
            Linking.openURL(`tel:${phoneNumber}`)
              .then(() => {
                console.log('llamada iniciada correctamente');

              })
              .catch((err) => {
                Alert.alert('Ups!', 'No se pudo llamar al número indicado, por favor verifica que sea válido');
                console.log('el error al intentar hacer la llamada es el siguiente:', err);
              })
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const handlePhonePress3 = (phoneNumber: string) => {
    setSelectedPhoneNumber(phoneNumber);
    setModalVisible(true);
  };

  const handleAllow = () => {
    setModalVisible(false);
    Linking.openURL(`tel:${selectedPhoneNumber}`)
      .then(() => {
        console.log('Llamada iniciada correctamente');
      })
      .catch((err) => {
        Alert.alert(
          'Ups!',
          'No se pudo llamar al número indicado, por favor verifica que sea válido'
        );
        console.log('El error al intentar hacer la llamada es el siguiente:', err);
      });
  };

  const handleDeny = () => {
    setModalVisible(false);
  };


  return (
    <View
      style={styles.screenContainer}
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
          
           <IonIcon name='arrow-back' color= { 'white' } size = {30}/> 
          </Pressable>

        <View style={{ width: '75%', marginBottom: titleMarginBottom}}>



          <Text style={{
            fontSize: wp('7%'), // Ajuste responsivo para el tamaño del texto
            textAlign: 'center',
            color: 'white',
            fontWeight:'bold',
            marginLeft: wp('0%'),
            marginBottom: hp('1%')
          }} >
            Mi Salud
          </Text>
        </View>

        <View>
       

          <Pressable onPress={() => {
            console.log('presiono el boton ');
            navigation.navigate('Buzón')
          }}
            style={{ marginLeft: 0, marginBottom: iconMarginBottom, marginRight: wp('3%') }}
          >
            {/*  <IonIcon name='notifications-outline' color={'white'} size={35} />  */}
            <NotiMensajes IonIconSize={iconNotificationFontSize} />
          </Pressable>
        {/*   <NotiComponent3 /> */}

        </View>

      </View>

      <View style={styles.cardContainer} >
        <View style={styles.card}>
          <Text style={{ fontSize: cardTitleFontSize, fontWeight: 'normal', textAlign: 'center', marginBottom: wp('2%'), color: 'black' }}/* style={styles.cardTitle} */>Tu Prepaga Digital</Text>
          <Text style={{ fontSize: cardDescriptionFontSize,
    textAlign: 'center',
    color: 'black',}}/* style={styles.cardSubtitle} */>Accedé a todos los centros de atención</Text>
        </View>
      </View>

    {/*   {isModalVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                ¿Deseas llamar al número {selectedPhoneNumber}?
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.allowButton} onPress={handleAllow}>
                  <Text style={styles.buttonText}>Llamar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.denyButton} onPress={handleDeny}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )} */}
        {/* Modal para la llamar por teléfono */}
            {isModalVisible && (
              <Modal
                transparent={true}
                animationType="fade"
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                      ¿Deseas llamar al siguiente número?
                    </Text>
                    <Text style={styles.selectedNumber}>{selectedPhoneNumber}</Text>
      
                    <View style={styles.buttonContainer}>
                      {/* <TouchableOpacity style={styles.allowButton} onPress={handleAllow}>
                        <Text style={styles.buttonText}>Llamar</Text>
                      </TouchableOpacity> */}
      
                      {/* nuevo con gradiente */}
                      <LinearGradient
                        colors={['#509d4f', '#5ab759', '#5ab759', '#5ab759']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.allowButton} onPress={handleAllow}>
                          <Text style={styles.buttonText}>
                            Llamar
                          </Text>
                        </TouchableOpacity>
                      </LinearGradient>
      
                      <LinearGradient
                        colors={['#c86443', '#d6783c', '#e08050', '#e88848']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.denyButton}>
                        <TouchableOpacity onPress={handleDeny}>
                          <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                      </LinearGradient>
                     
                    </View>
                  </View>
                </View>
              </Modal>
            )}


      <View style={styles.bigContentContainer} >
        <View style={styles.emergencyContainer} >
          <View style={{ marginBottom: 15 }}>
            <Text style={{ /* fontSize: 30 */ fontSize: hp('3.5%'), textAlign: 'center', color: globalColors.orange2, fontWeight: 'bold', marginTop: 0, marginBottom: wp('1%')/* marginBottom: 10 */ }} > Urgencias y Emergencias</Text>
            <Text style={styles.emergencySubitle}>En caso de emergencias, comunicate a los siguientes números:</Text>
          </View>
          <View >

            <Text style={styles.emergencyProvincesTitle}> Mendoza</Text>
            <TouchableOpacity onPress={() => handlePhonePress3('0810-333-9743')}>
              <Text style={styles.emergencyProvincesNumbers}> 0810-333-9743</Text>
            </TouchableOpacity>

          
            <Text style={styles.emergencyProvincesTitle}> San Luis</Text>
            <TouchableOpacity onPress={() => handlePhonePress3('265-742-8786')}>
              <Text style={styles.emergencyProvincesNumbers}> 265-742-8786</Text>
          
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePhonePress3('266-443-5700')}>
              <Text style={styles.emergencyProvincesNumbers}> 266-443-5700</Text>
            </TouchableOpacity>
            <Text style={styles.emergencyProvincesTitle}> Córdoba</Text>
            <TouchableOpacity onPress={() => handlePhonePress3('0810-444-351111')}>
              <Text style={styles.emergencyProvincesNumbers}> 0810-444-351111</Text>
          
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePhonePress3('0810-333-351111')}>
              <Text style={styles.emergencyProvincesNumbers}> 0810-333-351111</Text>
            </TouchableOpacity>
          </View>

        </View>

        <View style={{ marginTop: hp('1%'), marginHorizontal:wp('3%') }}>

          <TertiaryButton
            onPress={() => navigation.navigate('Cartillas')}
            label="Cartilla Médica"
            color={globalColors.profile2}
            iconName='heart-outline'
            description='Accedé a todas las cartillas'
            textSize={buttonTextFontSize} 
            descriptionSize={buttonDescriptionFontSize}
          />

        </View>
        <View style={{ marginTop: hp('1%'), marginHorizontal:wp('3%') }}>

          <TertiaryButton
            onPress={() => navigation.navigate('Cartilla Farmacias')}
            label="Cartilla de Farmacias"
            color={globalColors.profile2}
            iconName='medkit-outline'
            description='Accedé a todas las cartillas'
            textSize={buttonTextFontSize} 
            descriptionSize={buttonDescriptionFontSize}
          />

        </View>
      </View>

    </View >
  )
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingHorizontal: 0,
    marginTop: 0,
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
    /*   top: 120,  */
    /*  width: '100%', */
    width: wp('95%'),
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
  cardTitle: {
    /* fontSize: 22, */
    fontSize: hp('2.5%'),
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: wp('2%'),
    /*   marginBottom: 10, */
  },
  cardSubtitle: {
    fontSize: hp('2%'),
    textAlign: 'center',
    color: 'black',
  },
  emergencyContainer: {
    backgroundColor: 'white',
    marginTop: hp('7%'),
    /*   marginTop: '20%', */
    marginHorizontal: wp('6%'),
    /*    marginHorizontal: 30, */
    padding: wp('1%'),
    /*  padding: 10, */
    borderWidth: 0.3,
    borderColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    elevation: 6,
    shadowRadius: 5,
    zIndex: 3,
  },
  emergencySubitle: {
    fontSize: hp('2%'),
    /*    fontSize: 18, */
    marginBottom: 0,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    color: 'black'
  },
  emergencyProvincesTitle: {
    color: 'brown',
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
    /*   fontSize: 25, */
    textAlign: 'center'
  },
  emergencyProvincesNumbers: {
    color: globalColors.yellow,
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
    /*   fontSize: 20, */
    textAlign: 'center'
  },
/* mejora de modal que pregunta si desea llamar----------ZZZZ */
callButton: {
  backgroundColor: '#007bff',
  padding: 15,
  borderRadius: 5,
},
callButtonText: {
  color: '#fff',
  fontSize: 16,
},
/* modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContainer: {
  width: '80%',
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 20,
  alignItems: 'center',
},
modalTitle: {
  fontSize: 18,
  marginBottom: 20,
  textAlign: 'center',
  color:"black"
},
buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
},
allowButton: {
  flex: 1,
  backgroundColor: '#28a745',
  padding: 10,
  borderRadius: 5,
  marginRight: 5,
  alignItems: 'center',
},
denyButton: {
  flex: 1,
  backgroundColor: '#dc3545',
  padding: 10,
  borderRadius: 5,
  marginLeft: 5,
  alignItems: 'center',
},
buttonText: {
  color: '#fff',
  fontSize: 16,
},
 */


modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContainer: {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 15,
  marginHorizontal:wp('5%'),
  maxWidth:wp('80%'),
  minWidth:wp('75%')
},
modalTitle: {
  /* fontSize: 18, */
  fontSize: hp('2.2%'),
  fontWeight: 'bold',
  alignSelf:'center',
   marginBottom:10,
  textAlign:'center',
  color: '#3b3937',
  /*  */
  /* color:'gray' */
},
selectedAddress: {
 /*  fontSize: 16, */
 fontSize: hp('2%'),
  marginBottom: wp('3%'),
  alignSelf:'center',
  marginTop:0,
  textAlign:'center',
  color:'gray'
},
selectedNumber: {
  fontSize: hp('2.3%'),
  marginBottom: wp('3%'),
  alignSelf:'center',
  marginTop:0,
  fontWeight:'bold',
  color: globalColors.profile
},
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
  maxWidth: 70,
},
denyButton: {
  backgroundColor: '#f44336',
  padding: 10,
  borderRadius: 15,
},
buttonText: {
  color: '#fff',
  fontSize: 16,
  alignSelf: 'center',
},

});


{/*   <TouchableOpacity
          onPress={() => {
            Clipboard.setString(currentUser);
            Alert.alert('Copiado en el portapapeles.');
          }}
        >
          <Text style={{ marginTop: 20 }}  > Usuario: {currentUser ? currentUser : 'No hay usuario'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Clipboard.setString(currentPass);
            Alert.alert('Copiado en el portapapeles.');
          }}
        >
          <Text style={{ marginTop: 20 }}  > Contraseña: {currentPass ? currentPass : 'No hay contraseña'}</Text>
        </TouchableOpacity> */}