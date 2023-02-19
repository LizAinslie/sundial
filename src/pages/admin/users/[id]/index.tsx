import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { FC } from "react";
import AdminHeader from "../../../../components/AdminHeader";
import PageLayout from "../../../../components/PageLayout";
import { getServerAuthSession } from "../../../../server/auth";
import { prisma } from "../../../../server/db";
import { StrippedUser } from "../../../../utils/stripSensitiveValues";

type ViewUserPageProps = {
  user: StrippedUser;
};

const ViewUserPage: FC<ViewUserPageProps> = ({ user }) => {
  return (
    <>
      <Head>
        <title>User {user.username} - Sundial Admin</title>
      </Head>
      <PageLayout>
        <AdminHeader>
          <div className="flex flex-row gap-4">
            <Link
              href="/admin/users"
              className="flex flex-row items-center gap-2 rounded-md bg-sky-500 p-3 text-white hover:bg-sky-600"
            >
              <FontAwesomeIcon fixedWidth icon={faArrowLeft} />
            </Link>

            <div className="flex flex-grow flex-col">
              <span className="font-bold">
                Viewing {user.username}
                {user.admin && " (admin)"}
              </span>
              <span className="text-sm">{user.id}</span>
            </div>
          </div>
        </AdminHeader>
        {/* todo: user feed */}
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  ViewUserPageProps
> = async ({ params, req, res }) => {
  // admins only
  const session = await getServerAuthSession({ req, res });
  if (!session?.user.admin)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const userId = params!.id as string;

  // look user up in db
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user)
    return {
      notFound: true,
    };

  return {
    props: {
      user,
    },
  };
};

export default ViewUserPage;
