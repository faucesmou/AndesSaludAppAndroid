import React from 'react'
import { Text, View, Dimensions } from 'react-native'
import { StackActions, type NavigationProp, useNavigation} from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuthStore } from '../../../store/auth/useAuthStore'
import { RootStackParams } from '../../../routes/StackNavigator'
import { globalColors } from '../../../theme/theme'
import CustomHeader from '../../../components/CustomHeader'
import { BackButton } from '../../../components/shared/BackButton'
import { MisDatosScreen } from '../../profile/MisDatosScreen'
import { TertiaryButton } from '../../../components/shared/TertiaryButton'
import { useNotificationStore } from '../../../store/notification-store'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


/* interface OnPressHandler {
  logout: () => Promise<void>;
  setOrderNotifications: (notifications: Notification[]) => void;
  setMedicalNotifications: (notifications: Notification[]) => void;
} */

export const SettingsScreen = () => {
  const { logout } = useAuthStore()
  const { top } = useSafeAreaInsets()
  const setMedicalNotifications = useNotificationStore((state) => state.setMedicalNotifications);
  const setOrderNotifications = useNotificationStore((state) => state.setOrderNotifications);

 const navigator =useNavigation(); 
const navigation = useNavigation<NavigationProp<RootStackParams>>()
const colorNaranja = globalColors.orange


/* const handleReset = () => {
  navigation.reset({
    index: 0,
    routes: [{ name: 'LoginScreen' }],
  });
}; */
/* const handleReset = async () => {
  await logout(); 
  navigation.reset({
    index: 0,
    routes: [{ name: 'LoginScreen' }],
  });
}; */

const { height } = Dimensions.get('window');

 
 let buttonTextFontSize = wp('5%');
 let buttonDescriptionFontSize = wp('4.5%');
 

 if (height < 680) { // IMPORTANTE Pantallas más pequeñas como iPhone SE o iPhone 8 de 5.4 pulgadas o menos aproximadamente 
 

  buttonTextFontSize = wp('4.2%');
  buttonDescriptionFontSize = wp('4%');

}

  return (
    <View 
    style={ {
      flex: 1,
      paddingHorizontal: 20,
      marginTop: 20 ,
      
    }}
    >
      <View
      style={{ alignItems:'center'}}
      >

      <CustomHeader  /* color={globalColors.black}  */ />
      </View>
       <BackButton /> 
     {/*    <Text style={{marginBottom: 10}}> Settings Screen</Text> */}


        <MisDatosScreen/>

         <TertiaryButton
           onPress={()=> navigation.navigate('Buzón') }
          label="Buzón de Avisos"
          color={globalColors.profile2}
          iconName='mail-unread-outline'
          textSize={buttonTextFontSize} 
          descriptionSize={buttonDescriptionFontSize}
      /*     description='Gestioná la orden de tus estudios' */
        />

         <TertiaryButton
          onPress={
            logout
             } 
          label="Cerrar Sesión"
          color={globalColors.profile2}
          iconName='power-outline' 
          textSize={buttonTextFontSize} 
          descriptionSize={buttonDescriptionFontSize}
          /*  iconName='caret-forward-circle-outline' */
         /*  iconName='log-out-outline' */
      /*     description='Gestioná la orden de tus estudios' */
        />

      <TertiaryButton
        onPress={() => navigator.goBack()}
        label="Regresar"
        color={globalColors.profile2}
        iconName='medkit-outline'
        textSize={buttonTextFontSize} 
        descriptionSize={buttonDescriptionFontSize}
      /*     description='Gestioná la orden de tus estudios' */
      />
    </View>
  )
}