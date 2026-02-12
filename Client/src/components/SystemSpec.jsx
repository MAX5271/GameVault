import { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash.debounce';
import axios from '../api/axios';
import DataContext from '../context/DataContext';
import styles from './SystemSpec.module.css';

const RAM_OPTIONS = [4, 8, 16, 32, 64, 128];

const SpecAutocomplete = ({ label, value, apiEndpoint, payloadKey, onSelect }) => {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const debouncedFetch = useMemo(
    () =>
      debounce(async (nextQuery) => {
        if (!nextQuery) {
          setResults([]);
          return;
        }
        setIsLoading(true);
        try {
          const response = await axios.post(apiEndpoint, {
            [payloadKey]: nextQuery
          });
          setResults(response.data.response || []);
        } catch (error) {
          console.error(`Error fetching ${label}:`, error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    [apiEndpoint, payloadKey, label]
  );

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    debouncedFetch(val);
    if (val === "") onSelect(""); 
  };

  const handleSelect = (item) => {
    setQuery(item);
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div className={styles.inputGroup} ref={wrapperRef}>
      <label className={styles.label}>{label}</label>
      <div className={styles.autocompleteWrapper}>
        <input
          type="text"
          className={styles.input}
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
             setIsOpen(true);
             if(query) debouncedFetch(query);
          }}
          placeholder={`Search ${label}...`}
        />
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              className={styles.resultsList}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {isLoading ? (
                <li className={styles.loadingItem}>Searching Database...</li>
              ) : results.length > 0 ? (
                results.map((item, index) => (
                  <li
                    key={index}
                    className={styles.resultItem}
                    onClick={() => handleSelect(item)}
                  >
                    {item}
                  </li>
                ))
              ) : (
                <li className={styles.noResults}>No components found</li>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function SystemSpec({ onLoaded }) {
  const { user } = useContext(DataContext);
  const [specs, setSpecs] = useState({
    ram: 0,
    cpu: "",
    gpu: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchSpecs = async () => {
      try {
        const response = await axios.get('/api/v1/user/getSpecs', {
          headers: { Authorization: `Bearer ${user.accessToken}` },
          withCredentials: true
        });
        
        if (isMounted && response.data.success) {
          setSpecs({
            cpu: response.data.response.cpu || "",
            gpu: response.data.response.gpu || "",
            ram: response.data.response.ram || 0
          });
        }
      } catch (error) {
        console.error("Failed to load specs:", error);
        if(isMounted) setFetchError("Could not load current specs.");
      } finally {
        if(isMounted && onLoaded) onLoaded();
      }
    };

    if (user?.accessToken) {
      fetchSpecs();
    }
    
    return () => { isMounted = false; };
  }, [user, onLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.post('/api/v1/user/setSpecs', {
        cpu: specs.cpu,
        gpu: specs.gpu,
        ram: specs.ram
      }, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
        withCredentials: true
      });
      setIsSaving(false);
    } catch (error) {
      console.error("Failed to save specs:", error);
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>SYSTEM CONFIGURATION</h2>
        <div className={styles.subtitle}>OPTIMIZE FOR PERFORMANCE</div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <SpecAutocomplete 
          label="PROCESSOR (CPU)" 
          apiEndpoint="/api/v1/user/searchCpu"
          payloadKey="cpu"
          value={specs.cpu} 
          onSelect={(val) => setSpecs(prev => ({...prev, cpu: val}))} 
        />

        <SpecAutocomplete 
          label="GRAPHICS (GPU)" 
          apiEndpoint="/api/v1/user/searchGpu"
          payloadKey="gpu"
          value={specs.gpu} 
          onSelect={(val) => setSpecs(prev => ({...prev, gpu: val}))} 
        />

        <div className={styles.inputGroup}>
          <label className={styles.label}>MEMORY (RAM)</label>
          <div className={styles.ramGrid}>
            {RAM_OPTIONS.map((size) => (
              <motion.button
                key={size}
                type="button"
                className={`${styles.ramButton} ${specs.ram === size ? styles.activeRam : ''}`}
                onClick={() => setSpecs(prev => ({...prev, ram: size}))}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {size} <span className={styles.unit}>GB</span>
              </motion.button>
            ))}
          </div>
        </div>

        {fetchError && <div style={{color: 'red', fontSize: '0.8rem'}}>{fetchError}</div>}

        <div className={styles.actions}>
          <motion.button
            type="submit"
            className={styles.saveBtn}
            disabled={isSaving}
            whileHover={{ scale: 1.02, boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.2)" }}
            whileTap={{ scale: 0.98 }}
          >
            {isSaving ? "SAVING..." : "CONFIRM SPECS"}
          </motion.button>
        </div>
      </form>
    </div>
  );
}