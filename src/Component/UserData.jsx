import axios from "axios";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";


function UserData() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ascending" });
  const itemsPerPage = 10; 

  useEffect(() => {
    axios
      .get("https://dummyjson.com/users")
      .then((res) => setData(res.data.users))
      .catch((err) => console.log(err));
  }, []);

  const Gender = (gender) => {
    return gender === "female" ? "F" : "M";
  };

  const Country = (country) => {
    return country === "United States" ? "USA" : country;
  };

  // Filter data for country and Gender
  const filteredData = data.filter((user) => {
    return (
      (selectedCountry === "" || user.address.country === selectedCountry) &&
      (selectedGender === "" || user.gender === selectedGender)
    );
  });

  // Sorting data
  const sortedData = filteredData.sort((a, b) => {
    if (sortConfig.key) {
      const direction = sortConfig.direction === "ascending" ? 1 : -1;
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return -1 * direction;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return 1 * direction;
      }
    }
    return 0;
  });

  // Calculating the paginated data
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="mt-2">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-left">Employee Data</h1>
         
            <div className="flex">
            <FaFilter className="mr-8 text-2xl mt-2" />
              <select
                className="mr-2 px-4 py-2 border border-gray-300 rounded"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="">All Countries</option>
                {[...new Set(data.map((user) => user.address.country))].map((country) => (
                  <option key={country} value={country}>
                    {Country(country)}
                  </option>
                ))}
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <table className="min-w-full bg-white text-center border border-gray-300">
            <thead className="bg-green-600 text-white">
              <tr>
                <th
                  className="py-2 px-4 border border-gray-300 cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  ID {sortConfig.key === "id" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th className="py-2 px-4 border border-gray-300">Image</th>
                <th
                  className="py-2 px-4 border border-gray-300 cursor-pointer"
                  onClick={() => handleSort("firstName")}
                >
                  FullName {sortConfig.key === "firstName" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th
                  className="py-2 px-4 border border-gray-300 cursor-pointer"
                  onClick={() => handleSort("gender")}
                >
                  Demography {sortConfig.key === "gender" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th className="py-2 px-4 border border-gray-300">Designation</th>
                <th className="py-2 px-4 border border-gray-300">Location</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((user, index) => (
                <tr key={index} className="text-xl align-middle">
                  <td className="py-2 px-4 border border-gray-300">{user.id}</td>
                  <td className="py-2 px-4 border border-gray-300">
                    <img
                      src={user.image}
                      alt={user.firstName}
                      className="w-8 h-8 rounded-full mx-auto"
                    />
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {user.firstName} {user.maidenName} {user.lastName}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {Gender(user.gender)}/{user.age}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">{user.company.title}</td>
                  <td className="py-2 px-4 border border-gray-300">
                    {user.address.state}, {Country(user.address.country)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded-xl w-32 disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 text-white rounded-xl w-32 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserData;
