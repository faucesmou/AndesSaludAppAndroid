import React, { useEffect, useState } from 'react'
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

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
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const ConsultaScreenUx = () => {
  console.log('Entrando al ConsultaScreen Ux---->')
  const { ObtenerFamiliares, idAfiliado, idAfiliadoTitular, ObtenerEspecialidades, ObtenerPrestadores, GuardarIdPrestador, GuardarIdFamiliarSeleccionado } = useAuthStore();
  /* use state para asegurarnos de que los 3 inputs fueron guardados antes de permitirle al usuario enviar la solicitud:  */
  const [isFormComplete, setIsFormComplete] = useState(false);

  //---------------------LOGICA PARA EL SELECT DE FAMILIAR ELEGIDO-------------------------------------->
  //useStates: State 1 (nombresDeFamiliares): para guardar un listado de solamente NOMBRES de Familiares (sin el id) y poder mostrarlos en el select para que elija el usuario. State2 (FamiliaresObtenidosObjeto): datos de los familiares obtenidos de la consulta (nombre y id). State 3(selectedFamiliarNombre): nombre del familiar seleccionado. State4(FamiliarSeleccionadoDatos) : nombre y id del familiar seleccionado. 
  const [nombresDeFamiliares, setNombresDeFamiliares] = useState<string[]>([]);
  const [FamiliaresObtenidosObjeto, setFamiliaresObtenidosObjeto] = useState<string[]>([]); // 
  const [selectedFamiliarNombre, setSelectedFamiliarNombre] = useState<string | null>(null);
  const [FamiliarSeleccionadoDatos, setFamiliarSeleccionadoDatos] = useState<string[]>([]); // 
  const [isConsultingFamiliar, setIsConsultingFamiliar] = useState(false);
  const [errorConsultingFamiliar, setErrorConsultingFamiliar] = useState(false);

  const handleSelectFamiliar = async (itemValue: string | number, itemIndex: number) => {


    setSelectedFamiliarNombre(nombresDeFamiliares[itemIndex]);
    //@ts-ignore
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
  const handleSelectFamiliarNuevoSelect = async (familiarSeleccionado: string) => {

    setSelectedFamiliarNombre(familiarSeleccionado);
    //@ts-ignore
    const familiarEncontrado: any = FamiliaresObtenidosObjeto.find(familiar => familiar.apellidoYNombre === familiarSeleccionado);
    if (familiarEncontrado) {
      setFamiliarSeleccionadoDatos(familiarEncontrado)
      const { apellidoYNombre, idAfiliado }: { apellidoYNombre: string, idAfiliado: string } = familiarEncontrado;
      console.log('Apellido y Nombre esde el handle del nuevo select pa->:', apellidoYNombre);
      console.log('ID de Afiliado--desde el handle del nuevo select pa->:', idAfiliado);
      await GuardarIdFamiliarSeleccionado(idAfiliado);
    } else {
      console.log('No se encontró el familiar');

    }
    setSelectedValue(familiarSeleccionado)
    setModalVisible(false);

  };


  //--------------------- LOGICA PARA EL SELECT DE ESPECIALIDAD ELEGIDA-------------------------------------->
  //
  //useStates: State 1 (NombresDeEspecialidades): para guardar un listado de solamente NOMBRES de especialidades (sin el id) y poder mostrarlos en el select para que elija el usuario. State2 (EspecialidadesObtenidasObjeto): datos de las especialidades obtenidas de la consulta (nombre y id). state 3(SelectedEspecialidadNombre): nombre de la especialidad seleccionada. state4(EspecialidadSeleccionadaDatos) : nombre y id de la especialidad seleccionada. 
  const [NombresDeEspecialidades, setNombresDeEspecialidades] = useState<string[]>([]);
  const [EspecialidadesObtenidasObjeto, setEspecialidadesObtenidasObjeto] = useState<string[]>([]); // 
  const [SelectedEspecialidadNombre, setSelectedEspecialidadNombre] = useState<string | null>(null);
  const [EspecialidadSeleccionadaDatos, setEspecialidadSeleccionadaDatos] = useState<string[]>([]);
  const [IdEspecialidadElegida, setIdEspecialidadElegida] = useState<string>('');
  const [isConsultingEspecialidades, setIsConsultingEspecialidades] = useState(false);
  const [errorConsultingEspecialidades, setErrorConsultingEspecialidades] = useState(false);


  const handleSelectEspecialidad = (itemValue: string | number, itemIndex: number) => {
    setSelectedEspecialidadNombre(NombresDeEspecialidades[itemIndex]);
    //@ts-ignore
    const EspecialidadEncontrada: any = EspecialidadesObtenidasObjeto.find(especialidad => especialidad.nombreParaAfiliado === itemValue);
    if (EspecialidadEncontrada) {
      setEspecialidadSeleccionadaDatos(EspecialidadEncontrada)
      const { nombreParaAfiliado, idPrestacion }: { nombreParaAfiliado: string, idPrestacion: string } = EspecialidadEncontrada;
      //podemos luego guardar estas constantes en el context.
      setIdEspecialidadElegida(idPrestacion)

    }


  };
  const handleSelectEspecialidadNuevoSelect = (especialidadSeleccionada: string) => {
    setSelectedEspecialidadNombre(especialidadSeleccionada);
    //@ts-ignore
    const EspecialidadEncontrada: any = EspecialidadesObtenidasObjeto.find(especialidad => especialidad.nombreParaAfiliado === especialidadSeleccionada);
    if (EspecialidadEncontrada) {
      setEspecialidadSeleccionadaDatos(EspecialidadEncontrada)
      const { nombreParaAfiliado, idPrestacion }: { nombreParaAfiliado: string, idPrestacion: string } = EspecialidadEncontrada;
      //podemos luego guardar estas constantes en el context.
      setIdEspecialidadElegida(idPrestacion)
      setSelectedEspecialidad(especialidadSeleccionada)
      console.log('IdEspecialidadElegida esde el handle del nuevo select pa->:', IdEspecialidadElegida);
      console.log('SelectedEspecialidad--desde el handle del nuevo select pa->:', selectedEspecialidad);

    }
    setModalEspecialidadVisible(false)

  };

  //---------------------LOGICA PARA EL SELECT DE PRESTADOR ELEGIDO-------------------------------------->
  const [PrestadoresObtenidosObjeto, setPrestadoresObtenidosObjeto] = useState<string[]>([]);
  const [NombresDePrestadores, setNombresDePrestadores] = useState<string[]>([]);
  const [SelectedPrestadorNombre, setSelectedPrestadorNombre] = useState<string | null>(null);
  const [PrestadorSeleccionadoDatos, setPrestadorSeleccionadoDatos] = useState<string[]>([]);
  const [IdPrestadorElegido, setIdPrestadorElegido] = useState<string>('');

  //---------------------NUEVO SELECT NUEVO SELECT NUEVOOOOO-------------------------------------->
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEspecialidadVisible, setModalEspecialidadVisible] = useState(false);
  const [modalPrestadorVisible, setModalPrestadorVisible] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const dynamicGap = screenWidth * 0.00;
  const dynamicMargin = screenWidth * 0.01;
  const [selectedValue, setSelectedValue] = useState('Familiares');
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('Especialidades');
  const [selectedPrestador, setSelectedPrestador] = useState('Prestadores');

    const [isConsultingPrestador, setIsConsultingPrestador] = useState(false);
  const [errorConsultingPrestador, setErrorConsultingPrestador] = useState(false);

  /*   const handleSelect2 = (nombre:any) => {
      const actions = {
        'Córdoba': filtrarPorCordoba,
        'Mendoza': filtrarPorMendoza,
        'San Juan': filtrarPorSanJuan,
        'San Luis': filtrarPorSanLuis,
        'Todos': filtrarPorTodos,
      };
  
      const action = actions[nombre];
      if (action) {
        action();
      } else {
        console.warn(`No hay acción definida para la opción: ${nombre}`);
      }
      setSelectedValue(nombre);
      setModalVisible(false);  // Cierra el modal después de seleccionar
    }; */





  const handleSelectPrestador = async (itemValue: string | number, itemIndex: number) => {
    setSelectedPrestadorNombre(NombresDePrestadores[itemIndex]);
    //@ts-ignore
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

  const handleSelectPrestadorNuevoSelect = async (prestadorSeleccionado: string) => {
    setSelectedPrestadorNombre(prestadorSeleccionado);
    //@ts-ignore
    const PrestadorEncontrado: any = PrestadoresObtenidosObjeto.find(prestador => prestador.prestador === prestadorSeleccionado);
    if (PrestadorEncontrado) {
      setPrestadorSeleccionadoDatos(PrestadorEncontrado)
      const { prestador, idPrestador }: { prestador: string, idPrestador: string } = PrestadorEncontrado;
      console.log('Nombre del Prestador desde el nuevo select:', prestador);
      console.log('ID del Prestador desde el nuevo select:', idPrestador);
      await GuardarIdPrestador(idPrestador)
      setIdPrestadorElegido(idPrestador)
      setSelectedPrestador(prestadorSeleccionado)
      console.log('Nombre del Prestador desde el nuevo select: se habria guardado en el context', prestador);
      console.log('ID del Prestador desde el nuevo select:', idPrestador);
    } else {
      console.log('No se encontró el prestador');

    }
    setModalPrestadorVisible(false)

  };





  useEffect(() => {

    console.log('FamiliarSeleccionadoDatos------>>>', FamiliarSeleccionadoDatos);
    console.log('EspecialidadSeleccionadaDatos------>>>', EspecialidadSeleccionadaDatos);
    console.log('PrestadorSeleccionadoDatos ------>>>', PrestadorSeleccionadoDatos);

    const obtenerFamiliaresConsulta = async () => {
      setIsConsultingFamiliar(true)
      try {
        if (idAfiliado !== undefined) {
          const FamiliaresObtenidosObjeto = await ObtenerFamiliares(idAfiliado);
          /*      console.log('familiares obtenidos objeto datos--->', FamiliaresObtenidosObjeto); */

          setFamiliaresObtenidosObjeto(FamiliaresObtenidosObjeto);
          const mensajePredeterminado = '(Desliza hacia arriba)';
          const nombresFamiliares = [mensajePredeterminado, ...FamiliaresObtenidosObjeto.map((familiar) => familiar.apellidoYNombre)];
          /* const nombresFamiliares = FamiliaresObtenidosObjeto.map((familiar) => familiar.apellidoYNombre); */
          setNombresDeFamiliares(nombresFamiliares)
          setIsConsultingFamiliar(false)
          return FamiliaresObtenidosObjeto
          /*  set({ idsFamiliares: idsesFamiliares }) */
        } else {
          console.error('idAfiliado es undefined. No se puede llamar a ObtenerFamiliares.');
          setIsConsultingFamiliar(false);
          setErrorConsultingFamiliar(true)
        }
      } catch (error) {
        console.error('idAfiliado es undefined. No se puede llamar a ObtenerFamiliares desde el tramitesScreen.');
        setIsConsultingFamiliar(false)
        setErrorConsultingFamiliar(true)
      }
    };
    const obtenerEspecialidadesConsulta = async () => {

      setIsConsultingEspecialidades(true)

      try {
        if (idAfiliado !== undefined && idAfiliadoTitular !== undefined) {
          const especialidadesObtenidas = await ObtenerEspecialidades(idAfiliado, idAfiliadoTitular);
          setEspecialidadesObtenidasObjeto(especialidadesObtenidas);
          const mensajePredeterminado = '(Desliza hacia arriba)';
          const nombresEspecialidades = [mensajePredeterminado, ...especialidadesObtenidas.map((especialidad) => especialidad.nombreParaAfiliado)];
          setNombresDeEspecialidades(nombresEspecialidades)
          setIsConsultingEspecialidades(false)
          return especialidadesObtenidas

        } else {
          console.error('idAfiliado  o idAfiliadoTitular es undefined. No se puede llamar a ObtenerEspecialidades.');
          setIsConsultingEspecialidades(false)
          setErrorConsultingEspecialidades(true)
        }
      } catch (error) {
        console.error('idAfiliado  o idAfiliadoTitular es undefined. No se puede llamar a ObtenerEspecialidades desde el ConsultaScreen.');
        setIsConsultingEspecialidades(false)
        setErrorConsultingEspecialidades(true)
      }
    };
    const obtenerPrestadoresConsulta = async () => {

      setIsConsultingPrestador(true)
      try {

        if (idAfiliado !== undefined && idAfiliadoTitular !== undefined && IdEspecialidadElegida !== undefined) {
          console.log('empezando LA CONSULTA ObtenerPrestadores------------')
          
          const PrestadoresObtenidos: any = await ObtenerPrestadores(idAfiliado, idAfiliadoTitular, IdEspecialidadElegida);
          setPrestadoresObtenidosObjeto(PrestadoresObtenidos);
         
          const nombresPrestadores = PrestadoresObtenidos.map((prestador: any) => prestador.prestador);
          if (nombresPrestadores[0] === "No se encontraron prestadores para la especialidad indicada.") {
            setNombresDePrestadores(["Elija familiar y especialidad"]);
            setIsConsultingPrestador(false)
          } else {
            const mensajePredeterminado = '(Desliza hacia arriba)';
            //@ts-ignore
            const nombresPrestadoresParaMostrar = [mensajePredeterminado, ...PrestadoresObtenidos.map((prestador) => prestador.prestador)];
            setNombresDePrestadores(nombresPrestadoresParaMostrar)
            setIsConsultingPrestador(false)
            /*  setNombresDePrestadores(nombresPrestadores); */
          }


          return PrestadoresObtenidos

        } else {
          console.error('idAfiliado  o idAfiliadoTitular es undefined. No se puede llamar a ObtenerEspecialidades.');
          setIsConsultingPrestador(false)
          setErrorConsultingPrestador(true)
        }
      } catch (error) {
        console.error('idAfiliado  o idAfiliadoTitular es undefined. No se puede llamar a ObtenerEspecialidades desde el ConsultaScreen.');
        setIsConsultingPrestador(false)
        setErrorConsultingPrestador(true)
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


  const { height } = Dimensions.get('window');
  let MarginTopSeleccionaFamiliar: number = hp('0.5%');
  let MarginTopDivider: number = hp('1%');
  let buttonTextFontSize = wp('4.3%');
 let consignaTextFontSize = wp('5.3%'); 
 let titleTextFontSize = wp('5.7%'); 
 let optionSelectedTextFontSize = wp('4.3%'); 
  let buttonDescriptionFontSize = wp('4.5%');
  if (height < 680) { // IMPORTANTE Pantallas más pequeñas como iPhone SE o iPhone 8 de 5.4 pulgadas o menos aproximadamente 

    MarginTopSeleccionaFamiliar = hp('0%');
    MarginTopDivider = hp('0.5%');
    buttonTextFontSize = wp('3.8%');
    buttonDescriptionFontSize = wp('4%');
    optionSelectedTextFontSize = wp('4%'); 
    titleTextFontSize = wp('5%');
    consignaTextFontSize = wp('4.9%'); 
  }


  return (
    <View style={globalStyles.container}>

      <CustomHeader /* color={globalColors.black} */ titleSize={hp('4%')}  />

      <BackButton Size={hp('4%')} />

      {/* <Text style={{ marginBottom: '3%', marginTop: '2%', fontSize: titleTextFontSize, textAlign: 'center', color: '#030136' }}>Solicitá tu Orden de Consulta</Text> */}

      <Text style={{
        marginBottom: wp('2%'),
        marginTop: 0,
        fontSize: hp('3.2%'),
        textAlign: 'center',
        color: globalColors.gray2,
        fontWeight: 'bold'
      }}>Solicitá tu Orden de Consulta</Text>

      {/* color: '#'595960 */}



      <View
        style={{ /* backgroundColor: 'green', */ flex: 1, marginBottom: '7%', marginTop: '2%' }}>


        <Divider marginTopDivider={MarginTopDivider}  />

        {/* -----------------FAMILIAR NUEVO SELECT---------------- */}

        <View style={[styles.container, { gap: dynamicGap }]}>
          {/* Botón que abre el modal */}
          <Text style={[styles.consignaText, { marginHorizontal: dynamicMargin, fontSize:consignaTextFontSize }]}>Selecciona el Familiar:</Text>
          <TouchableOpacity
            style={[styles.selectButton, { marginHorizontal: dynamicMargin }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>{selectedValue}</Text>
          </TouchableOpacity>

          {/* Modal para seleccionar las opciones */}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={{ alignSelf: 'center' }}>
                  <IonIcon name='chevron-up-circle-outline' size={20} color="#505050" />
                </View>
                <ScrollView>
                  {
                    isConsultingFamiliar ? 
                    (
                      <TouchableOpacity
                      style={styles.modalOption}>

                      <Text style={styles.optionText}>Aguarda un momento</Text>

                    </TouchableOpacity>
                    )
                    : errorConsultingFamiliar ? 
                    (
                      <TouchableOpacity
                      style={styles.modalOption}>

                      <Text style={styles.optionText}>No se encontraron familiares</Text>

                    </TouchableOpacity>
                    )

                    :
                    
                    (

                  nombresDeFamiliares.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.modalOption}
                      onPress={() => handleSelectFamiliarNuevoSelect(option)}
                    >
                      <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>


                  ))
                )
                  
                  }
                </ScrollView>
                <View style={{ alignSelf: 'center', marginTop: 5 }}>
                  <IonIcon name='chevron-down-circle-outline' size={20} color="#505050" />
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

        </View>

        <Divider  marginTopDivider={MarginTopDivider} />
        {/* -----------------ESPECIALIDAD Nuevo SElectt---------------- */}

        <View style={[styles.container, { gap: dynamicGap }]}>
          {/* Botón que abre el modal */}
          <Text style={[styles.consignaText, { marginHorizontal: dynamicMargin, fontSize:consignaTextFontSize  }]}>Selecciona una Especialidad:</Text>
          <TouchableOpacity
            style={[styles.selectButton, { marginHorizontal: dynamicMargin }]}
            onPress={() => setModalEspecialidadVisible(true)}
          >
            <Text style={styles.buttonText}>{selectedEspecialidad}</Text>
          </TouchableOpacity>

          {/* Modal para seleccionar las opciones */}
          <Modal
            visible={modalEspecialidadVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalEspecialidadVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContentEspecialidad}>
                <View style={{ alignSelf: 'center' }}>
                  <IonIcon name='chevron-up-circle-outline' size={20} color="#505050" />
                </View>
                <ScrollView>
                  {
                    isConsultingEspecialidades ?
                      (
                        <TouchableOpacity
                          style={styles.modalOption}>

                          <Text style={styles.optionText}>Aguarda un momento</Text>

                        </TouchableOpacity>
                      )
                      : errorConsultingEspecialidades ?
                        (
                          <TouchableOpacity
                            style={styles.modalOption}>

                            <Text style={styles.optionText}>No se encontraron especialidades</Text>

                          </TouchableOpacity>
                        )

                        :
                        (


                          NombresDeEspecialidades.map((option) => (
                            <TouchableOpacity
                              key={option}
                              style={styles.modalOption}
                              onPress={() => handleSelectEspecialidadNuevoSelect(option)}
                            >
                              <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                          ))
                        )

                  }
                </ScrollView>
                <View style={{ alignSelf: 'center', marginTop: 5 }}>
                  <IonIcon name='chevron-down-circle-outline' size={20} color="#505050" />
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalEspecialidadVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

        </View>

        {/* -----------------PRESTADOR Nuevo SElectt---------------- */}

     
        <Divider  marginTopDivider={MarginTopDivider} />

        { height < 680? (
         <Divider  marginTopDivider={MarginTopDivider} />
      ) : null

        } 
        <View style={[styles.container, { gap: dynamicGap }]}>
          {/* Botón que abre el modal */}
          <Text style={[styles.consignaText, { marginHorizontal: dynamicMargin, fontSize:consignaTextFontSize  }]}>Selecciona un Prestador:</Text>
          <TouchableOpacity
            style={[styles.selectButton, { marginHorizontal: dynamicMargin }]}
            onPress={() => setModalPrestadorVisible(true)}
          >
            <Text style={styles.buttonText}> {selectedPrestador}  {/* {selectedPrestador.toLowerCase()}  */}</Text>
          </TouchableOpacity>

          {/* Modal para seleccionar las opciones */}
          <Modal
            visible={modalPrestadorVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalPrestadorVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContentEspecialidad}>
                <View style={{ alignSelf: 'center' }}>
                  <IonIcon name='chevron-up-circle-outline' size={20} color="#505050" />
                </View>
                <ScrollView>
                  {
                  
                  
                    isConsultingPrestador ? 
                    (
                      <TouchableOpacity
                      style={styles.modalOption}>

                      <Text style={styles.optionText}>Aguarda un momento</Text>

                    </TouchableOpacity>
                    )
                    : errorConsultingPrestador ? 
                    (
                      <TouchableOpacity
                      style={styles.modalOption}>

                      <Text style={styles.optionText}>No se encontraron prestadores</Text>

                    </TouchableOpacity>
                    )

                    :
                    
                    (
                  
                  NombresDePrestadores.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.modalOption}
                      onPress={() => handleSelectPrestadorNuevoSelect(option)}
                    >
                      <Text style={styles.optionText}>{option} </Text>
                    </TouchableOpacity>
                  ))
                  
                )
                  }
                </ScrollView>
                <View style={{ alignSelf: 'center', marginTop: 5 }}>
                  <IonIcon name='chevron-down-circle-outline' size={20} color="#505050" />
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalPrestadorVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

        </View>
     
        <Divider  marginTopDivider={MarginTopDivider} />

        <View style={{ alignSelf: 'center', marginTop:hp('1%')/* marginTop: 5, */ /* backgroundColor:'yellow', marginTop:hp('1%') */}}>

          {!isFormComplete ?
            (
              <Text style={{ marginBottom: '3%', marginTop: '2%', fontSize: 18, textAlign: 'center', color: '#595960', /* color:'#030136' */ }}>Completá todos los campos para poder continuar con tu solicitud</Text>
            ) :
            null
          }

          <TertiaryButton
            onPress={() => navigation.navigate('Enviando')}
            label="Continuar con la solicitud"
            color={globalColors.profile2}
            iconName='people-outline'
            description='Presiona para continuar'
            disabled={!isFormComplete}
            textSize={18}
          />
        </View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    margin: 0,
    padding: 0,
    backgroundColor: '#4285F4',
    fontSize: 18,
    /* backgroundColor: SelectedPrestadorNombre ? globalColors.NaranjaPastel : 'white' */
  },
  consignaText: {
   /*  color: 'gray', */
   color: globalColors.gray2,
   fontWeight: 'bold',
    fontSize: hp('2%'),
    margin: 0,
    padding: 0,
    marginBottom: 10,
  },
  /* inicio del modal  */
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  /*   gap: -10, */
    marginBottom: 10,
    marginTop: 12,
  },
  modalContent: {
    backgroundColor: 'white',
    width: 250,
    borderRadius: 10,
    maxHeight: 400, // Limita la altura del modal para permitir el scroll
    padding: 10,
  },
  modalContentEspecialidad: {
    backgroundColor: '#FFFFFF',
    /*  backgroundColor: 'blue', */
    width: '70%',
    borderRadius: 10,
    maxHeight: '80%', // Limita la altura del modal para permitir el scroll
    padding: 10,
    justifyContent: 'center',
    /*  alignItems: 'center', */
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color:'black'
    /*  color: '#595960',  */
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,

  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  selectButton: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  /* cartel de no hay prestadores:  */
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
})

