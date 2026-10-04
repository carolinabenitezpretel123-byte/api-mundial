const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Cadena de conexión a tu MongoDB Atlas (reemplaza <db_password> por tu contraseña real)
const uri = "mongodb+srv://tu_usuario:<db_password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let db, teamsCollection;

async function conectarDB() {
    try {
        await client.connect();
        db = client.db("mundial");
        teamsCollection = db.collection("teams");
        console.log("Conectado exitosamente a MongoDB Atlas - Base de datos: mundial");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
    }
}
conectarDB();

// ENDPOINT 1: Obtener todos los equipos
app.get('/api/teams', async (req, res) => {
    try {
        const teams = await teamsCollection.find({}).toArray();
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: "Error al consultar los equipos" });
    }
});

// ENDPOINT 2: Obtener jugadores filtrados por país
app.get('/api/teams/:pais/jugadores', async (req, res) => {
    try {
        const paisBuscado = req.params.pais;
        const equipo = await teamsCollection.findOne({ pais: paisBuscado });
        
        if (!equipo) {
            return res.status(404).json({ mensaje: "País no encontrado en la base de datos" });
        }
        
        res.json({
            pais: equipo.pais,
            grupo: equipo.grupo,
            jugadores: equipo.jugadores
        });
    } catch (error) {
        res.status(500).json({ error: "Error al consultar los jugadores" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});