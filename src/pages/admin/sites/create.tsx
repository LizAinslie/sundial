import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { FC, useState } from "react";
import AdminHeader from "../../../components/AdminHeader";
import PageLayout from "../../../components/PageLayout";
import { getServerAuthSession } from "../../../server/auth";

const AdminSiteCreationPage: FC = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);

  return (
    <>
      <Head>
        <title>Create Site - Sundial Admin</title>
        <meta name="theme-color" content="#bae6fd" />
      </Head>
      <PageLayout>
        <AdminHeader>
          <div className="flex flex-row gap-4 items-center">
            <Link href='/admin/users' className="bg-sky-500 hover:bg-sky-600 text-white rounded-md p-3 flex flex-row items-center gap-2">
              <FontAwesomeIcon fixedWidth icon={faArrowLeft} />
            </Link>

            <h1 className="text-2xl">Create Site</h1>
          </div>
        </AdminHeader>
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // admins only
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


export default AdminSiteCreationPage;

