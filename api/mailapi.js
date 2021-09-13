const express = require("express");
const app = express();
const cors = require("cors")

const sendMailMethod = require("./node-email");

app.use(cors());

app.post("/sendmail", async (req, res) => {
    try{
        const result = await sendMailMethod(req.body);

        res.json({
            status:true,
            payload: result,
        });
    }catch(error){
        console.error(error.message);

        res.json({
            status:false,
            payload: "Something went wrong in Sendmail Route.",
        });
    }
});
app.listen(3000, ()=>{
    console.log('api listening ok')
})