require("dotenv").config();
const app = require("./src/app.js");
const connectToDB = require("./src/config/db.js");

const PORT = process.env.PORT || 3000;

connectToDB();

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}!`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});







