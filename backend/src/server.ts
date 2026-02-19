import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/log-submission", (req: Request, res: Response) => {
  const { student, assignmentId, txHash } = req.body;

  console.log("Submission logged:", {
    student,
    assignmentId,
    txHash
  });

  res.json({ success: true });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
