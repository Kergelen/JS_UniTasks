/**
 * Konwertuje znacznik czasu systemu Unix (w sekundach) na obiekt Date.
 *
 * @param {number} unixTime - Znacznik czasu Uniksa w sekundach
 * @returns {Date} Obiekt Date reprezentujący daną sygnaturę czasową systemu Unix
 */
  function unixTimeToDate(unixTime) {
    return new Date(unixTime * 1000);
  }
  
  /**
   * Zwraca dzień miesiąca (1-31) z obiektu Date
   *
   * @param {Date} date 
   * @returns {number} - Dzień miesiąca
   */
  function getDay(date) {
    return date.getDate();
  }
  
  /**
   * Zwraca miesiąc (1-12) z obiektu Date
   *
   * @param {Date} date
   * @returns {number} - Miesiąc
   */
  function getMonth(date) {
    return date.getMonth() + 1;
  }
  
  /**
   * Zwraca rok z obiektu Date
   *
   * @param {Date} date 
   * @returns {number} Rok
   */
  function getYear(date) {
    return date.getFullYear();
  }
  
  /**
   * Zwraca datę w formacie „dd-mm-rrrr” z obiektu Date.
   *
   * @param {Date} date 
   * @returns {string} - Data w formacie „dd-mm-rrrr”.
   */
  function getFormattedDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  
  module.exports = {
    unixTimeToDate,
    getDay,
    getMonth,
    getYear,
    getFormattedDate
  };