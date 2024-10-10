import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'

import { Picker } from '@react-native-picker/picker';
import { globalColors, globalStyles } from '../../../theme/theme'
/* import { PrimaryButton } from '../../components/shared/PrimaryButton' */
import { NavigationProp, useNavigation, useIsFocused } from '@react-navigation/native'
import { RootStackParams } from '../../../routes/StackNavigator'
import CustomHeader from '../../../components/CustomHeader'
import { useAuthStore } from '../../../store/auth/useAuthStore'
/* import { IndexPath, Layout, Select, SelectItem, SelectGroup, } from '@ui-kitten/components' */
import { BackButton } from '../../../components/shared/BackButton'
import { TertiaryButton } from '../../../components/shared/TertiaryButton';
import { IonIcon } from '../../../components/shared/IonIcon';
import Divider from '../../../components/shared/Divider';


export const ConsultaScreenFinal = () => {
  console.log('Entrando al ConsultaScreenFinal---->')
  const { ObtenerFamiliares, idAfiliado, idAfiliadoTitular, ObtenerEspecialidades, ObtenerPrestadores, GuardarIdPrestador, GuardarIdFamiliarSeleccionado } = useAuthStore();
/* use state para asegurarnos de que los 3 inputs fueron guardados antes de permitirle al usuario enviar la solicitud:  */
const [isFormComplete, setIsFormComplete] = useState(false);

  //---------------------LOGICA PARA EL SELECT DE FAMILIAR ELEGIDO-------------------------------------->
  //useStates: State 1 (nombresDeFamiliares): para guardar un listado de solamente NOMBRES de Familiares (sin el id) y poder mostrarlos en el select para que elija el usuario. State2 (FamiliaresObtenidosObjeto): datos de los familiares obtenidos de la consulta (nombre y id). State 3(selectedFamiliarNombre): nombre del familiar seleccionado. State4(FamiliarSeleccionadoDatos) : nombre y id del familiar seleccionado. 
  const [nombresDeFamiliares, setNombresDeFamiliares] = useState<string[]>([]);
  const [FamiliaresObtenidosObjeto, setFamiliaresObtenidosObjeto] = useState<string[]>([]); // 
  const [selectedFamiliarNombre, setSelectedFamiliarNombre] = useState<string | null>(null);
  const [FamiliarSeleccionadoDatos, setFamiliarSeleccionadoDatos] = useState<string[]>([]); // 

  const handleSelectFamiliar = async (itemValue: string | number, itemIndex: number) => {
  
  
    setSelectedFamiliarNombre(nombresDeFamiliares[itemIndex]);
    const familiarEncontrado: any = FamiliaresObtenidosObjeto.find(familiar => familiar.apellidoYNombre === itemValue);
    if (familiarEncontrado) {
      setFamiliarSeleccionadoDatos(familiarEncontrado)
      const { apellidoYNombre, idAfiliado }: { apellidoYNombre: string, idAfiliado: string } = familiarEncontrado;
      console.log('Apellido y Nombre:', apellidoYNombre);
      console.log('ID de Afiliado--->:', idAfiliado);
      await GuardarIdFamiliarSeleccionado(idAfiliado);
    } else {
      console.log('No se encontró el familiar');

    }

  };


  //--------------------- LOGICA PARA EL SELECT DE ESPECIALIDAD ELEGIDA-------------------------------------->
  //
  //useStates: State 1 (NombresDeEspecialidades): para guardar un listado de solamente NOMBRES de especialidades (sin el id) y poder mostrarlos en el select para que elija el usuario. State2 (EspecialidadesObtenidasObjeto): datos de las especialidades obtenidas de la consulta (nombre y id). state 3(SelectedEspecialidadNombre): nombre de la especialidad seleccionada. state4(EspecialidadSeleccionadaDatos) : nombre y id de la especialidad seleccionada. 
  const [NombresDeEspecialidades, setNombresDeEspecialidades] = useState<string[]>([]);
  const [EspecialidadesObtenidasObjeto, setEspecialidadesObtenidasObjeto] = useState<string[]>([]); // 
  const [SelectedEspecialidadNombre, setSelectedEspecialidadNombre] = useState<string | null>(null);
  const [EspecialidadSeleccionadaDatos, setEspecialidadSeleccionadaDatos] = useState<string[]>([]);
  const [IdEspecialidadElegida, setIdEspecialidadElegida] = useState<string>('');

  const handleSelectEspecialidad = (itemValue: string | number, itemIndex: number) => {
    setSelectedEspecialidadNombre(NombresDeEspecialidades[itemIndex]);
    const EspecialidadEncontrada: any = EspecialidadesObtenidasObjeto.find(especialidad => especialidad.nombreParaAfiliado === itemValue);
    if (EspecialidadEncontrada) {
      setEspecialidadSeleccionadaDatos(EspecialidadEncontrada)
      const { nombreParaAfiliado, idPrestacion }: { nombreParaAfiliado: string, idPrestacion: string } = EspecialidadEncontrada;
      //podemos luego guardar estas constantes en el context.
      setIdEspecialidadElegida(idPrestacion)

    }


  };

  //---------------------LOGICA PARA EL SELECT DE PRESTADOR ELEGIDO-------------------------------------->
  const [PrestadoresObtenidosObjeto, setPrestadoresObtenidosObjeto] = useState<string[]>([]);
  const [NombresDePrestadores, setNombresDePrestadores] = useState<string[]>([]);
  const [SelectedPrestadorNombre, setSelectedPrestadorNombre] = useState<string | null>(null);
  const [PrestadorSeleccionadoDatos, setPrestadorSeleccionadoDatos] = useState<string[]>([]);
  const [IdPrestadorElegido, setIdPrestadorElegido] = useState<string>('');

  const handleSelectPrestador = async (itemValue: string | number, itemIndex: number) => {
    setSelectedPrestadorNombre(NombresDePrestadores[itemIndex]);
    const PrestadorEncontrado: any = PrestadoresObtenidosObjeto.find(prestador => prestador.prestador === itemValue);
    if (PrestadorEncontrado) {
      setPrestadorSeleccionadoDatos(PrestadorEncontrado)
      const { prestador, idPrestador }: { prestador: string, idPrestador: string } = PrestadorEncontrado;
      console.log('Nombre del Prestador:', prestador);
      console.log('ID del Prestador:', idPrestador);
      await GuardarIdPrestador(idPrestador)
      setIdPrestadorElegido(idPrestador)
    } else {
      console.log('No se encontró la especialidad');

    }

  };





  useEffect(() => {

    console.log('FamiliarSeleccionadoDatos------>>>', FamiliarSeleccionadoDatos);
    console.log('EspecialidadSeleccionadaDatos------>>>', EspecialidadSeleccionadaDatos);
    console.log('PrestadorSeleccionadoDatos ------>>>', PrestadorSeleccionadoDatos);

    const obtenerFamiliaresConsulta = async () => {

      try {
        if (idAfiliado !== undefined) {
          const FamiliaresObtenidosObjeto = await ObtenerFamiliares(idAfiliado);
          /*      console.log('familiares obtenidos objeto datos--->', FamiliaresObtenidosObjeto); */

          setFamiliaresObtenidosObjeto(FamiliaresObtenidosObjeto);
          const mensajePredeterminado = 'Desliza hacia arriba';
          const nombresFamiliares = [mensajePredeterminado, ...FamiliaresObtenidosObjeto.map((familiar) => familiar.apellidoYNombre)];
          /* const nombresFamiliares = FamiliaresObtenidosObjeto.map((familiar) => familiar.apellidoYNombre); */
          setNombresDeFamiliares(nombresFamiliares)

          return FamiliaresObtenidosObjeto
          /*  set({ idsFamiliares: idsesFamiliares }) */
        } else {
          console.error('idAfiliado es undefined. No se puede llamar a ObtenerFamiliares.');
        }
      } catch (error) {
        console.error('idAfiliado es undefined. No se puede llamar a ObtenerFamiliares desde el tramitesScreen.');
      }
    };
    const obtenerEspecialidadesConsulta = async () => {
      try {
        if (idAfiliado !== undefined && idAfiliadoTitular !== undefined) {
          const especialidadesObtenidas = await ObtenerEspecialidades(idAfiliado, idAfiliadoTitular);
          setEspecialidadesObtenidasObjeto(especialidadesObtenidas);
          const mensajePredeterminado = 'Desliza hacia arriba';
          const nombresEspecialidades = [mensajePredeterminado, ...especialidadesObtenidas.map((especialidad) => especialidad.nombreParaAfiliado)];
          setNombresDeEspecialidades(nombresEspecialidades)
          return especialidadesObtenidas

        } else {
          console.error('idAfiliado  o idAfiliadoTitular es undefined. No se puede llamar a ObtenerEspecialidades.');
        }
      } catch (error) {
        console.error('idAfiliado  o idAfiliadoTitular es undefined. No se puede llamar a ObtenerEspecialidades desde el ConsultaScreen.');
      }
    };
    const obtenerPrestadoresConsulta = async () => {
      try {

        if (idAfiliado !== undefined && idAfiliadoTitular !== undefined && IdEspecialidadElegida !== undefined) {
          const PrestadoresObtenidos: any = await ObtenerPrestadores(idAfiliado, idAfiliadoTitular, IdEspecialidadElegida);
          setPrestadoresObtenidosObjeto(PrestadoresObtenidos);
          const nombresPrestadores = PrestadoresObtenidos.map((prestador: any) => prestador.prestador);
          if (nombresPrestadores[0] === "No se encontraron prestadores para la especialidad indicada.") {
            setNombresDePrestadores(["Elija familiar y especialidad"]);
          } else {
            setNombresDePrestadores(nombresPrestadores);
          }


          return PrestadoresObtenidos

        } else {
          console.error('idAfiliado  o idAfiliadoTitular es undefined. No se puede llamar a ObtenerEspecialidades.');
        }
      } catch (error) {
        console.error('idAfiliado  o idAfiliadoTitular es undefined. No se puede llamar a ObtenerEspecialidades desde el ConsultaScreen.');
      }
    };
    obtenerFamiliaresConsulta();
    obtenerEspecialidadesConsulta();
    obtenerPrestadoresConsulta();
  }, [selectedFamiliarNombre, SelectedEspecialidadNombre, /* IdEspecialidadElegida,*/ SelectedPrestadorNombre])



  const navigation = useNavigation<NavigationProp<RootStackParams>>()
/* hasta que no se carguen todos los inputs no se habilita el boton de enviar consulta:  */
  useEffect(() => {
    setIsFormComplete(!!selectedFamiliarNombre && !!SelectedEspecialidadNombre && !!SelectedPrestadorNombre);
  }, [selectedFamiliarNombre, SelectedEspecialidadNombre, SelectedPrestadorNombre]);


  return (
    <View style={globalStyles.container}>

      <CustomHeader /* color={globalColors.black}  *//>

      <BackButton />

      <Text style={{ marginBottom: '3%', marginTop: '2%', fontSize: 25, textAlign: 'center', }}>Solicitar Orden de Consulta</Text> 

      <View
        style={{  /* backgroundColor: 'green',  */ flex: 1, marginBottom: '7%', marginTop: '2%' }}>

        {/* -----------------FAMILIAR---------------- */}

        <View style={{  /* backgroundColor: 'yellow', */  borderRadius: 10, overflow: 'hidden', marginVertical: 5, justifyContent: 'center', marginTop: 5  }}>
          <Text style={{ /* backgroundColor: 'yellow', */ fontSize: 20, textAlign: 'center', marginBottom: 10, marginTop: 5 }}>Selecciona un familiar</Text>
          <View style={globalStyles.pickerWrapper2}>
          <View style={{  marginTop: 10, marginLeft:10 }}>
          <IonIcon name='chevron-forward-outline' size={30} color="#505050" /* style={globalStyles.icon} */ />
            </View>
            <Picker
              style={globalStyles.inputIOS}
              selectedValue={selectedFamiliarNombre !== null ? selectedFamiliarNombre : undefined}
              onValueChange={(itemValue: string | number, itemIndex: number) =>
                handleSelectFamiliar(itemValue, itemIndex)
              }
              itemStyle={globalStyles.itemStyle}
            >
              {nombresDeFamiliares.map((item, index) => (
                <Picker.Item style={{ marginVertical: 0 }} key={index} label={item} value={item}
                />
              ))}
            </Picker>
           
          </View>
        </View>

        <Divider />
        {/* -----------------ESPECIALIDAD---------------- */}

        <View style={{ borderRadius: 10, overflow: 'hidden', marginVertical: 5, justifyContent: 'center', marginTop: 10, marginBottom:20  }}>
          <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 10, marginTop: 10 }}>Selecciona una Especialidad</Text>
          <View style={globalStyles.pickerWrapper2}>
          <View style={{  marginTop: 10, marginLeft:10 }}>
          <IonIcon name='chevron-forward-outline' size={30} color="#505050" /* style={globalStyles.icon} */ />
            </View>
            <Picker
              style={globalStyles.inputIOS}
              selectedValue={SelectedEspecialidadNombre !== null ? SelectedEspecialidadNombre : undefined}
              onValueChange={(itemValue: string | number, itemIndex: number) =>
                handleSelectEspecialidad(itemValue, itemIndex)
              }
              itemStyle={globalStyles.itemStyle}
            >
              {NombresDeEspecialidades.map((item, index) => (
                <Picker.Item style={{ marginVertical: 0 }} key={index} label={item} value={item}

                />
              ))}
            </Picker>
          </View>
          <View>
            
          </View>
            <Text style={{ fontSize: 15, textAlign: 'center', marginBottom: 5, marginTop: 5 }}>Especialidad Seleccionada:</Text>
            <View
            style={{ borderRadius: 15,
              paddingHorizontal: 10, 
              paddingVertical: 5,
              marginHorizontal: 40,
              backgroundColor: SelectedEspecialidadNombre ?  globalColors.NaranjaPastel   : 'white' 
            }}
            >
          <Text style={{ 
            fontSize: 15, 
            textAlign: 'center', 
            marginBottom: 5, 
            marginTop: 5, 
            
             }}
             >{SelectedEspecialidadNombre} </Text>

            </View>
        </View>

        <Divider />
        {/* -----------------PRESTADOR---------------- */}

        <View style={{ borderRadius: 10, overflow: 'hidden', marginVertical: 5, justifyContent: 'center', marginBottom: 25, marginTop: 15  }}>
          <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 10, marginTop: 5 }}>Selecciona un Prestador</Text>
          <View style={globalStyles.pickerWrapper2}>
            <View style={{  marginTop: 10, marginLeft:10 }}>
          <IonIcon name='chevron-forward-outline' size={30} color="#505050" /* style={globalStyles.icon} */ />
            </View>
            <Picker
              style={globalStyles.inputIOS}
              selectedValue={SelectedPrestadorNombre !== null ? SelectedPrestadorNombre : undefined}
              onValueChange={(itemValue: string | number, itemIndex: number) =>
                handleSelectPrestador(itemValue, itemIndex)
              }
              itemStyle={globalStyles.itemStyle}
            >
              {NombresDePrestadores.map((item, index) => (
                <Picker.Item style={{ marginVertical: 0 }} key={index} label={item} value={item}

                />
              ))}
            </Picker>
          </View>
         

            <Text style={{ fontSize: 15, textAlign: 'center', marginBottom: 5, marginTop: 5 }}>Prestador Seleccionado:</Text>
          {/* <Text style={{ fontSize: 15, textAlign: 'center', marginBottom: 5, marginTop: 5 }}>{SelectedPrestadorNombre} </Text> */}
          <View
            style={{ borderRadius: 15,
              paddingHorizontal: 10, 
              paddingVertical: 5,
              marginHorizontal: 40,
              backgroundColor: SelectedPrestadorNombre ? globalColors.NaranjaPastel : 'white' 
            }}
            >
          <Text style={{ 
            fontSize: 15, 
            textAlign: 'center', 
            marginBottom: 5, 
            marginTop: 5, 
            
             }}
             >{SelectedPrestadorNombre} </Text>

      
          </View>
        </View>


      {/*   <PrimaryButton
          onPress={() => navigation.navigate('MiOrdenConsulta')}
          label="Solicitar Orden de consulta"
        /> */}

        <TertiaryButton
          onPress={() => navigation.navigate('Orden Enviada')}
          label="Continuar con la solicitud"
          color={globalColors.profile2}
          iconName='people-outline'
         description='Presiona para continuar' 
         disabled={!isFormComplete}
        />
      </View>

    </View>
  )
}

