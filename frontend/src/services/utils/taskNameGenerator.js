const taskNameGenerator = (name) => {
    const wordsArray = name.split(' ');
    const capitalizer = wordsArray.map((word, index) => {
        if(index === 0) return word.charAt(0).toLowerCase() + word.slice(1);
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    const capitalizedName = capitalizer.join('');
    return capitalizedName;
}

export default taskNameGenerator;