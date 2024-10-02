import React, { useEffect, useState } from 'react'
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { Linking, StyleSheet, Text, TouchableOpacity, View, Button, useWindowDimensions } from 'react-native';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BoxShadow } from 'react-native-shadow';


import { useAuthStore } from '../../../store/auth/useAuthStore';
import { BackButton } from '../../../components/shared/BackButton';
import { globalColors, globalStyles } from '../../../theme/theme';
import CustomHeader from '../../../components/CustomHeader';
import { PrimaryButton } from '../../../components/shared/PrimaryButton';
import { RootStackParams } from '../../../routes/StackNavigator';
import { ScrollView } from 'react-native-gesture-handler';

import datos from './datosPrueba.json';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Saldo {
  id: number;
  titular: number;
  valor: number;
  categoriaTitular: string;
  saldoBase: number;
  valorPlanContrato: number;
  AporteContrato: number;
  descuentos: string; 
  descuentosMonto: number;
  adicionales: string; 
  adicionalesMonto: number;
  periodo: number;
  linkDePago: string;
  pagado: boolean;
  gf: number; 
  medioPago: string;
  planDePago: number;
  tipoSaldo: string;
  revision: number;
  contratoId: number;
}

// Estado inicial vacío
const initialSaldo: Saldo[] = [];


const shadowOpt = {
  width: 350,
  height: 200,
  color: "#000",
  border: 8,
  shadowRadius: 21,
  radius: 3,
  opacity: 0.1,
  x: -5,
  y: 20,
  style: { marginVertical: 5 }
};

export const PagosScreen = () => {

  const { idAfiliadoTitular, cuilTitular } = useAuthStore();

  console.log('cuilTitular desde el FACTURA SCREEN---->', cuilTitular);


  const { top } = useSafeAreaInsets();

  const [formularios, setFormularios] = useState<{ nombre: string; descripcion: string; nombreArchivo: string }[]>([]);

  const [Saldos, setSaldos] = useState<Saldo[]>(initialSaldo);
  const [showAfiliados, setShowAfiliados] = useState(false);
  const [errores, setErrores] = useState<string>('');
  const [error, setError] = useState<string | null>(null);


/*   const Saldos = datos.data; */
  useEffect(() => {


    const PagosPeticion = async () => {
      console.log('entrando a PagosPeticion--------->>>>');
      try {
        const response = await axios.post(`https://fiscalizacion.createch.com.ar/contratos/paginador/aplicacion?afiliado=${cuilTitular}`);


        if (response.status === 200) {
          // Procesa la respuesta de la API
          const data = await response.data.data;
          if (Array.isArray(data)) {
            const extractedData = response.data.data.map((item: any) => ({
              id: item.id,
              cuilTitular: item.titular,
              debePagar: item.valor,
              categoriaTitular: item.categoriaTitular,
              saldoBase: item.saldoBase,
              valorPlanContrato: item.valorPlanContrato,
              AporteContrato: item.AporteContrato,
              descuentos: item.descuentos,
              descuentosMonto: item.descuentosMonto,
              adicionales: item.adicionales,
              adicionalesMonto: item.adicionalesMonto,
              periodo: item.periodo,
              linkDePago: item.linkDePago,
              pagado: item.pagado,
              gf: item.gf,
              medioPago: item.medioPago,
              planDePago: item.planDePago,
              tipoSaldo: item.tipoSaldo,
              revision: item.revision,
              contratoId: item.contratoId,
              
            }));
            setSaldos(extractedData);
          
          }
          else {
            setError('El formato de los datos recibidos no es el esperado.');
            console.log('no es array');

          }
        } else {
          setError("Error con los datos");
          console.log('la respuesta con errores de Cta Cte es--------->>>>', error);
        }

      } catch (error) {
        console.error('Error al obtener los pagos:', error);
        setError("Error con los datos");
      }
    };

    PagosPeticion()
  
  }, [])

  const handlePress = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Error al abrir el enlace:', err));
  };


  const { height } = useWindowDimensions();
  let modalsTitleFontSize = wp('4.5%');
  let paddingTopNumber = hp('8.5%');
  let cardTitleFontSize: number = hp('2.5%');
  if (height < 680) { // IMPORTANTE Pantallas más pequeñas como iPhone SE o iPhone 8 de 5.4 pulgadas o menos aproximadamente 
    paddingTopNumber = hp('5%');
    modalsTitleFontSize = wp('4.2%');
    cardTitleFontSize = hp('1.5%');
  }


  return (
    <View

      style={globalStyles.container}
    >
      <CustomHeader /* color={globalColors.gray2}  */titleSize={hp('4%')} />

      <BackButton Size={hp('4%')}/>

      <Text style={{ marginBottom: 0, marginTop: 5, fontSize: 25, textAlign: 'center', color: 'black' }}>Estado de Pagos</Text>
      <ScrollView >

        <View style={globalStyles.containerEstudiosMedicosEnv2}>
          {error ? (
            <View style={globalStyles.errorContainerEstudios}>
              <Text style={globalStyles.titleErrorEstMedicosEnv}>Problemas en la solicitud</Text>
              <Text style={globalStyles.errorTextEstudios}>Error: {error}</Text>
            </View>
          ) : (
            Saldos.map((saldo, index) => (
              <View key={saldo.id} style={[
                styles.cardWrapper,
                { marginBottom: saldo.pagado ? '4%' : '7%' },
              ]}
              >
                <BoxShadow setting={{ ...shadowOpt, height: showAfiliados ? 210 : 105 }} 
                  >

                  <View style={styles.card}>

                      
                    <Text style={[styles.resultText3, {fontSize: modalsTitleFontSize}]}>{saldo.tipoSaldo}</Text>

                    <Text style={[globalStyles.resultText2, {fontSize: modalsTitleFontSize}]}>Medio de Pago: {saldo.medioPago}</Text> 

                    { saldo.pagado === false ? 
                      (
                          <>
                          <Text style={[globalStyles.resultText2, { fontSize: modalsTitleFontSize}]}>Saldo: ${saldo.debePagar}</Text>
                        <TouchableOpacity style={styles.primaryButton45} onPress={() => handlePress(saldo.linkDePago)}>
                          <Text style={globalStyles.buttonText}>
                            Link de Pago
                          </Text>
                        </TouchableOpacity>
                          </>

                      ) : (

                    <View style={globalStyles.paidSign} >
                      <Text style={[globalStyles.buttonText, {fontSize: modalsTitleFontSize}]}>
                        Pagado
                      </Text>
                    </View>
                      )
                    }

                  </View>
                </BoxShadow>

              </View>
            ))
          )}
        </View>


      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto',
  },
  cardWrapper: {
    alignItems: 'center',
    marginBottom: '5%',
  },
  card: {
    width: 350,
    height: 'auto',
    marginTop: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
    borderRadius: 15,
  },
  primaryButton45: {
    backgroundColor: '#b74a4a',
    borderRadius: 5,
    padding: 5,
    margin: 10,
    marginTop: 10,
    marginBottom: 15,
    marginHorizontal: 60,
    paddingHorizontal: 10,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center'

  },
  resultText3: {
    fontSize: 18,
    /* fontSize: 18, */
    fontFamily: 'Quicksand-Light',
    margin: 0,
    marginTop: 10,
    color: 'black',
  },
});


