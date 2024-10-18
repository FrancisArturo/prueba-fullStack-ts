import { API_HOST } from "../config";
import type { Data, ApiSearchResponse } from "../types";

export const searchData = async (search: string): Promise<[Error?, Data?]> => {
	try {
		const res = await fetch(`${API_HOST}/api/users?q=${search}`);

		if (!res.ok) throw new Error("Error al buscar");

		const json = (await res.json()) as ApiSearchResponse;
		return [undefined, json.data];
	} catch (error) {
		if (error instanceof Error) return [error];
	}

	return [new Error("Unknown Error")];
};
