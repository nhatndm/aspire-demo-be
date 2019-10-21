const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const LoansModel = mongoose.model("Loan", {});
const Lodash = require("lodash");

const LoansDetailModel = mongoose.model(
  "Loandetail",
  new Schema({
    principal: Schema.Types.String,
    interestPayment: Schema.Types.Number,
    dateOfPayment: Schema.Types.String,
    loanId: Schema.Types.ObjectId,
    status: Schema.Types.String
  })
);

exports.getLoans = async (req, res) => {
  const loans = await LoansModel.find();
  let newArray = [];

  loans.forEach(v => {
    const jsonItem = v.toJSON();
    newArray.push({
      ...jsonItem,
      client: jsonItem.client.name
    });
  });

  return res.status(200).send({ loans: newArray });
};

exports.getLoanDetails = async (req, res) => {
  const loanId = req.params.id;
  const loans = await LoansModel.aggregate([
    {
      $match: {
        _id: ObjectId(loanId)
      }
    },
    {
      $lookup: {
        from: "loandetails",
        localField: "_id",
        foreignField: "loanId",
        as: "loans"
      }
    }
  ]);

  const loanObject = loans[0];

  return res
    .status(200)
    .send({ loans: loanObject.loans, client: loanObject.client.name });
};

exports.loanRePayment = async (req, res) => {
  const idloanDeTail = req.params.idloanDeTail;
  const cost = req.body.cost;
  const loanFound = await LoansDetailModel.findById(idloanDeTail);

  if (cost < loanFound.interestPayment + loanFound.principal) {
    return res.status(400).send({ error: "your repayment is not valid" });
  }

  loanFound.status = "UNPAID";
  await loanFound.save();
  return res.status(200).send({ loan: loanFound });
};
