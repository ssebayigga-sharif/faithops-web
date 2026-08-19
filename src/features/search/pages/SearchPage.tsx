import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  SearchService,
  type SearchResult,
  type EventSearchResult,
} from "../services/search.service";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [results, setResults] = useState<SearchResult[]>([]);
  const [eventResults, setEventResults] = useState<EventSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setEventResults([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    SearchService.searchAll(query.trim())
      .then((data) => {
        if (!cancelled) {
          setResults(data.members);
          setEventResults(data.events);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResults([]);
          setEventResults([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div className="search-page">
      <h1 className="search-page__title">
        {query ? `Results for "${query}"` : "Search members"}
      </h1>

      {!query.trim() && (
        <p className="search-page__hint">
          Type a name, email, phone, or department in the search bar above.
        </p>
      )}

      {isLoading && <p className="search-page__loading">Searching…</p>}

      {!isLoading &&
        query.trim() &&
        results.length === 0 &&
        eventResults.length === 0 && (
          <p className="search-page__empty">
            No members found matching "{query}".
          </p>
        )}

      {!isLoading && results.length > 0 && (
        <div className="search-results">
          <p className="search-results__count">
            {results.length} member{results.length !== 1 ? "s" : ""} found
          </p>
          <div className="search-results__grid">
            {results.map((member) => (
              <Link
                key={member.uid}
                to={`/profile/${member.uid}`}
                className="search-result-card"
              >
                <div className="search-result-card__avatar">
                  {member.profilePhotoUrl ? (
                    <img
                      src={member.profilePhotoUrl}
                      alt={`${member.fullName}`}
                    />
                  ) : (
                    <span className="search-result-card__initials">
                      {member.firstName.charAt(0)}
                      {member.lastName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="search-result-card__info">
                  <strong className="search-result-card__name">
                    {member.fullName}
                  </strong>
                  <span className="search-result-card__role">
                    {member.role}
                  </span>
                  <span className="search-result-card__contact">
                    {member.email}
                  </span>
                  {member.phone && (
                    <span className="search-result-card__contact">
                      {member.phone}
                    </span>
                  )}
                  {member.department && (
                    <span className="search-result-card__dept">
                      {member.department}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!isLoading && eventResults.length > 0 && (
        <div className="search-results search-results--events">
          <p className="search-results__count">
            {eventResults.length} event{eventResults.length !== 1 ? "s" : ""}{" "}
            found
          </p>
          <div className="search-results__grid">
            {eventResults.map((event) => (
              <Link key={event.id} to="/events" className="search-result-card">
                <div className="search-result-card__avatar search-result-card__avatar--event">
                  <span>
                    {new Date(event.start).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="search-result-card__info">
                  <strong className="search-result-card__name">
                    {event.title}
                  </strong>
                  <span className="search-result-card__role">
                    {event.category}
                  </span>
                  <span className="search-result-card__contact">
                    {event.venue || "Church campus"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
