jest.mock('react-native-gesture-handler', () => {
  return {
    GestureHandlerRootView: ({ children }) => children,
    // Agrega otros mocks si hace falta
  };
});
