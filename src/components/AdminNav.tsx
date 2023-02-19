import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import AdminHeader from "./AdminHeader";

const AdminNav: FC = () => {
  const router = useRouter();

  return (
    <AdminHeader>
      <div className="flex flex-row items-center justify-evenly gap-4">
        <Link
          href="/admin/users"
          className={classNames(
            "rounded-md px-4 py-3 font-bold text-sky-900 hover:bg-sky-300 hover:bg-opacity-50",
            {
              "bg-sky-500 text-white hover:bg-sky-600 hover:bg-opacity-100":
                router.asPath === "/admin/users",
            }
          )}
        >
          Users
        </Link>

        <Link
          href="/admin"
          className={classNames(
            "rounded-md px-4 py-3 font-bold text-sky-900 hover:bg-sky-300 hover:bg-opacity-50",
            {
              "bg-sky-500 text-white hover:bg-sky-600 hover:bg-opacity-100":
                router.asPath === "/admin",
            }
          )}
        >
          Feed
        </Link>

        <Link
          href="/admin/sites"
          className={classNames(
            "rounded-md px-4 py-3 font-bold text-sky-900 hover:bg-sky-300 hover:bg-opacity-50",
            {
              "bg-sky-500 text-white hover:bg-sky-600 hover:bg-opacity-100":
                router.asPath === "/admin/sites",
            }
          )}
        >
          Sites
        </Link>
      </div>
    </AdminHeader>
  );
};

export default AdminNav;
