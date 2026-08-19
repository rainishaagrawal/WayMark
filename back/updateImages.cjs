const mongoose = require('mongoose');
require('dotenv').config({path: './.env'});
const images = {
  'Carnival of Venice': 'https://loremflickr.com/1200/800/venice,carnival/all',
  'Rio Carnival': 'https://loremflickr.com/1200/800/rio,carnival/all',
  'Chinese New Year': 'https://loremflickr.com/1200/800/china,lantern/all',
  'Songkran Water Festival': 'https://loremflickr.com/1200/800/thailand,water/all',
  'Oktoberfest': 'https://loremflickr.com/1200/800/munich,beer/all',
  'Diwali Festival of Lights': 'https://loremflickr.com/1200/800/diwali/all',
  'Cherry Blossom Festival': 'https://loremflickr.com/1200/800/cherryblossom/all',
  'Dia de los Muertos': 'https://loremflickr.com/1200/800/mexico,skull/all',
  'Gion Matsuri Festival': 'https://loremflickr.com/1200/800/kyoto,festival/all',
  'Edinburgh Fringe Festival': 'https://loremflickr.com/1200/800/edinburgh,fringe/all'
};
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Festival = require('./src/models/Festival').default;
  for (const [name, image] of Object.entries(images)) {
    await Festival.updateOne({name}, {$set: {image}});
    console.log('Updated', name);
  }
  process.exit(0);
}).catch(console.error);
