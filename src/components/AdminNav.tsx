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
        <Link href='/admin/users' className={classNames('text-sky-900 hover:bg-opacity-50 hover:bg-sky-300 rounded-md font-bold px-4 py-3', {
          'bg-sky-500 hover:bg-opacity-100 hover:bg-sky-600 text-white': router.asPath === '/admin/users'
        })}>Users</Link>

        <Link href='/admin' className={classNames('text-sky-900 hover:bg-opacity-50 hover:bg-sky-300 rounded-md font-bold px-4 py-3', {
          'bg-sky-500 hover:bg-opacity-100 hover:bg-sky-600 text-white': router.asPath === '/admin'
        })}>Feed</Link>
      
        <Link href='/admin/sites' className={classNames('text-sky-900 hover:bg-opacity-50 hover:bg-sky-300 rounded-md font-bold px-4 py-3', {
          'bg-sky-500 hover:bg-opacity-100 hover:bg-sky-600 text-white': router.asPath === '/admin/sites'
        })}>Sites</Link>
      </div>
    </AdminHeader>
  );
};

export default AdminNav;

