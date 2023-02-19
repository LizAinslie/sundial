import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Site } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import AdminHeader from "../../../../components/AdminHeader";
import PageLayout from "../../../../components/PageLayout";
import { getServerAuthSession } from "../../../../server/auth";
import { prisma } from "../../../../server/db";

type EditSitePageProps = {
  site: Site;
};

const EditSitePage: NextPage<EditSitePageProps> = ({ site: serverSite }) => {
  const [site, setSite] = useState(serverSite);

  return (
    <>
      <Head>
        <title>Edit Site - Sundial Admin</title>
        <meta name="theme-color" content="#bae6fd" />
      </Head>
      <PageLayout>
        <AdminHeader>
          <div className="flex flex-row gap-4">
            <Link
              href="/admin/users"
              className="flex flex-row items-center gap-2 rounded-md bg-sky-500 p-3 text-white hover:bg-sky-600"
            >
              <FontAwesomeIcon fixedWidth icon={faArrowLeft} />
            </Link>

            <div className="flex flex-grow flex-col">
              <span className="font-bold">
                Editing {site.name}
                {!site.enabled && " (disabled)"}
              </span>
              <span className="text-sm">{site.id}</span>
            </div>
          </div>
        </AdminHeader>
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  EditSitePageProps
> = async ({ params, req, res }) => {
  // admins only
  const session = await getServerAuthSession({ req, res });
  if (!session?.user.admin)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const siteId = params!.id as string;

  // look user up in db
  const site = await prisma.site.findUnique({ where: { id: siteId } });
  if (!site)
    return {
      notFound: true,
    };

  return {
    props: {
      site,
    },
  };
};

export default EditSitePage;
