import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FC } from "react";
import AdminList from "../../../components/AdminList";
import AdminNav from "../../../components/AdminNav";
import PageLayout from "../../../components/PageLayout";
import { getServerAuthSession } from "../../../server/auth";
import { api } from "../../../utils/api";
import { StrippedUser } from "../../../utils/stripSensitiveValues";

type UserCardProps = {
  user: StrippedUser;
};

const UserCard: FC<UserCardProps> = ({ user }) => {
  return (
    <div className="flex flex-row rounded-md bg-sky-200 p-2">
      <Link
        className="flex flex-grow flex-col"
        href={`/admin/users/${user.id}`}
      >
        <span className="font-bold">
          {user.username}
          {user.admin && " (admin)"}
        </span>
        <span className="text-sm">{user.id}</span>
      </Link>
      <div className="flex h-full flex-row items-center">
        <Link
          href={`/admin/users/${user.id}/edit`}
          className="aspect-square rounded-md py-2.5 px-3.5 hover:bg-sky-300 hover:bg-opacity-50 transition-colors"
        >
          <FontAwesomeIcon
            fixedWidth
            className="align-middle leading-none"
            icon={faPencil}
          />
        </Link>
      </div>
    </div>
  );
};

const AdminUsersList: NextPage = () => {
  const usersQuery = api.admin.getUsers.useQuery();

  return (
    <>
      <Head>
        <title>Users - Sundial Admin</title>
        <meta name="theme-color" content="#bae6fd" />
      </Head>
      <PageLayout>
        <AdminNav />
        <AdminList create="/admin/users/create">
          {usersQuery.data &&
            usersQuery.data.map((user) => <UserCard user={user} />)}
        </AdminList>
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // admins only
  const session = await getServerAuthSession({ req, res });
  if (!session?.user.admin)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: {},
  };
};

export default AdminUsersList;
