import React from 'react'
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native'
import { globalStyles } from '../../theme/theme';
import { FlatList } from 'react-native-gesture-handler';
import { PrimaryButton } from '../../components/shared/PrimaryButton';
import { type RootStackParams } from '../../routes/StackNavigator';



const products = [
  {id:1, name: 'Product'},
  {id:2, name: 'producto 2'},
  {id:3, name: 'producto 3'},
  {id:4, name: 'producto 4'},
  {id:5, name: 'producto 5'},
];

export const ProductsScreen = () => {


const navigation = useNavigation< NavigationProp < RootStackParams > >()

  return (
    <View style={ globalStyles.container }>
      <Text style={{marginBottom: 5, fontSize:30}}>Productos</Text>
      
      <FlatList
      data={ products }
      renderItem={ ( {item} )=> (
        <PrimaryButton
        onPress={ ()=> navigation.navigate('Credenciales', { id: item.id, name: item.name} )}
        label={ item.name}
        />
      )}
      />

    </View>
  )
}