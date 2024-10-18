interface Props {
	row: Record<string, string>;
}

export const Card: React.FC<Props> = ({ row }) => {
	return (
		<li>
			{Object.entries(row).map(([key, value]) => (
				<p key={key}>
					<strong>{key}: </strong> {value}
				</p>
			))}
		</li>
	);
};
