"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import {
  DISCOVER_GENRES,
  DISCOVER_STATUSES,
  DISCOVER_TYPES,
  DISCOVER_ORDERS,
} from "../../data/discoverData";
import styles from "./DiscoverFilters.module.css";

export function DiscoverFilters() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<string>("");

  const genresRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const orderRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        openDropdown === "genres" &&
        genresRef.current &&
        !genresRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }
      if (
        openDropdown === "status" &&
        statusRef.current &&
        !statusRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }
      if (
        openDropdown === "type" &&
        typeRef.current &&
        !typeRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }
      if (
        openDropdown === "order" &&
        orderRef.current &&
        !orderRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleGenreToggle = (value: string) => {
    setSelectedGenres((prev) =>
      prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value],
    );
  };

  // Label resolving functions
  const getGenresLabel = () => {
    if (selectedGenres.length === 0) return "الكل";
    if (selectedGenres.length === 1) {
      const matched = DISCOVER_GENRES.find(
        (g) => g.value === selectedGenres[0],
      );
      return matched ? matched.label : "الكل";
    }
    return `${selectedGenres.length} تصنيفات`;
  };

  const getStatusLabel = () => {
    const matched = DISCOVER_STATUSES.find((s) => s.value === selectedStatus);
    return matched ? matched.label : "الجميع";
  };

  const getTypeLabel = () => {
    const matched = DISCOVER_TYPES.find((t) => t.value === selectedType);
    return matched ? matched.label : "الجميع";
  };

  const getOrderLabel = () => {
    const matched = DISCOVER_ORDERS.find((o) => o.value === selectedOrder);
    return matched ? matched.label : "الأفتراضي";
  };

  return (
    <div className={styles["filterContainer"]} dir="rtl">
      {/* Filter Row */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className={styles["filterForm"]}
      >
        {/* 1. Genres Dropdown */}
        <div className={styles["dropdownWrapper"]} ref={genresRef}>
          <button
            type="button"
            className={`${styles["dropdownBtn"]} ${openDropdown === "genres" ? styles["active"] : ""}`}
            onClick={() => toggleDropdown("genres")}
          >
            <span className={styles["dropdownLabel"]}>التصنيفات</span>
            <span className={styles["dropdownValue"]}>{getGenresLabel()}</span>
            <ChevronDown className={styles["chevronIcon"]} />
          </button>

          {openDropdown === "genres" && (
            <div
              className={`${styles["dropdownMenu"]} ${styles["genresMenu"]} animate-fade-in`}
            >
              <div className={styles["genresGrid"]}>
                {DISCOVER_GENRES.map((genre) => {
                  const isChecked = selectedGenres.includes(genre.value);
                  return (
                    <label
                      key={genre.value}
                      className={`${styles["checkboxLabel"]} ${isChecked ? styles["checked"] : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleGenreToggle(genre.value)}
                        className={styles["hiddenCheckbox"]}
                      />
                      <span className={styles["checkboxBox"]}>
                        {isChecked && <Check className={styles["checkIcon"]} />}
                      </span>
                      <span className={styles["labelText"]}>{genre.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. Status Dropdown */}
        <div className={styles["dropdownWrapper"]} ref={statusRef}>
          <button
            type="button"
            className={`${styles["dropdownBtn"]} ${openDropdown === "status" ? styles["active"] : ""}`}
            onClick={() => toggleDropdown("status")}
          >
            <span className={styles["dropdownLabel"]}>الحالة</span>
            <span className={styles["dropdownValue"]}>{getStatusLabel()}</span>
            <ChevronDown className={styles["chevronIcon"]} />
          </button>

          {openDropdown === "status" && (
            <div className={`${styles["dropdownMenu"]} animate-fade-in`}>
              <ul className={styles["optionList"]}>
                {DISCOVER_STATUSES.map((status) => (
                  <li key={status.value}>
                    <button
                      type="button"
                      className={`${styles["optionBtn"]} ${
                        selectedStatus === status.value
                          ? styles["selectedOption"]
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedStatus(status.value);
                        setOpenDropdown(null);
                      }}
                    >
                      {status.label}
                      {selectedStatus === status.value && (
                        <Check className={styles["itemCheckIcon"]} />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 3. Type Dropdown */}
        <div className={styles["dropdownWrapper"]} ref={typeRef}>
          <button
            type="button"
            className={`${styles["dropdownBtn"]} ${openDropdown === "type" ? styles["active"] : ""}`}
            onClick={() => toggleDropdown("type")}
          >
            <span className={styles["dropdownLabel"]}>النوع</span>
            <span className={styles["dropdownValue"]}>{getTypeLabel()}</span>
            <ChevronDown className={styles["chevronIcon"]} />
          </button>

          {openDropdown === "type" && (
            <div className={`${styles["dropdownMenu"]} animate-fade-in`}>
              <ul className={styles["optionList"]}>
                {DISCOVER_TYPES.map((type) => (
                  <li key={type.value}>
                    <button
                      type="button"
                      className={`${styles["optionBtn"]} ${
                        selectedType === type.value
                          ? styles["selectedOption"]
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedType(type.value);
                        setOpenDropdown(null);
                      }}
                    >
                      {type.label}
                      {selectedType === type.value && (
                        <Check className={styles["itemCheckIcon"]} />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 4. Order Dropdown */}
        <div className={styles["dropdownWrapper"]} ref={orderRef}>
          <button
            type="button"
            className={`${styles["dropdownBtn"]} ${openDropdown === "order" ? styles["active"] : ""}`}
            onClick={() => toggleDropdown("order")}
          >
            <span className={styles["dropdownLabel"]}>بحسب</span>
            <span className={styles["dropdownValue"]}>{getOrderLabel()}</span>
            <ChevronDown className={styles["chevronIcon"]} />
          </button>

          {openDropdown === "order" && (
            <div className={`${styles["dropdownMenu"]} animate-fade-in`}>
              <ul className={styles["optionList"]}>
                {DISCOVER_ORDERS.map((order) => (
                  <li key={order.value}>
                    <button
                      type="button"
                      className={`${styles["optionBtn"]} ${
                        selectedOrder === order.value
                          ? styles["selectedOption"]
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedOrder(order.value);
                        setOpenDropdown(null);
                      }}
                    >
                      {order.label}
                      {selectedOrder === order.value && (
                        <Check className={styles["itemCheckIcon"]} />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 5. Search Button */}
        <button type="submit" className={styles["searchBtn"]}>
          <Search className={styles["searchBtnIcon"]} />
          <span>البحث</span>
        </button>
      </form>
    </div>
  );
}
