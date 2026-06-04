import {Borrower} from "../models/borrower.model.js"
import {Loan} from "../models/loan.model.js"
import {Payment} from "../models/payment.model.js"

const createBorrower = async (req,res) => {
    try{
        const borrower = new Borrower(req.body);
        await borrower.save();
        res.status(200).json({
            success: true,
            borrower
        });
    }
    catch(error){
        res.status(400).json(
            {
                success: false,
                message: `Failed to create Borrower profile, ${error.message}`
            }
        )
    }
}

const addLoanToBorrower = async (req,res) => {
    try{
        const {id} = req.params
        const borrower = await Borrower.findById(id)

        if(!borrower){
            return res.status(404).json({
                success: false,
                message: `Borrower not found...`
            })
        }

        const newLoan = new Loan({...req.body, borrower: id})
        await newLoan.save()

        borrower.loans.push(newLoan._id)
        await borrower.save()

        res.status(201).json({
            success: true,
            message: `Loan added succesfully!!`
        })
    }
    catch(err){
        res.status(400).json({
            success: false,
            message: `Failed to add loan to borrower, ${err.message}`
        })
    }
}


const getAllBorrowers = async (req,res) => {

    try {
        const { search, status } = req.query

        const filter = {}

        if (search) {
            filter.name = { $regex: search, $options: 'i' }  // case-insensitive
        }

        if (status) {
            const validStatuses = ["active", "defaulter", "cleared"]
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
                })
            }
            filter.status = status
        }

        const borrowers = await Borrower.find(filter).populate('loans')

        res.status(200).json({
            success: true,
            count: borrowers.length,
            borrowers
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: `Failed to get borrowers: ${err.message}`
        })
    }

    // const borrowers = await Borrower.find().populate('loans')
    // res.json(borrowers)
}


const getBorrowerById = async (req,res) => {
    const borrower = await Borrower.findById(req.params.id).populate('loans')
    if(!borrower){
        return res.status(404).json({
            success: false,
            message: `No borrower found....`
        })
    }

    res.json(borrower)
}

const getOverdueBorrowers = async (req, res) => {
  try {
    const borrowers = await Borrower.find().populate({
      path: 'loans',
      populate: { path: 'payments' }
    });

    const now = new Date();
    const overdueBorrowers = [];

    for (const b of borrowers) {
      let isOverdue = false;

      for (const loan of (b.loans || [])) {
        const payments = loan.payments || [];
        let lastPaymentDate = payments.length > 0
          ? new Date(payments[payments.length - 1].paymentDate)
          : new Date(loan.startDate);

        const monthsLate = (now.getFullYear() - lastPaymentDate.getFullYear()) * 12
          + (now.getMonth() - lastPaymentDate.getMonth());

        if (monthsLate >= 4) {
          isOverdue = true;
          break;
        }
      }

      if (isOverdue) overdueBorrowers.push(b);
    }

    res.json({ success: true, overdue: overdueBorrowers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const updateBorrowerStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const validStatuses = ["active", "defaulter", "cleared"]
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
            })
        }

        const borrower = await Borrower.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )

        if (!borrower) {
            return res.status(404).json({
                success: false,
                message: `Borrower not found`
            })
        }

        res.status(200).json({
            success: true,
            message: `Borrower status updated to "${status}"`,
            borrower
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: `Failed to update borrower status: ${err.message}`
        })
    }
}


export {createBorrower, addLoanToBorrower ,getAllBorrowers, getBorrowerById, getOverdueBorrowers, updateBorrowerStatus}