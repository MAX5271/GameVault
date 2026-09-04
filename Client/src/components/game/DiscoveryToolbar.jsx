import { SORT_OPTIONS, GENRE_OPTIONS, PLATFORM_OPTIONS } from "../../constants/discoveryFilters";
import styles from "./DiscoveryToolbar.module.css";

function DiscoveryToolbar({
  ordering,
  onOrderingChange,
  selectedGenres,
  onToggleGenre,
  selectedPlatforms,
  onTogglePlatform,
}) {
  return (
    <div className={styles.toolbar}>
      <select
        value={ordering}
        onChange={(e) => onOrderingChange(e.target.value)}
        className={`${styles.sortSelect} ${ordering ? styles.sortActive : ""}`}
        aria-label="Sort games"
      >
        {SORT_OPTIONS.map(({ value, label }) => (
          <option key={value || "default"} value={value}>
            {label}
          </option>
        ))}
      </select>

      <div className={styles.chipGroup}>
        {GENRE_OPTIONS.map(({ slug, label }) => (
          <button
            type="button"
            key={slug}
            onClick={() => onToggleGenre(slug)}
            className={`${styles.chip} ${selectedGenres.includes(slug) ? styles.chipActive : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.chipGroup}>
        {PLATFORM_OPTIONS.map(({ id, label }) => (
          <button
            type="button"
            key={id}
            onClick={() => onTogglePlatform(id)}
            className={`${styles.chip} ${selectedPlatforms.includes(id) ? styles.chipActive : ""}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DiscoveryToolbar;
