
import app from "./server/express.js";
import router from "./server/assets-router.js";
import connectDB from "./server/config/db.js";

app.use("/src", router);

app.use("/", function (req, res) {
    res.send("Welcome to User application");
});

const startServer = async () => {
    await connectDB();

    app.listen(3000, () => {
        console.log("Server running at http://localhost:3000/");
    });
};

startServer();

export default app;
