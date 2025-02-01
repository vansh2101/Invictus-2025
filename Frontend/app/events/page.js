"use client";
import EventCard from "@/components/EventCard";
import React, { useRef, useState, useEffect } from "react";
import { Search } from "lucide-react";

function page() {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const [mode, setMode] = useState("mode");
  const [category, setCategory] = useState("category");
  const [date, setDate] = useState("date");


  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.3;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const fetchAllData = async () => {
    const response = await fetch("http://localhost:8000/api/events", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    setData(data.events);
    setEvents(data.events);
  };

  const fetchFilteredData = async (query) => {
    if (query === ""){
      setEvents(data);
      return;
    }

    setEvents(prev => {
      return prev.filter((event) => {
        return event.event_name.toLowerCase().startsWith(query.toLowerCase());
      });
    });
  }

  const filterData = () => {
    console.log(mode, category, date);

    if(mode === "mode" && category === "category" && date === "date"){
      setEvents(data);
      setDisabled(false);
      return
    }

    setDisabled(true);

    setEvents(data.filter((event) => {
        if(mode !== "mode" && category !== "category" && date !== "date"){
          return event.mode.toLowerCase() === mode && event.category.toLowerCase() === category && event.date.toLowerCase() === date;
        }
        else if(mode !== "mode" && category !== "category"){
          return event.mode.toLowerCase() === mode && event.category.toLowerCase() === category;
        }
        else if(mode !== "mode" && date !== "date"){
          return event.mode.toLowerCase() === mode && event.date.toLowerCase() === date;
        }
        else if(category !== "category" && date !== "date"){
          return event.category.toLowerCase() === category && event.date.toLowerCase() === date;
        }
        else if(mode !== "mode"){
          return event.mode.toLowerCase() === mode;
        }
        else if(category !== "category"){
          return event.category.toLowerCase() === category;
        }
        else if(date !== "date"){
          return event.date.toLowerCase() === date;
        }
    })
  );
  }

  useEffect(() => {
    filterData(mode, category, date);
  }, [mode, category, date]);

  useEffect(() => {
    fetchAllData();
    var item = document.getElementById("scroll");

    window.addEventListener("wheel", function (e) {
      if (e.deltaY > 0) item.scrollLeft += 100;
      else item.scrollLeft -= 100;
    });
  }, []);

  return (
    <>
      <div className="visible-delay flex flex-col items-center sm:items-start justify-start text-black px-4 sm:px-4 md:px-6 lg:px-16 -mt-5 md:mt-28 lg:mt-24 overflow-auto z-10">
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          <h1
            className="text-6xl sm:text-5xl md:text-5xl lg:text-6xl"
          >
            Events
          </h1>

          <div className="py-2 flex flex-row w-[100%] md:w-auto items-center justify-center md:justify-between">
            <select className="mr-2 text-[12px] md:text-[15px] flex flex-row items-center justify-between bg-black px-3 py-3 text-white rounded-md cursor-pointer" onChange={(e) => setMode(e.target.value.toLowerCase())}>
              <option>Mode</option>
              <option>Online</option>
              <option>Offline</option>
              <option>Hybrid</option>
            </select>
            <select className="mr-2 text-[12px] md:text-[15px] flex flex-row items-center justify-between bg-black px-3 py-3 text-white rounded-md cursor-pointer" onChange={(e) => setCategory(e.target.value.toLowerCase())}>
              <option className="mr-2">Category</option>
            </select>
            <select className="flex text-[12px] md:text-[15px] flex-row items-center justify-between bg-black px-3 py-3 text-white rounded-md cursor-pointer" onChange={(e) => setDate(e.target.value.toLowerCase())}>
              <option>Date</option>
              <option>15th Feb</option>
              <option>16th Feb</option>
              <option>17th Feb</option>
              <option>18th Feb</option>
            </select>
          </div>
          <div className="flex flex-row items-center justify-between ml-2 px-3 py-2 text-lg  rounded-md text-white bg-black">
            <Search size={24} className="mr-3" />
            <input
              placeholder="search for events..."
              type="text"
              className="text-[12px] md:text-[15px] bg-transparent outline-none font-jmh"
              onChange={(e) => fetchFilteredData(e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-row items-center justify-start w-full overflow-auto">
          <div
            ref={scrollRef}
            className="flex md:pl-2 flex-row select-none overflow-x-scroll no-scrollbar cursor-grab active:cursor-grabbing"
            id="scroll"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {events.map((event, index) => (
              <>
                <EventCard key={index} data={event} />
                <EventCard key={index} data={event} />
                <EventCard key={index} data={event} />
                <EventCard key={index} data={event} />
                <EventCard key={index} data={event} />
                <EventCard key={index} data={event} />
                <EventCard key={index} data={event} />
                <EventCard key={index} data={event} />

              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
