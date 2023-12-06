exports.UploadBilling = async (req, res) => {
  try {
    const file = req.file.filename;
    if (!file) {
      return res.status(404).send({
        message: "Not Found Billing",
        status: 404,
      });
    }

    res.status(200).send({
      message: "ອັບໂຫລດ Billing ສໍາເລັດ",
      status: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error,
      status: 500,
    });
  }
};
