export default function Control(props) {
    return (
        <div className="clock__controls-item">
            <div
                className="clock__controls-item__label"
                id={props.name + "-label"}
            >
                {props.label}
            </div>

            <div className="clock__controls-item-wrapper">
                <button
                    className="clock__controls-item__decrease"
                    id={props.name + "-decrement"}
                    value="-"
                    onClick={props.handler}
                >
                    &#8595;
                </button>
                <div
                    className="clock__controls-item__result"
                    id={props.name + "-length"}
                >
                    {props.length}
                </div>
                <button
                    className="clock__controls-item__increase"
                    id={props.name + "-increment"}
                    value="+"
                    onClick={props.handler}
                >
                    &#8593;
                </button>
            </div>
        </div>
    );
}
