import { Layout, Text, Input, Button, Icon } from "@ui-kitten/components"
import { Alert, StyleSheet, useWindowDimensions, TouchableOpacity, Animated, View, Linking } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { MyIcon } from "../../components/ui/MyIcon";

import { StackScreenProps } from "@react-navigation/stack";
import { useAuthStore } from "../../store/auth/useAuthStore";
import { useState, useEffect, useRef } from "react";
import { RootStackParams } from "../../routes/StackNavigator";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'> { }


export const UserData = ( ) => {

  function capitalizeWords(string:string) {
    return string.replace(/\b\w+/g, function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  }
  const [isUserValid, setIsUserValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [linkAndesSalud, setLinkAndesSalud] = useState("");

  const { getUser, getPass, getUserName, getUserLastName} = useAuthStore();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const currentUser = getUser();
  const currentPass = getPass();
  const currentUserName = capitalizeWords(getUserName());
  const currentUserLastName = capitalizeWords(getUserLastName());
  console.log('el currentUser en user data  es: ', currentUser);
  console.log('el currentPass en user data es: ', currentPass);
 console.log('el currentUserName en user data  es: ', currentUserName);
  console.log('el currentUserLastName en user data es: ', currentUserLastName)

  useEffect(() => {
    // Siempre que user o pass cambien, se re-renderiza el componente
    console.log('Usuario actualizado:', currentUser);
    console.log('Contraseña actualizada:', currentPass);
    if( currentUser != "---" && currentPass != "---"){
      setIsUserValid(true)
    }
  }, [currentUser, currentPass]);

  const { height } = useWindowDimensions();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleUserVisibility = () => {
    setShowUser(!showUser);
  };
  /* parte de la logica para enviar al afiliado a inscribirse */
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

 
  let UrlAndes = `https://www.andessalud.com.ar/`
  const handleOpenURLAndes = () => {
    console.log('entrando a Andes Salud');
    
    setLinkAndesSalud(UrlAndes);
  }

  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView style={{ marginHorizontal: wp('5%'), flexGrow: 1}}>
     

        <Layout style={{ paddingTop: height * 0.20, /* alignItems:'center'  */ }}>
          
          <Text category="h1"
            style={styles.title}
          > Tus Datos</Text>
          <Text 
            style={styles.text}
          >Hola {currentUserName}{' '}{currentUserLastName}! </Text>


           {!isUserValid  ? 
        (
          <>
          <Text style={{ marginBottom: '3%', marginTop: '3%', fontSize: 18, textAlign: 'left', color: '#595960', }}>Actualmente no tienes un Usuario y Contraseña</Text> 
          <Text style={{ marginBottom: '3%', marginTop: '2%', fontSize: 18, textAlign: 'left', color: '#595960', }}>Para establecer tu Usuario y Contraseña ingresa a la página de Andes Salud y sigue los pasos para registrar una cuenta</Text> 


          <Layout style={{
            marginTop: '100%',
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'center'
          }}>
            <Text>
              ¿No tienes cuenta? 
              Registrate en 
            </Text>
            <Text
              style={styles.customText}
              status="primary"
              category="s1"
              onPress={handleOpenURLAndes}
            >
              {' '}
              Andes Salud {' '}
            </Text>
          </Layout>

           {/* informacion para crear cuenta */}
        <Layout style={{ height: 10 }} />

<Layout style={{
  alignItems: 'flex-end',
  flexDirection: 'row',
  justifyContent: 'center'
}}>
  <Text>
    ¿Deseas iniciar sesión?
  </Text>
  <Text
    style={styles.customText}
    status="primary"
    category="s1"
    onPress={() => navigation.navigate('LoginScreenNew')}
  >
    {' '}
    Iniciar sesión{' '}
  </Text>
</Layout>
          </>
        ) :
              <> 
          <Text 
            style={styles.text2}
          >A continuacion puedes acceder a tus datos de Usuario:</Text>
{/* <Text style={{ marginBottom: '3%', marginTop: '3%', fontSize: 18, textAlign: 'left', color: '#595960', }}>Actualmente no tienes un Usuario y Contraseña</Text>  */}

    <View style={{ alignItems:'center' }} >

          <View style={styles.userContainer}>
            <Text style={styles.passwordText}>
              Usuario:{' '} 
              {showUser ? currentUser : '******'}
            </Text>
            <Icon
            style={[styles.passwordIcon, { width: wp('10%'), height: wp('10%') }]}
             /*  style={styles.passwordIcon} */
              name={showUser ? 'eye-off' : 'eye'}
              fill="#8F9BB3"
              onPress={toggleUserVisibility}
            />
          </View>
          <View style={styles.passwordContainer}>

            <Text style={styles.passwordText}>
                    Contraseña:{' '}
                    {showPassword ? currentPass : '******'}
                  </Text>
                  <Icon
                    style={[styles.passwordIcon, { width: wp('10%'), height: wp('10%') }]}
                    /* style={styles.passwordIcon} */
                    name={showPassword ? 'eye-off' : 'eye'}
                    fill="#8F9BB3"
                    onPress={togglePasswordVisibility}
                  />
                </View>

    </View>
        {/* informacion para crear cuenta */}
        <Layout style={{ height: wp('20%') }} />

        <Layout style={{
          alignItems: 'flex-end',
          flexDirection: 'row',
          justifyContent: 'center'
        }}>
          <Text>
            ¿Deseas iniciar sesión?
          </Text>
          <Text
            style={styles.customText}
            status="primary"
            category="s1"
            onPress={() => navigation.navigate('LoginScreenNew')}
          >
            {' '}
            Iniciar sesión{' '}
          </Text>
        </Layout>
    </> 
        }  

  
      
        </Layout>

      
  

        <Layout style={{ height: 10 }} />



      </ScrollView>

    </Layout>
  )

}

  const styles = StyleSheet.create({
    customButton: {
      backgroundColor: '#4285F4',
      borderRadius: 10,
      margin: 10,
      padding: 15,
    },
    customText: {
      color: '#4285F4',
    },
    userContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 0,
      
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      /* backgroundColor: 'green' */
    },
    passwordText: {
    fontSize: 17, 
     flex: 0.8, // Ocupa todo el espacio disponible menos el icono
    },
    passwordIcon: {
      width: '35%', 
      height: '35%',
      aspectRatio: 1, // Mantiene una proporción cuadrada
    },
    text: {
      fontSize: 20,
      marginTop:15,
      textAlign: 'left'
    },
    text2: {
      marginBottom: '3%', 
      marginTop: '3%', 
      fontSize: 19, 
      textAlign: 'left', 
      color: '#595960',
    /*   fontSize: 16,
      textAlign: 'left' */
    /*   marginTop:10, */
    },
    title: {
      fontSize: 33, // Ajusta el tamaño según tus preferencias
      textAlign: 'center',
    },
    customText: {
      color: '#4285F4',
    },
  });