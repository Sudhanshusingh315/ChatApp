import { useRef, useState } from "react";
import "./style.css";

export default function ThemeSection({
    showThemeSection,
    setShowThemeSection,
}) {
    const [selectedTheme, setSelectedTheme] = useState({});
    const userThemes = useRef([
        {
            "theme-name": "default",
        },
        {
            "theme-name": "blue",
        },
        {
            "theme-name": "red",
        },
        {
            "theme-name": "green-gray",
        },
        {
            "theme-name": "brown",
        },
        {
            "theme-name": "pastal-orange",
        },
        {
            "theme-name": "pink",
        },
        {
            "theme-name": "coffee",
        },
        {
            "theme-name": "yellow",
        },
    ]);
    const goBack = () => {
        setShowThemeSection(false);
    };
    const selectUserTheme = (e, theme) => {
        const { "theme-name": themeName } = theme;
        e.stopPropagation();
        console.log("selected theme is", theme);
        setSelectedTheme(theme);
        // do something.
        document.querySelector("body").setAttribute("data-theme", themeName);
        goBack();
    };
    return (
        <div
            className="theme-sections"
            style={showThemeSection ? { transform: "translateX(0%)" } : {}}
        >
            <h2 className="heading">Pick your themes!!</h2>
            {userThemes.current?.map((theme, index) => {
                return (
                    <div
                        onClick={(e) => {
                            selectUserTheme(e, theme);
                        }}
                        key={theme?.["theme-name"]}
                        className="theme-section"
                        theme-option={`${theme?.["theme-name"]}`}
                    >
                        <div className="yours dummy-message-theme"></div>
                        <div className="mine dummy-message-theme"></div>
                    </div>
                );
            })}
        </div>
    );
}
