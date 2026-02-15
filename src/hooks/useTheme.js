import { useState, useEffect } from 'react';

export default function useTheme() {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        document.body.dataset.theme = theme;
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return { theme, toggleTheme };
}
