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

const AdminUserCreationPage: NextPage = () => {
  const [username, setUsername] = useState("");
  const [createdPassword, setCreatedPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [newUserId, setNewUserId] = useState("");

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
        <title>Create User - Sundial Admin</title>
        <meta name="theme-color" content="#bae6fd" />
      </Head>
      <PageLayout>
        <AdminHeader>
          <div className="flex flex-row items-center gap-4">
            <Link
              href="/admin/users"
              className="flex flex-row items-center gap-2 rounded-md bg-sky-500 p-3 text-white hover:bg-sky-600"
            >
              <FontAwesomeIcon fixedWidth icon={faArrowLeft} />
            </Link>

            <h1 className="text-2xl">Create User</h1>
          </div>
        </AdminHeader>
        {submitted ? (
          <>
            <div className="flex flex-grow flex-col items-center justify-center p-4">
              <h2 className="text-center text-3xl">
                A random password has been generated for this user.
              </h2>
              <p className="mt-2 text-lg">Click below to copy it.</p>
              <div
                className="font-monospace mt-2 cursor-pointer bg-sky-300 px-4 py-3 font-bold"
                onClick={copyPassword}
              >
                {createdPassword}
              </div>

              <Link
                href={`/admin/users/${newUserId}`}
                className="align-self-center mt-4 flex flex-row justify-center rounded-md bg-sky-500 px-4 py-3 text-white hover:bg-sky-600"
                type="submit"
              >
                Go to User
              </Link>
            </div>
          </>
        ) : (
          <>
            <form
              className="flex flex-grow flex-col gap-4 p-4"
              onSubmit={handleSubmit}
            >
              <input
                className="rounded-md border-none bg-white px-4 py-3 outline-none autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] focus:border-none focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={username}
                onChange={(e: ChangeEvent) =>
                  void setUsername((e.target as HTMLInputElement).value)
                }
                type="text"
                name="username"
                placeholder="Username"
              />
              <button
                className="flex flex-row justify-center rounded-md bg-sky-500 px-4 py-3 text-white hover:bg-sky-600"
                type="submit"
              >
                Create User
              </button>
            </form>
          </>
        )}
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

export default AdminUserCreationPage;
