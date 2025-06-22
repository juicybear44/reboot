import React from "react";

import "../scss/glitch.scss";

export default function Glitch(title, subtitle) {
    return (
        <div className="glitch-container">
            <div className="glitch" data-text={title}>{title}</div>
            <div>
                {subtitle}
            </div>
        </div>
    )
}