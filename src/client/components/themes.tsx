import React from "react";
export const themes = {
  light: {
    background: "#FFFFFF",
    text: "#000000",
    primary: "#6200EE",
    secondary: "#03DAC6",
  },
  dark: {
    background: "#121212",
    text: "#FFFFFF",
    primary: "#BB86FC",
    secondary: "#03DAC6",
  },
};

export type ThemeType = typeof themes.light;

export const ThemeContext = React.createContext(themes.light);

export const ThemeProvider = ({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: "light" | "dark";
}) => {
  return (
    <ThemeContext.Provider value={themes[theme]}>
      {children}
    </ThemeContext.Provider>
  );
};