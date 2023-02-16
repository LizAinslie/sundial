import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import AdminHeader from "../../../components/AdminHeader";
import PageLayout from "../../../components/PageLayout";
import { prisma } from "../../../server/db";

const CreateUserPage: NextPage = () => {
  const [username, setUsername] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // trpc
  }

  return (
    <>
      <Head>
        <title>New User - Sundial Admin</title>
      </Head>
      <PageLayout>
        <AdminHeader>
          <div className="flex flex-row gap-4">
            <Link href='/admin/users' className="bg-sky-500 hover:bg-sky-600 text-white rounded-md p-3 flex flex-row items-center gap-2">
              <FontAwesomeIcon fixedWidth icon={faArrowLeft} />
            </Link>

            <div className="flex flex-col flex-grow">
              <h1 className="text-3xl">New User</h1>
            </div>
          </div>
        </AdminHeader>
        <form onSubmit={}>
        </form>
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<EditUserPageProps> = async ({ params }) => {
  const userId = params!.id as string;
  console.log('id', userId);

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

