"use client";

import { useEffect, useState, useCallback } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import styles from "./page.module.css";
import { debounce } from "lodash";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchAdvocates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/advocates");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const { data } = await response.json();
        setAdvocates(data);
        setFilteredAdvocates(data);
      } catch (error) {
        setError("Failed to fetch advocates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvocates();
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      const filtered = advocates.filter((advocate) => {
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
      setFilteredAdvocates(filtered);
    }, 300),
    [advocates]
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchInput(e.target.value);
    debouncedSearch(searchTerm);
  };

  const onClick = () => {
    setFilteredAdvocates(advocates);
    setSearchInput("");
    const searchDisplay = document.getElementById("search-term");
    if (searchDisplay) {
      searchDisplay.innerHTML = "";
    }
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

  if (error) {
    return (
      <main>
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>Solace Advocates</h1>
        </header>
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>Error: {error}</p>
            <button
              className={styles.resetButton}
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Solace Advocates</h1>
      </header>

      <div className={styles.container}>
        <div className={styles.searchContainer} role="search">
          <h2 className={styles.searchTitle} id="search-title">
            Search Advocates
          </h2>
          <div className={styles.searchInputContainer}>
            <input
              className={styles.searchInput}
              placeholder="Search by name, city, or specialty..."
              onChange={onChange}
              value={searchInput}
              disabled={isLoading}
              aria-label="Search advocates"
              aria-describedby="search-title search-description"
              aria-busy={isLoading}
            />
            <button
              className={styles.resetButton}
              onClick={onClick}
              disabled={isLoading}
              aria-label="Reset search"
            >
              Reset Search
            </button>
          </div>
          <p id="search-description" className={styles.searchTerm}>
            {searchInput ? (
              <>
                Showing results for:{" "}
                <span className={styles.searchHighlight}>{searchInput}</span>
              </>
            ) : (
              <span className={styles.searchPlaceholder}>
                Search by advocate name, city, or specialty
              </span>
            )}
          </p>
        </div>

        <div className={styles.gridContainer}>
          {isLoading ? (
            <div className={styles.loadingContainer} role="status">
              <div className={styles.spinner} aria-hidden="true" />
              <div className={styles.loadingText}>Loading advocates...</div>
            </div>
          ) : (
            <>
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
                  border: 1,
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
                    borderTop: "1px solid #265b4e",
                  },
                }}
              />
              {!isLoading && filteredAdvocates.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No advocates found matching "{searchInput}"</p>
                  <button
                    className={styles.resetButton}
                    onClick={onClick}
                    aria-label="Clear search and show all advocates"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
