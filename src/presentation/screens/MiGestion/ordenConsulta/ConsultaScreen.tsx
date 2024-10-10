import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'

import { Picker } from '@react-native-picker/picker';
import { globalColors, globalStyles } from '../../../theme/theme'
import { PrimaryButton } from '../../../components/shared/PrimaryButton'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParams } from '../../../routes/StackNavigator'
import CustomHeader from '../../../components/CustomHeader'
import { useAuthStore } from '../../../store/auth/useAuthStore'
import { IndexPath, Layout, Select, SelectItem, SelectGroup, } from '@ui-kitten/components'
import { BackButton } from '../../../components/shared/BackButton'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
/* import { SvgXml } from 'react-native-svg';
const isotipo = require('../credential/CredentialsData/images/Isotipo.svg'); */
const tramites = [
  { id: 1, name: 'Autorizar prestación' },
  { id: 2, name: 'Solicitar medicamentos' },
  { id: 3, name: 'Reintegros' },
  { id: 4, name: 'Empadronamientos anticonceptivos' },
  { id: 5, name: 'Mis trámites' },
];

const data = [
  'Developer',
  'Designer',
  'Product Manager',
];

interface Especialidad {
  id: string;
  nombre: string;
}

interface Props {
  especialidades: Especialidad[];
}

export const ConsultaScreen = () => {

  const { ObtenerFamiliares, idAfiliado, idAfiliadoTitular, ObtenerEspecialidades } = useAuthStore();

  //codigo para los selects:---------------------->

// PRUEBA REACT UI KITTEN SELECT:
const [selectedIndex, setSelectedIndex] = React.useState<IndexPath>(new IndexPath(0));

const displayValue = data[selectedIndex.row];

const renderOption = (title:any): React.ReactElement => (
  <SelectItem title={title} />
);

// ADAPTACION PARA NUESTRA APP: 

const [idNombresEspecialidad, setIdNombresEspecialidad] = useState<string[]>([]);

const [selectedIndexGonzalo, setSelectedIndexGonzalo] = React.useState<IndexPath>(new IndexPath(0));

const displayValueGonzalo = idNombresEspecialidad[selectedIndex.row];

const renderOptionGonzalo = (title): React.ReactElement => (
  <SelectItem title={title} />
);






  //useState para Familiar: 
   const [selectedIndex2, setSelectedIndex2] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0) ); 
   //const [selectedIndex, setSelectedIndex] = useState<number | null>(null);//no se si lo uso
  const [selectedFamiliar, setSelectedFamiliar] = useState<string | null>(null);
  const [selectedIndexEspecialidad, setSelectedIndexEspecialidad] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
  const [idsesFamiliares, setIdsesFamiliares] = useState<string[]>([]); // Inicializa idsesFamiliares como un array vacío

  const handleSelect3 = (itemValue: string | number, itemIndex: number) => {
    setSelectedFamiliar(idsesFamiliares[itemIndex]);
  };


  const [idEspecialidad, setIdEspecialidad] = useState<string[]>([]); // Inicializa idsesFamiliares como un array vacío
  const [selectedEspecialidad, setSelectedEspecialidad] = useState<{ idPrestacion: number, nombreParaAfiliado: string } | null>(null);
  
  const handleSelectEspecialidad = (index: any) => {
    const especialidadSeleccionada = idEspecialidad[index -1]; // Obtenemos la especialidad seleccionada del array de especialidades
    console.log('se SELECCIONO la especialidadSeleccionada:----> ', especialidadSeleccionada);
    setSelectedEspecialidad(especialidadSeleccionada);
  };


  useEffect(() => {

    const obtenerFamiliaresConsulta = async () => {
      try {
        if (idAfiliado !== undefined) {
          const idsesFamiliaresObtenidos = await ObtenerFamiliares(idAfiliado);
          /* console.log('estos son los idsesFamiliaresObtenidos desde el effect de CONSULTAScreen', idsesFamiliaresObtenidos); */
          setIdsesFamiliares(idsesFamiliaresObtenidos);
          console.log('IdsesFamiliares: ', idsesFamiliares);

          return idsesFamiliaresObtenidos
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
          console.log('estE ES EL SELECTED ESPECIALIDAD--->', selectedEspecialidad);
          setIdEspecialidad(especialidadesObtenidas);
          console.log('estE ES EL ARRAY DE ID ESPECIALDIDAD CON TODAS--->', idEspecialidad);
          const nombresEspecialidades = idEspecialidad.map((especialidad) => especialidad.nombreParaAfiliado);
          setIdNombresEspecialidad(nombresEspecialidades)
          return {especialidadesObtenidas, nombresEspecialidades}

        } else {
          console.error('idAfiliado  o idAfiliadoTitular es undefined. No se puede llamar a ObtenerFamiliares.');
        }
      } catch (error) {
        console.error('idAfiliado  o idAfiliadoTitular es undefined. No se puede llamar a ObtenerFamiliares desde el ConsultaScreen.');
      }
    };
    obtenerFamiliaresConsulta();
    obtenerEspecialidadesConsulta()
  }, [selectedEspecialidad])


  /*   const { idAfiliado } = useAuthStore(); */
  const [formData, setFormData] = useState({
    idAfiliado: '',
    prestacion: '',
    prestador: '',
  })
  // Función para manejar los cambios en los inputs
  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  /*   const [idAfiliado, setIdAfiliado] = useState('');
    const [prestacion, setPrestacion] = useState('');
    const [prestador, setPrestador] = useState(''); */
  //son 3 selects:
  //voy a llamar los id familiares desde el context y mostrarlos en el select.
  //voy a llamar a consulta especialidad y mostrarlos en el select.
  //voy a llamar a consulta prestador y mostrarlos en el select.
  
  let nombrePlaceHolder = selectedEspecialidad ? selectedEspecialidad.nombreParaAfiliado : "Seleccione Especialidad";
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParams>>()
  return (
    <View style={[globalStyles.container, { marginTop: top }]}>

   {/*    <CustomHeader color={globalColors.black} /> */}

      <BackButton />

      <Text style={{ marginBottom: 20, marginTop: 10, fontSize: 25, textAlign: 'center', }}>Solicitar orden de consulta</Text>
      <View
        style={{/*  marginBottom: 250, *//*  alignItems: 'center' */ }}>

        <View style={{borderRadius: 10, overflow: 'hidden', marginVertical: 5, justifyContent: 'center'}}>
        <Text style={{  fontSize: 20, textAlign: 'center' }}>Selecciona un familiar</Text>
          <Picker
            selectedValue={selectedFamiliar !== null ? selectedFamiliar : undefined}
            onValueChange={(itemValue: string | number, itemIndex: number ) =>
              handleSelect3(itemValue, itemIndex)
            }
            itemStyle={{
              fontSize: 15,
              fontFamily: 'Quicksand-Light',
              marginVertical: 0,
              padding: 0,
              margin:0,
            }}
          >
            {idsesFamiliares.map((item, index) => (
              <Picker.Item style={{marginVertical: 0}} key={index} label={item} value={item}
            
              />
            ))}
          </Picker>
        </View>

        <Layout level='1'>
          <Text style={{ marginLeft: 15 }}>Selecciona una Especialidad</Text>
          <Select
           /*  title={{selectedIndex}} */
            selectedIndex={selectedIndex2}
            onSelect={(selectedIndex) => {
              setSelectedIndexEspecialidad(selectedIndex);
              handleSelectEspecialidad(selectedIndex);
            }}
          >   
            {idEspecialidad.map((item, index) => (
              <SelectItem key={index}  title={item.nombreParaAfiliado} /> // Acceder al nombre de la especialidad en el segundo elemento

            ))}
          </Select>
          {selectedEspecialidad && (
            <Text style={{ marginLeft: 15 }}>{nombrePlaceHolder}</Text>
          )}

         {/*  <Text style={{ marginLeft: 15 }}>Selecciona un Prestador</Text>
          <Select
            placeholder={nombrePlaceHolder}
            selectedIndex={selectedIndex}
            onSelect={(selectedIndex) => {
              setSelectedIndexEspecialidad(selectedIndex);
              handleSelectEspecialidad(selectedIndex);
              console.log('este es el selectedIndex: ', selectedIndex);


            }}
          >
            {idEspecialidad.map((item, index) => (
              <SelectItem key={index} title={item.nombreParaAfiliado} /> // Acceder al nombre de la especialidad en el segundo elemento

            ))}
          </Select> */}
          {/* este funciona bien al menos para mostrar los nombres:  
          
           <Select
            placeholder="Seleccione Especialidad"
            selectedIndex={selectedIndex}
            onSelect={index => setSelectedIndex(index)}
          >
            {idEspecialidad.map((item, index) => (
              <SelectItem key={index} title={item.nombreParaAfiliado} /> // Acceder al nombre de la especialidad en el segundo elemento
            ))}
          </Select>
          
          
          
          
          */}
          {/* <Select
            placeholder="Seleccione Especialidad"
            selectedIndex={selectedIndex}
            onSelect={onSelect}
            value={selectedEspecialidad} 
            onSelect={index => setSelectedIndex(index)}
          >
            {idEspecialidad.map((especialidad, index) => (
              <SelectItem key={index} title={especialidad[1]} />
            ))}
          </Select> */}
        </Layout>

        <Layout
      style={globalStyles.containerSelect}
      level='1'
    >

      <Select
        style={globalStyles.select}
        placeholder='Default'
        value={displayValue}
        selectedIndex={selectedIndex}
        onSelect={(index: IndexPath) => setSelectedIndex(index)}
      >
        {data.map(renderOption)}
      </Select>

     

    </Layout>
    

        <Layout
      style={globalStyles.containerSelect}
      level='1'
    >

      <Select
        style={globalStyles.select}
        placeholder='Default'
        value={displayValueGonzalo}
        selectedIndex={selectedIndexGonzalo}
        onSelect={(index: IndexPath) => setSelectedIndexGonzalo(index)}
      >
        {idNombresEspecialidad.map(renderOptionGonzalo)}
      </Select>

     

    </Layout>
        {/*  <Layout level='1'>
          <Text style={{ marginLeft: 15 }}>Selecciona un Prestador</Text>
          <Select
            placeholder="Seleccione Prestador"
            selectedIndex={selectedIndex}
            onSelect={index => setSelectedIndex(index)}
          >
            {idPrestaciones.map((item, index) => (
              <SelectItem key={index} title={item} />
            ))}
          </Select>
        </Layout> */}

        {/*  <Input
          placeholder="Seleccione Afiliado"
          autoCapitalize="none"
          value={formData.idAfiliado}
          onChangeText={(text) => handleChange('idAfiliado', text)}
          accessoryLeft={<MyIcon name="arrowhead-right-outline" />}
          style={{ marginBottom: 10 }}
        /> */}

        {/*  <Input
          placeholder="Seleccione Especialidad"
          autoCapitalize="none"
          value={formData.prestacion}
          accessoryLeft={<MyIcon name="arrowhead-right-outline" />}
          style={{ marginBottom: 10 }}
        /> */}



        {/*  <Input
          placeholder="Seleccione Prestador"
          autoCapitalize="none"
          value={formData.prestador}
          onChangeText={text => setPrestador(text)}
          onChangeText={(text) => handleChange('prestador', text)}
           editable={isPreviousComplete('prestador')}
          accessoryLeft={<MyIcon name="arrowhead-right-outline" />}
          style={{ marginBottom: 10 }}
        /> */}
        <PrimaryButton
          /*  onPress={() => navigation.navigate('MiOrdenConsulta')} */
          onPress={() => {
            console.log('se realizò la consulta de orden de consultaaaa');

          }}
          disabled={!formData.idAfiliado || !formData.prestacion || !formData.prestador}
          label=" Solicitar Orden de consulta"
        />

        {/* <SvgXml xml={isotipo} width="100" height="150" /> */}
      </View>

      {/*   <Text style={{ marginBottom: 70, fontSize:25 }}>Mis tramites</Text> */}

      {/*   <PrimaryButton
    onPress={ ()=> navigation.navigate('Settings' as never )}
    label={"Ajustes"}
    /> */}
    </View>
  )
}

