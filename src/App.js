import React from "react";
import "./App.scss";
import Display from "./components/Display";
import Control from "./components/Control";

const accurateInterval = function (fn, time) {
    let nextAt, timeout, wrapper;
    nextAt = new Date().getTime() + time;
    wrapper = function () {
        nextAt += time;
        timeout = setTimeout(wrapper, nextAt - new Date().getTime());
        return fn();
    };
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return {
        cancel() {
            return clearTimeout(timeout);
        },
    };
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            breakLen: 5,
            sessionLen: 25,
            timer: 1500,
            running: false,
            phase: "Session",
            counter: null,
        };
        this.changeBreak = this.changeBreak.bind(this);
        this.changeSession = this.changeSession.bind(this);
        this.handleLength = this.handleLength.bind(this);
        this.countdown = this.countdown.bind(this);
        this.phaseControl = this.phaseControl.bind(this);
        this.clockFormat = this.clockFormat.bind(this);
        this.startStop = this.startStop.bind(this);
        this.clear = this.clear.bind(this);
        this.startCount = this.startCount.bind(this);
        this.stopCount = this.stopCount.bind(this);
        this.switchPhase = this.switchPhase.bind(this);
        this.alarm = React.createRef();
    }

    handleLength(name, sign, currentValue, type) {
        if (this.state.running) return;

        if (type === this.state.phase) {
            if (sign === "-" && currentValue > 1) {
                this.setState({
                    [name]: currentValue - 1,
                    timer: (currentValue - 1) * 60,
                });
            } else if (sign === "+" && currentValue < 60) {
                this.setState({
                    [name]: currentValue + 1,
                    timer: (currentValue + 1) * 60,
                });
            }
        } else {
            if (sign === "-" && currentValue !== 1) {
                this.setState({ [name]: currentValue - 1 });
            } else if (sign === "+" && currentValue !== 60) {
                this.setState({ [name]: currentValue + 1 });
            }
        }
    }

    changeBreak(e) {
        this.handleLength(
            "breakLen",
            e.target.value,
            this.state.breakLen,
            "Break"
        );
    }

    changeSession(e) {
        this.handleLength(
            "sessionLen",
            e.target.value,
            this.state.sessionLen,
            "Session"
        );
    }

    countdown() {
        if (this.state.running && this.state.timer > 0) {
            this.setState((state) => {
                return {
                    timer: --state.timer,
                };
            });
        }
    }

    switchPhase() {
        if (this.state.phase === "Session") {
            this.setState((state) => {
                return {
                    timer: state.breakLen * 60,
                    phase: "Break",
                };
            });
            this.startCount();
        } else {
            this.setState((state) => {
                return {
                    timer: state.sessionLen * 60,
                    phase: "Session",
                };
            });
            this.startCount();
        }
    }

    phaseControl() {
        if (this.state.timer <= 0) {
            this.alarm.current.play();
            this.stopCount();

            setTimeout(this.switchPhase, this.alarm.current.duration * 1000);
        }
    }

    clockFormat() {
        let minutes = Math.floor(this.state.timer / 60);
        let seconds = this.state.timer - minutes * 60;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        return minutes + ":" + seconds;
    }

    startStop() {
        if (this.state.running) {
            this.alarm.current.pause();
            this.alarm.current.currentTime = 0;
            this.stopCount();
        } else {
            this.startCount();
        }
    }

    startCount() {
        this.setState({
            running: true,
            counter: accurateInterval(() => {
                this.countdown();
                this.phaseControl();
            }, 1000),
        });
    }

    stopCount() {
        this.state.counter?.cancel();
        this.setState({
            running: false,
            counter: null,
        });
    }

    clear() {
        this.stopCount();
        this.alarm.current.currentTime = 0;
        this.alarm.current.pause();
        this.setState({
            breakLen: 5,
            sessionLen: 25,
            timer: 1500,
            running: false,
            phase: "Session",
        });
    }

    render() {
        return (
            <div className="clock">
                <Display
                    currentLength={this.clockFormat()}
                    currentPhase={this.state.phase}
                />
                <div className="clock__controls">
                    <Control
                        length={this.state.breakLen}
                        label="Break Length"
                        name="break"
                        handler={this.changeBreak}
                    />
                    <Control
                        length={this.state.sessionLen}
                        label="Session Length"
                        name="session"
                        handler={this.changeSession}
                    />
                </div>
                <div className="clock__controls">
                    <button id="start_stop" onClick={this.startStop}>
                        {this.state.running ? "Stop" : "Start"}
                    </button>

                    <button id="reset" onClick={this.clear}>
                        Clear
                    </button>
                </div>
                <audio
                    id="beep"
                    ref={this.alarm}
                    src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
                />
            </div>
        );
    }
}

export default App;
