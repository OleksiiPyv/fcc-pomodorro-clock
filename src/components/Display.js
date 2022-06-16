export default function Display(props) {
    return (
        <div className="clock__display">
            <div id="timer-label">{props.currentPhase}</div>
            <div id="time-left">{props.currentLength}</div>
        </div>
    )
}