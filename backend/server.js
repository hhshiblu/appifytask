const app = require("./app/app");
require("dotenv").config();
const { connectDatabase } = require("./db/mysql");


const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
