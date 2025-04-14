// server.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Infos Infobip
const INFOBIP_API_URL = 'https://43p9e6.api.infobip.com/sms/2/text/advanced';
const INFOBIP_API_KEY = '2319fbc8195a1aef75e352bd59974337-137e2fe2-d6e3-48b5-9873-e507bc926c09'; // Remplace par ta vraie clé API ici

app.post('/virement', async (req, res) => {
  const { nom, courriel, mobile, montant, destinataire, message } = req.body;

  try {
    await axios.post(INFOBIP_API_URL, {
      messages: [
        {
          from: "BMCI",
          destinations: [{ to: mobile }], // Utilise le mobile du formulaire
          text: `Bonjour ${nom}, votre virement de ${montant}€ à ${destinataire} a été effectué avec succès.`,
        },
      ],
    }, {
      headers: {
        Authorization: `App ${INFOBIP_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    res.status(200).json({ success: true, message: 'SMS envoyé avec succès !' });
  } catch (error) {
    console.error('Erreur lors de l’envoi du SMS :', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Échec de l’envoi du SMS.' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur en cours sur http://localhost:${PORT}`);
});
