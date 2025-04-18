const getColorFromScale = ({ value, colorMax, colorMin }) => {

    if (typeof value !== 'number' || value < 0 || value > 1) {
        console.error('Value must be a number between 0 and 1');
        return null;
    }

    const interpolate = (start, end, factor) => start + (end - start) * factor;

    const extractRGB = (color) => {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
        if (!match) {
            console.error('Invalid color format. Use rgb(...) or rgba(...)');
            return null;
        }
        const [, r, g, b, a] = match.map((val, i) => (i === 0 ? val : Number(val)));
        return [r, g, b, a ?? 1]; // default alpha = 1
    };

    const min = extractRGB(colorMin);
    const max = extractRGB(colorMax);

    if (!min || !max) return null;

    const r = Math.round(interpolate(min[0], max[0], value));
    const g = Math.round(interpolate(min[1], max[1], value));
    const b = Math.round(interpolate(min[2], max[2], value));
    const a = interpolate(min[3], max[3], value).toFixed(2);

    return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
};

export default getColorFromScale;
