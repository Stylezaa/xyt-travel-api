const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);

    console.log('Connection to DATABASE Successfully');
  } catch (error) {
    console.log(error);
    process.exit(1); //ຄໍາສັ່ງການອອກຈາກ error
  }
};

module.exports = connectDB;
