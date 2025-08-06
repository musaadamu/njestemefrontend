import React from "react";

export default function EditorialBoard() {
  const editorInChief = {
    name: "Prof. John Sakiyo",
    affiliation: "Department of Environmental and Life Science Education, Modibbo Adama University Yola"
  };

  const editorialMembers = [
    {
      name: "Dr. A. M. Umar",
      affiliation: "Energy Research Institute, Luton, UK"
    },
    {
      name: "Dr. I. Dauda",
      affiliation: "Department of Building Construction Technology, Federal University of Technology, Minna"
    },
    {
      name: "Dr. M. E. Hanafi",
      affiliation: "College of Engineering and Petroleum, University of Bahrain, Dar Kulayb"
    },
    {
      name: "Dr. C. Warringtin",
      affiliation: "Jomo Kenyatta University, Nairobi"
    },
    {
      name: "Prof. F.M. Joda",
      affiliation: "Department of Environmental and Life Sciences, Modibbo Adama University, Yola"
    },
    {
      name: "Dr. K. Waziri",
      affiliation: "Department of Environmental and Life Sciences, Modibbo Adama University, Yola"
    },
    {
      name: "Sajid P. K. S, PhD",
      affiliation: "Department of Geography and Environmental Management, Vidyasagar University, India"
    }
  ];

  const editorialSecretary = {
    name: "Musah Aminu, PhD",
    affiliation: "Department of Integrated Science, F. C. E (T) Potiskum"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
      {/* Header Section */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              International Journal of Innovative Research in Science, Technology and Mathematics Education
            </h1>
            <p className="text-lg text-gray-600 mb-1">Volume 1, Number 1, January-March, 2025</p>
            <p className="text-sm text-gray-500 font-medium">ISSN: 2636-7157</p>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-3xl font-bold text-center text-indigo-800">Editorial Board</h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <p className="text-lg text-gray-700 leading-relaxed text-center">
            The Editorial Board comprises distinguished scholars and researchers committed to maintaining 
            the highest standards of academic excellence and integrity in science, technology, and mathematics education.
          </p>
        </div>

        {/* Editor-in-Chief */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-indigo-800 mb-6 text-center">Editor-in-Chief</h3>
          <div className="bg-white rounded-lg shadow-lg border border-indigo-200 p-8 max-w-3xl mx-auto">
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{editorInChief.name}</h4>
              <p className="text-gray-600 text-lg">{editorInChief.affiliation}</p>
            </div>
          </div>
        </div>

        {/* Editorial Board Members */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-indigo-800 mb-6 text-center">Editorial Board Members</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {editorialMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
                <h4 className="text-lg font-bold text-gray-900 mb-3">{member.name}</h4>
                <p className="text-gray-600 leading-relaxed">{member.affiliation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial Secretary */}
        <div>
          <h3 className="text-2xl font-bold text-indigo-800 mb-6 text-center">Editorial Secretary</h3>
          <div className="bg-white rounded-lg shadow-lg border border-indigo-200 p-8 max-w-3xl mx-auto">
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{editorialSecretary.name}</h4>
              <p className="text-gray-600 text-lg">{editorialSecretary.affiliation}</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
            <p className="text-gray-700 text-sm">
              For editorial inquiries or manuscript submissions, please contact the Editorial Secretary 
              or visit our journal's submission guidelines page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}