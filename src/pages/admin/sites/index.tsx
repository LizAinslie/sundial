import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Site } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FC } from "react";
import AdminList from "../../../components/AdminList";
import AdminNav from "../../../components/AdminNav";
import PageLayout from "../../../components/PageLayout";
import { getServerAuthSession } from "../../../server/auth";
import { api } from "../../../utils/api";

type SiteCardProps = {
  site: Site;
};

const SiteCard: FC<SiteCardProps> = ({ site }) => {
  return (
    <>
      <div className="flex flex-row rounded-md bg-sky-200 p-2">
        <div className="flex flex-grow flex-col">
          <span className="font-bold">
            {site.name}
            {!site.enabled && " (disabled)"}
          </span>
          <span className="text-sm">{site.id}</span>
        </div>
        <div className="flex h-full flex-row items-center">
          <Link
            href={`/admin/sites/${site.id}/edit`}
            className="aspect-square rounded-md py-2.5 px-3.5 hover:bg-sky-300 hover:bg-opacity-50"
          >
            <FontAwesomeIcon
              fixedWidth
              className="align-middle leading-none"
              icon={faPencil}
            />
          </Link>
        </div>
      </div>
    </>
  );
};

const AdminSitesPage: NextPage = () => {
  const sitesQuery = api.sites.getSites.useQuery();

  return (
    <>
      <Head>
        <title>Sites - Sundial Admin</title>
        <meta name="theme-color" content="#bae6fd" />
      </Head>
      <PageLayout>
        <AdminNav />
        <AdminList create="/admin/sites/create">
          {sitesQuery.data &&
            sitesQuery.data.map((it) => <SiteCard site={it} />)}
        </AdminList>
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

export default AdminSitesPage;
