// database/mongodb/celulares-app.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();


let db; 
let collection;

async function connectToMongoDB() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI); 
    await client.connect();
    console.log('Conectado a MongoDB pa');

    db = client.db('AppAndesSalud-Celulares'); 
    collection = db.collection('Celulares-Actualizados');

  } catch (error) {
    console.error('Error al conectar a MongoDB DESDE EL SERVIDOR: error:', error);
    throw error; // 
  }
}


async function guardarCelular(datos) {
  console.log("ENTRÓ A ESTAMOS ADENTRO guardarCelular AHORA INTENTANDO CONECTAR CON MONGODB========================>:");
    console.error("Datos recibidos en guardarCelular del backend::==>", datos);
    try {
      if (!db ||!collection) {
        await connectToMongoDB(); // Asegura la conexión antes de operar
      }
      const result = await collection.insertOne(datos);

      console.error("Datos guardados con éxito, el result es===>>>>===>", result);
      return result;
    } catch (error) {
      console.error("Error al guardar celular:", error);
      throw error; // Re-lanza el error
    }
}

// Otras funciones para interactuar con la colección (si las necesitas)
// Por ejemplo: obtenerCelular(id), actualizarCelular(id, datos), etc.

export { connectToMongoDB, guardarCelular }; // Exporta las funciones