import { faArrowLeft, faMapPin, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Site, Event, User, EventType } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FC, useState } from "react";
import AdminHeader from "../../../../components/AdminHeader";
import MapTile from "../../../../components/MapTile";
import PageLayout from "../../../../components/PageLayout";
import { getServerAuthSession } from "../../../../server/auth";
import { prisma } from "../../../../server/db";
import { api } from "../../../../utils/api";

type SiteEventProps = {
  event: Event & {
    user: User;
  };
};

const SiteEvent: FC<SiteEventProps> = ({ event }) => {
  const [open, setOpen] = useState(false);

  let action = '';
  switch (event.type) {
    case EventType.CLOCK_IN:
      action = "clocked in.";
      break;
    case EventType.CLOCK_OUT:
      action = "clocked out.";
      break;
    case EventType.BREAK_IN:
      action = "started their lunch.";
      break;
    case EventType.BREAK_OUT:
      action = "ended their lunch.";
      break;
    case EventType.START_TRAVEL:
      action = "started transit.";
      break;
    case EventType.STOP_TRAVEL:
      action = "stopped transit.";
      break;
  }

  return (
    <div
      className="rounded-md bg-sky-200 px-2 py-1.5 flex flex-col gap-1.5" 
    >
      <div className="flex items-center">
        <span>
          <Link href={`/admin/users/${event.userId}`} className="font-bold">{event.user.username}</Link>
          {' ' + action}
        </span>
        <div className="flex-grow" />
        <FontAwesomeIcon
          className="cursor-pointer"
          onClick={() => void setOpen(!open)}
          icon={faMapPin}
          fixedWidth
        />
      </div>
      {open && <MapTile lat={event.lat} lon={event.lon} />}
    </div>
  );
};

type ViewSitePageProps = {
  site: Site;
};

const ViewSitePage: NextPage<ViewSitePageProps> = ({ site }) => {
  const getEventsQuery = api.admin.getEventsForSite.useQuery({ siteId: site.id });

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
              href="/admin/sites"
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
            
            <Link
              href={`/admin/sites/${site.id}/edit`}
              className="btn-primary p-3"
            >
              <FontAwesomeIcon fixedWidth icon={faPencil} />
            </Link>
          </div>
        </AdminHeader>
        <div className="flex flex-grow flex-col p-4 gap-4">
          <MapTile lat={site.lat} lon={site.lon} />
          <div className="flex-grow">
            <div className="flex flex-col gap-4">
              {getEventsQuery.data && getEventsQuery.data.map((event) => 
                <SiteEvent event={event} />)}
            </div>
          </div>
        </div>
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

  // look site up in db
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

