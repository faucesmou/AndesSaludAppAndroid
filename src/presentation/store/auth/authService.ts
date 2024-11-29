import AsyncStorage from '@react-native-async-storage/async-storage';

export const initializeAuth = async (): Promise<boolean> => {
  try {
    const authData = await AsyncStorage.getItem('authData');
    if (authData) {
      const parsedData = JSON.parse(authData);
      return parsedData.status === 'authenticated';
    }
    return false;
  } catch (error) {
    console.error('Error al inicializar la autenticación:', error);
    return false;
  }
};

export const loadAuthData = async (): Promise<Record<string, any> | null> => {
  try {
    const authData = await AsyncStorage.getItem('authData');
    if (authData) {
      return JSON.parse(authData);
    }
    return null;
  } catch (error) {
    console.error('Error al cargar datos de autenticación de authService.ts:', error);
    return null;
  }
};
