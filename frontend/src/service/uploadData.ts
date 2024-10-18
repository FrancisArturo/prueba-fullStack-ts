import { API_HOST } from "../config";
import type { ApiUploadResponse, Data } from "../types";

export const uploadData = async (file: File): Promise<[Error?, Data?]> => {
	const formData = new FormData();
	formData.append("file", file);

	try {
		const res = await fetch(`${API_HOST}/api/files`, {
			method: "POST",
			body: formData,
		});

		if (!res.ok) throw new Error("Error al cargar el archivo");

		const json = (await res.json()) as ApiUploadResponse;
		return [undefined, json.data];
	} catch (error) {
		if (error instanceof Error) return [error];
	}

	return [new Error("Unknown Error")];
};
