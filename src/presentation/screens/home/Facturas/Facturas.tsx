import React, { useEffect, useState } from 'react'
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { Linking, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
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

import datos from './datosFacturas.json';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FullScreenLoader } from '../../../components/ui/FullScreenLoader';


// Define los tipos
interface Padron {
  nombre: string;
  cuil: number;
  edad: string;
  plan: string;
}

interface FacturasInt {
  id:string;
  periodo: number;
  tipoSaldo: string;
  medioPago: string;
  linkMp: string;
  pagados: string;
  padrones: Padron[];
  periodoString: string;
  facturas:string;
  idUnico:string;
  periodo2:string;
}

// Estado inicial vacío
const initialSaldo: FacturasInt[] = [];


const shadowOpt = {
  width: 350,
  height: 200,
  color: "#000",
  border: 8,
  radius: 3,
  shadowRadius: 15,
  opacity: 0.1,
  x: -1,
  y: 20,
  style: { marginVertical: 5 }
};

export const Facturas = () => {

  const { idAfiliadoTitular, cuilTitular,  } = useAuthStore();


  console.log('ENTRANDO A FACTURAS---->>>', );
  console.log('El cuilTitular es---->>>', cuilTitular );

  const navigation = useNavigation<NavigationProp<RootStackParams>>()
  const { top } = useSafeAreaInsets();

  const [formularios, setFormularios] = useState<{ nombre: string; descripcion: string; nombreArchivo: string }[]>([]);


  const [Facturas, setFacturas] = useState<FacturasInt[]>(initialSaldo);
  const [UrlDescarga, setUrlDescarga] = useState<FacturasInt[]>(initialSaldo);
  const [showAfiliados, setShowAfiliados] = useState(false);
  const [errores, setErrores] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [errorGenerandoFactura, setErrorGenerandoFactura] = useState<string | null>(null);
  const [mensajeFactura, setMensajeFactura] = useState<string | null>(null);
  const [UrlFacturaGenerada, setUrlFacturaGenerada] = useState<string | null>(null);
 
  const [isConsulting, setIsConsulting] = useState(false);
  const [isError, setIsError] = useState(false);
  //probando modificar individualemnte los botones
  const [Facturas2, setFacturas2] = useState<FacturasInt[]>([]);
  const [mensajeFacturas, setMensajeFacturas] = useState<{ id: string, mensaje: string }[]>([]);


  const parsearFecha = (numero: any): string => {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const string = numero.toString();
    const mes = parseInt(string.substring(string.length - 2, string.length));
    const year = string.substring(0, string.length - 2);

    if (!isNaN(mes) && mes >= 1 && mes <= 12) {
      const elemento = meses[mes - 1];
      const completo = `${elemento} de ${year}`;
      return completo;
    }
    return '';
  }


  /* const fechaMes = () => {
    let fecha = new Date()
    let year = fecha.getFullYear()
    let mes = fecha.getMonth() + 1
    if (mes < 10) {
        mes = 0${mes}
    }
    return ${year}${mes}
  }  */

  /*  const Facturas = datos.data; */

  useEffect(() => {

    const FacturasRequest = async () => {

      setIsConsulting(true);
      try {
        const response = await axios.get(`https://fiscalizacion.createch.com.ar/facturacion/api/total?titular=${cuilTitular}`);

       /*  console.log('la respuesta de cristian es: response.data.data--------->>>>', response.data.data); */

        const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        if (response.status === 200) {
          // Procesa la respuesta de la API
          const data = await response.data.data;
          if (Array.isArray(data)) {
            const extractedData = response.data.data.map((item: any) => ({
              id: item.id,
              periodo: item.periodo,
              idUnico: item.idUnico,
              sujetoFacturable: item.sujetoFacturable,
              linkMp: item.linkMp,
              pagados: item.pagados,
              facturas: item.facturas,
              periodoString: parsearFecha(item.periodo),
            }));
            //invierto el orden para mostrar del más reciente al más antiguo:
            const reversedData = extractedData.reverse();


            setFacturas(reversedData);
            setIsConsulting(false);
          }
          else {
            setError('El formato de los datos recibidos no es el esperado.');
            console.log('no es array');
            setIsConsulting(false);
            setIsError(true)

          }
        } else {
          setError("Error con los datos");
          console.log('la respuesta con errores de FacturasRequest es--------->>>>', error);
          setIsConsulting(false);
          setIsError(true)
        }

      } catch (error) {
        console.error('Error al obtener FacturasRequest :', error);
        setError("Error con los datos");
        setIsConsulting(false);
        setIsError(true)

      }
    };
    FacturasRequest()
    
/*     console.log('la respuesta de cristian Facturas es--------->>>>', Facturas); */
  }, [])

  const handlePress = (url: string ) => {

    Linking.openURL(url).catch((err) => console.error('Error al abrir el enlace de factura:', err));
 
  
}


  const FacturasRequest2 = async ( existeFactura: string, idUnico: string) => {

      console.log('entrando a FACTURAREQUEST2 ---------->');
      
    try {
     if (existeFactura === "Si" ) {  
      console.log('INICIANDO CONSULTA DE FACTURA CON idUnicoFactura---------->', idUnico);
      const response = await axios.get(`https://fiscalizacion.createch.com.ar/facturacion/api/external?idUnico=${idUnico}`);



      if (response.status === 200) {
        // Procesa la respuesta de la API
        const data = await response.data.data;
        if ((data)) {
          let UrlDescarga = data.UrlComprobante;
          console.log('la UrlDescarga es-------------->>>>>>>>>>>: ', UrlDescarga);
      
         handlePress(UrlDescarga)
        } else {
          setError('El formato de los datos recibidos no es el esperado.');
          console.log('no es array');
       
        }
      } else {
        setError("Error con los datos");
        console.log('Error en la consulta factura con id unico.Error>>>>', error);
     
      } 
      
    }  else {
     
      console.log('No existe factura para descargar');
   
    }
    } catch (error) {
      console.error('Error al obtener las facturas:', error);
    /*   console.log('Detalles completos del error---->', error.response); */
      setError("Error con los datos");
     
    }
   /*  console.log('Fin de la funcion FacturaRequest2 con el idUnico >>>', idUnicoFactura); */
  }
  const GenerarFactura = async ( existeFactura: string, idUnico: string, periodo2: string ) => {

      console.log('entrando a GENERAR FACTURA---------->');
      
    try {
     if (existeFactura === "No" ) {  
      console.log('INICIANDO GENERACION DE FACTURA CON idUnicoFactura---------->', idUnico);
      console.log('INICIANDO GENERACION DE FACTURA CON periodo2---------->', periodo2);
      const response = await axios.post(`https://fiscalizacion.createch.com.ar/facturacion/api/url-factura?titular=${cuilTitular}&idUnico=${idUnico}&periodo=${periodo2}`);
      console.log('los datos de generar factura recibidos son---------->response>>>', response);
      if (response.status === 200) {
        // Procesa la respuesta de la API
        const data = await response.data.meta;
        console.log('los datos de generar factura recibidos son---------->data>>>', data);
        if ((data)) {
          let mensajeFacturaGenerada = data.msg;
          let urlFactura = data.urlFactura
          console.log('el urlFactura---------->>>>', urlFactura);
          if (urlFactura != ""){
            setUrlFacturaGenerada(urlFactura);
            handlePress(urlFactura)
          }
          console.log('el mensaje de factura generada es: Descarga de factura generada es-------------->>>>>>>>>>>: ', mensajeFacturaGenerada);
          setMensajeFactura(mensajeFacturaGenerada)
          setErrorGenerandoFactura(''); 

        } else {
          setError('El formato de los datos recibidos no es el esperado.');
          setMensajeFactura(''); 
          setErrorGenerandoFactura('Reintentar más tarde.');
          console.log('no es array');
       
        }
      } else {
        setError("Error con los datos");
        console.log('Error en la generacion de factura con id unico.Error>>>>', error);
        setErrorGenerandoFactura('Reintentar más tarde.');
        setMensajeFactura('');
      
     
      } 
      
    }  else {
     
      console.log('No existe factura para descargar / generar');
      setErrorGenerandoFactura('Reintentar más tarde.');
      setMensajeFactura('');
    }
    } catch (error) {
      console.error('Error al obtener las facturas:', error);
      setErrorGenerandoFactura('Reintentar más tarde.');
      setMensajeFactura('');
    
     
    }
    console.log('Fin de la funcion generar factura con el idUnico >>>', idUnico);
  }

  const GenerarFactura2 = async (id: string, existeFactura: string, idUnico: string, periodo2: string) => {
    try {
      console.log('INICIANDO CONSULTA DE GenerarFactura2 ---------->');
      if (existeFactura === "No") {
        const response = await axios.post(`https://fiscalizacion.createch.com.ar/facturacion/api/url-factura?titular=${cuilTitular}&idUnico=${idUnico}&periodo=${periodo2}`);

        console.log('RESPONSE DE CONSULTA DE GenerarFactura2---------->', response);

        const data = response.data.meta;
        if (data) {
          const mensajeFacturaGenerada = data.msg;
          const urlFactura = data.urlFactura;
          if (urlFactura) {
            handlePress(urlFactura);
          }
          else if(mensajeFacturaGenerada === 'Factura no creada SALDO IGUAL 0' ) {
            console.log('entrando en else if facutra no creada..--->');
            
            let mensajeSaldoCero = 'Factura con saldo $0'
            setMensajeFacturas(prev => [...prev.filter(item => item.id !== id), { id, mensaje: mensajeSaldoCero }]);
          
          } else {

            setMensajeFacturas(prev => [...prev.filter(item => item.id !== id), { id, mensaje: mensajeFacturaGenerada }]);
          }
        } else {
          setMensajeFacturas(prev => [...prev.filter(item => item.id !== id), { id, mensaje: 'Reintentar más tarde.' }]);
        }
      } else {
        setMensajeFacturas(prev => [...prev.filter(item => item.id !== id), { id, mensaje: 'Reintentar más tarde.' }]);
      }
    } catch (error) {
      setMensajeFacturas(prev => [...prev.filter(item => item.id !== id), { id, mensaje: 'Reintentar más tarde.' }]);
    }
  };
  const getButtonText2 = (id: string) => {
    const mensajeObj = mensajeFacturas.find(item => item.id === id);
    return mensajeObj ? mensajeObj.mensaje : 'Generar';
  };
  const getButtonText = () => {
    if (mensajeFactura === 'Factura Enviada' || mensajeFactura === 'Factura Actualizada') {
      return 'Factura generada';
    }
    if (errorGenerandoFactura) {
      return 'Reintentar más tarde';
    }
    return 'Generar';
  };

  
  

  return (
    <View

      style={globalStyles.container}
    >
      <CustomHeader titleSize={hp('4%')} />

      <BackButton Size={hp('4%')} />

      <Text style={{
        marginBottom: wp('2%'),
        marginTop: wp('-1%'),
        fontSize: hp('3.5%'),
        textAlign: 'center',
        color: globalColors.gray2,
        fontWeight: 'bold'
      }}>Descargá tus Facturas</Text>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
      >

        <View style={{ ...globalStyles.containerEstudiosMedicosEnv2, marginTop: 0 }}>
          {
            isConsulting ?
              (
                <>

                  <View
                    style={{
                      flex: 0.5,
                      marginTop: top - hp('-5%'),
                      marginBottom: hp('6%'),
                      marginHorizontal: wp('9%'),
                    }}
                  >
                    <View style={styles.noDataContainer}>
                      <Text style={styles.noDataText}>
                        Aguardá un momento mientras obtenemos tus Facturas
                      </Text>
                      <Text style={styles.noDataText}>
                        Esto puede tomar unos segundos
                      </Text>

                    </View>
                  </View>
                  <FullScreenLoader />

                </>

              )
              : isError ? (

          <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>
                ¡Ups! Parece que algo salió mal. 
                </Text>
                <Text style={styles.noDataText}>
               Por favor, intenta nuevamente más tarde. 
                </Text>
                <Text style={styles.noDataText2}>
                Si el problema persiste, no dudes en comunicarte con nuestro servicio de atención al cliente
                </Text>
              </View>
           )
           :
           (
       
            Facturas.map((factura, index) => (


              <View style={styles.cardWrapper}
        
                key={index}

              >
                <BoxShadow setting={{ ...shadowOpt, height: showAfiliados ? 210 : 105 }} >
                  <View style={styles.card}>

                    <Text style={globalStyles.resultText3}>Período: {factura.periodoString}</Text>
                    <Text style={globalStyles.resultText2}>Estado del pago: {factura.pagados ? 'Pagado' : 'Pendiente'}</Text>

                    {!factura.pagados ?
                      (
                        <TouchableOpacity
                          style={globalStyles.primaryButton2}
                          onPress={() => handlePress(factura.linkMp)}
                        >
                          <Text style={globalStyles.buttonText}>
                            Link de Pago
                          </Text>
                        </TouchableOpacity>

                      ) :

                      (
                        factura.facturas === "Si" ? (

                          <TouchableOpacity
                            style={globalStyles.paidButton}
                            onPress={async () => {
                              let existeFactura = factura.facturas;
                              let idUnico = factura.idUnico;
                              await FacturasRequest2(existeFactura, idUnico)
                            }}
                          >

                            <Text style={globalStyles.buttonText}>
                              Descargar
                            </Text>

                          </TouchableOpacity>

                        )
                          :
                          (
                            <>
                             
                              <TouchableOpacity
                          style={globalStyles.paidButton}
                          onPress={async () => {
                            await GenerarFactura2(factura.id, factura.facturas, factura.idUnico, String(factura.periodo));
                          }}
                        >
                          <Text style={globalStyles.buttonText}>{getButtonText2(factura.id)}</Text>
                        </TouchableOpacity>  

                  </>

                  )

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
    marginBottom: 15,
    borderRadius: 15,
  
  },
  card: {
    width: 350,
    height: 'auto',
    marginTop: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
  },
    /* Cartel de error: no se pudieron obtener las facturas:  */
    noDataContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noDataText: {
      fontSize: wp('4.5%'),
      color: 'gray',
      textAlign: 'center',
      marginTop:wp('3%'),
    },
    noDataText2: {
      fontSize: wp('4%'),
      color: 'gray',
      textAlign: 'center',
      marginTop:wp('8%'),
    },
});
