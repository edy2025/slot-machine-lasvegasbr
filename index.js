const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

app.post('/pagar', async (req, res) => {
  try {
    const preference = {
      items: [
        {
          title: '100 Moedas Slot Machine',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 1.99
        }
      ],
      back_urls: {
        success: 'https://seu-site.com/sucesso',
        failure: 'https://seu-site.com/erro',
        pending: 'https://seu-site.com/pendente'
      },
      auto_return: 'approved'
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ url: response.body.init_point });
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    res.status(500).json({ error: 'Erro ao iniciar pagamento.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor de pagamento rodando na porta ${PORT}`);
});
