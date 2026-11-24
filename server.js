import app from "./server/express.js";
import router from "./server/assets-router.js";
import connectDB from "./server/config/db.js";

app.use("/src", router);

app.use("/", function (req, res) {
    res.send("Welcome to User application");
});

const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

export default app;