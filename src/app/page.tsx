"use client";

import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import styles from "./page.module.css";

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
    const searchTerm = e.target.value.toLowerCase();

    document.getElementById("search-term").innerHTML = searchTerm;

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchTerm) ||
        advocate.lastName.toLowerCase().includes(searchTerm) ||
        advocate.city.toLowerCase().includes(searchTerm) ||
        advocate.degree.toLowerCase().includes(searchTerm) ||
        advocate.specialties.some((s) =>
          s.toLowerCase().includes(searchTerm)
        ) ||
        String(advocate.yearsOfExperience).includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
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
    <main>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Solace Advocates</h1>
      </header>

      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <h2 className={styles.searchTitle}>Search Advocates</h2>
          <div className={styles.searchInputContainer}>
            <input
              className={styles.searchInput}
              placeholder="Search by name, city, or specialty..."
              onChange={onChange}
            />
            <button className={styles.resetButton} onClick={onClick}>
              Reset Search
            </button>
          </div>
          <p className={styles.searchTerm}>
            Searching for: <span id="search-term"></span>
          </p>
        </div>

        <div className={styles.gridContainer}>
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
              color: "black",
              "& .MuiDataGrid-cell": {
                padding: "8px",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f4f8f7",
                "& .MuiDataGrid-columnHeaderTitle": {
                  color: "#285e50",
                  fontWeight: "bold",
                },
              },
              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: "#f4f8f7",
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
      </div>
    </main>
  );
}
