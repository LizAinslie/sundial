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
    <div className="bg-sky-200 rounded-md p-2 flex flex-row">
      <div className="flex flex-col flex-grow">
        <span className="font-bold">{user.username}{user.admin && ' (admin)'}</span>
        <span className="text-sm">{user.id}</span>
      </div>
      <div className="flex flex-row h-full items-center">
        <Link href={`/admin/users/${user.id}/edit`} className="py-2.5 px-3.5 rounded-md hover:bg-opacity-50 hover:bg-sky-300 aspect-square">
          <FontAwesomeIcon fixedWidth className="leading-none align-middle" icon={faPencil} />
        </Link>
      </div>
    </div>
  );
};

const AdminUsersList: NextPage = () => {
  const usersQuery = api.admin.getUsers.useQuery()

  return (
    <>
      <Head>
        <title>Users - Sundial Admin</title>
      </Head>
      <PageLayout>
        <AdminNav />
        <AdminList create={() => {}}refresh={() => void usersQuery.refetch()}>
          {usersQuery.data && usersQuery.data.map(user => (<UserCard user={user} />))}
        </AdminList>
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerAuthSession({ req, res });

  if (!(session?.user.admin)) return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };

  return {
    props: {},
  };
};

export default AdminUsersList;
