import Footer from "@/components/Footer";
import NavBar from "@/components/navbar";
import React from "react";

const ImprintPage = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/pages/imprint`, {
      cache: 'no-store'
    });

    const defaultContent = {
      title: "Information as per Section 5 of the Telecommunications Act (TMG):",
      company: "Serious Business GmbH",
      address: {
        title: "Address:",
        street: "Leopoldstr. 31",
        city: "80802 München"
      },
      contact: {
        title: "Contact:",
        phone: "+49 89 2500664 10",
        email: "hello@serious.business",
        website: "www.serious.business"
      }
    };

    const pageData = response.ok ? await response.json() : defaultContent;

    return (
      <main className="relative min-h-screen">
        <NavBar />
        <div className="max-w-xl mx-auto px-4 py-16 sm:py-24">
          <section className="mb-16">
            <h1 className="text-4xl font-normal mb-12">
              {pageData.title}
            </h1>

            <p className="text-xl mb-12">{pageData.company}</p>

            <h2 className="text-4xl font-normal mb-8">
              {pageData.address.title}
            </h2>

            <p className="text-xl mb-1">{pageData.address.street}</p>
            <p className="text-xl mb-12">{pageData.address.city}</p>

            <h2 className="text-4xl font-normal mb-8">{pageData.contact.title}</h2>

            <p className="text-xl mb-1">
              Telefon: {pageData.contact.phone}
            </p>
            <p className="text-xl mb-1">
              E-Mail:{" "}
              <a
                href={`mailto:${pageData.contact.email}`}
                className="underline hover:text-neutral-grey transition-colors"
              >
                {pageData.contact.email}
              </a>
            </p>
            <p className="text-xl">
              Internet:{" "}
              <a
                href={`https://www.${pageData.contact.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-neutral-grey transition-colors"
              >
                {pageData.contact.website}
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

export default ImprintPage;
