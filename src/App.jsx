import React, { useState } from "react";

const destinations = [
  {
    name: "Madrid",
    code: "MAD",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    info: "Vibrant nightlife & tapas.",
    price: 320,
    type: "City"
  },
  {
    name: "Lisbon",
    code: "LIS",
    image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=800&q=80",
    info: "Sunny coast & pastel streets.",
    price: 210,
    type: "Beach"
  },
  {
    name: "Reykjavik",
    code: "KEF",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80",
    info: "Nature & northern lights.",
    price: 499,
    type: "Nature"
  },
  {
    name: "Prague",
    code: "PRG",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80",
    info: "Old town charm.",
    price: 154,
    type: "City"
  }
];

// Main App
export default function App() {
  const [page, setPage] = useState("home"); // 'home', 'results', 'profile'
  const [search, setSearch] = useState({ from: "", to: "", date: "" });
  const [rouletteResult, setRouletteResult] = useState(null);
  const [rouletteSpinning, setRouletteSpinning] = useState(false);

  // Sample flights data (static)
  const flights = [
    { time: "08:00", duration: "2h5m", price: 400, flightNo: "1812" },
    { time: "10:30", duration: "2h5m", price: 200, flightNo: "1813" },
    { time: "12:00", duration: "2h5m", price: 1000, flightNo: "1814" }
  ];

  function goToProfile() {
    setPage("profile");
  }

  function goToHome() {
    setPage("home");
    setSearch({ from: "", to: "", date: "" });
    setRouletteResult(null);
  }

  function handleSearch(from, to, date) {
    setSearch({ from, to, date });
    setPage("results");
  }

  function playRoulette() {
    setRouletteSpinning(true);
    setRouletteResult(null);

    setTimeout(() => {
      // Filter affordable destinations under 400 EUR
      const affordable = destinations.filter(d => d.price < 400);
      const pick = affordable[Math.floor(Math.random() * affordable.length)];
      setRouletteResult(pick);
      setSearch({ from: "", to: pick.code, date: "" });
      setPage("results");
      setRouletteSpinning(false);
    }, 1200);
  }

  return (
    <>
      <Header page={page} goToProfile={goToProfile} goToHome={goToHome} />
      <div style={styles.container}>
        {page === "home" && (
          <>
            <h1 style={styles.title}>Where Next?</h1>
            <SearchForm onSearch={handleSearch} />
            <div style={{ margin: "30px 0", textAlign: "center", color: "#ec4186" }}>or</div>
            <div style={{ textAlign: "center" }}>
              <button
                onClick={playRoulette}
                disabled={rouletteSpinning}
                style={{ ...styles.rouletteBtn, opacity: rouletteSpinning ? 0.6 : 1, cursor: rouletteSpinning ? "not-allowed" : "pointer" }}
              >
                🎲 Travel Roulette
              </button>
              {rouletteSpinning && <div style={{ marginTop: 15, color: "#ec4186", fontWeight: "600" }}>Spinning globe...</div>}
            </div>
          </>
        )}

        {page === "results" && (
          <>
            <FlightResults search={search} flights={flights} destinations={destinations} />
            <button onClick={goToHome} style={styles.backBtn}>← Back to Search</button>
          </>
        )}

        {page === "profile" && <ProfilePage goBack={goToHome} />}
      </div>
    </>
  );
}

function Header({ page, goToProfile, goToHome }) {
  return (
    <header style={styles.header}>
      <div style={styles.logo} onClick={goToHome} tabIndex={0} role="button" aria-label="Go to Home">
        ✈️ Flightly
      </div>
      <nav>
        {page !== "profile" ? (
          <button style={styles.navBtn} onClick={goToProfile}>
            Profile
          </button>
        ) : (
          <button style={styles.navBtn} onClick={goToHome}>
            Search
          </button>
        )}
      </nav>
    </header>
  );
}

function SearchForm({ onSearch }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  function submit(e) {
    e.preventDefault();
    onSearch(from.trim().toUpperCase(), to.trim().toUpperCase(), date);
  }

  return (
    <form onSubmit={submit} style={styles.form}>
      <input
        required
        placeholder="Departure airport (e.g. LGW)"
        value={from}
        onChange={e => setFrom(e.target.value)}
        style={styles.input}
      />
      <input
        required
        placeholder="Arrival airport (e.g. MAD)"
        value={to}
        onChange={e => setTo(e.target.value)}
        style={styles.input}
      />
      <input
        required
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.searchBtn}>
        SEARCH FLIGHTS &rarr;
      </button>
    </form>
  );
}

function FlightResults({ search, flights, destinations }) {
  const toDest = destinations.find(d => d.code === search.to);

  return (
    <div>
      <h2 style={{ ...styles.title, marginBottom: 20 }}>
        Flights to <span style={styles.gradientText}>{toDest?.name || "Unknown"}</span>
      </h2>
      <div>
        {flights.map(flight => (
          <div key={flight.flightNo} style={styles.flightCard}>
            <div>
              <b>{flight.time}</b> <span>{flight.duration}</span>
            </div>
            <div>Flight No {flight.flightNo}</div>
            <div style={styles.flightPrice}>{flight.price} EUR</div>
            <button style={styles.bookBtn} onClick={() => alert(`Booked flight ${flight.flightNo} to ${toDest?.name}! 🎉`)}>
              Book Flight
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePage({ goBack }) {
  const user = {
    name: "Traveler Jane",
    tier: "Gold",
    points: 2450,
    progress: 80
  };

  return (
    <div>
      <h2 style={styles.title}>{user.name}</h2>
      <div style={styles.profileCard}>
        <div>Tier: <b>{user.tier}</b></div>
        <div>Points: <b>{user.points}</b></div>
        <div style={{ marginTop: 15 }}>
          Next Tier Progress:
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${user.progress}%` }} />
          </div>
          <span>{user.progress}%</span>
        </div>
      </div>
      <button style={{...styles.navBtn, marginTop: 25}} onClick={goBack}>← Back to Search</button>
    </div>
  );
}

// Simple styles inline for OneCompiler ease
const styles = {
  header: {
    backgroundColor: "#6157E1",
    color: "white",
    padding: "16px 30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "1.2em",
    boxShadow: "0 2px 10px rgba(70,76,255,0.07)",
    userSelect: "none",
    cursor: "default"
  },
  logo: {
    fontWeight: "bold",
    letterSpacing: "1px",
    fontSize: "1.42em",
    cursor: "pointer"
  },
  navBtn: {
    backgroundColor: "#EC4186",
    color: "white",
    border: "none",
    padding: "8px 20px",
    borderRadius: "22px",
    cursor: "pointer",
    fontSize: "1em",
    boxShadow: "0 1px 8px rgba(236,65,134,0.11)",
    transition: "background 0.18s"
  },
  container: {
    maxWidth: 430,
    margin: "40px auto",
    backgroundColor: "#FFF9C3",
    borderRadius: 25,
    boxShadow: "0 7px 24px rgba(85,51,255,0.10)",
    padding: 32,
    fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif",
    color: "#081840"
  },
  title: {
    fontWeight: 700,
    fontSize: "2em",
    margin: "10px 0 22px 0",
    background: "linear-gradient(90deg, #6157E1, #EC4186)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  gradientText: {
    background: "linear-gradient(90deg, #6157E1, #EC4186)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginBottom: 2
  },
  input: {
    padding: 10,
    border: "1.5px solid #E7E7FB",
    borderRadius: 12,
    fontSize: "1em",
    outline: "none",
    backgroundColor: "#BCB9DB",
    color: "#081840",
    transition: "border-color 0.14s"
  },
  searchBtn: {
    backgroundColor: "#EC4186",
    color: "white",
    fontWeight: 700,
    border: "none",
    padding: "12px 0",
    borderRadius: 16,
    cursor: "pointer",
    fontSize: "1em",
    marginTop: 4,
    boxShadow: "0 1px 12px rgba(236,65,134,0.16)",
    transition: "background 0.16s"
  },
  rouletteBtn: {
    backgroundColor: "#6157E1",
    color: "white",
    border: "none",
    borderRadius: 20,
    padding: "13px 30px",
    fontSize: "1.11em",
    fontWeight: 600,
    boxShadow: "0 1px 11px rgba(97,87,225,.13)",
    transition: "background 0.13s"
  },
  flightCard: {
    backgroundColor: "#E7E7FB",
    borderRadius: 16,
    padding: "18px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 7,
    boxShadow: "0 4px 14px rgba(70,76,255,0.08)",
    marginBottom: 17
  },
  flightPrice: {
    color: "#EC4186",
    fontWeight: 700,
    fontSize: "1.15em",
    marginBottom: 5
  },
  bookBtn: {
    backgroundColor: "#6157E1",
    color: "white",
    border: "none",
    borderRadius: 17,
    padding: 10,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
    transition: "background 0.14s"
  },
  backBtn: {
    marginTop: 20,
    cursor: "pointer",
    fontWeight: 600,
    border: "none",
    backgroundColor: "#EC4186",
    color: "white",
    padding: "10px 18px",
    borderRadius: 20
  },
  profileCard: {
    backgroundColor: "#E7E7FB",
    borderRadius: 19,
    padding: "24px 23px",
    fontSize: "1.09em",
    marginTop: 12,
    boxShadow: "0 6px 10px rgba(98,77,225,0.10)"
  },
  progressBar: {
    width: "100%",
    backgroundColor: "#eee",
    borderRadius: 9,
    height: 13,
    margin: "7px 0",
    overflow: "hidden"
  },
  progressFill: {
    backgroundColor: "#EC4186",
    height: "100%",
    borderRadius: 9,
    transition: "width 0.62s"
  }
};
