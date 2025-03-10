"use client";

import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

type Advocate = {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: string;
  phoneNumber: string;
};

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    document.getElementById("search-term").innerHTML = searchTerm;

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(searchTerm) ||
        advocate.lastName.includes(searchTerm) ||
        advocate.city.includes(searchTerm) ||
        advocate.degree.includes(searchTerm) ||
        advocate.specialties.includes(searchTerm) ||
        advocate.yearsOfExperience.includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  // Define columns
  const columns: GridColDef[] = [
    {
      field: "firstName",
      headerName: "First Name",
      width: 130,
      renderCell: (params) => (
        <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          {params.value}
        </div>
      ),
    },
    { field: "lastName", headerName: "Last Name", width: 130 },
    { field: "city", headerName: "City", width: 130 },
    { field: "degree", headerName: "Degree", width: 80 },
    {
      field: "specialties",
      headerName: "Specialties",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <div
          style={{
            whiteSpace: "normal",
            lineHeight: "20px",
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {(params.value as string[]).join(", ")}
        </div>
      ),
    },
    {
      field: "yearsOfExperience",
      headerName: "Years of Experience",
      width: 130,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        const number = String(params.value || "");
        if (number.length !== 10) return <div>{number}</div>;

        return (
          <div>
            {`(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`}
          </div>
        );
      },
    },
  ];

  // Prepare rows with unique ids
  const rows = filteredAdvocates.map((advocate, index) => ({
    id: index,
    ...advocate,
  }));

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input style={{ border: "1px solid black" }} onChange={onChange} />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <div style={{ height: 700, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowHeight={() => "auto"}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 15 },
            },
          }}
          pageSizeOptions={[10, 15, 20]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          sx={{
            border: 2,
            borderColor: "#265b4e",
            "& .MuiDataGrid-cell": {
              padding: "8px",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#265b4e",
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "black",
                fontWeight: "bold",
              },
            },
            "& .MuiDataGrid-row:nth-of-type(even)": {
              backgroundColor: "#f5f5f5",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#d7a13b20",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "2px solid #265b4e",
            },
          }}
        />
      </div>
    </main>
  );
}
