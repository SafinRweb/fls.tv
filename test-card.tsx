import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

export function MatchCardDummy() {
    const cardBg = "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1200";

    return (
        <div className="block w-full">
            <div
                className="relative group w-full h-48 md:h-56 rounded-[20px] overflow-hidden border border-white/10 bg-layer shadow-lg transition-all duration-300 hover:border-accent hover:shadow-neon"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${cardBg}')` }}
                >
                    <img
                        src={cardBg}
                        className="hidden"
                        aria-hidden="true"
                        alt=""
                    />
                </div>
            </div>
        </div>
    );
}

const html = renderToStaticMarkup(<MatchCardDummy />);
console.log(html);
