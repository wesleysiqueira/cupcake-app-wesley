import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";

import { Title } from "./text/Title";

interface HeaderProps {
  title: string;
  backHref?: string;
}

export default function Header({ title, backHref = "/" }: HeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-orange-500 p-6 rounded-b-[25px]">
      <div className="max-w-4xl mx-auto">
        <Link
          className="text-white hover:text-orange-100 inline-flex items-center gap-2"
          href={backHref}
        >
          <ArrowBack />
          Voltar
        </Link>
        <Title className="text-white mt-4" variant="h1">
          {title}
        </Title>
      </div>
    </div>
  );
}
