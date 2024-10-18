import { useEffect, useState } from "react";
import type { Data } from "../types";
import { searchData } from "../service/search";
import { toast } from "sonner";
import { useDebounce } from "@uidotdev/usehooks";
import { Card } from "../components/Card";

const DEBOUNCE_TIME = 300;

export const Search = ({ initialData }: { initialData: Data }) => {
	const [data, setData] = useState<Data>(initialData);
	const [search, setSearch] = useState(() => {
		const searchParams = new URLSearchParams(window.location.search);
		return searchParams.get("q") ?? "";
	});

	const debounceSearch = useDebounce(search, DEBOUNCE_TIME);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	};

	useEffect(() => {
		const newPathName =
			debounceSearch === "" ? window.location.pathname : `?q=${debounceSearch}`;
		window.history.pushState({}, "", newPathName);
	}, [debounceSearch]);

	useEffect(() => {
		if (!debounceSearch) {
			setData(initialData);
			return;
		}
		searchData(debounceSearch).then((response) => {
			const [err, newData] = response;
			if (err) {
				toast.error(err.message);
				return;
			}
			if (newData) {
				setData(newData);
			}
		});
	}, [debounceSearch, initialData]);

	return (
		<>
			<h3 className="search">Search</h3>
			<form className="form">
				<input
					type="search"
					placeholder="Buscar información"
					defaultValue={search}
					onChange={handleSearch}
				/>
			</form>
			<ul className="card-container">
				{data?.map((row, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<Card row={row} key={index} />
				))}
			</ul>
		</>
	);
};
