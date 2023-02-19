import { Site } from "@prisma/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC } from "react";
import AdminList from "../../../components/AdminList";
import AdminNav from "../../../components/AdminNav";
import PageLayout from "../../../components/PageLayout";
import { api } from "../../../utils/api";

type SiteCardProps = {
  site: Site;
};

const SiteCard: FC<SiteCardProps = ({ site }) => {
  return (
    <></>
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
        <AdminList create={() => void router.push('/admin/sites/create'}>
          {sitesQuery.data && sites.map((it) => (<SiteCard site={it} />))}
        </AdminList>
      </PageLayout>
    </>
  );
};
