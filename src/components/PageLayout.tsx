import { FC, PropsWithChildren } from "react";

const PageLayout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<main className="h-screen w-screen bg-sky-100 text-sky-900">
			{children}
		</main>
	);
};

export default PageLayout;

