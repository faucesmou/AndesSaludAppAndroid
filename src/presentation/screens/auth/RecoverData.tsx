import { Layout, Text, Input, Button } from "@ui-kitten/components"
import { Alert, Linking, StyleSheet, View, useWindowDimensions, Image } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { MyIcon } from "../../components/ui/MyIcon";

import { StackScreenProps } from "@react-navigation/stack";
import { useAuthStore } from "../../store/auth/useAuthStore";
import { useEffect, useState } from "react";
import { RootStackParams } from "../../routes/StackNavigator";
import { FullScreenLoader } from "../../components/ui/FullScreenLoader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IonIcon } from "../../components/shared/IonIcon";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Path, Svg } from "react-native-svg";


interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'> { }


export const RecoverData = ({ navigation }: Props) => {

  const [linkPixi, setLinkPixi] = useState("");
  const [linkAndesSalud, setLinkAndesSalud] = useState("");

  const { recuperarDatos, setUser, setPass, setUserName, setUserLastName  } = useAuthStore();
/*   const [isConsulting, setIsConsulting] = useState(false); */

  const [isRecovering, setIsRecovering] = useState(false)
  const { top } = useSafeAreaInsets();


  const [form, setForm] = useState({
    numeroAfiliado: '',
    idAfiliado: '',
    dni: '',
    email: '',
    password: '',
    fullName: '',
  })

  const recover = async () => {

    if (form.dni.length === 0 || form.numeroAfiliado.length === 0) {
      Alert.alert('Todos los campos son obligatorios');
      return;
    }
    setIsRecovering(true);
    try {
      const respuesta = await recuperarDatos(form.numeroAfiliado, form.dni)
      if (respuesta) {
        const user = respuesta.usuarioAfiliado
        const pass = respuesta.passAfiliado;
        //@ts-ignore
        const usuarioNombre = respuesta.usuarioNombre
        //@ts-ignore
        const usuarioApellido = respuesta.usuarioApellido; 
        setUser(user);
        setPass(pass); 
        setUserName(usuarioNombre);
        setUserLastName(usuarioApellido); 
        console.log('el usuario en recover data es: ', user);
        console.log('el pass en recover data es: ', pass);
        console.log('el usuarioNombre en recover data es: ', usuarioNombre);
        console.log('el usuarioApellido en recover data es: ', usuarioApellido);
        navigation.navigate('UserData')
        setIsRecovering(false);
      } else {
        Alert.alert('Ups!', 'El Dni o Numero de Credencial son incorrectos');
      }
    } catch (error) {
      console.error('Error al recuperar los datos:', error);
    } finally {
      setIsRecovering(false);
    }
  }

  useEffect(() => {
    const openURLAndesSalud = async () =>{
      if(linkAndesSalud){
        try{
          await Linking.openURL(linkAndesSalud)
        } catch (err) {
          console.log('Error al intentar ingresar a Andes Salud:', err);
        } finally {
        
          setLinkAndesSalud('');
        }
      }
    }
    openURLAndesSalud()
  }, [linkAndesSalud])
  
  useEffect(() => {
    
    const openUrlPixi = async () =>{
      if(linkPixi){
        try{
          await Linking.openURL(linkPixi)
        } catch (err) {
          console.log('error al intentar ingresar a whatsapp Pixi:', err);
        } finally {
        
          setLinkPixi('');
        }
      }
    }
   
    openUrlPixi();
  }, [linkPixi]);


  let UrlPixi = `https://api.whatsapp.com/send?phone=542613300622&text=%C2%A1Hola%2C%20Pixi!%20Vengo%20de%20la%20APP%20y%20tengo%20algunas%20consultas.%20%F0%9F%91%8D`
  let UrlAndes = `https://www.andessalud.com.ar/`
  
  const handleOpenURLPixi = () => {
    console.log('entrando a whatsapp Pixi');
    
    setLinkPixi(UrlPixi);
  }
  const handleOpenURLAndes = () => {
    console.log('entrando a Andes Salud');
    
    setLinkAndesSalud(UrlAndes);
  }

  const { height } = useWindowDimensions();
 /*  let paddingTopNumber = hp('18%'); */
 let paddingTopNumber = hp('1%');
  let paddingHorizontalNumber = wp('7%');
  if (height < 680) { // IMPORTANTE Pantallas más pequeñas como iPhone SE o iPhone 8 de 5.4 pulgadas o menos aproximadamente 
    /* paddingTopNumber = hp('12%'); */
    paddingTopNumber = hp('1%');
    paddingHorizontalNumber = wp('6%'); 
  }


    return (
      <Layout style={{ flex: 1 }}>
        <ScrollView style={{ marginHorizontal: hp('0.7%') }}/* style={{ marginHorizontal: paddingHorizontalNumber }} */>


       

          <Layout style={{ paddingTop:paddingTopNumber/*  height * 0.20  */}}>


          <View style={styles.topSection}>
              <Image source={require('../../assets/images/logoBlanco3.png')}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.textTitlePrincipal}>Recuperá</Text>
              <Text style={styles.textTitlePrincipal}>Tu información</Text>

            </View>

          <View style={styles.waveContainer}>
              <Svg
                height={hp('13%')} // Ajusta el tamaño de la onda
                width='100%'
                /* width={wp('99%')} */
                /*  color={'black'} */
                viewBox="0 0 1440 320" // Vista para el SVG
                preserveAspectRatio="none" // Esto evita que la onda se distorsione al ajustar el ancho
              >
                <Path
                  fill="white" // Color de la sección inferior (fondo blanco)
                  /* para controlar los picos y valles modifica estos primeros valores:  */
                  /* d="M0,40 C520,20 1140,420 1440,160 L1640,1090 L0,400Z" */
                  d="M0,40 C520,20 1140,420 1440,160 L1440,320 L0,320Z" 
                />
              </Svg>
            </View>

           {/*  <Text category="h1"
              style={{ marginBottom: 20 }}
              style={styles.textTitle}
            >Recuperar Datos</Text> */}

            <Text /* category="p1" */ style={styles.text}>Por favor, completá los siguientes campos para continuar</Text>

          </Layout>

          {/* Inputs */}

          <Layout style={{ marginTop: 15, paddingHorizontal: 20, }}>
            <Input
              placeholder="DNI"
              value={form.dni}
              onChangeText={(dni) => setForm({ ...form, dni })}
              accessoryLeft={<MyIcon name="person-outline" />}
              style={{ marginBottom: 10, borderRadius: 15, borderColor:'#7ba1c3' }}

            />
            <Input
              placeholder="Número de Credencial"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.numeroAfiliado}
              onChangeText={(numeroAfiliado) => setForm({ ...form, numeroAfiliado })}
              accessoryLeft={<IonIcon name='card-outline' size={25} color="#505050" marginLeft={'2%'} marginRight={'2.3%'}/> }
              
              style={{ marginBottom: 10, borderRadius: 15, marginLeft: 1, borderColor:'#7ba1c3'}}
            />
        
          </Layout>

          {/* Espacio */}

          <Layout style={{ height: 2 }} />

          {/* Button */}

          <Layout style={{ marginTop: 0, paddingHorizontal: 20, }}>
            <Button
              style={styles.customButton}
              disabled={isRecovering}
              accessoryRight={<MyIcon name="arrow-forward-outline" white isDisabled={isRecovering} />}
              onPress={recover}
            >
              Recuperar Datos
            </Button>

          </Layout>
          {
            isRecovering ? (

              <>
              <Layout style={{ height: hp('2%') }} />
              <View
                style={{
                  flex: 0.5,
                  marginTop: top - 1,
                  marginBottom: 0,
                }}
              >
                <FullScreenLoader />
              </View>
              
              </>

            )
              :
              <>
              <Layout style={{ height: hp('2%') }} />

<Layout style={{
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  paddingHorizontal: 20,

}}>
  <Text style={styles.customText2}>
    El Número de credencial es el que figura en tu tarjeta de Andes Salud
  </Text>
  <Text style={styles.customText2}>
    ¿No encuentras tu Número? Solicítalo con Pixi:
  </Text>
  <Text
    style={styles.customText3}
    status="primary"
    category="s1"
    onPress={handleOpenURLPixi}
  >
    {' '}
    Pixi{' '}
  </Text>
</Layout>
              </>
          }

          {/* informacion para crear cuenta */}
          

          <Layout style={{ height: hp('2.5%'), /* backgroundColor:'yellow', */ }} />

          <Layout style={{
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: hp('1%'),
            paddingHorizontal: 20,
          }}>
            <Text>
              ¿Ya tienes una cuenta?
            </Text>
            <Text
              style={styles.customText}
              status="primary"
              category="s1"
              onPress={() => navigation.navigate('LoginScreenNew')}
            >
              {' '}
              Ingresar{' '}
            </Text>

          </Layout>


          <Layout style={{
            alignItems: 'center',
            flexDirection: 'row',
            /*  justifyContent: 'center', */
            marginHorizontal: '0%',
            alignSelf: 'center',
            paddingHorizontal: 20,
            /*      backgroundColor:'green', */
          }}>
            <Text
              style={{/* marginLeft:'4%', */ alignSelf: 'center', /* marginHorizontal:wp('0%') */ }}
            >¿No tienes cuenta?
              Registrate en
            </Text>
            <Text
              style={{ /* color: '#4285F4' */color: '#7ba1c3', alignSelf: 'center', marginHorizontal: '0%', }/* styles.customText */}
              status="primary"
              category="s1"
              onPress={handleOpenURLAndes}
            >
              {' '}
              Andes Salud {' '}
            </Text>
          </Layout>

        </ScrollView>

      </Layout>
    )

  }
  const styles = StyleSheet.create({
    customButton: {
      backgroundColor: '#ECB30C',
    /*   backgroundColor: '#4285F4', */
      borderRadius: 10,
      margin: 10,
      padding: 15,
      borderColor: '#ECB30C',
      marginBottom: wp('0%'),
      maxWidth: hp('30%'),
      minWidth: hp('15%'),
      alignSelf:'center',
    },
    customText: {
     /*  color: '#4285F4', */
     color: '#7ba1c3',
    },
    customText2: {
     /*  color: '#4285F4', */
      marginBottom:10,
      textAlign: 'center'
    },
    customText3: {
   /*   color: '#4285F4',  */
   color: '#7ba1c3',
     fontSize:20,
     fontWeight:'bold',
    },
    icon: {
      alignItems: 'flex-start',
      marginBottom: 0,
      marginLeft:5,
    },
    waveContainer: {
      backgroundColor: '#ECB30C', // Fondo blanco en la parte inferior
      marginTop: -hp('2%'), // Para ajustar la superposición de la onda
      marginBottom: hp('0%'),
    },
    textTitle: {
      fontSize: wp('8%'),
      color: 'black',
      fontWeight:'bold',
      textAlign: 'center',
      alignSelf:'center',
      /* marginBottom: 20  */
    },
    topSection: {
      backgroundColor: '#ECB30C', // Fondo naranja en la parte superior
      height: hp('23%'),
      justifyContent: 'center',
      alignItems: 'center',
    },
    textTitlePrincipal: {
      fontSize: wp('6.8%'),
      color: 'white',
      fontWeight:'bold',
      textAlign: 'center',
      alignSelf:'center'
    },
    image: {
      width: wp('20%'), 
      height: hp('10%'), 
      marginBottom: wp('1%'),
      marginTop: hp('0.5%'),
    },
    text: {
      fontSize: wp('4%'),
      color: 'black',
      fontWeight:'bold',
      marginBottom: hp('0%'),
      flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    },

  });