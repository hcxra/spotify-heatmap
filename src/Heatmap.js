import React, { useEffect, useState } from "react";
import "./Heatmap.css";

const Heatmap = () => {
  const [data, setData] = useState([]);
  const monthsLayout = [
    { name: "January", days: 31, startDay: 1 },
    { name: "February", days: 29, startDay: 4 },
    { name: "March", days: 31, startDay: 4 },
    { name: "April", days: 30, startDay: 0 },
    { name: "May", days: 31, startDay: 2 },
    { name: "June", days: 30, startDay: 5 },
    { name: "July", days: 31, startDay: 0 },
    { name: "August", days: 31, startDay: 3 },
    { name: "September", days: 30, startDay: 6 },
    { name: "October", days: 31, startDay: 1 },
    { name: "November", days: 30, startDay: 4 },
    { name: "December", days: 31, startDay: 6 },
  ];

  useEffect(() => {
    fetch("/data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          console.log("Data fetched successfully:", data);
          setData(data);
        } else {
          console.error("Data is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching data.json:", error));
  }, []);

  const getDayData = (month, day) => {
    const dateString = `2024-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const result = data.find((entry) => entry.date === dateString);
    console.log(`Checking date: ${dateString}`, result || "No data");
    return result || { empty: true, date: dateString };
  };

  const getColorScaleClass = (hoursPlayed) => {
    if (hoursPlayed === 0) return "color-empty";
    if (hoursPlayed <= 1) return "color-scale-1";
    if (hoursPlayed <= 2) return "color-scale-2";
    if (hoursPlayed <= 3) return "color-scale-3";
    if (hoursPlayed <= 4) return "color-scale-4";
    return "color-scale-5";
  };
  
  return (
    <div>
      <div className="heatmap">
        {monthsLayout.map((month, monthIndex) => (
          <div className="month" key={monthIndex}>
            <h2>{month.name}</h2>
            <div className="grid">
              {/* Empty padding days */}
              {Array.from({ length: month.startDay }).map((_, i) => (
                <div key={`pad-${monthIndex}-${i}`} className="day color-empty"></div>
              ))}
              {/* Actual days of the month */}
              {Array.from({ length: month.days }).map((_, dayIndex) => {
                const dayData = getDayData(monthIndex, dayIndex + 1);
                const colorClass = dayData.empty
                  ? "color-empty"
                  : getColorScaleClass(dayData.hoursPlayed || 0);
                return (
                  <div
                    key={`day-${monthIndex}-${dayIndex}`}
                    className={`day ${colorClass}`}
                    onMouseEnter={(e) => {
                      const tooltip = document.getElementById("tooltip");
                      tooltip.style.display = "block";
                      tooltip.style.left = `${e.pageX + 10}px`;
                      tooltip.style.top = `${e.pageY + 10}px`;
                      tooltip.innerHTML = dayData.empty
                        ? `
                          <strong>Date:</strong> ${dayData.date}<br />
                          No available information.
                        `
                        : `
                          <strong>Date:</strong> ${dayData.date}<br />
                          <strong>Hours Played:</strong> ${dayData.hoursPlayed.toFixed(2)}<br />
                          <strong>Most Played Track:</strong> ${dayData.trackName}
                        `;
                    }}
                    onMouseLeave={() => {
                      const tooltip = document.getElementById("tooltip");
                      tooltip.style.display = "none";
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div id="tooltip" className="tooltip"></div>
    </div>
  );
};

export default Heatmap;






