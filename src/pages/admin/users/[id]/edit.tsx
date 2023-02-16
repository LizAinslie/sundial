import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import AdminHeader from "../../../../components/AdminHeader";
import PageLayout from "../../../../components/PageLayout";
import { getServerAuthSession } from "../../../../server/auth";
import { prisma } from "../../../../server/db";
import { StrippedUser } from "../../../../utils/stripSensitiveValues";

type EditUserPageProps = {
  user: StrippedUser;
};

const EditUserPage: NextPage<EditUserPageProps> = ({ user: serverUser }) => {
  const [user, setUser] = useState(serverUser); 

  return (
    <>
      <Head>
        <title>Edit User - Sundial Admin</title>
        <meta name="theme-color" content="#bae6fd" />
      </Head>
      <PageLayout>
        <AdminHeader>
          <div className="flex flex-row gap-4">
            <Link href='/admin/users' className="bg-sky-500 hover:bg-sky-600 text-white rounded-md p-3 flex flex-row items-center gap-2">
              <FontAwesomeIcon fixedWidth icon={faArrowLeft} />
            </Link>

            <div className="flex flex-col flex-grow">
              <span className="font-bold">{user.username}{user.admin && ' (admin)'}</span>
              <span className="text-sm">{user.id}</span>
            </div>
          </div>
        </AdminHeader>
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<EditUserPageProps> = async ({ params, req, res }) => {
  // admins only
  const session = await getServerAuthSession({ req, res });
  if (!session?.user.admin) return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };

  const userId = params!.id as string;

  // look user up in db
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return {
    notFound: true,
  };

  return {
    props: {
      user,
    },
  };
};

export default EditUserPage;

