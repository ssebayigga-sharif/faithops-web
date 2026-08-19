import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search as SearchIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  Close,
} from "@carbon/icons-react";
import {
  SearchService,
  type SearchResult,
  type EventSearchResult,
} from "../../features/search/services/search.service";

export const HeaderSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [members, setMembers] = useState<SearchResult[]>([]);
  const [events, setEvents] = useState<EventSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search trigger
  const triggerSearch = useCallback((val: string) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!val.trim()) {
      setMembers([]);
      setEvents([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await SearchService.searchAll(val.trim());
        setMembers(res.members.slice(0, 5)); // Limit preview size
        setEvents(res.events.slice(0, 5));
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setIsLoading(false);
      }
    }, 400);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    triggerSearch(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsExpanded(true);
        containerRef.current?.querySelector("input")?.focus();
      }
    };
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  const handleSelectMember = (uid: string) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/profile/${uid}`);
  };

  const handleSelectEvent = (id: string) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/events`); // Navigate to events page (which is standard)
  };

  const hasResults = members.length > 0 || events.length > 0;

  return (
    <div
      className={`header-search-container${isExpanded ? " is-expanded" : ""}`}
      ref={containerRef}
    >
      <button
        type="button"
        className="header-search-mobile-toggle"
        aria-label={isExpanded ? "Close search" : "Open search"}
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        {isExpanded ? <Close size={20} /> : <SearchIcon size={20} />}
      </button>
      <div className="header-search-wrapper">
        <SearchIcon size={16} className="header-search-icon" />
        <input
          type="text"
          className="header-search-input"
          placeholder="Search members, events..."
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          autoFocus={isExpanded}
          aria-label="Search members and events"
        />
      </div>

      {isOpen && query.trim() && (
        <div className="header-search-dropdown">
          {isLoading ? (
            <div className="header-search-message">Searching...</div>
          ) : !hasResults ? (
            <div className="header-search-message">
              No results found for "{query}"
            </div>
          ) : (
            <div className="header-search-results">
              {/* Members Section */}
              {members.length > 0 && (
                <div className="header-search-section">
                  <div className="header-search-section-title">Members</div>
                  <ul className="header-search-list">
                    {members.map((member) => (
                      <li
                        key={member.uid}
                        className="header-search-item"
                        onClick={() => handleSelectMember(member.uid)}
                      >
                        <div className="header-search-avatar">
                          {member.profilePhotoUrl ? (
                            <img src={member.profilePhotoUrl} alt="" />
                          ) : (
                            <UserIcon size={16} />
                          )}
                        </div>
                        <div className="header-search-item-info">
                          <span className="header-search-item-name">
                            {member.fullName}
                          </span>
                          <span className="header-search-item-meta">
                            {member.role} &bull; {member.department || "Member"}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Events Section */}
              {events.length > 0 && (
                <div className="header-search-section">
                  <div className="header-search-section-title">Events</div>
                  <ul className="header-search-list">
                    {events.map((event) => (
                      <li
                        key={event.id}
                        className="header-search-item"
                        onClick={() => handleSelectEvent(event.id)}
                      >
                        <div className="header-search-avatar header-search-avatar-event">
                          <CalendarIcon size={16} />
                        </div>
                        <div className="header-search-item-info">
                          <span className="header-search-item-name">
                            {event.title}
                          </span>
                          <span className="header-search-item-meta">
                            {event.category} &bull;{" "}
                            {new Date(event.start).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div
                className="header-search-see-all"
                onClick={() => {
                  setIsOpen(false);
                  navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                }}
              >
                Press Enter to view all results
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default HeaderSearch;
