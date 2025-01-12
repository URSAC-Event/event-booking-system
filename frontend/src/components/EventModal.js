import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css';

const EventModal = ({ isModalOpen, setModalOpen, eventData, handleInputChange, handleFileChange, handleModalSubmit }) => {
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState(''); // For fromDate validation
  const [toDateError, setToDateError] = useState(''); // For toDate validation
 
 
 
 
  const [timeframe, setTimeframe] = useState({ start: '', end: '' });



  
  useEffect(() => {
    if (isModalOpen) {
      axios.get('http://localhost:5000/api/organizations')
        .then(response => {
          setOrganizations(response.data);
        })
        .catch(error => {
          console.error('Error fetching organizations:', error);
        });
    }
  }, [isModalOpen]);

  const twoWeeksAhead = new Date();
  twoWeeksAhead.setDate(twoWeeksAhead.getDate() + 14);
  const minDate = twoWeeksAhead.toISOString().split('T')[0];

  const handleDateValidation = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate) {
      const selectedDateObj = new Date(selectedDate);
      if (selectedDateObj < twoWeeksAhead) {
        setError('The date must be at least two weeks from today.');
      } else {
        setError('');
      }
    }
  };








  
  const handleDateTimeVenueConflictCheck = async () => {
    const venue = eventData.venue;
    const fromDate = new Date(eventData.fromDate);
    const toDate = eventData.toDate ? new Date(eventData.toDate) : fromDate;
  
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      const events = response.data;
  
      let isConflict = false;
  
      // Step 1: Create a temporary daily structure for the date range
      const dailySchedule = {};
  
      // Initialize the daily schedule with empty arrays for each day within the range
      for (
        let currentDate = new Date(fromDate);
        currentDate <= toDate;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        const currentDateStr = currentDate.toISOString().split('T')[0];
        dailySchedule[currentDateStr] = [];
      }
  
      // Step 2: Populate the daily schedule with existing event timeframes
      events.forEach(event => {
        if (event.venue === venue) {
          const eventStartDate = new Date(event.date);
          const eventEndDate = event.datefrom ? new Date(event.datefrom) : eventStartDate;
  
          for (
            let currentDate = new Date(eventStartDate);
            currentDate <= eventEndDate;
            currentDate.setDate(currentDate.getDate() + 1)
          ) {
            const currentDateStr = currentDate.toISOString().split('T')[0];
            if (dailySchedule[currentDateStr]) {
              const [start, end] = event.duration.split(' to ').map(time => {
                const [hourMinute, period] = time.split(' ');
                let [hour, minute] = hourMinute.split(':').map(Number);
  
                if (period === 'PM' && hour !== 12) hour += 12;
                if (period === 'AM' && hour === 12) hour = 0;
  
                return { hour, minute };
              });
  
              dailySchedule[currentDateStr].push({ start, end });
            }
          }
        }
      });
  
      // Step 3: Check for conflicts with the proposed timeframe
      for (
        let currentDate = new Date(fromDate);
        currentDate <= toDate;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        const currentDateStr = currentDate.toISOString().split('T')[0];
        const proposedStartHour = fromDate.getHours();
        const proposedEndHour = toDate.getHours();
  
        if (dailySchedule[currentDateStr]) {
          for (let timeFrame of dailySchedule[currentDateStr]) {
            const eventStartHour = timeFrame.start.hour;
            const eventEndHour = timeFrame.end.hour;
  
            // Check for time overlap
            if (
              (proposedStartHour < eventEndHour && proposedEndHour > eventStartHour) ||
              (proposedEndHour > eventStartHour && proposedStartHour < eventEndHour)
            ) {
              isConflict = true;
              break;
            }
          }
        }
  
        if (isConflict) break; // Break early if a conflict is found
      }
  
      if (isConflict) {
        alert("The selected time overlaps with an existing event's timeframe within the venue.");
      } else {
        alert("No conflicts found! You can proceed with the submission.");
      }
    } catch (error) {
      console.error('Error checking venue, date, and time conflict:', error);
      alert('Failed to check conflicts.');
    }
  };
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  







  const handleDateConflictCheck = async () => {
  const fromDate = new Date(eventData.fromDate);
  const toDate = eventData.toDate ? new Date(eventData.toDate) : fromDate;

  try {
    const response = await axios.get('http://localhost:5000/api/events'); // Fetch events
    const events = response.data;

    // Check for conflicting dates
    const dateConflict = events.some(event => {
      const existingFromDate = new Date(event.date);
      const existingToDate = event.datefrom ? new Date(event.datefrom) : existingFromDate;

      return (
        (fromDate >= existingFromDate && fromDate <= existingToDate) ||
        (toDate >= existingFromDate && toDate <= existingToDate) ||
        (fromDate <= existingFromDate && toDate >= existingToDate)
      );
    });

    if (dateConflict) {
      // Check for venue conflicts if a date conflict exists
      const venueConflict = events.some(event => {
        const existingFromDate = new Date(event.date);
        const existingToDate = event.datefrom ? new Date(event.datefrom) : existingFromDate;

        return (
          event.venue === eventData.venue &&
          (
            (fromDate >= existingFromDate && fromDate <= existingToDate) ||
            (toDate >= existingFromDate && toDate <= existingToDate) ||
            (fromDate <= existingFromDate && toDate >= existingToDate)
          )
        );
      });

      if (venueConflict) {
        alert("An event already exists for the selected venue on the selected date range.");
      } else {
        alert("No conflict found for the selected venue! You can proceed with the submission.");
      }
    } else {
      alert("No conflict found! You can proceed with the submission.");
    }
  } catch (error) {
    console.error('Error checking date and venue conflict:', error);
    alert('Failed to check date and venue conflict.');
  }
};

  

  const handleToDateValidation = (e) => {
    const fromDate = new Date(eventData.fromDate);
    const toDate = new Date(e.target.value);
    
    if (toDate < fromDate) {
      setToDateError('The "To Date" cannot be earlier than the "From Date".');
    } else {
      setToDateError('');
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      const fromDateInput = document.querySelector('input[name="fromDate"]');
      fromDateInput.addEventListener('blur', handleDateValidation);

      return () => {
        fromDateInput.removeEventListener('blur', handleDateValidation);
      };
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Add Event</h3>
        <form onSubmit={handleModalSubmit} encType="multipart/form-data">
          <div className={styles.formGroup}>
            <label>Venue:</label>
            <select
              name="venue"
              value={eventData.venue}
              onChange={handleInputChange}
              required
              className={styles.input}
            >
              <option value="">Select Venue</option>
              <option value="Court">Court</option>
              <option value="Room 101">Room 101</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Event Name"
              value={eventData.name}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Organization:</label>
            <select
              name="organization"
              value={eventData.organization}
              onChange={handleInputChange}
              required
              className={styles.input}
            >
              <option value="">Select Organization</option>
              {organizations.length > 0 ? (
                organizations.map((org, index) => (
                  <option key={index} value={org.organization}>
                    {org.organization}
                  </option>
                ))
              ) : (
                <option disabled>Loading...</option>
              )}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>From Date:</label>
            <input
              type="date"
              name="fromDate"
              value={eventData.fromDate}
              onChange={handleInputChange}
              required
              className={styles.input}
              min={minDate}
            />
            {error && <p className={styles.error}>{error}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>To Date (Optional):</label>
            <input
              type="date"
              name="toDate"
              value={eventData.toDate}
              onChange={(e) => {
                handleInputChange(e);
                handleToDateValidation(e);
              }}
              className={styles.input}
            />
            {toDateError && <p className={styles.error}>{toDateError}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>Time Duration:</label>
            <div className={styles.timeGroup}>
              <span>From:</span>
              <div className={styles.timeFromGroup}>
                <select
                  name="fromHour"
                  value={eventData.fromHour}
                  onChange={handleInputChange}
                  className={styles.timeInput}
                >
                  <option value="">Select Hour</option>
                  {[...Array(12).keys()].map((i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <select
                  name="fromMinute"
                  value={eventData.fromMinute}
                  onChange={handleInputChange}
                  className={styles.timeInput}
                >
                  {[...Array(60).keys()].map((i) => (
                    <option key={i} value={String(i).padStart(2, '0')}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  name="fromAmPm"
                  value={eventData.fromAmPm}
                  onChange={handleInputChange}
                  className={styles.timeInput}
                >
                  <option value="">Select AM/PM</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>

              <span>to:</span>

              <div className={styles.timeToGroup}>
                <select
                  name="toHour"
                  value={eventData.toHour}
                  onChange={handleInputChange}
                  className={styles.timeInput}
                >
                  <option value="">Select Hour</option>
                  {[...Array(12).keys()].map((i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <select
                  name="toMinute"
                  value={eventData.toMinute}
                  onChange={handleInputChange}
                  className={styles.timeInput}
                >
                  {[...Array(60).keys()].map((i) => (
                    <option key={i} value={String(i).padStart(2, '0')}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  name="toAmPm"
                  value={eventData.toAmPm}
                  onChange={handleInputChange}
                  className={styles.timeInput}
                >
                  <option value="">Select AM/PM</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Document:</label>
            <input
              type="file"
              name="document"
              accept=".pdf"
              onChange={handleFileChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Poster:</label>
            <input
              type="file"
              name="poster"
              accept="image/png, image/jpeg, image/jpg, image/gif"
              onChange={handleFileChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.modalFooter}>
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
          <button 
    type="button"
    className={styles.checkDateButton} 
    onClick={handleDateConflictCheck}
  >
    Check Date
  </button>








  <button type="button" onClick={handleDateTimeVenueConflictCheck} className={styles.checkConflictButton}>
  Check Venue, Date, and Time Conflicts
</button>





          {timeframe.start && (
            <div className={styles.timeframeDisplay}>
              <p>Start Time: {timeframe.start}</p>
              <p>End Time: {timeframe.end}</p>
            </div>
          )}

        </form>









      </div>
    </div>
  );
};

export default EventModal; 