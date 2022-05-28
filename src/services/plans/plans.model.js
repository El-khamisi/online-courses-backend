const mongoose = require('mongoose');

const plansNames = {
  Monthly: 'Monthly',
  Biannual: 'Biannual',
  Annual: 'Annual',
};

const plansSchema = new mongoose.Schema({
  name: { type: String, trim: true, enum: [...Object.values(plansNames), 'Invalid Plan Name'], required: [true, 'Name of plane is required'], unique: true },
  list: { type: [String] },
  price: { type: Number, set: (v) => Math.round(v * 100) / 100, required: [true, 'Provide valid Price'] },
  priceEGP: { type: Number, set: (v) => Math.round(v * 100) / 100 },
  rateEGP: { type: Date },
});

const initPlans = async () => {
  const plan = await mongoose.connection.models.Plan.find().exec();

  for (const value of Object.values(plansNames)) {
    if (!plan.some((e) => e.name == value)) {
      let preprice;
      switch (value) {
        case plansNames.Monthly:
          preprice = 25;
          break;
        case plansNames.Biannual:
          preprice = 150;
          break;
        case plansNames.Annual:
          preprice = 200;
          break;
      }

      const doc = new mongoose.connection.models.Plan({
        name: value,
        price: preprice,
      });
      await doc.save();
    }
  }
};

module.exports = {
  plansNames,
  initPlans,
  planModel: mongoose.model('Plan', plansSchema),
};
// curl --request GET --url 'https://api.apilayer.com/exchangerates_data/convert?from=USD&to=EGP&amount=1' --header 'apikey: C1llzKxg52ShBGa6RLTKvNnz2D39eUyN'
