
const controller = {
guardarTelefonoPrueba: async (req, res) => {
    console.log("Entrando a guardar-datos-prueba desde el servidor"); 
    try {
        console.log("Petición a guardar-datos-prueba recibida"); 
    res.status(200).json({ mensaje: 'Ruta de prueba funcionando' }); 

    } catch (error) {
        console.error("Error en la Petición a guardar-datos-prueba recibida:", error);
        return res.status(500).json({
            success: false,
            message: "Error en la Petición a guardar-datos-prueba recibida",
            errorDetails: error.stack || error
        });
        
    }
},
guardarTelefonoOficial: async (req, res) => {
    console.log("Entrando a guardarTelefonoOficial desde el servidor"); 
    let datosDelCelular = req.body
    console.log("Datos recibidos en el servidor en guardarTelefonoOficial==>:", datosDelCelular);
    try {
        const resultado = await guardarCelular(datosDelCelular);
    res.status(200).json({ mensaje: 'Ruta de prueba funcionando' }); 

    } catch (error) {
        console.error("Error en la ruta /guardar-datos:", error);
        return res.status(500).json({
            success: false,
            message: "Error en la Petición a guardar-datos-prueba recibida",
            errorDetails: error.stack || error
        });
        
    }
}}


/* EN INDEX.ROUTES.JS:  */
router.post('/guardar-datos-prueba', controller.guardarTelefonoPrueba)
router.post('/guardar-datos', controller.guardarTelefonoOficial)