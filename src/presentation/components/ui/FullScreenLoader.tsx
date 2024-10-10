import React from 'react';
import { Layout, Spinner } from '@ui-kitten/components';
import { StyleProp, ViewStyle } from 'react-native';

interface FullScreenLoaderProps {
  layoutStyle?: ViewStyle; // Para personalizar el estilo del contenedor Layout
  spinnerSize?: 'small' | 'medium' | 'large' | 'giant'; // Tamaños posibles del Spinner
  spinnerStatus?: 'primary' | 'success' | 'info' | 'warning' | 'danger'; // Modificar el símbolo/color del Spinner
  spinnerStyle?: StyleProp<ViewStyle>;
  flexNumber?: number;
  color?: string;
/*   marginTop?: number;
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch';  */
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  layoutStyle,
  spinnerSize = 'giant', // Valor predeterminado,
  spinnerStatus = 'primary', // Valor predeterminado para el color/símbolo del Spinner
  flexNumber,
  color="#e89e49",
}) => {
  return (
    <Layout
      style={[{ flex: flexNumber || 1, justifyContent: 'center', alignItems: 'center', }, layoutStyle]} // Mezcla los estilos por defecto con los que se pasan por props
    >
      <Spinner
        size={spinnerSize} 
        status={spinnerStatus} 
        style={[
          { borderColor: color }, 
        ]}
      />
    </Layout>
  );
};
/* color="#e89e49" */

/* import { Layout, Spinner } from '@ui-kitten/components'

export const FullScreenLoader = () => {
 
    return (
      <Layout
      style={{ flex:1, justifyContent: 'center', alignItems: 'center'}}
      >
        <Spinner
        size="giant"
        />
      </Layout>
    )
  
} */