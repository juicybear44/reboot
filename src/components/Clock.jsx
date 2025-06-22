import React from "react";

export default class Clock extends React.Component {
    state = {
        time: new Date().toLocaleTimeString()
    }

    componentDidMount() {
        this.intervalID = setInterval(
            () => this.tick(),
            1000
        )
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    tick() {
        this.setState({
            time: new Date().toLocaleTimeString()
        })
    }

    render() {
        return (
                <div className="font-pixel text-2xl">{this.state.time}</div>

        )
    }
}




//TODO: Refactor later

// import { useState, useEffect } from "react";

// function DigitalClock() {
//   const [time, setTime] = useState(new Date());

//   useEffect(() => {
//     const timeInterval = setInterval(() => {
//       setTime(new Date());
//     }, 1000);

//     return () => clearInterval(timeInterval);
//   }, []);
//   return (
//     <>
//       <div className="clock-container">
//         <div className="cover"></div>
//         <p className="date">{time.toDateString()}</p>
//         <div className="time">
//           <span className="clock">{time.getHours()}:</span>
//           <span className="clock">{time.getMinutes()}:</span>
//           <span className="secs">{time.getSeconds()}</span>
//         </div>
//         <p className="date">{time.toLocaleTimeString()}</p>
//       </div>
//     </>
//   );
// }
// export default DigitalClock;