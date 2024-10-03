// Divider.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { globalColors } from '../../theme/theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Prop {
  marginTopDivider?: number
}

const Divider: React.FC<Prop> = ({marginTopDivider}: Prop) => {
  return <View style={[styles.divider, {marginTop: marginTopDivider || wp('2%')}]} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 0.4,
    backgroundColor: globalColors.gray2,
    marginHorizontal: 40,
    alignSelf: 'stretch',
    marginBottom:wp('2%'),
 /*    marginTop:10, */
  },
});

export default Divider;
