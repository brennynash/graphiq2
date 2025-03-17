import Footer from "@/components/Footer";
import NavBar from "@/components/navbar";
import Link from "next/link";
import React from "react";

const PressPage = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/pages/press`, {
      cache: 'no-store'
    });

    const defaultContent = {
      title: "Get to know GRAPHIQ.ART",
      pressKit: {
        title: "Press Releases & images",
        description: "Please click here for our digital press kit including our latest press releases, press images and logo:",
        downloadLink: "/files/graphiq.art_Presskit.zip",
        downloadText: "GRAPHIQ.ART.Presskit.zip"
      },
      contact: {
        title: "Press Contact",
        name: "Amadeus Estifanos",
        email: "amadeus@graphiq.art"
      }
    };

    const pageData = response.ok ? await response.json() : defaultContent;

    return (
      <main className="relative min-h-screen">
        <NavBar />
        <div className="max-w-xl mx-auto px-4 py-16 sm:py-24">
          <section className="mb-16">
            <h1 className="text-4xl md:text-5xl font-normal mb-20">
              {pageData.title}
            </h1>
            <h2 className="text-3xl md:text-4xl font-normal mb-8">
              {pageData.pressKit.title}
            </h2>
            <p className="text-lg text-neutral-grey mb-8 max-w-2xl">
              {pageData.pressKit.description}
            </p>
            <Link
              href={pageData.pressKit.downloadLink}
              className="text-lg underline hover:text-neutral-grey transition-colors"
            >
              {pageData.pressKit.downloadText}
            </Link>
          </section>
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-normal mb-8">
              {pageData.contact.title}
            </h2>
            <p className="text-lg">
              {pageData.contact.name} |{" "}
              <a
                href={`mailto:${pageData.contact.email}`}
                className="underline hover:text-neutral-grey transition-colors flex items-center"
              >
                {pageData.contact.email.split('@')[0]}
                <iconify-icon icon="mdi:at" width="18" height="18"></iconify-icon>
                {pageData.contact.email.split('@')[1]}
              </a>
            </p>
          </section>
        </div>
        <Footer />
      </main>
    );
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
};

export default PressPage;
