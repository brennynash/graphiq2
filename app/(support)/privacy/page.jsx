import Footer from "@/components/Footer";
import NavBar from "@/components/navbar";
import Link from "next/link";
import React from "react";

const PrivacyPage = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/pages/privacy`, {
      cache: 'no-store'
    });

    const defaultContent = {
      title: "PRIVACY POLICY",
      intro: "This website collects some Personal Data from its Users.",
      sections: [
        {
          title: "OWNER AND DATA CONTROLLER",
          content: [
            "Graphiq Art GmbH Leopoldstr. 31 80802 München Germany",
            {
              text: "Owner contact email: ",
              email: "hello@graphiq.art"
            }
          ]
        },
        {
          title: "TYPES OF DATA COLLECTED",
          content: [
            "Among the types of Personal Data that this Application collects, by itself or through third parties, there are: Cookies; Usage Data.",
            "Complete details on each type of Personal Data collected are provided in the dedicated sections of this privacy policy or by specific explanation texts displayed prior to the Data collection."
          ]
        },
        {
          title: "METHOD AND PLACE OF PROCESSING THE DATA",
          subsections: [
            {
              subtitle: "Processing methods",
              content: [
                "The Data Controller processes the Data of Users in a proper manner and takes appropriate security measures to prevent unauthorized access, disclosure, modification, or unauthorized destruction of the Data.",
                "The Data processing is carried out using computers and/or IT enabled tools, following organizational procedures and methods strictly related to the purposes indicated."
              ]
            }
          ]
        },
        {
          title: "THE PURPOSES OF PROCESSING",
          content: [
            "The Data concerning the User is collected to allow the Owner to provide its services, as well as for the following purposes: Analytics and Contacting the User."
          ]
        },
        {
          title: "DETAILED INFORMATION ON THE PROCESSING OF PERSONAL DATA",
          content: [
            "Personal Data is collected for the following purposes and using the following services:"
          ],
          subsections: [
            {
              subtitle: "Analytics",
              content: [
                "The services contained in this section enable the Owner to monitor and analyze web traffic and can be used to keep track of User behavior."
              ]
            }
          ]
        },
        {
          title: "YOUR RIGHTS",
          content: [
            "Users may exercise certain rights regarding their Data processed by the Owner.",
            "In particular, Users have the right to do the following:"
          ],
          list: [
            "Withdraw their consent at any time.",
            "Access their personal data.",
            "Obtain information about the processing of personal data.",
            "Rectify inaccurate personal data concerning them.",
            "Have incomplete personal data completed.",
            "Have their data erased or removed.",
            "Restrict the processing of their personal data.",
            "Receive their data in a structured, commonly used and machine-readable format.",
            "Lodge a complaint with a supervisory authority."
          ]
        },
        {
          title: "CHANGES TO THIS PRIVACY POLICY",
          content: [
            "The Owner reserves the right to make changes to this privacy policy at any time by notifying its Users on this page. It is strongly recommended to check this page often, referring to the date of the last modification listed at the bottom."
          ]
        }
      ],
      lastUpdated: "February 27, 2025"
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

            <p className="text-xl mb-20">
              {pageData.intro}
            </p>

            {pageData.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-4xl font-normal mb-12">
                  {section.title}
                </h2>

                {section.content && section.content.map((content, contentIndex) => (
                  <p key={contentIndex} className="text-xl mb-8">
                    {typeof content === 'string' ? content : (
                      <>
                        {content.text}{" "}
                        <Link
                          href={`mailto:${content.email}`}
                          className="underline hover:text-neutral-grey transition-colors flex items-center"
                        >
                          {content.email.split('@')[0]}
                          <iconify-icon icon="mdi:at" width="18" height="18"></iconify-icon>
                          {content.email.split('@')[1]}
                        </Link>
                      </>
                    )}
                  </p>
                ))}

                {section.subsections && section.subsections.map((subsection, subIndex) => (
                  <div key={subIndex}>
                    <h3 className="text-2xl font-normal mb-6">
                      {subsection.subtitle}
                    </h3>
                    {subsection.content.map((content, contentIndex) => (
                      <p key={contentIndex} className="text-xl mb-8">
                        {content}
                      </p>
                    ))}
                  </div>
                ))}

                {section.list && (
                  <ul className="list-disc pl-8 text-xl mb-16 space-y-2">
                    {section.list.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <p className="text-xl italic">
              Last updated: {pageData.lastUpdated}
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

export default PrivacyPage;
