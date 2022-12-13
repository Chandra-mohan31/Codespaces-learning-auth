const app = require("./app");


console.log("hey there codespaces");
const {PORT} = process.env;

app.listen(PORT, () => {
    console.log(`server is running at port: ${PORT}`);
})