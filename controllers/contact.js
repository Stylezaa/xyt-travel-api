// Functions
const sendEmail = require("../functions/MailSender");

exports.ContactUs = async (req, res) => {
  try {
    const {
      gender,
      full_name,
      email,
      phone_number,
      country,
      city,
      whatsapp,
      facebook,
      subject,
      specific_request,
    } = req.body;

    const ServerEmail = "anyting9977@gmail.com";

    res.status(200).json({
      message: "Send Contact Successfully",
      status: 200,
    });

    await sendEmail({
      from: email,
      email: ServerEmail,
      subject: "Contact US",
      message: `
             Form: ${email},
             Full Name: ${full_name},
             Gender: ${gender},
             Phone Number: ${phone_number},
             Country: ${country},
             City: ${city},
             Whatsapp: ${whatsapp},
             Facebook: ${facebook},
             Subject: ${subject},
             Specific Request: ${specific_request}
      `,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error,
      status: 500,
    });
  }
};
