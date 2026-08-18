import React from "react";

const sponsors = [
  {
    id: 1,
    image: "/sponsor1.png",
    title: "Ad title 1",
    description: "Visit now",
    url: "#",
  },
  {
    id: 2,
    image: "/sponsor2.jpg",
    title: "Ad title 2",
    description: "Visit now",
    url: "#",
  },
  {
    id: 3,
    image: "/sponsor3.png",
    title: "Ad title 3",
    description: "Visit now",
    url: "#",
  },
];

const SponsorSidebar = () => {
  return (
    <aside className="fixed right-0 top-16 w-[350px] h-screen px-4 py-4 bg-[#f2f4f7] dark:bg-[#1b1b1c] hidden lg:block overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
        Sponsored
      </h2>

      <div className="space-y-4">
        {sponsors.map((sponsor) => (
          <a
            key={sponsor.id}
            href={sponsor.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-[#262829] p-2 rounded-lg transition"
          >
            <img
              src={sponsor.image}
              alt={sponsor.title}
              className="w-28 h-28 object-cover rounded-lg"
            />

            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {sponsor.title}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {sponsor.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </aside>
  );
};

export default SponsorSidebar;