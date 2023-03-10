import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Autocomplete from "react-google-autocomplete";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import AdminHeader from "../../../components/AdminHeader";
import PageLayout from "../../../components/PageLayout";
import { getServerAuthSession } from "../../../server/auth";
import { api } from "../../../utils/api";
import { env } from '../../../env.mjs';

const AdminSiteCreationPage: NextPage = () => {
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
              href="/admin/sites"
              className="btn-primary p-3 aspect-square"
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
            className="input"
            value={name}
            onChange={(e: ChangeEvent) =>
              void setName((e.target as HTMLInputElement).value)
            }
            type="text"
            name="name"
            placeholder="Site name"
          />
          <Autocomplete
            apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}
            options={{
              types: [],
            }}
            onPlaceSelected={(place) => {
              setAddress(place.formatted_address ?? '');
              setLat(place.geometry?.location?.lat() ?? 0)
              setLon(place.geometry?.location?.lng() ?? 0)
            }}
            className="input"
            placeholder="Site Address"
          />
          {/* todo: address lookup / lat-lon-address inputs */}
          <button
            className="btn-primary"
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
