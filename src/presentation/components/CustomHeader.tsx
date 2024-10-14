// CustomHeader.js
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { globalColors } from '../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  color?: string;
  titleSize?: number;
}

const CustomHeader = ( {color, titleSize} : Props) => {
  const navigation = useNavigation();


  const { top, bottom } = useSafeAreaInsets();
  const headerHeight = hp('13%'); // Altura inicial del encabezado
  const adjustedHeaderHeight = headerHeight + top; // Ajusta la altura para tener en cuenta los márgenes seguros
  const backColor = color ? color : '#e1a159'/* '#7ba1c3' *//* globalColors.profile2 */

  React.useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        /* backgroundColor: backColor,  */
        height: adjustedHeaderHeight,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontSize: titleSize? titleSize : 35, // tamaño título del header
        marginBottom: 25, fontWeight:'bold', 
        marginTop: wp('6%'),       
      },
      headerTitleAlign: 'center',
      headerBackground: () => (
        <LinearGradient
          colors={['#e49958','#e49958','#e1a159', '#e1a159','#e1a159', '#e49958','#e49958','#e49958', ]} // El gradiente de colores
          start={{ x: 0, y: 0 }} // Degradado desde la esquina superior izquierda
          end={{ x: 1, y: 2.5 }} // Hacia la esquina inferior derecha
          style={{ flex: 1, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}
        />
      ),

    });
  }, [navigation, backColor, titleSize, adjustedHeaderHeight]);

  return null; 
};

export default CustomHeader;
