import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import AdminHeader from "../../../components/AdminHeader";
import PageLayout from "../../../components/PageLayout";
import { getServerAuthSession } from "../../../server/auth";
import { api } from "../../../utils/api";

const CreateUserPage: NextPage = () => {
  const [username, setUsername] = useState('');
  const [createdPassword, setCreatedPassword] = useState('jhdcsvcjhavdjhgvgahvhagjvahvcahjcvhaj');
  const [submitted, setSubmitted] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  
  const createUserMutation = api.admin.createUser.useMutation({
    onSuccess(data) {
      setCreatedPassword(data.password);
      setNewUserId(data.userId);
      setSubmitted(true);
    },
  });

  function copyPassword() {
    navigator.clipboard.writeText(createdPassword);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    await createUserMutation.mutateAsync({ username });
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
        {submitted ? <>
          <div className="flex flex-grow p-4 flex-col items-center justify-center">
            <h2 className="text-3xl text-center">A random password has been generated for this user.</h2>
            <p className="text-lg mt-2">Click below to copy it.</p>
            <div className="bg-sky-300 px-4 py-3 font-bold font-monospace mt-2 cursor-pointer" onClick={copyPassword}>
              {createdPassword}
            </div>
          </div>
        </> : <>
          <form className="p-4 flex flex-col flex-grow gap-4" onSubmit={handleSubmit}>
            <input 
              className="autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] rounded-md bg-white border-none outline-none focus:border-none focus:outline-none focus:ring-sky-500 focus:ring-2 px-4 py-3"
              value={username}
              onChange={(e: ChangeEvent) => void setUsername((e.target as HTMLInputElement).value)}
              type='text' 
              name='username' 
              placeholder="Username"
            />
            <button className="rounded-md text-white bg-sky-500 hover:bg-sky-600 px-4 py-3 flex flex-row justify-center" type="submit">
              Create User
            </button>
          </form>
        </>}
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerAuthSession({ req, res });

  if (!session?.user.admin) return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };

  return {
    props: {},
  };
};

export default CreateUserPage;

