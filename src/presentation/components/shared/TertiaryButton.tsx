import { useNavigation } from '@react-navigation/native'; //supuestamente esto generaba anidacion( revisar )
import React from 'react'
import { Pressable, StyleSheet, Text, View, TextStyle  } from 'react-native';
import { globalColors, globalStyles } from '../../theme/theme';
import { IonIcon } from './IonIcon';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Props {
    onPress: () => void;
    label?: string;
    id?: any;
    color?: string;
    disabled?: boolean;
    iconName?: string;
    description?: string;
    textSize?:number;
    descriptionSize?: number;
    textAlign?: TextStyle['textAlign']
}


export const TertiaryButton = ( { onPress, label, color, disabled, iconName, description, textSize, textAlign, descriptionSize }: Props) => {
  const backColor = disabled ? globalColors.disabled : (color ? color : globalColors.background);
 
  const navigation = useNavigation();


  
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed && !disabled ? 'lightgray' : backColor,
          opacity: disabled ? 0.5 : 1,
        },
        styles.TertiaryButton
      ]}
    >
      <View style={styles.contentWrapper2}>
        <View style={styles.textWrapper}>
          {label && (
            <Text /* style={[styles.buttonText, { fontSize: textSize ? textSize : 20, textAlign: textAlign ? textAlign : 'left'  }] } */
            style={StyleSheet.flatten([styles.buttonText, { fontSize: textSize || wp('5%'), textAlign: textAlign || 'left' }])}
            >
              {label}
            </Text>
          )}
          {description && (
            <Text style={[styles.descriptionText, { fontSize: descriptionSize || wp('4.5%') }]}>
              {description}
            </Text>
          )}
        </View>
        {iconName && (
          <View style={styles.iconWrapper}>
            <IonIcon name={iconName} size={hp('4%')} color="gray" />
          </View>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  TertiaryButton: {
    backgroundColor: 'white',
  minWidth: wp('80%'),
/*   minWidth: '80%',  */
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    padding: wp('2%'),
   /*  padding: 10, */
    margin: wp('1%'),
   /*  margin: 5, */
    marginBottom: wp('2%'),
   /*  marginBottom: 10, */
    marginHorizontal: wp('3%'),
   /*  marginHorizontal: 15, */
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal:wp('1%'),
  /*   paddingHorizontal:5, */
  },
  textWrapper: {
    flex: 1,
    paddingRight: wp('1%'),
   /*  paddingRight: 5, */
  },
  iconWrapper: {
    justifyContent: 'flex-end',
    marginLeft: wp('1%'),
   /*  backgroundColor:'blue', */
   /*  marginLeft: 10, */
  },
  buttonText: {
    color: 'black',
    fontSize: wp('3.2%'),
    /* fontSize: 20, */
    fontWeight: 'normal',
  },
  descriptionText: {
    color: 'gray',
    fontSize: wp('4.5%'),
    /* fontSize: 18, */
  },
});