const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());

const pool = new Pool({
    user: 'trtp',
    host: 'localhost',
    database: 'windtarifa',
    port: 5432,
})

const TABLE = 'weather';
app.get('/', async (req, res) => {
    const queryText = 'SELECT * FROM '.concat(TABLE);
    pool.query(queryText, (err, result) => {
        if (err) {
            res.status(500).send('500 response: Internal Server Error');
            return;
        }

        const data = {};
        result.rows.forEach(row => {
            if (!data[row.t_date]) {
                data[row.t_date] = {};
            }

            if (!data[row.t_date][row.t_hour]) {
                data[row.t_date][row.t_hour] = {};
            }
            data[row.t_date][row.t_hour] = row;
        });
        console.log('api-root res status: ', res.statusCode);
        res.status(200).send(data);
    }
    );
});

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
    console.log('Server is running on port 3000');
}
);
