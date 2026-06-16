import {app} from "./app.js"
import connectDB from "./DB/index.js"
import dotenv from "dotenv"
import scheduleDefaulterCheck from "./jobs/defaulterCheck.js"


//can also use "nodemon -r dotenv/config --experimental-json-modules src/index.js" in place of nodemon src/index.js in package.json
dotenv.config({
    path: './.env'
})


connectDB()
        .then(() => {
            scheduleDefaulterCheck()
            app.listen(process.env.PORT || 3000, () => {console.log(`App is listening at https://localhost:${process.env.PORT || 3000}`)});

        })
        .catch((error) => {
            console.log(`DB Connection error: ${error}`)
        })