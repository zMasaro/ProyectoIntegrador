import { AddUser } from "../models/signup";
import express from "express";
const router = express.Router();

router.post("/register", async (req, res) => {
const {email,name,lastName,password,rol} = req.body;
if(!email || !name || !lastName || !password|| !rol){
    return res.status(400).json({message : "Debe llenar todos los campos"});
}
try{
    const user = await AddUser({email,name,lastName,password,rol});
    res.json({message: "Usuario registrado correctamente", user});
}catch(error: any){
    return res.status(400).json({ message: error.message });
}
});

export default router;