import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FC, FormEvent, useState } from "react";
import AdminHeader from "../../../components/AdminHeader";
import PageLayout from "../../../components/PageLayout";
import { getServerAuthSession } from "../../../server/auth";
import { api } from "../../../utils/api";

const AdminSiteCreationPage: FC = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);

  const createSiteMutation = api.sites.createSite.useMutation();

  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const siteId = await createSiteMutation.mutateAsync({
      name: name === '' ? undefined : name,
      address,
      lat, lon,
    });

    router.push(`/admin/sites/${siteId}`);
  }

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
        <form className="p-4 flex flex-col flex-grow gap-4" onSubmit={handleSubmit}>
          <input
            className="autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] rounded-md bg-white border-none outline-none focus:border-none focus:outline-none focus:ring-sky-500 focus:ring-2 px-4 py-3"
            value={name}
            onChange={(e: ChangeEvent) => void setName((e.target as HTMLInputElement).value)}
            type='text'
            name='name'
            placeholder="Site name"
          />
          {/* todo: address lookup / lat-lon-address inputs */}
          <button className="rounded-md text-white bg-sky-500 hover:bg-sky-600 px-4 py-3 flex flex-row justify-center" type="submit">
            Create Site
          </button>
        </form>
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

