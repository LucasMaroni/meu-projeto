const { Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  

// Middleware para tratar JSON no corpo da solicitação
app.use(bodyParser.json());

// Configuração do CORS
app.use(cors());

// Configuração do Pool do PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'databasemcd',
    password: '11032005',
    port: 5432,
});

// Definição da rota
app.post('/finalizar-atendimento', async (req, res) => {
    const { id, placa, operacao, localizacao, status, tempo } = req.body;

    try {
        const client = await pool.connect();
        await client.query(
            'INSERT INTO atendimentos (id, placa, operacao, localizacao, status, tempo) VALUES ($1, $2, $3, $4, $5, $6)',
            [id, placa, operacao, localizacao, status, tempo]
        );
        client.release();
        res.status(200).json({ message: 'Dados inseridos com sucesso' });
    } catch (error) {
        console.error('Erro ao finalizar atendimento:', error);
        res.status(500).json({ error: 'Erro ao finalizar atendimento' });
    }
});
