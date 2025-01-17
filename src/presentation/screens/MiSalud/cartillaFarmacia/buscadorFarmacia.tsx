import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';

const BuscadorFarmacia = ({ cartillas }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredCartillas, setFilteredCartillas] = useState(cartillas);

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === '') {
      // Si el texto está vacío, mostramos todas las cartillas
      setFilteredCartillas(cartillas);
    } else {
      // Filtramos las cartillas por nombre
      const filtered = cartillas.filter((cartilla) =>
        cartilla.nombre.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCartillas(filtered);
    }
  };

  const renderCartilla = ({ item }) => (
    <View style={styles.cartillaItem}>
      <Text style={styles.cartillaNombre}>{item.nombre}</Text>
      <Text style={styles.cartillaDomicilio}>{item.domicilio}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
        <Text style={{ fontSize: 17, color: 'black' }}>Teléfonos: </Text>
        {item.telefono.toLowerCase() === 'no disponible' ? (
          <Text style={[styles.phoneText, { color: 'gray', textDecorationLine: 'none' }]}>
            No disponible
          </Text>
        ) : (
          item.telefono
            .split(/[,;\s]+/)
            .map((phone, idx) => (
              <Text
                key={idx}
                style={[styles.phoneText, { marginRight: 10, color: '#4285F4' }]}
                onPress={() => console.log(`Llamar a ${phone}`)}
              >
                {phone}
              </Text>
            ))
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Campo de búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre..."
        value={searchText}
        onChangeText={handleSearch}
      />

      {/* Lista de cartillas */}
      <FlatList
        data={filteredCartillas} // Mostrar cartillas filtradas o todas
        keyExtractor={(item) => item.idFarmacia}
        renderItem={renderCartilla}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No se encontraron resultados</Text>
        }
      />
    </View>
  );
};

export default BuscadorFarmacia;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  cartillaItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cartillaNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cartillaDomicilio: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  phoneText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});
