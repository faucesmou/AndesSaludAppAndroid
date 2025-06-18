import React, { useEffect, useState } from 'react'
import { Text, View, Dimensions, Linking, ScrollView } from 'react-native'
import { StackActions, type NavigationProp, useNavigation } from '@react-navigation/native'
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



export const EstadoDeMisPagos = () => {

  const { top } = useSafeAreaInsets()

  const navigation = useNavigation<NavigationProp<RootStackParams>>()

  const { height } = Dimensions.get('window');


  let buttonTextFontSize = wp('5%');
  let buttonDescriptionFontSize = wp('4.5%');


  if (height < 680) { // IMPORTANTE Pantallas más pequeñas como iPhone SE o iPhone 8 de 5.4 pulgadas o menos aproximadamente 


    buttonTextFontSize = wp('4.2%');
    buttonDescriptionFontSize = wp('4%');

  }
  

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 20,

      }}
    >
      <View
        style={{ alignItems: 'center' }}
      >

        <CustomHeader   titleSize={hp('3.5%')} />
      </View>
      <BackButton Size={20} />
      {/*    <Text style={{marginBottom: 10}}> Settings Screen</Text> */}

<ScrollView>

  

     {/*  <MisDatosScreen /> */}

      <TertiaryButton
        onPress={() => navigation.navigate('Pagos')}
        label="Pagar"
        color={globalColors.profile2}
        iconName='mail-unread-outline'
        textSize={buttonTextFontSize}
        descriptionSize={buttonDescriptionFontSize}
          description='Estados de pago, opciones de pago'
      />
      <TertiaryButton
        onPress={() => navigation.navigate('Facturas')}
        label="Descargar Facturas"
        color={globalColors.profile2}
        iconName='mail-unread-outline'
        textSize={buttonTextFontSize}
        descriptionSize={buttonDescriptionFontSize}
          description='Historial y descarga de facturas'
      />

      
</ScrollView>
    </View>
  )
}