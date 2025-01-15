import { createStackNavigator } from '@react-navigation/stack';


import { ProductScreen } from '../screens/home/afiliados/ProductScreen';

/* import { SettingsScreen } from '../screens/settings/Perfil'; */
import { useNavigation } from '@react-navigation/native';

/* probando la persistencia del Login:  */
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
/* --------------- */

import { HamburgerMenu } from '../components/shared/HamburgerMenu';
import { useProfileStore } from '../store/profile-store';

import { Afiliados/* , ProductsScreen2  */} from '../screens/home/afiliados/Afiliados';
import { MisDatosScreen } from '../screens/profile/MisDatosScreen';
import { BottomTabsNavigator } from './BottomTabsNavigator';
import { MiOrdenConsultaScreen } from '../screens/MiGestion/MiOrdenConsultaScreen';
import { CredencialScreen } from '../screens/credential/CredencialScreen';
import { TopTabsNavigator } from './TopTabsNavigator';
import { TramitesScreen } from '../screens/MiGestion/TramitesScreen';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { LoadingScreen } from '../screens/loading/LoadingScreen';
import { useAuthStore } from '../store/auth/useAuthStore';
import { CredencialScreenPrueba } from '../screens/credential/CredencialScreenPrueba';
import { ConsultaScreen } from '../screens/MiGestion/ordenConsulta/ConsultaScreen';
import { ConsultaScreenFinal } from '../screens/MiGestion/ordenConsulta/ConsultaScreenFinal';
import { FormulariosEspScreen } from '../screens/MiGestion/formulariosEspeciales/FormulariosEspScreen';
import { FormularioElegido } from '../screens/MiGestion/formulariosEspeciales/FormularioElegido';
import { CartillaMedicaScreen } from '../screens/MiSalud/cartillaMedica/CartillaMedicaScreen';
import { CartillaScreen } from '../screens/MiSalud/CartillaScreen';
import { CartillaMedicaEspecialidad } from '../screens/MiSalud/cartillaMedica/CartillaMedicaEspecialidad';
import { EstudiosMedicosScreen } from '../screens/MiGestion/estudiosMedicos/EstudiosMedicosScreen';
import { EstudiosMedicosEnv } from '../screens/MiGestion/estudiosMedicos/EstudiosMedicosEnv';
import { PagosScreen } from '../screens/home/pagos/PagosScreen';
import { SettingsScreen } from '../screens/home/Perfil/Perfil';
import { Buzon } from '../screens/home/Perfil/Buzon';
import { Buzon1 } from '../screens/home/Perfil/Buzon1';
import { HomeScreen } from '../screens/home/HomeScreen';
import { Facturas } from '../screens/home/Facturas/Facturas';
import { LoginScreen2 } from '../screens/auth/LoginScreen2';
import { RecoverData } from '../screens/auth/RecoverData';
import { UserData } from '../screens/auth/UserData';
import { ConsultaScreenUx } from '../screens/MiGestion/ordenConsulta/ConsultaScreenUx';
import { EstudiosMedicosScreenUx } from '../screens/MiGestion/estudiosMedicos/EstudiosMedicosScreenUx';
import { LoginScreenNew } from '../screens/auth/LoginScreenNew';
import { EstudiosMedicosEnvNew } from '../screens/MiGestion/estudiosMedicos/EstudiosMedicosEnvNew';
import { FullScreenLoader } from '../components/ui/FullScreenLoader';
import { FormulariosEspScreenNuevo } from '../screens/MiGestion/formulariosEspeciales/FormulariosEspScreenNuevo';
import { CartillaMedicaScreenOtrasCartillas } from '../screens/MiSalud/cartillaMedica/CartillaMedicaScreenOtrasCartillas';
import { CartillaFarmaciaProvincias } from '../screens/MiSalud/cartillaFarmacia/CartillaFarmaciaProvincias';
import { CartillaFarmaciaDepartamento } from '../screens/MiSalud/cartillaFarmacia/CartillaFarmaciaDepartamento';
import { CartillaFarmaciaDepartamentoSeleccionado } from '../screens/MiSalud/cartillaFarmacia/CartillaFarmaciaDepartamentoSeleccionado';

/* import { UserData } from '../screens/auth/userData'; */



/* type es similar a interfaz, es decir defnimos la estructura que tienen que tener los props. */

export type RootStackParams = {
  home: undefined,
  HomeScreenUxNew: undefined,
 /*  Product: { id: number, name: string }, */
  Credenciales: { id: number, name: string },
  Products: undefined,
  Afiliados: undefined,
  "Buzón": undefined,
  Buzon1: undefined,
  Perfil: undefined,
  MiGestión: undefined,
  MisDatos: undefined,
 /*  "Orden Enviada": undefined, */
  "¡Enviada!": undefined,
  "Enviando": undefined,
  Credencial: undefined,
  Cartilla: undefined,
  "Cartilla Farmacias": undefined,
  "Cartillas Farmacias": undefined,
  "Farmacias": undefined,
  LoginScreen: undefined,
  LoginScreenNew: undefined,
  LoginScreen2: undefined,
  LoginGonzalo: undefined,
  RegisterScreen: undefined,
  RecoverData: undefined,
  LoadingScreen: undefined,
  SideMenuNavigator: undefined,
  CredencialScreenPrueba:undefined,
  ConsultaScreen: undefined,
  Consulta2: undefined,
  "Consulta": undefined,
  Formulario:undefined,
  CartillaScreen: undefined,
  Cartillas: undefined,
  "Otras Cartillas":undefined,
  MiSalud: undefined,
  Formularios:undefined,
  Prestadores: { idCartilla: string };
  Departamentos: { idCartilla: string };
  EstudiosMedicos: undefined, 
  "Estudios Médicos": undefined,
  "Estudios": undefined,
 "Estudios!": undefined,
  "Enviado": undefined,
  "Enviado2": undefined,
  EstudiosMedicosEnviados:undefined,
  Pagos: undefined,
  Facturas:undefined,
  "UserData": undefined,

}


const Stack = createStackNavigator<RootStackParams>();

export const StackNavigator = () => {

  const { initializeAuth, status } = useAuthStore();
  const navigator = useNavigation();

  const email = useProfileStore(state => state.email);

  /* useEffect(() => {
  navigator.setOptions({
    headerShown: false,
  })
  
  }, []) */

/* probando la persistencia del Login: ---------------> */
  const [isReady, setIsReady] = useState(false);


  useEffect(() => {
    (async () => {
      console.log('inicializando la app con initializeAuth--->>');
      
      await initializeAuth();

      setIsReady(true);
      console.log('ha funcionado correctamente la inicialización!--->>');
    })();
  }, []);

  if (!isReady) {
    <FullScreenLoader />
    console.log('aqui deberia mostrar un loader o algo asi mientras se cargan los datos---es el !isReady>>');
    return null; // Muestra un loader o una pantalla inicial mientras se cargan los datos
  }
/* ----------------- */



  return (
    <Stack.Navigator
    /* ATENCIÒN ACÁ: INITIAL RouteName: esto define el loging sino anda usar la variante de abajo comentada. */
      initialRouteName={status === 'authenticated' ? /* 'HomeScreenUxNew' */  'home'  : 'LoginScreenNew'/* 'LoginGonzalo' */}
   /*    initialRouteName={'home'} */
      screenOptions={{
        headerShown: false,
        headerStyle: {
          elevation: 50,
          shadowColor: 'transparent',
        }
      }}
    >
{/* ------------VISTAS PRINCIPALES: -------------->*/}

{/* ------------VISTAS INICIO SESIÓN: -------------->*/}
    <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown: false }} /> 
    <Stack.Screen name='LoginScreenNew' component={LoginScreenNew} options={{ headerShown: false }} /> 
      {/* <Stack.Screen name='LoginGonzalo' component={LoginScreen2} options={{ headerShown: false }} /> */}
      
      <Stack.Screen name='RegisterScreen' component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name='RecoverData' component={RecoverData} options={{ headerShown: false }} />
      <Stack.Screen name='UserData' component={UserData} options={{ headerShown: false }} />
     
      <Stack.Screen name='LoadingScreen' component={LoadingScreen} options={{ headerShown: true }} />



{/* ------------VISTAS DESDE EL BOTTOM TAB: -------------->*/}

{/* La vista PADRE es el home con BottomTabsNavigator: */}
      <Stack.Screen name='home' component={BottomTabsNavigator} options={{ headerShown: false }} /> 

      {/* <Stack.Screen name= 'home' component={HomeScreen} />  */}
{/* vistas a las que se accede desde el botomTabsNavigator: */}

{/* (Mi Salud): */}
      <Stack.Screen name="MiSalud" component={CartillaScreen} options={{ headerShown: false }} />

{/* (Mi Gestion): */}
     <Stack.Screen name="MiGestión" component={TramitesScreen} options={{ headerShown: true }} />

{/* ----------VISTAS SECUNDARIAS: -------------->*/}

{/*  HOME (INICIO): */}
                        {/* Descarga tu factura: */}
  <Stack.Screen name="Facturas" component={Facturas} options={{ headerShown: true }} /> 
 

                        {/* Mi grupo Familiar : */}
      <Stack.Screen name="Afiliados" component={Afiliados} options={{ headerShown: true }} /> 
      {/* Desde Mi grupo Familiar a Cargo podemos navegar al Product Screen (componente reutilizable) */}
      <Stack.Screen name="Credenciales" component={ProductScreen} options={{ headerShown: true }} />

                          {/* Settings: */}
      <Stack.Screen name="Perfil" component={SettingsScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Buzón" component={Buzon} options={{ headerShown: true }} /> 

{/* MI SALUD (CartillaScreen): */}

      <Stack.Screen name="Cartillas" component={CartillaMedicaScreen} options={{ headerShown: true }} /> 

      <Stack.Screen name="Otras Cartillas" component={CartillaMedicaScreenOtrasCartillas} options={{ headerShown: true }} /> 
     {/* Desde CartilaMedicaScreen vamos a la especialidad: */}

      <Stack.Screen name="Prestadores" component={CartillaMedicaEspecialidad} options={{ headerShown: true }} />

      <Stack.Screen name="Cartillas Farmacias" component={CartillaFarmaciaDepartamento} options={{ headerShown: true }} />
      <Stack.Screen name="Farmacias" component={CartillaFarmaciaDepartamentoSeleccionado} options={{ headerShown: true }} />

{/* MI SALUD (Cartilla Farmacia): */}

<Stack.Screen name="Cartilla Farmacias" component={CartillaFarmaciaProvincias} options={{ headerShown: true }} /> 

      <Stack.Screen name="Estudios!" component={EstudiosMedicosScreen} options={{ headerShown: true, headerTitleStyle: { fontSize: 18 },  }} />
   <Stack.Screen name="Estudios" component={EstudiosMedicosScreenUx} options={{ headerShown: true, headerTitleStyle: { fontSize: 18 },  }} /> 
      
{/* MI GESTIÓN (TramitesScreen): */}

{/* Solicitar orden de consulta: */}
      <Stack.Screen name="Consulta2" component={ConsultaScreenFinal} options={{ headerShown: true }} />
      <Stack.Screen name="Consulta" component={ConsultaScreenUx} options={{ headerShown: true }} />

{/* ConsultaScreenFinal Redirige a miOrdenConsultaScreen y muestra el Link: */}
      <Stack.Screen name="Enviando" component={MiOrdenConsultaScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Enviado2" component={EstudiosMedicosEnv} options={{ headerShown: true }} />
      <Stack.Screen name="Enviado" component={EstudiosMedicosEnvNew} options={{ headerShown: true }} />

{/* Obtener Formularios Especiales: */}
     {/*  <Stack.Screen name="Formularios" component={FormulariosEspScreen} options={{ headerShown: true }} /> */}
      <Stack.Screen name="Formularios" component={FormulariosEspScreenNuevo} options={{ headerShown: true }} />

      <Stack.Screen name="Formulario" component={FormularioElegido} options={{ headerShown: true }} />

{/* Pagos del usuario */}

     <Stack.Screen name="Pagos" component={PagosScreen} options={{ headerShown: true }} /> 



{/* DRAWER----------> */}

      <Stack.Screen name="MisDatos" component={MisDatosScreen} options={{ headerShown: true }} />
      
    
    </Stack.Navigator>
  );
}

/*  ---MATERIAL REUTILIZABLE----> */

{/* <Stack.Screen name="MiSalud" component={CartillaMedicaScreen} options={{ headerShown: true }} /> */}


{/*     <Stack.Screen name="ConsultaScreen" component={ConsultaScreen} options={{ headerShown: true }} /> */}
   {/*  <Stack.Screen name="Credencial" component={CredencialScreen} /> */}
  {/*   <Stack.Screen name="CredencialScreenPrueba" component={CredencialScreenPrueba} /> */}

{/* <Stack.Screen name="Settings2" component={ ProfileScreen } /> */ }
/* initialRouteName={status === 'authenticated' ? 'home': 'LoginScreen'} */
/*    initialRouteName={status === 'authenticated' ? 'home': 'LoginScreen'}  */
    

    {/*  <Stack.Screen name='Cartilla' component={TopTabsNavigator} options={{ headerShown: true }} /> */}


    /* 
        // Integra farmacias y teléfonos.
        const mappedIntegrado = mappedCartillas.map((farmacia: any) => {
          // Encuentra los teléfonos asociados a la farmacia actual.
          const telefonos = mappedTelefonos
            .filter((telefono: any) => telefono.idFarmacia === farmacia.idFarmacia)
            .map((tel:any) => tel.telefono)
            .join(", "); // Concatena los teléfonos con comas.

          return {
            idFarmacia: farmacia.idFarmacia,
            nombre: farmacia.nombre,
            telefono: telefonos || "", // Si no hay teléfonos, deja un string vacío.
          };
        }); */