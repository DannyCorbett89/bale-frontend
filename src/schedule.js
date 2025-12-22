import './schedule.css'

function Schedule() {
    return (
        <div className="calendar">
            <iframe
                src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FLondon&hl=en_GB&showPrint=0&showCalendars=0&title=FC%20Events&src=azhqcDdoMzFrYmw2bmpza205bTBtNWNucGNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23d81b60"
                frameBorder="0" scrolling="no"></iframe>
        </div>
    );
}

export default Schedule;