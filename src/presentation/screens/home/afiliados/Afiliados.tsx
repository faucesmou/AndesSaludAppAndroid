import React, { useEffect, useState } from 'react'
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import axios from 'axios';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { globalColors } from '../../../theme/theme';
import { RootStackParams } from '../../../routes/StackNavigator';
import CustomHeader from '../../../components/CustomHeader';
import { BackButton } from '../../../components/shared/BackButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FullScreenLoader } from '../../../components/ui/FullScreenLoader';
import { FlatList } from 'react-native-gesture-handler';
import { TertiaryButton } from '../../../components/shared/TertiaryButton';
/* import { globalColors, globalStyles } from '../../theme/theme';
import { FlatList } from 'react-native-gesture-handler';
import { PrimaryButton } from '../../components/shared/PrimaryButton';
import { type RootStackParams } from '../../routes/StackNavigator';
import { BackButton } from '../../components/shared/BackButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomHeader from '../../components/CustomHeader';
import { useAuthStore } from '../../store/auth/useAuthStore';
import Credencial from '../../components/shared/Credencial';
import { TertiaryButton } from '../../components/shared/TertiaryButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FullScreenLoader } from '../../components/ui/FullScreenLoader'; */


/* const products = [
  {id:1, name: 'Product'},
  {id:2, name: 'producto 2'},
  {id:3, name: 'producto 3'},
  {id:4, name: 'producto 4'},
  {id:5, name: 'producto 5'},
]; */

export const Afiliados = () => {

  const { idAfiliado } = useAuthStore();

  const { top } = useSafeAreaInsets();

  const [products, setProducts] = useState<{ apellidoYNombre: string; nroAfiliado: string; idAfiliado: any }[]>([]);
  
  const [isConsulting, setIsConsulting] = useState(false);
  
  useEffect(() => {
    setIsConsulting(true);
    const ProductsRequest = async () => {
      try {
        const response = await axios.get(`https://andessalud.createch.com.ar/api/obtenerFamiliares?idAfiliado=${idAfiliado}`);
          console.log('EL RESPONSE DE AFILIADOS ES : ---------x-x-x-x-x-x->', response);
console.log('este es el RESPONSE.data.data DE CRISTIAN: de familiares --======>>', response.data.data )
        const mappedProducts = response.data.data.map((item: { apellidoYNombre: any; nroAfiliado: any; idAfiliado: any }) => ({
          apellidoYNombre: item.apellidoYNombre,
          nroAfiliado: item.nroAfiliado,
          idAfiliado: item.idAfiliado
        }));

        setProducts(mappedProducts);
        console.log('este es el mappedProducts:---x-x-x-x-<<>>>', mappedProducts);
        setIsConsulting(false);


      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };
    ProductsRequest()

  }, [])

  const color = globalColors.gray
  const navigation = useNavigation<NavigationProp<RootStackParams>>()
  console.log('este es el products:', products);
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
        marginTop: 20,
        /* backgroundColor: 'green', */
        marginBottom: 0,

      }}
    >
      <CustomHeader /* color={globalColors.gray2} */ titleSize={hp('4%')} />

      <BackButton Size={hp('4%')}/>
      {/* <Text style={{ marginBottom: 5, fontSize: 25, textAlign: 'center', color: 'black' }}>Afiliados a Cargo</Text> */}
      <Text style={{
        marginBottom: wp('2%'),
        marginTop: 0,
        fontSize: hp('3.5%'),
        textAlign: 'center',
        color: globalColors.gray,
        fontWeight: 'bold'
      }}>Afiliados a Cargo</Text>

      <View
        style={{
          marginBottom: 0, marginTop: 0, /* backgroundColor: 'yellow', */
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: hp('2.5%'),
            marginBottom: 10,
            marginTop: 10,
            padding: 0,
            marginHorizontal: 10,
            /* color: 'black', */
            color: globalColors.gray2,
            fontWeight: 'bold'
          }}
        >Selecciona un familiar para ver su credencial:</Text>

        
          {
            
            isConsulting ? (

              <View
                style={{
                  flex: 0.5,
                  marginTop: top - hp('-4%'),
                  marginBottom: hp('6%'),
                }}
              >
                <FullScreenLoader  />
              </View>
    
            )
              :
            
            
            <FlatList
            style={{  /*  backgroundColor: 'orange', */  marginBottom: 0, padding: 5, width: '100%',  maxHeight: '80%'  }}
            data={products}
            renderItem={({ item }) => (
              <TertiaryButton

                onPress={() => navigation.navigate('Credenciales', { id: item.apellidoYNombre, nroAfiliado: item.nroAfiliado, idAfiliado: item.idAfiliado })}
                label={item.apellidoYNombre}
                textSize={18}
                textAlign={'center'}
                /*               label={<Text style={{ fontSize: 18, textAlign:'center' }}>{item.apellidoYNombre}</Text>}  */
                color={color}
              />
            )}
          />}
  

      </View>

   

      <View style={styles.imageContainer}>

        <View
          style={styles.innerContainer}
        >
          <Text style={{
            fontSize: wp('6%'),
            textAlign: 'center',
            /* color: '#cccccc' */
            color: globalColors.gray,
          }} >
            Andes Salud
          </Text>

          <Image source={require('../../../assets/images/logogrisClaro.png')}
            style={styles.image}
            resizeMode="contain" // Ajusta la imagen manteniendo su relación de aspecto
          />
        </View>
      </View>
   
    </View>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    marginBottom: 30,
    marginHorizontal:35,
    marginTop: 0,
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
    flex: 0.6,
    width: '80%',
    height: '80%',
    margin: 10,
  }
});

      {/*  <View style={{ marginTop: 0, }}>
        <TertiaryButton
          onPress={() => navigation.navigate('EstudiosMedicos')}
          label="TertiaryButton Example"
          color={globalColors.profile2}
          iconName='medkit-outline'
          description='Gestioná la orden de tus estudios'
        />

      </View> */}

        {/*  <View
        style={{
          marginBottom: 100, marginTop: 50, justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 10
          }}
        > Texto / imagen </Text>
      </View> */}
      {/*  <View
        style={{
          marginBottom: 350, marginTop: 0, backgroundColor: 'yellow', flex: 1, justifyContent: 'top',
          alignItems: 'center',
        }}
      >

        <Credencial />

      </View> */}