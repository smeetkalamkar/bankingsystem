const express = require('express');
const mongoose = require('mongoose');

const app = express();

const connect = () => {
    return mongoose.connect('mongodb://127.0.0.1:27017/bankDB')
}


app.listen(7001,async () =>{
    try {
        await connect();
        
    } catch (error) {
        console.log(error)
    }
    console.log("listening on port 7001")
})

const userSchema = new mongoose.Schema(
    {
        firstName:{type:String, required :true},
        lastName :{type:String, required :true},
        age : {type:String, required :true},
        email :{type:String, required :true,unique:true},
        address : {type:String, required :true},
    },
    {
        versionKey: false,
        timestamps :true
    }
)

const User = mongoose.model("user",userSchema);


const branchSchema = new mongoose.Schema(
    {
        branchName : {type:String, required :true},
        branchAddress :{type:String, required :true},
        IFSC : {type:String, required :true},
        MICR :{type:Number, required :true},
    },
    {
        versionKey: false,
        timestamps :true
    }
)

const Branch = mongoose.model("branch",branchSchema);


const masterSchema = new mongoose.Schema(
    {
        balance : {type:Number, required :true},
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user",
            required : true,
        },
        branchId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "branch",
            required : true,
        },

    },
    {
        versionKey: false,
        timestamps :true
    }
)

const Master = mongoose.model("master",masterSchema);


const savingSchema = mongoose.Schema(
    {
        accountNumber : {type:Number, required :true},
        balance: {type:Number, required :true},
        interestRate : {type:Number, required :true},
        masterId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "master",
            required : true,
        },
       
    },
    {
        versionKey: false,
        timestamps :true
    }
)

const Saving = mongoose.model("saving",savingSchema);


const fixedSchema = mongoose.Schema(
    {
        accountNumber : {type:Number, required :true},
        balance :{type:Number, required :true},
        interestRate : {type:Number, required :true},
        startDate : {type:Date, required :true},
        maturityDate :{type:Date, required :true},
        masterId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "master",
            required : true,
        },
    },
    {
        versionKey: false,
        timestamps :true
    }
)

const Fixed = mongoose.model("fixed",fixedSchema);

app.post("/save",async(req,res) =>{
    try {
        const savingacc = await Saving.create(req.body)
        return res.status(201).send(Saving);
    } catch (error) {
        return res.status(500).send({message:error.message})
        
    }
})


app.post("/fix",async(req,res) =>{
    try {
        const fixedacc = await Fixed.create(req.body)
        return res.status(201).send(Fixed);
    } catch (error) {
        return res.status(500).send({message:error.message})
        
    }
})

