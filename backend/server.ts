import express from "express";
import cors from "cors";
import multer from "multer";
import csvToJson from "convert-csv-to-json";

const app = express();
const port = process.env.PORT ?? 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let userData: Array<Record<string, string>> = [];

app.use(cors());

app.post("/api/files", upload.single("file"), async (req, res) => {
	// 1. Extract file from request
	const { file } = req;

	// 2. Validate that we have file
	if (!file) return res.status(400).json({ message: "file is required" });

	// 3. Validate the mimetype(csv)
	if (file.mimetype !== "text/csv")
		return res.status(400).json({ message: "file must be CSV" });

	let json: Array<Record<string, string>> = [];
	try {
		// 4. Transform File(buffer(los archivos viajan en formato binario para más eficiencia)) to string
		const rawCsv = Buffer.from(file.buffer).toString("utf8");

		// 5. Transform string(csv) to JSON
		json = csvToJson.fieldDelimiter(",").csvStringToJson(rawCsv);
	} catch (error) {
		return res.status(500).json({ message: "error parsing files" });
	}

	// 6. Save the JSON to db (or memory)
	userData = json;

	// 7. Return 200 with the message and the JSON
	return res
		.status(200)
		.json({ data: json, message: "el archivo se cargo correctamente" });
});

app.get("/api/users", async (req, res) => {
	//1. Extract query param 'q' from the request
	const { q } = req.query;

	//2. Validate that we have query param
	if (!q)
		return res.status(500).json({ message: 'Query param "q" is required' });
	if (q === "all") {
		return res.status(200).json({ data: userData });
	}

	//3. Filter data from db (or memory) with query param
	const search = q.toString().toLowerCase();
	const filteredData = userData.filter((row) => {
		return Object.values(row).some((value) =>
			value.toLowerCase().includes(search),
		);
	});

	//4. Return status 200 with filtered data
	return res.status(200).json({ data: filteredData });
});

app.listen(port, () => {
	console.log(`escuchando en puerto ${port}`);
});
