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
            "btn-muted font-bold",
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
            "btn-muted font-bold",
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
            "btn-muted font-bold",
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
