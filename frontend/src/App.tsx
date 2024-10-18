import { useState } from "react";
import "./App.css";
import type { Data } from "./types";
import { uploadData } from "./service/uploadData";
import { Toaster, toast } from "sonner";
import { Search } from "./steps/Search";

const APP_STATUS = {
	IDDLE: "iddle", //al entrar
	ERROR: "error", //cuando hay error
	READY_UPLOAD: "ready_upload", //al elegir archivo
	UPLOADING: "uploading", //mientras se sube el archivo
	READY_USAGE: "ready_usage", //despues de subir
} as const;

const BUTTON_TEXT = {
	[APP_STATUS.READY_UPLOAD]: "subir archivo",
	[APP_STATUS.UPLOADING]: "subiendo...",
};

type AppStatusType = (typeof APP_STATUS)[keyof typeof APP_STATUS];

function App() {
	const [appStatus, setAppStatus] = useState<AppStatusType>(APP_STATUS.IDDLE);
	const [file, setFile] = useState<File | null>();
	const [data, setData] = useState<Data>([]);

	const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFile(file);
			setAppStatus(APP_STATUS.READY_UPLOAD);
		}
	};

	const handleSubmitFile = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (appStatus !== APP_STATUS.READY_UPLOAD || !file) return;

		setAppStatus(APP_STATUS.UPLOADING);

		const [err, newData] = await uploadData(file);

		if (err) {
			setAppStatus(APP_STATUS.ERROR);
			toast.error(err.message);
			return;
		}

		setAppStatus(APP_STATUS.READY_USAGE);
		if (newData) setData(newData);
		toast.success("Archivo subido correctamente");
	};

	const showButton =
		appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING;

	const showInput = appStatus !== APP_STATUS.READY_USAGE;

	return (
		<>
			<main>
				<Toaster />
				<h1>CSV Reader</h1>
				{showInput && (
					<form onSubmit={handleSubmitFile}>
						<input
							type="file"
							accept=".csv"
							name="file"
							onChange={handleInputChange}
							disabled={appStatus === APP_STATUS.UPLOADING}
						/>
						{showButton && (
							<button
								type="submit"
								disabled={appStatus === APP_STATUS.UPLOADING}
							>
								{BUTTON_TEXT[appStatus]}{" "}
							</button>
						)}
					</form>
				)}

				{appStatus === APP_STATUS.READY_USAGE && <Search initialData={data} />}
			</main>
		</>
	);
}

export default App;
