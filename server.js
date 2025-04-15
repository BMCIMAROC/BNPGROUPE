const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/virement', async (req, res) => {
  const { nom, courriel, mobile, montant, destinataire, message } = req.body;

  const smsMessage = `Bonjour ${nom}, votre virement de ${montant}€ à ${destinataire} a bien été enregistré.`;

  try {
    const response = await axios.post(
      `${process.env.INFOBIP_BASE_URL}/sms/2/text/advanced`,
      {
        messages: [
          {
            destinations: [{ to: mobile }],
            from: process.env.INFOBIP_SENDER,
            text: smsMessage
          }
        ]
      },
      {
        headers: {
          Authorization: `App ${process.env.INFOBIP_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    );

    console.log('SMS envoyé !', response.data);
    res.status(200).send('Virement effectué et SMS envoyé');
  } catch (error) {
    console.error('Erreur envoi SMS:', error.response?.data || error.message);
    res.status(500).send('Erreur lors de l\'envoi du SMS');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
