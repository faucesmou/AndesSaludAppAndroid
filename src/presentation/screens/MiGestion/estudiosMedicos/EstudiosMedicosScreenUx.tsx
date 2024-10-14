import React, { useEffect, useState } from 'react'
import { Text, View, Alert, TextInput, ScrollView, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import { xml2js } from 'xml-js';
import { Picker } from '@react-native-picker/picker';
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { RootStackParams } from '../../../routes/StackNavigator';
import { globalColors, globalStyles } from '../../../theme/theme';
import CustomHeader from '../../../components/CustomHeader';
import { BackButton } from '../../../components/shared/BackButton';
import { PrimaryButton } from '../../../components/shared/PrimaryButton';
import UploadImage from '../../../components/shared/UploadImage';
/* import { ScrollView } from 'react-native-gesture-handler'; */
import { TertiaryButton } from '../../../components/shared/TertiaryButton';
import { IonIcon } from '../../../components/shared/IonIcon';
import Divider from '../../../components/shared/Divider';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';



export const EstudiosMedicosScreenUx = () => {





  const { ObtenerFamiliares, idAfiliado, idAfiliadoTitular, cadena, ObtenerPrestadoresEstudiosMedicos, GuardarIdPrestador, GuardarIdFamiliarSeleccionado, GuardarImagenes, imagenes } = useAuthStore();

  /* logica para no mostrar boton de enviar hasta que no esten los datos: */

  const [SelectedEspecialidadNombre, setSelectedEspecialidadNombre] = useState<string | null>(null);

  const [SelectedImage, setSelectedImage] = useState(false)

  const [isFormComplete, setIsFormComplete] = useState(false);



  //---------------------LOGICA PARA BORRAR CUALQUIER DATO RESIDUAL QUE HAY A QUEDADO EN EL CONTEXT-------------------------------------->
  useEffect(() => {
    const resetContextValues = async () => {
      try {
        // Restablecer los valores en el contexto
        await GuardarImagenes([null, null, null, null, null]);
        await GuardarIdPrestador('');
        await GuardarIdFamiliarSeleccionado('');

        const { imagenes, idPrestador, idAfiliadoSeleccionado } = useAuthStore.getState();

        if (imagenes.every(img => img === null) && idPrestador === '' && idAfiliadoSeleccionado === '') {
          console.log('ENTRANDO A ESTUDIOS MEDICOS: Todos los valores: imagenes, idPrestador y idAfiliadoSeleccionado fueron borrados del contexto.');
        } else {
          console.log('Algunos valores NO fueron borrados del contexto idPrestador: ', idPrestador);
        }

        if (idPrestador === '') {
          console.log('idPrestador fue borrado correctamente:', idPrestador);
        } else {
          console.log('idPrestador NO fue borrado:', idPrestador);
        }
      } catch (error) {
        console.log('Error en la carga inicial de la vista y borrado de datos iniciales:', error);
      }
    };

    resetContextValues();
  }, []);


  //---------------------LOGICA PARA EL SELECT DE FAMILIAR ELEGIDO-------------------------------------->
  //useStates: State 1 (nombresDeFamiliares): para guardar un listado de solamente NOMBRES de Familiares (sin el id) y poder mostrarlos en el select para que elija el usuario. State2 (FamiliaresObtenidosObjeto): datos de los familiares obtenidos de la consulta (nombre y id). State 3(selectedFamiliarNombre): nombre del familiar seleccionado. State4(FamiliarSeleccionadoDatos) : nombre y id del familiar seleccionado. 
  const [nombresDeFamiliares, setNombresDeFamiliares] = useState<string[]>([]);
  const [FamiliaresObtenidosObjeto, setFamiliaresObtenidosObjeto] = useState<string[]>([]); // 
  const [selectedFamiliarNombre, setSelectedFamiliarNombre] = useState<string | null>(null);
  const [FamiliarSeleccionadoDatos, setFamiliarSeleccionadoDatos] = useState<string[]>([]); // 
  const [isConsultingFamiliar, setIsConsultingFamiliar] = useState(false);
  const [errorConsultingFamiliar, setErrorConsultingFamiliar] = useState(false);


  /*   const handleSelectFamiliar = (itemValue: string | number, itemIndex: number) => {
      setSelectedFamiliarNombre(nombresDeFamiliares[itemIndex]);
      const familiarEncontrado: any = FamiliaresObtenidosObjeto.find(familiar => familiar.apellidoYNombre === itemValue);
      if (familiarEncontrado) {
        setFamiliarSeleccionadoDatos(familiarEncontrado)
        const { apellidoYNombre, idAfiliado }: { apellidoYNombre: string, idAfiliado: string } = familiarEncontrado;
        GuardarIdFamiliarSeleccionado(idAfiliado);
        console.log('datos FamiliarSeleccionadoDatos', FamiliarSeleccionadoDatos);
        console.log('datos de familiar encontrado: apellidoYNombre + idAfiliado -->-->-->--> ', apellidoYNombre, idAfiliado);
  
      } else {
        console.log('No se encontró el familiar');
  
      }
  
    }; */

  //---------------------LOGICA PARA EL SELECT DE PRESTADOR ELEGIDO-------------------------------------->
  const [PrestadoresObtenidosObjeto, setPrestadoresObtenidosObjeto] = useState<string[]>([]);
  const [NombresDePrestadores, setNombresDePrestadores] = useState<string[]>([' Incluya al menos 3 caracteres']);
  const [SelectedPrestadorNombre, setSelectedPrestadorNombre] = useState<string | null>(null);
  const [PrestadorSeleccionadoDatos, setPrestadorSeleccionadoDatos] = useState<string[]>([]);
  const [IdPrestadorElegido, setIdPrestadorElegido] = useState<string>('');
  const [NumeroPrestadoresEncontrados, setNumeroDePrestadoresEncontrados] = useState<number>(0);


  //--------------------- LOGICA PARA EL INPUT DE BÙSQUEDA DE PRESTADOR-------------------------------------->
  const [isPosting, setIsPosting] = useState(false)
  const [busqueda, setBusqueda] = useState({ cadena: '' })
  const [isConsultingPrestador, setIsConsultingPrestador] = useState(false);
  const [errorConsultingPrestador, setErrorConsultingPrestador] = useState(false);


  const obtenerPrestadoresConsulta = async () => {

    /*   if (busqueda.cadena.length > 1 && busqueda.cadena.length < 3) {
        Alert.alert('Error', 'La bùsqueda debe incluir al menos 3 caracteres');
        return false;
      }; */

      setIsConsultingPrestador(true)

    try {

      if (idAfiliado !== undefined && busqueda.cadena !== '') {
        const PrestadoresObtenidos: any = await ObtenerPrestadoresEstudiosMedicos(idAfiliado, busqueda.cadena);
        setPrestadoresObtenidosObjeto(PrestadoresObtenidos);

        const nombresPrestadores = PrestadoresObtenidos.map((prestador: any) => {
          if (Array.isArray(prestador.nombre)) {
            setIsConsultingPrestador(false)
            return prestador.nombre[0];
            
          } else {
            setIsConsultingPrestador(false)
            return prestador.nombre;
          }

        });



        if (nombresPrestadores.length === 0) {
          setNombresDePrestadores(["No se encontraron prestadores"]);
          setNumeroDePrestadoresEncontrados(0)
          setIsConsultingPrestador(false)
        } else {
          setNombresDePrestadores(nombresPrestadores);
          let CantidadDePrestadoresEncontrados = nombresPrestadores.length;
          setNumeroDePrestadoresEncontrados(CantidadDePrestadoresEncontrados)
          setIsConsultingPrestador(false)
          // Si solo hay un prestador, seleccionarlo automáticamente:
          if (nombresPrestadores.length === 1) {
            /*    handleSelectPrestador(nombresPrestadores[0], 0); */
            handleSelectPrestadorNuevoSelect(nombresPrestadores[0])
            setNumeroDePrestadoresEncontrados(1)
            setIsConsultingPrestador(false)
          }
        }
        setIsConsultingPrestador(false)
        return true;

      } else {

        console.log('idAfiliado  o cadena esta vacio. No se puede llamar a ObtenerPrestadoresEstudiosMedicos.');
        setIsConsultingPrestador(false);
        /* setErrorConsultingPrestador(true) */
        return false;
      }
    } catch (error) {
      console.log(' No se puede llamar a ObtenerPrestadoresEstudiosMedicos desde el EstudiosMedicosScreen.');
      setIsConsultingPrestador(false);
      setErrorConsultingPrestador(true)
    }
  };
  /* Por el momento no se usa este handle porque he quitado el botón "buscar prestador" y se busca automaticamente mientras el usuario escribe. */
  const HandleBuscarPrestador = async () => {

    setIsPosting(true);
    const respuestaExitosa = await obtenerPrestadoresConsulta()
    setIsPosting(false);
    if (!respuestaExitosa) {
      Alert.alert('Error', 'Dificultades tecnicas en la busqueda');
      return;
    }
    return;
  }


  /*  const handleSelectPrestador = (itemValue: string | number, itemIndex: number) => {
 
     setSelectedPrestadorNombre(NombresDePrestadores[itemIndex]);
 
     const selectedNombre = typeof itemValue === 'string' ? itemValue : itemValue.toString();
 
     const PrestadorEncontrado: any = PrestadoresObtenidosObjeto.find(prestador => prestador.nombre === selectedNombre);
     if (PrestadorEncontrado) {
       setPrestadorSeleccionadoDatos(PrestadorEncontrado)
       const { nombre, idConvenio }: { nombre: string, idConvenio: string } = PrestadorEncontrado;
       setIdPrestadorElegido(idConvenio)
       GuardarIdPrestador(idConvenio)
       console.log('datos de PrestadorEncontrado:-->-->-->--> nombre + idConvenio', nombre, idConvenio);
     } else {
       console.log('No se encontró la especialidad');
     }
   }; */

  useEffect(() => {
    obtenerPrestadoresConsulta();
  }, [idAfiliado, busqueda.cadena]);

  // Si solo hay un prestador y no hay uno seleccionado, seleccionarlo automáticamente
  /*   useEffect(() => {
      if (NombresDePrestadores.length === 1 && !SelectedPrestadorNombre) {
      
        handleSelectPrestadorNuevoSelect(NombresDePrestadores[0])
      }
    }, [NombresDePrestadores, IdPrestadorElegido,]); */

  useEffect(() => {

    const obtenerFamiliaresConsulta = async () => {
      setIsConsultingFamiliar(true)
      try {
        if (idAfiliado !== undefined) {
          const FamiliaresObtenidosObjeto = await ObtenerFamiliares(idAfiliado);

          setFamiliaresObtenidosObjeto(FamiliaresObtenidosObjeto);
          const mensajePredeterminado = 'Desliza hacia arriba';
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

    obtenerFamiliaresConsulta();
    /*     obtenerEspecialidadesConsulta();
        obtenerPrestadoresConsulta(); */
  }, [/* selectedFamiliarNombre, */ /* SelectedEspecialidadNombre, */ /* IdEspecialidadElegida,*/ /* SelectedPrestadorNombre *//* IdPrestadorElegido */])
  const cerrarTeclado = () => {
    Keyboard.dismiss();
  };


  const navigation = useNavigation<NavigationProp<RootStackParams>>()

  /* nuevo select familiares */
  const screenWidth = Dimensions.get('window').width;
  const dynamicGap = screenWidth * 0.00;
  const dynamicMargin = screenWidth * 0.01;
  const [modalFamiliarVisible, setModalFamiliarVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('Familiares');

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
    setModalFamiliarVisible(false);

  };

  /* nuevo select prestador */
  const [modalPrestadorVisible, setModalPrestadorVisible] = useState(false);
  const [selectedPrestador, setSelectedPrestador] = useState('Prestadores');

  const handleSelectPrestadorNuevoSelect = async (prestadorSeleccionado: string) => {
    console.log('ENTRANDO a handleSelectPrestadornuevo: este es el prestadorSeleccionado:', prestadorSeleccionado);
    setSelectedPrestadorNombre(prestadorSeleccionado);

    const PrestadorEncontrado: any = PrestadoresObtenidosObjeto.find(prestador => prestador.nombre.toLowerCase() === prestadorSeleccionado.toLowerCase());
    if (PrestadorEncontrado) {
      setPrestadorSeleccionadoDatos(PrestadorEncontrado)
      const { nombre, idConvenio }: { nombre: string, idConvenio: string } = PrestadorEncontrado;
      console.log('Nombre del Prestador desde el nuevo select:', nombre);
      console.log('ID del Prestador desde el nuevo select:', idConvenio);
      await GuardarIdPrestador(idConvenio)
      setIdPrestadorElegido(idConvenio)
      setSelectedPrestador(prestadorSeleccionado)
      setSelectedEspecialidadNombre(prestadorSeleccionado)

      console.log('Nombre del Prestador desde el nuevo select: se habria guardado en el context', nombre);
      console.log('ID del Prestador desde el nuevo select:', idConvenio);
    } else {
      console.log('No se encontró el prestador');

    }
    setModalPrestadorVisible(false)

  };


  useEffect(() => {
    // Verificar si hay al menos una imagen válida (no null) y actualizar SelectedImage
    setSelectedImage(imagenes.some((image) => image !== null));
  }, [imagenes]);

  useEffect(() => {
    setIsFormComplete(!!selectedFamiliarNombre && !!SelectedEspecialidadNombre && !!SelectedImage);
  }, [selectedFamiliarNombre, SelectedEspecialidadNombre, SelectedImage]);

  const { height } = Dimensions.get('window');
  let MarginTopSeleccionaFamiliar: number = hp('0.5%');
  let MarginTopDivider: number = hp('0.5%');
  let buttonTextFontSize = wp('4.3%');
 let optionSelectedTextFontSize = wp('4.3%'); 
  let buttonDescriptionFontSize = wp('4.5%');
  if (height < 680) { // IMPORTANTE Pantallas más pequeñas como iPhone SE o iPhone 8 de 5.4 pulgadas o menos aproximadamente 

    MarginTopSeleccionaFamiliar = hp('0%');
    MarginTopDivider = hp('0.5%');
    buttonTextFontSize = wp('3.8%');
    buttonDescriptionFontSize = wp('4%');
    optionSelectedTextFontSize = wp('4%'); 
  }

  return (

    <View style={globalStyles.container}>
 <ScrollView>  
      <CustomHeader /* color={globalColors.black} */ titleSize={hp('4%')}  />

      <BackButton Size={hp('4%')}/>
      {/*   <Text style={{ marginBottom: '3%', marginTop: '2%', fontSize: 25, textAlign: 'center', color:'#030136'}}>Estudios medicos Ux</Text>  */}

      <View
        style={{   /* backgroundColor: 'green', */  flex: 1, marginBottom: '15%', marginTop: '0%' }}>

        {/* <TouchableWithoutFeedback onPress={cerrarTeclado} > 

        </TouchableWithoutFeedback>*/}

          {/* -----------------FAMILIAR---------------- */}

          <TouchableWithoutFeedback onPress={cerrarTeclado} >

            {/* -----------------FAMILIAR NUEVO SELECT---------------- */}

            <View style={[styles.container, { gap: dynamicGap, marginTop: MarginTopSeleccionaFamiliar }]}>
              {/* Botón que abre el modal */}
              <Text style={[styles.consignaText, { marginHorizontal: dynamicMargin }]}>Selecciona el Familiar:</Text>
              <TouchableOpacity
                style={[styles.selectButton, { marginHorizontal: dynamicMargin }]}
                onPress={() => setModalFamiliarVisible(true)}
              >
                <Text style={{
                  color: 'white',
                  fontWeight: 'bold',
                  margin: 0,
                  padding: 0,
                  backgroundColor: '#4285F4',
                  fontSize: optionSelectedTextFontSize,
                }/* styles.buttonText */}>{selectedValue}</Text>
              </TouchableOpacity>

              {/* Modal para seleccionar las opciones */}
              <Modal
                visible={modalFamiliarVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalFamiliarVisible(false)}
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
                        <Text style={{
                          fontSize: buttonTextFontSize,
                          textAlign: 'center',
                          color:'black',
                        }/* styles.optionText */}>{option}</Text>
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
                    onPress={() => setModalFamiliarVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

          </View>

        </TouchableWithoutFeedback>

        {/* -----------------INPUT 2 PARA ESCRIBIR EL PRESTADOR---------------- */}
        <TouchableWithoutFeedback onPress={cerrarTeclado} >
          <Divider marginTopDivider={MarginTopDivider} />
        </TouchableWithoutFeedback>
        {/*   <KeyboardAvoidingView behavior="padding"> */}

        <TouchableWithoutFeedback onPress={cerrarTeclado} >
          <View style={globalStyles.containerInput2} >
            <Text style={{ /* backgroundColor: 'yellow', */ fontSize: 18, textAlign: 'center', marginBottom: 10, marginTop: 0, color:'black' }}>Utilizá el siguiente buscador para encontrar tu prestador</Text>
            <TextInput
              editable={true}
              style={globalStyles.estilosInput2}
              placeholder="Escribí aquí el prestador deseado"
              placeholderTextColor="gray"
              value={busqueda.cadena}
              onChangeText={(cadena) => setBusqueda({ cadena })}
            />
          </View>
        </TouchableWithoutFeedback>
        {/*  </KeyboardAvoidingView> */}


        {/* -----------------PRESTADOR---------------- */}
        {/*  <Divider /> */}
        <TouchableWithoutFeedback onPress={cerrarTeclado} >

          <Text style={{ fontSize: hp('2.2%') /* 18 */, textAlign: 'center', marginBottom: 5, marginTop: 5, color:'black' }}>Prestadores encontrados: {NumeroPrestadoresEncontrados} </Text>

        </TouchableWithoutFeedback>




        {/* -----------------PRESTADOR Nuevo SElectt---------------- */}

        <TouchableWithoutFeedback onPress={cerrarTeclado} >



            <View style={[styles.container, { gap: dynamicGap }]}>
              {/* Botón que abre el modal */}
              <Text style={[styles.consignaText, { marginHorizontal: dynamicMargin, textAlign: 'center', fontSize: hp('2.5%') }]}>Selecciona un Prestador:</Text>
              <TouchableOpacity
                style={[styles.selectButton, { marginHorizontal: dynamicMargin }]}
                onPress={() => setModalPrestadorVisible(true)}
              >
                <Text style={{
                  color: 'white',
                  fontWeight: 'bold',
                  margin: 0,
                  padding: 0,
                  backgroundColor: '#4285F4',
                  fontSize: optionSelectedTextFontSize,
                }}/* style={styles.buttonText} */>{selectedPrestador} ({NumeroPrestadoresEncontrados})</Text>
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
                    onPress={() => setModalPrestadorVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

          </View>
        </TouchableWithoutFeedback>




        <TouchableWithoutFeedback onPress={cerrarTeclado} >
          <Divider marginTopDivider={MarginTopDivider} />
        </TouchableWithoutFeedback>

       {/*  <View style={{ marginBottom: wp('0%'), marginTop: hp('0%') }}> */}
        <UploadImage />
          
        {/*    </View> */}


        {/* componente para cargar imagenes: UploadImage */}

        <TouchableWithoutFeedback onPress={cerrarTeclado} >

          <View style={{ flex: 0, justifyContent: 'flex-end' }}>

            {!isFormComplete ?
              (
                <Text style={{ marginBottom: wp('1.5%'), marginTop: wp('1%'), fontSize: hp('2.2%'), textAlign: 'center', color: '#595960', /* color:'#030136' */ }}>Completá todos los campos para poder continuar con tu solicitud</Text>
              ) :
              null
            }

            <TertiaryButton
              onPress={() => navigation.navigate('Enviado')}
              label="Solicitar mi estudio"
              color={globalColors.profile2}
              iconName='medkit-outline'
              description='Presiona aquí para continuar'
              disabled={!isFormComplete}
              textSize={buttonTextFontSize}
              descriptionSize={buttonDescriptionFontSize}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
 </ScrollView> 

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
    fontSize: 16,
    /* backgroundColor: SelectedPrestadorNombre ? globalColors.NaranjaPastel : 'white' */
  },
  consignaText: {
    color: 'black',
    fontSize: 20,
    margin: 0,
    padding: 0,
    marginBottom: 10,

  },
  /* inicio del modal  */
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: -10,
    marginBottom: 12,
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
    color:'black'
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

