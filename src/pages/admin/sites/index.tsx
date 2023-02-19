import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Site } from "@prisma/client";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
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
      <div className="bg-sky-200 rounded-md p-2 flex flex-row">
        <div className="flex flex-col flex-grow">
          <span className="font-bold">{site.name}{(!site.enabled) && ' (disabled)'}</span>
          <span className="text-sm">{site.id}</span>
        </div>
        <div className="flex flex-row h-full items-center">
          <Link href={`/admin/sites/${site.id}/edit`} className="py-2.5 px-3.5 rounded-md hover:bg-opacity-50 hover:bg-sky-300 aspect-square">
            <FontAwesomeIcon fixedWidth className="leading-none align-middle" icon={faPencil} />
          </Link>
        </div>
      </div>
    </>
  );
};

const AdminSitesPage: FC = () => {
  const router = useRouter();
  const sitesQuery = api.sites.getSites.useQuery();

  return (
    <>
      <Head>
        <title>Sites - Sundial Admin</title>
      </Head>
      <PageLayout>
        <AdminNav />
        <AdminList create={() => void router.push('/admin/sites/create')}>
          {sitesQuery.data && sitesQuery.data.map((it) => (<SiteCard site={it} />))}
        </AdminList>
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


export default AdminSitesPage;

