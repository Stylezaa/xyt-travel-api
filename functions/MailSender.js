// Library
const nodemailer = require("nodemailer");
// const fs = require("fs");

const sendEmail = async (option) => {
  // Create Transporter
  // const transporter = nodemailer.createTransport({
  //   service: "",
  //   port: "",
  //   auth: {
  //     user: "",
  //     password: "",
  //   },
  // });

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "thanousinpvck@gmail.com",
      pass: "zhdl zvlz dpwe ptbb",
    },
  });

  // Define Email Options
  const emailOptions = {
    from: option.from,
    to: option.email,
    subject: option.subject,
    text: option.message,
    // attachments: [
    //   {
    //     filename: "example.txt", // Name of the attached file
    //     content: fs.createReadStream("path/to/your/file/example.txt"), // Path to the file
    //   },
    // ],
  };

  await transporter.sendMail(emailOptions, function (error, info) {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = sendEmail;
