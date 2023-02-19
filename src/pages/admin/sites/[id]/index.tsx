import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Site } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import Head, { defaultHead } from "next/head";
import Link from "next/link";
import AdminHeader from "../../../../components/AdminHeader";
import MapTile from "../../../../components/MapTile";
import PageLayout from "../../../../components/PageLayout";
import { getServerAuthSession } from "../../../../server/auth";
import { prisma } from "../../../../server/db";

type ViewSitePageProps = {
  site: Site;
};

const ViewSitePage: NextPage<ViewSitePageProps> = ({ site }) => {
  return (
    <>
      <Head>
        <title>Site {site.name} - Sundial Admin</title>
        <meta name="theme-color" content="#bae6fd" />
      </Head>
      <PageLayout>
        <AdminHeader>
          <div className="flex flex-row gap-4">
            <Link
              href="/admin/users"
              className="btn-primary p-3"
            >
              <FontAwesomeIcon fixedWidth icon={faArrowLeft} />
            </Link>

            <div className="flex flex-grow flex-col">
              <span className="font-bold">
                Viewing {site.name}
                {(!site.enabled) && " (disabled)"}
              </span>
              <span className="text-sm">{site.id}</span>
            </div>
          </div>
        </AdminHeader>
        <MapTile lat={site.lat} lon={site.lon} />
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  ViewSitePageProps
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
      site: JSON.parse(JSON.stringify(site)),
    },
  };
};

export default ViewSitePage;

