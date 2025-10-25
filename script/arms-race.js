// script/arms-race.js - Arms Race event tracker and display
export function initializeArmsRace() {
    const tracker = new ArmsRaceTracker();
    let updateInterval;

    /**
     * Start the Arms Race tracking and display updates
     */
    function startTracking() {
        updateDisplay(); // Initial display
        updateInterval = setInterval(updateDisplay, 1000); // Update every seconds
    }

    /**
     * Stop the Arms Race tracking
     */
    function stopTracking() {
        if (updateInterval) {
            clearInterval(updateInterval);
        }
    }

    /**
     * Update the Arms Race display with current data
     */
    function updateDisplay() {
        try {
            const userOffset = tracker.getUserUTCOffset();
            const serverOffset = tracker.serverUTCOffset;
            const timeDiff = tracker.getTimeDifference();

            // Update timezone information
            const timezoneInfo = document.getElementById('timezoneInfo');
            if (timezoneInfo) {
                timezoneInfo.innerHTML =
                    `<strong>Your time zone: </strong>${tracker.formatTimezoneOffset(userOffset)} • ` +
                    `<strong>Server: </strong>${tracker.formatTimezoneOffset(serverOffset)} • ` +
                    `<strong>Time offset: </strong>${timeDiff}h`;
            }

            const todaysData = tracker.getTodaysEvents();
            const currentDate = new Date().toLocaleDateString('en-EN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Update general information
            const currentDateEl = document.getElementById('currentDate');
            const armsRaceDayEl = document.getElementById('armsRaceDay');
            
            if (currentDateEl) currentDateEl.textContent = currentDate;
            if (armsRaceDayEl) armsRaceDayEl.textContent = `day ${todaysData.armsRaceDay}/7`;

            // Update current event information
            const currentEventNameEl = document.getElementById('currentEventName');
            const countdownEl = document.getElementById('countdown');
            
            if (todaysData.currentEvent) {
                if (currentEventNameEl) currentEventNameEl.textContent = todaysData.currentEvent.name;
                if (countdownEl) {
                    const timeRemaining = tracker.getTimeRemaining(todaysData.currentEvent.index);
                    countdownEl.textContent = tracker.formatTimeRemaining(timeRemaining);
                }
            } else {
                if (currentEventNameEl) currentEventNameEl.textContent = "No event in progress";
                if (countdownEl) countdownEl.textContent = "";
            }

            // Update events list
            const eventsList = document.getElementById('eventsList');
            if (eventsList) {
                eventsList.innerHTML = '';
                
                todaysData.events.forEach(event => {
                    const eventDiv = document.createElement('div');
                    eventDiv.className = `event ${event.status}`;

                    const statusClass = `status-${event.status}`;
                    const statusText = event.status === 'current' ? 'ACTUAL' :
                                      event.status === 'completed' ? 'FINISHED' : 'NEXT';

                    eventDiv.innerHTML = `
                        <div class="event-number">${event.number}</div>
                        <div class="event-content">
                            <div class="event-name">${event.name}</div>
                            <div class="event-time">${event.timeRange.start} - ${event.timeRange.end}</div>
                        </div>
                        <div class="event-status ${statusClass}">${statusText}</div>
                    `;

                    eventsList.appendChild(eventDiv);
                });
            }

            // Update last update timestamp
            const lastUpdateEl = document.getElementById('lastUpdate');
            if (lastUpdateEl) {
                lastUpdateEl.textContent = `Last update: ${new Date().toLocaleTimeString('en-EN')}`;
            }

        } catch (error) {
            console.error('Error updating Arms Race display:', error);
        }
    }

    // Start tracking
    startTracking();

    // Cleanup on page unload
    window.addEventListener('beforeunload', stopTracking);
    
    return {
        stop: stopTracking
    };
}

/**
 * Arms Race Tracker - Manages event scheduling and timing
 */
class ArmsRaceTracker {
    constructor() {
        // Reference date: October 21, 2025 = Day 3/7
        // Using October 21, 2025 as Day 1/7 at 00:00 UTC-2
        this.referenceDate = new Date('2025-10-21T00:00:00-02:00');
        this.serverUTCOffset = -2; // UTC-2

        this.events = [
            'Hero Advancement',
            'City Building',
            'Unit Progression',
            'Tech Research',
            'Drone Boost'
        ];

        // 7-day cycle for Arms Race events
        this.dayCycle = [
            [0, 1, 2, 3, 4, 0], // Day 1
            [1, 2, 3, 4, 0, 1], // Day 2  
            [2, 3, 4, 0, 1, 2], // Day 3
            [3, 4, 0, 1, 2, 3], // Day 4
            [4, 0, 1, 2, 3, 4], // Day 5
            [0, 1, 2, 3, 4, 0], // Day 6
            [1, 2, 3, 4, 0, 1]  // Day 7
        ];
    }

    /**
     * Get user's UTC offset in hours
     * @returns {number} UTC offset in hours
     */
    getUserUTCOffset() {
        return -new Date().getTimezoneOffset() / 60;
    }

    /**
     * Calculate time difference between user and server
     * @returns {number} Time difference in hours
     */
    getTimeDifference() {
        const userOffset = this.getUserUTCOffset();
        const serverOffset = this.serverUTCOffset;
        return userOffset - serverOffset;
    }

    /**
     * Get current server time
     * @returns {Date} Current server time
     */
    getServerTime() {
        const now = new Date();
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
        return new Date(utcTime + (this.serverUTCOffset * 3600000));
    }

    /**
     * Calculate current Arms Race day (1-7)
     * @returns {number} Current Arms Race day
     */
    getCurrentArmsRaceDay() {
        const serverNow = this.getServerTime();
        const serverDayStart = new Date(serverNow);
        serverDayStart.setHours(0, 0, 0, 0);

        const refDayStart = new Date(this.referenceDate);
        refDayStart.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((serverDayStart - refDayStart) / (24 * 60 * 60 * 1000));
        return ((daysDiff % 7) + 7) % 7 + 1;
    }

    /**
     * Get local day start time (server 00:00 adjusted for user timezone)
     * @returns {Date} Local day start time
     */
    getLocalDayStart() {
        const now = new Date();
        const localDayStart = new Date(now);
        localDayStart.setHours(0, 0, 0, 0);

        // Adjust for time difference
        const timeDiff = this.getTimeDifference();
        localDayStart.setHours(localDayStart.getHours() + timeDiff);

        // If current time is before day start, use previous day
        if (now < localDayStart) {
            localDayStart.setDate(localDayStart.getDate() - 1);
        }

        return localDayStart;
    }

    /**
     * Get current event index (0-5) based on time of day
     * @returns {number} Current event index
     */
    getCurrentEventIndex() {
        const now = new Date();
        const dayStart = this.getLocalDayStart();
        const timeSinceStart = now - dayStart;
        const eventIndex = Math.floor(timeSinceStart / (4 * 60 * 60 * 1000)); // 4-hour intervals

        return Math.min(Math.max(eventIndex, 0), 5);
    }

    /**
     * Get start and end time for a specific event
     * @param {number} eventIndex - Event index (0-5)
     * @returns {Object} Object with start and end times
     */
    getEventTimeRange(eventIndex) {
        const dayStart = this.getLocalDayStart();
        const eventStart = new Date(dayStart);
        eventStart.setHours(eventStart.getHours() + (eventIndex * 4));

        const eventEnd = new Date(eventStart);
        eventEnd.setHours(eventEnd.getHours() + 4);

        return {
            start: eventStart.toLocaleTimeString('en-EN', { hour: '2-digit', minute: '2-digit' }),
            end: eventEnd.toLocaleTimeString('en-EN', { hour: '2-digit', minute: '2-digit' })
        };
    }

    /**
     * Calculate time remaining until event ends
     * @param {number} eventIndex - Event index (0-5)
     * @returns {number} Time remaining in milliseconds
     */
    getTimeRemaining(eventIndex) {
        const dayStart = this.getLocalDayStart();
        const eventEnd = new Date(dayStart);
        eventEnd.setHours(eventEnd.getHours() + ((eventIndex + 1) * 4));

        return eventEnd - new Date();
    }

    /**
     * Format time remaining into readable string
     * @param {number} milliseconds - Time in milliseconds
     * @returns {string} Formatted time string
     */
    formatTimeRemaining(milliseconds) {
        if (milliseconds <= 0) return "Finished";
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        return `Ending in ${hours}h ${minutes.toString().padStart(2, '0')}m`;
    }

    /**
     * Format UTC offset for display
     * @param {number} offset - UTC offset in hours
     * @returns {string} Formatted UTC offset
     */
    formatTimezoneOffset(offset) {
        const sign = offset >= 0 ? '+' : '';
        return `UTC${sign}${offset}`;
    }

    /**
     * Get today's events with status and timing
     * @returns {Object} Today's events data
     */
    getTodaysEvents() {
        const currentIndex = this.getCurrentEventIndex();
        const armsRaceDay = this.getCurrentArmsRaceDay();
        const dayEvents = this.dayCycle[armsRaceDay - 1];

        const events = [];
        for (let i = 0; i < dayEvents.length; i++) {
            const eventTypeIndex = dayEvents[i];
            const eventName = this.events[eventTypeIndex];
            const timeRange = this.getEventTimeRange(i);

            let status = 'upcoming';
            if (i < currentIndex) {
                status = 'completed';
            } else if (i === currentIndex) {
                status = 'current';
            }

            events.push({
                number: i + 1,
                name: eventName,
                timeRange,
                status,
                index: i
            });
        }

        return {
            armsRaceDay,
            currentEvent: events.find(event => event.status === 'current'),
            events
        };
    }
}