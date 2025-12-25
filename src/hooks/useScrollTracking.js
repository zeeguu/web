import { useState, useRef, useEffect } from "react";
import useShadowRef from "./useShadowRef";

/**
 * Custom hook for tracking scroll events and viewport settings
 * Used by both web reader and extension reader to eliminate duplication
 * Contains all viewport calculation logic internally
 * 
 * @param {Object} config - Configuration object
 * @param {Object} config.api - The Zeeguu API instance
 * @param {string} config.articleID - The current article ID
 * @param {Object} config.articleInfo - Article information including source_id
 * @param {Function} config.getReadingSessionId - Function to get current reading session ID
 * @param {number} config.activityTimer - Current activity timer value
 * @param {string} config.scrollHolderId - ID of the scroll container element (default: "scrollHolder")
 * @param {string} config.bottomRowId - ID of the bottom row element (default: "bottomRow")
 * @param {number} config.sampleFrequency - How often to sample scroll events in seconds (default: 1)
 * @param {string} config.source - Source identifier (e.g., "UMR" for web, "EXTENSION_SOURCE" for extension)
 * 
 * @returns {Object} - Object containing:
 *   - scrollPosition: Current scroll position ratio (0-1)
 *   - viewPortSettings: JSON string of viewport configuration
 *   - handleScroll: Function to call on scroll events
 *   - sendFinalScrollEvent: Function to send final scroll event on unmount
 *   - uploadScrollActivity: Function to upload periodic scroll activity
 *   - scrollEvents: Ref to current scroll events array
 */
export default function useScrollTracking({
  api,
  articleID,
  articleInfo,
  getReadingSessionId,
  activityTimer,
  scrollHolderId = "scrollHolder",
  bottomRowId = "bottomRow",
  sampleFrequency = 1,
  source = "UMR",
}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [viewPortSettings, setViewPortSettings] = useState("");

  const scrollEvents = useRef([]);
  const lastSampleTimer = useRef(0);

  // Use shadow refs for values that change frequently
  const viewPortSettingsRef = useShadowRef(viewPortSettings);
  const activityTimerRef = useShadowRef(activityTimer);

  /**
   * Calculate the scroll ratio (0-1) representing how far down the page we are
   */
  const getScrollRatio = () => {
    const scrollElement = document.getElementById(scrollHolderId);
    if (!scrollElement) return 0;
    
    const scrollY = scrollElement.scrollTop;
    const bottomRowElement = document.getElementById(bottomRowId);
    const bottomRowHeight = bottomRowElement ? bottomRowElement.offsetHeight : 0;
    
    const endArticle = scrollElement.scrollHeight - scrollElement.clientHeight - bottomRowHeight;
    
    // Avoid division by zero
    if (endArticle <= 0) return 0;
    
    return Math.min(1, Math.max(0, scrollY / endArticle));
  };

  /**
   * Calculate and update viewport settings (viewport ratio for tolerance calculation)
   */
  const updateViewPortSettings = () => {
    const scrollElement = document.getElementById(scrollHolderId);
    if (!scrollElement) return;
    
    const bottomRowElement = document.getElementById(bottomRowId);
    const bottomHeight = bottomRowElement ? bottomRowElement.offsetHeight : 0;
    
    // Calculate viewport ratio for tolerance calculation
    // This represents what fraction of the article is visible on screen
    const viewportRatio = scrollElement.clientHeight / 
      (scrollElement.scrollHeight - bottomHeight);
    
    // Store just viewport ratio (optimized format)
    setViewPortSettings(
      JSON.stringify({
        viewportRatio: Math.max(0, Math.min(1, viewportRatio)) // Clamp between 0 and 1
      })
    );
  };

  /**
   * Handle scroll events - track position and sample at specified frequency
   */
  const handleScroll = () => {
    const ratio = getScrollRatio();
    setScrollPosition(ratio);
    
    const percentage = Math.floor(ratio * 100);
    const currentTimer = activityTimerRef.current;
    
    // Update viewport settings on each scroll (they might change if window resizes)
    updateViewPortSettings();
    
    // Sample scroll events at the specified frequency
    if (currentTimer - lastSampleTimer.current >= sampleFrequency) {
      scrollEvents.current.push([currentTimer, percentage]);
      lastSampleTimer.current = currentTimer;
    }
  };

  /**
   * Upload periodic scroll activity to the server
   */
  const uploadScrollActivity = () => {
    const readingSessionId = getReadingSessionId?.();
    if (!readingSessionId || !articleID || !articleInfo) return;
    
    // Update reading session duration
    if (api.readingSessionUpdate) {
      api.readingSessionUpdate(readingSessionId, activityTimerRef.current);
    }
    
    // Send periodic SCROLL events with accumulated scroll data
    if (scrollEvents.current && scrollEvents.current.length > 0 && viewPortSettingsRef.current) {
      console.log('📊 Sending periodic SCROLL event:', {
        articleID,
        scrollEventsCount: scrollEvents.current.length,
        scrollData: scrollEvents.current.slice(0, 5), // Show first 5 entries for debugging
        viewportSettings: JSON.parse(viewPortSettingsRef.current || '{}') // Show the viewport settings
      });
      
      api.logUserActivity(
        api.SCROLL,
        articleID,
        viewPortSettingsRef.current, // Optimized viewport settings
        JSON.stringify(scrollEvents.current).slice(0, 4096), // Limit data size
        articleInfo.source_id
      );
      
      // Don't clear events - keep them for the final scroll event
    }
  };

  /**
   * Send final scroll event (typically called on component unmount)
   */
  const sendFinalScrollEvent = () => {
    if (!articleID || !articleInfo || !viewPortSettingsRef.current) return;
    
    console.log('🏁 Sending final SCROLL event:', {
      articleID,
      scrollEventsCount: scrollEvents.current.length,
      scrollData: scrollEvents.current.slice(0, 5), // Show first 5 entries for debugging
      viewportSettings: JSON.parse(viewPortSettingsRef.current || '{}') // Show the viewport settings
    });
    
    api.logUserActivity(
      api.SCROLL,
      articleID,
      viewPortSettingsRef.current,
      JSON.stringify(scrollEvents.current).slice(0, 4096),
      articleInfo.source_id
    );
  };

  // Initialize viewport settings on mount
  useEffect(() => {
    updateViewPortSettings();
  }, []);

  /**
   * Initialize scroll tracking (call this in onCreate or useEffect)
   */
  const initializeScrollTracking = () => {
    scrollEvents.current = [];
    lastSampleTimer.current = 0;
    setScrollPosition(0);
    updateViewPortSettings();
  };

  return {
    scrollPosition,
    viewPortSettings,
    handleScroll,
    sendFinalScrollEvent,
    uploadScrollActivity,
    initializeScrollTracking,
    scrollEvents,
  };
}