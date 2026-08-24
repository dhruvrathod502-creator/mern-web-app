import Intro from "@/components/Intro";
import React, { useState } from "react";
import {
  BriefcaseBusiness,
  GraduationCap,
  MapPin,
  Home,
  Mail,
  Phone,
  CalendarDays,
  Heart,
  Info,
  Pencil,
} from "lucide-react";

const AboutPage = () => {
  const [activeSection, setActiveSection] = useState("Overview");
  const [isEditing, setIsEditing] = useState(false);

  const [aboutData, setAboutData] = useState({
    work: "Works at codesygnix",
    education: "Studied at b.com",
    currentCity: "Lives in valsad",
    hometown: "From valsad",
    email: "",
    phone: "1111",
    birthday: "",
    relationship: "In a relationship",
    bio: "",
  });

  const [tempData, setTempData] = useState(aboutData);

  const sections = [
    "Overview",
    "Work and Education",
    "Places Lived",
    "Contact and Basic Info",
    "Family and Relationships",
    "Details About You",
  ];

  const handleEdit = () => {
    setTempData({ ...aboutData });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTempData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setAboutData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData({ ...aboutData });
    setIsEditing(false);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setIsEditing(false);
    setTempData({ ...aboutData });
  };

  const DetailItem = ({
    icon: Icon,
    field,
    placeholder,
    subtitle,
    type = "text",
  }) => {
    return (
      <div className="flex items-start gap-4 py-3">
        <Icon
          size={22}
          className="text-[#8a8d91] mt-1 shrink-0"
        />

        <div className="flex-1">
          {isEditing ? (
            <input
              type={type}
              name={field}
              value={tempData[field]}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            />
          ) : (
            <>
              <p className="font-medium text-[#050505]">
                {aboutData[field] || placeholder}
              </p>

              {subtitle && (
                <p className="text-sm text-[#65676b] mt-1">
                  {subtitle}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "Overview":
        return (
          <div>
            <DetailItem
              icon={BriefcaseBusiness}
              field="work"
              placeholder="Add a workplace"
              subtitle="Work"
            />

            <DetailItem
              icon={GraduationCap}
              field="education"
              placeholder="Add a school or college"
              subtitle="Education"
            />

            <DetailItem
              icon={MapPin}
              field="currentCity"
              placeholder="Add current city"
              subtitle="Current City"
            />

            <DetailItem
              icon={Home}
              field="hometown"
              placeholder="Add hometown"
              subtitle="Hometown"
            />
          </div>
        );

      case "Work and Education":
        return (
          <div>
            <h3 className="text-lg font-bold mb-2">Work</h3>

            <DetailItem
              icon={BriefcaseBusiness}
              field="work"
              placeholder="Add a workplace"
              subtitle="Work"
            />

            <div className="border-t my-5" />

            <h3 className="text-lg font-bold mb-2">
              Education
            </h3>

            <DetailItem
              icon={GraduationCap}
              field="education"
              placeholder="Add a school or college"
              subtitle="Education"
            />
          </div>
        );

      case "Places Lived":
        return (
          <div>
            <DetailItem
              icon={MapPin}
              field="currentCity"
              placeholder="Add current city"
              subtitle="Current City"
            />

            <DetailItem
              icon={Home}
              field="hometown"
              placeholder="Add hometown"
              subtitle="Hometown"
            />
          </div>
        );

      case "Contact and Basic Info":
        return (
          <div>
            <DetailItem
              icon={Mail}
              field="email"
              type="email"
              placeholder="Add email address"
              subtitle="Email"
            />

            <DetailItem
              icon={Phone}
              field="phone"
              placeholder="Add phone number"
              subtitle="Mobile"
            />

            <DetailItem
              icon={CalendarDays}
              field="birthday"
              type="date"
              placeholder="Add birthday"
              subtitle="Birthday"
            />
          </div>
        );

      case "Family and Relationships":
        return (
          <DetailItem
            icon={Heart}
            field="relationship"
            placeholder="Add relationship status"
            subtitle="Relationship Status"
          />
        );

      case "Details About You":
        return (
          <div className="flex gap-4">
            <Info
              size={22}
              className="text-[#8a8d91] mt-1"
            />

            <div className="flex-1">
              {isEditing ? (
                <textarea
                  name="bio"
                  value={tempData.bio}
                  onChange={handleChange}
                  placeholder="Tell people more about yourself..."
                  rows="5"
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500"
                />
              ) : (
                <p>
                  {aboutData.bio ||
                    "Tell people more about yourself."}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-5 md:mt-5 md:px-10 mt-2 px-2 pb-2">
      
      {/* LEFT INTRO */}
      <div className="w-full md:w-[320px]">
        <Intro />
      </div>

      {/* ABOUT SECTION */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold">
            About
          </h1>
        </div>

        <div className="flex flex-col md:flex-row min-h-[500px]">
          
          {/* Sidebar */}
          <div className="w-full md:w-[250px] border-b md:border-b-0 md:border-r border-gray-200 p-4">
            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() =>
                    handleSectionChange(section)
                  }
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
                    activeSection === section
                      ? "bg-[#e7f3ff] text-[#1877f2]"
                      : "text-[#65676b] hover:bg-gray-100"
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {activeSection}
              </h2>

              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-[#e4e6eb] hover:bg-[#d8dadf] rounded-lg font-semibold"
                >
                  <Pencil size={17} />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-lg hover:bg-gray-100 font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    className="px-5 py-2 bg-[#1877f2] text-white rounded-lg font-semibold"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="max-w-[550px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;