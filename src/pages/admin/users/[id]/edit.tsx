import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import AdminHeader from "../../../../components/AdminHeader";
import PageLayout from "../../../../components/PageLayout";
import { getServerAuthSession } from "../../../../server/auth";
import { prisma } from "../../../../server/db";
import { api } from "../../../../utils/api";
import { 
  StrippedUser, stripUser
} from "../../../../utils/stripSensitiveValues";

type EditUserPageProps = {
  user: StrippedUser;
};

const EditUserPage: NextPage<EditUserPageProps> = ({ user: serverUser }) => {
  const [user] = useState(serverUser);
  const router = useRouter()
  const expirePasswordMutation = api.admin.expirePasswordForUser.useMutation({
    onSuccess() {
      location.reload();
    },
  });

  const setUserEnabledMutation = api.admin.setUserEnabled.useMutation({
    onSuccess() {
      location.reload();
    },
  });

  return (
    <>
      <Head>
        <title>Edit User - Sundial Admin</title>
        <meta name="theme-color" content="#bae6fd" />
      </Head>
      <PageLayout>
        <AdminHeader>
          <div className="flex flex-row gap-4">
            <Link
              href="/admin/users"
              className="btn-primary p-3 aspect-square"
            >
              <FontAwesomeIcon fixedWidth icon={faArrowLeft} />
            </Link>

            <div className="flex flex-grow flex-col">
              <span className="font-bold">
                Editing {user.username}
                {user.admin && " (admin)"}
              </span>
              <span className="text-sm">{user.id}</span>
            </div>
          </div>
        </AdminHeader>

        {user.enabled ? 
          <div className="flex flex-col p-4 gap-4">
            <h2 className="text-xl">Danger Zone</h2>
            <button 
              className="btn-danger"
              disabled={user.expirePassword}
              onClick={async () => {
                await expirePasswordMutation.mutateAsync({ userId: user.id });
              }}
            >
              Force Password Reset
            </button>
            <button 
              className="btn-danger" 
              onClick={async () => {
                await setUserEnabledMutation.mutateAsync({
                  userId: user.id,
                  enabled: false,
                });
              }}
            >
              Disable {user.username}
            </button>
          </div>
        :
          <div className="flex flex-col p-4 gap-4 items-center justify-center">
            <h2 className="text-2xl">
              User Disabled
            </h2>
            <button
              className="btn-primary"
              onClick={async () => {
                await setUserEnabledMutation.mutateAsync({
                  userId: user.id,
                  enabled: true,
                });
              }}
            >
              Enable {user.username}
            </button>
          </div>
        }
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  EditUserPageProps
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

    console.log(user);
  return {
    props: {
      user: JSON.parse(JSON.stringify(stripUser(user))),
    },
  };
};

export default EditUserPage;
