import { DrawerActions, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import { IonIcon } from './IonIcon';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface BackButtonProps {
  goToPage?: string;
  onPress?: () => void;
  Size?: number;
}

export const BackButton = ({ goToPage, onPress, Size }: BackButtonProps) => {

    const navigation = useNavigation();


    // Función para manejar el retroceso
const handleGoBack = () => {
 navigation.goBack(); // Retroceder a la pantalla anterior
};

const handlePress = () => {
  if (onPress) {
    onPress(); // Llama a la función de callback proporcionada
 } else {
   navigation.goBack(); // Retroceder a la pantalla anterior
 }
};

    useEffect(() => {
        navigation.setOptions({
          headerLeft: () => (
            <Pressable onPress={handlePress}
            style={{marginLeft:20, marginBottom: 20, marginTop: wp('6%')}}
            >
           <IonIcon name='arrow-back' color= { 'white' } size = {Size || 35}/> 
            </Pressable>
            
          )
        })
        
      }, [navigation, goToPage])


      return (<></>);
}
