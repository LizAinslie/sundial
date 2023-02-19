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
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);

  const createSiteMutation = api.sites.createSite.useMutation();

  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const siteId = await createSiteMutation.mutateAsync({
      name: name === "" ? undefined : name,
      address,
      lat,
      lon,
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
          <div className="flex flex-row items-center gap-4">
            <Link
              href="/admin/users"
              className="flex flex-row items-center gap-2 rounded-md bg-sky-500 p-3 text-white hover:bg-sky-600"
            >
              <FontAwesomeIcon fixedWidth icon={faArrowLeft} />
            </Link>

            <h1 className="text-2xl">Create Site</h1>
          </div>
        </AdminHeader>
        <form
          className="flex flex-grow flex-col gap-4 p-4"
          onSubmit={handleSubmit}
        >
          <input
            className="rounded-md border-none bg-white px-4 py-3 outline-none autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] focus:border-none focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={name}
            onChange={(e: ChangeEvent) =>
              void setName((e.target as HTMLInputElement).value)
            }
            type="text"
            name="name"
            placeholder="Site name"
          />
          {/* todo: address lookup / lat-lon-address inputs */}
          <button
            className="flex flex-row justify-center rounded-md bg-sky-500 px-4 py-3 text-white hover:bg-sky-600"
            type="submit"
          >
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

export default AdminSiteCreationPage;
