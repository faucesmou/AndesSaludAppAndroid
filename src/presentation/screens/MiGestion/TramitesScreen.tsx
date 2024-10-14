import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Image, Pressable, Dimensions } from 'react-native'
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



export const TramitesScreen = () => {
  console.log('Entrando a TramitesScreen (Mi Gestion)')

  const { top, bottom } = useSafeAreaInsets();

 /* mejorando responsividad: */
 const { height } = Dimensions.get('window');

 let headerHeight = hp('16%'); // Ajusta el tamaño de la cabecera según el alto de la pantalla
 let buttonTextFontSize = wp('4.5%');
 let buttonDescriptionFontSize = wp('4%');
 let cardTitleFontSize: number = hp('2.6%');
let cardDescriptionFontSize: number = hp('2%');
let iconNotificationFontSize: number = wp('8%');
let titleMarginBottom: number  = hp('4%'); 
let iconMarginBottom: number  = hp('7%');  
let arrowMarginBottom: number  = hp('4%');  
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


  const navigation = useNavigation<NavigationProp<RootStackParams>>()

/*   useEffect(() => {
    setShouldUpdateNotifications(true);
  }, []); */

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
            fontWeight:'bold',
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

          <Text style={{ fontSize: cardDescriptionFontSize,
    textAlign: 'center',
    color: 'black',}}>Gestioná todas tus solicitudes</Text>
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



          <TertiaryButton
            onPress={() => navigation.navigate('Formularios')}
            label="Obtener Formularios Especiales"
            color={globalColors.profile2}
            iconName='document-text-outline'
            description='Descargá tus formularios'
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
   alignSelf:'center',
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
    marginHorizontal:wp('3%'),
/*     backgroundColor: 'yellow' */
  },
  imageContainer: {
    marginBottom: 30,
    marginHorizontal:35,
    marginTop: 40,
    zIndex: 1.5,
    alignItems: 'center',
     justifyContent: 'center', 
    minHeight:'40%',
    minWidth: '50%'
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