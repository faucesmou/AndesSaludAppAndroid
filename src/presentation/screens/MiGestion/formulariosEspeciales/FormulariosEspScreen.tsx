import React, { useEffect, useState } from 'react'
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { Text, View, Linking, ScrollView, Dimensions } from 'react-native';

import axios from 'axios';

import { FlatList } from 'react-native-gesture-handler';



import { useSafeAreaInsets } from 'react-native-safe-area-context';


import { xml2js } from 'xml-js';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { BackButton } from '../../../components/shared/BackButton';
import { globalColors, globalStyles } from '../../../theme/theme';
import CustomHeader from '../../../components/CustomHeader';
import { PrimaryButton } from '../../../components/shared/PrimaryButton';
import { RootStackParams } from '../../../routes/StackNavigator';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';



/* const products = [
  {id:1, name: 'Product'},
  {id:2, name: 'producto 2'},
  {id:3, name: 'producto 3'},
  {id:4, name: 'producto 4'},
  {id:5, name: 'producto 5'},
]; */

export const FormulariosEspScreen = () => {

  const { idAfiliadoTitular } = useAuthStore();
 /*  console.log('idAfiliadoTitular ---->', idAfiliadoTitular); */



  const { top } = useSafeAreaInsets();

  const [formularios, setFormularios] = useState<{ nombre: string; descripcion: string; nombreArchivo: string }[]>([]);
  useEffect(() => {

    const FormsRequest = async () => {
      try {
        const response = await axios.get(`https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/APPObtenerFormulariosEspeciales?idAfiliadoTitular=${idAfiliadoTitular}`);

        const xmlData = response.data;

        // Convertir XML a JSON
        const result = xml2js(xmlData, { compact: true });

        const formulariosData = result.Resultado.fila.datos;
        console.log('formulariosData---->', formulariosData);

        const { nombre, descripcion, nombreArchivo } = formulariosData;
        // Combina los elementos de las listas en un solo objeto por formulario
        const mappedFormularios = nombre.map((_: any, index: number) => ({
          nombre: nombre[index]._text,
          descripcion: descripcion[index]._text,
          nombreArchivo: nombreArchivo[index]._text,
        }));
        /*  const mappedFormularios = Array.isArray(formulariosData)
         ? formulariosData.map((form: any) => ({
             nombre: form.nombre._text,
             descripcion: form.descripcion._text,
             nombreArchivo: form.nombreArchivo._text,
           }))
         : [{
             nombre: formulariosData.nombre._text,
             descripcion: formulariosData.descripcion._text,
             nombreArchivo: formulariosData.nombreArchivo._text,
           }]; */
        setFormularios(mappedFormularios);

/*         console.log('este es el mappedProducts:', mappedFormularios); */
/*         console.log('este es el formularios useState:', formularios); */

      } catch (error) {
        console.error('Error al obtener los formularios:', error);
      }
    };
    FormsRequest()

  }, [idAfiliadoTitular])

  const navigation = useNavigation<NavigationProp<RootStackParams>>()

 /*  const handleDescargarFormulario = (nombreArchivo: string) => {
    const url = `https://www.prestacional.saludnuevocuyo.com.ar/ClientBin/DocumentosDownload/${nombreArchivo}`;
    console.log('formulario nombre elegido: ---->', nombreArchivo);
    navigation.navigate('Formulario', { url });
  }; */
  const handleDescargarFormulario = (nombreArchivo: string) => {
    const url = `https://www.prestacional.saludnuevocuyo.com.ar/ClientBin/DocumentosDownload/${nombreArchivo}`;

    console.log('URL DE formularios Esp Screen: -->', url);
    Linking.openURL(url)
      .catch(err => console.error('Error al abrir URL: ', err));
  };

  const color = globalColors.orange


  return (
    <View
   
      style={globalStyles.container}
  
    >
      <CustomHeader /* color={globalColors.black}  */titleSize={hp('4%')}  />

      <BackButton Size={hp('4%')} />
 <ScrollView
 contentContainerStyle={{ flexGrow: 1 }}
 >    
      {/* <Text style={{ marginBottom: 5, marginTop: 5, fontSize: 25, textAlign: 'center', color: 'black' }}>Formularios Especiales</Text> */}

      <Text style={{
        marginBottom: wp('2%'),
        marginTop: 0,
        fontSize: hp('3.2%'),
        textAlign: 'center',
        color: globalColors.gray2,
        fontWeight: 'bold'
      }}>Formularios Especiales</Text>

      <View style={{ /* backgroundColor: 'green', */  flex: 1, marginBottom: 30, marginTop: 15 }}>
        {formularios.map((formulario, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'black' }}>{formulario.nombre}</Text>
            <Text  style={{fontSize: 15, marginBottom:10, color: 'black' }}>{formulario.descripcion}</Text>
            <Text style={{ color: '#0e77e7',  fontSize: 15, fontWeight:'bold'  }} 
            onPress={() => handleDescargarFormulario(formulario.nombreArchivo)}            
            >
              Descargar Formulario
            </Text>
          </View>
        ))}
      </View>
</ScrollView> 
    </View>

  )
}
{/* <FlatList
        data={products}
        renderItem={({ item }) => (
          <PrimaryButton
            onPress={() => navigation.navigate('Product', { id:item.apellidoYNombre, nroAfiliado: item.nroAfiliado })}
            label={item.apellidoYNombre} 
            color={color} 
          />
        )}
      /> */}
