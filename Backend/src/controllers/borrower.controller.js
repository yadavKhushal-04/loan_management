import {Borrower} from "../models/borrower.model.js"
import {Loan} from "../models/loan.model.js"

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
    const borrowers = await Borrower.find().populate('loans')
    res.json(borrowers)
}


const getBorrowerById = async (req,res) => {
    const borrower = await Borrower.findById(req.params.id).populate('loans')
    if(!borrower){
        return res.status(404).json({
            success: false,
            message: `No borrower found....`
        })
    }

    res.json(borrowers)
}


export {createBorrower, addLoanToBorrower ,getAllBorrowers, getBorrowerById}